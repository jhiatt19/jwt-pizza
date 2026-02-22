import { Page } from "@playwright/test";
import { test, expect } from "playwright-test-coverage";
import { Role, User } from "../src/service/pizzaService";

async function basicInit(page: Page) {
  interface Store {
    id: number;
    name: string;
    franchiseId: number;
  }
  let stores: Store[] = [];
  let loggedInUser: User | undefined;
  const validUsers: Record<string, User> = {
    "d@jwt.com": {
      id: "3",
      name: "Pizza Diner",
      email: "d@jwt.com",
      password: "diner",
      roles: [{ role: Role.Diner }],
    },
    "a@jwt.com": {
      id: "1",
      name: "Admin Admoninium",
      email: "a@jwt.com",
      password: "admin",
      roles: [{ role: Role.Admin }],
    },
    "f@jwt.com": {
      id: "2",
      name: "Pizza franchisee",
      email: "f@jwt.com",
      password: "franchise",
      roles: [{ role: Role.Franchisee, objectId: "4" }],
    },
  };

  await page.route("*/**/api/auth", async (route) => {
    if (route.request().method() === "PUT") {
      const loginReq = route.request().postDataJSON();
      const user = validUsers[loginReq.email];

      if (!user || user.password !== loginReq.password) {
        await route.fulfill({ status: 401, json: { error: "Unauthorized" } });
        return;
      }
      loggedInUser = validUsers[loginReq.email];
      const loginRes = {
        user: loggedInUser,
        token: "abcdef",
      };

      expect(route.request().method()).toBe("PUT");
      await route.fulfill({ json: loginRes });
    } else if (route.request().method() === "DELETE") {
      expect(route.request().method()).toBe("DELETE");
      await route.fulfill({ json: { message: "logout successful" } });
    } else if (route.request().method() === "POST") {
      expect(route.request().method()).toBe("POST");
      await route.fulfill({
        json: {
          user: {
            name: "Tester McTesty",
            email: "t@jwt.com",
            roles: [
              {
                role: "diner",
              },
            ],
            id: 4,
          },
          token: "ghijklm",
        },
      });
    }
  });

  await page.route("*/**/api/user/me", async (route) => {
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: loggedInUser });
  });

  await page.route("*/**/api/order/menu", async (route) => {
    const menuRes = [
      {
        id: 1,
        title: "Veggie",
        image: "pizza1.png",
        price: 0.0038,
        description: "A garden of delight",
      },
      {
        id: 5,
        title: "Pepperoni",
        image: "pizza2.png",
        price: 0.0042,
        description: "Spicy treat",
      },
    ];
    expect(route.request().method()).toBe("GET");
    await route.fulfill({ json: menuRes });
  });

  await page.route("*/**/api/franchise/2", async (route) => {
    if (route.request().method() === "GET") {
      const res = [
        {
          id: 4,
          name: "topSpot",
          admins: [
            {
              id: 2,
              name: "pizza franchisee",
              email: "f@jwt.com",
            },
          ],
          stores: stores,
        },
      ];
      expect(route.request().method()).toBe("GET");
      await route.fulfill({ json: res });
    }
  });

  await page.route("*/**/api/franchise/4/store", async (route) => {
    if (route.request().method() === "POST") {
      const res = {
        id: 1,
        franchiseId: 4,
        name: "Lindon",
      };
      expect(route.request().method()).toBe("POST");
      stores.push(res);
      await route.fulfill({ json: res });
    }
  });

  await page.route(/\/api\/franchise(\?.*)?$/, async (route) => {
    if (route.request().method() === "GET") {
      const franchiseRes = {
        franchises: [
          {
            id: 2,
            name: "LotaPizza",
            stores: [
              { id: 4, name: "Lehi" },
              { id: 5, name: "Springville" },
              { id: 6, name: "American Fork" },
            ],
          },
          {
            id: 3,
            name: "PizzaCorp",
            stores: [{ id: 7, name: "Spanish Fork" }],
          },
          { id: 4, name: "topSpot", stores: [{ id: 8, name: "Lindon" }] },
        ],
      };
      expect(route.request().method()).toBe("GET");
      await route.fulfill({ json: franchiseRes });
    } else if (route.request().method() === "POST") {
      const franchiseRes = {
        stores: [],
        id: 4,
        name: "topSpot",
        admins: [
          {
            email: "f@jwt.com",
            id: 2,
            name: "pizza franchisee",
          },
        ],
      };
      expect(route.request().method()).toBe("POST");
      await route.fulfill({ json: franchiseRes });
    } else if (route.request().method() === "DELETE") {
      const franchiseRes = {
        message: "franchise deleted",
      };
      expect(route.request().method()).toBe("DELETE");
      await route.fulfill({ json: franchiseRes });
    }
  });

  // Order a pizza.
  await page.route("*/**/api/order", async (route) => {
    if (route.request().method() === "POST") {
      const orderReq = route.request().postDataJSON();
      const orderRes = {
        order: { ...orderReq, id: 23 },
        jwt: "eyJpYXQ",
      };
      expect(route.request().method()).toBe("POST");
      await route.fulfill({ json: orderRes });
    } else if (route.request().method() === "GET") {
      const orderRes = {
        dinerID: 3,
        orders: [
          {
            id: 23,
            franchiseId: 2,
            storeId: 4,
            date: "2026-02-21T01:50:36.000Z",
            items: [
              {
                id: 1,
                menuId: 1,
                description: "Veggie",
                price: 0.0038,
              },
              {
                id: 2,
                menuId: 2,
                description: "Pepperoni",
                price: 0.0042,
              },
            ],
          },
        ],
        page: 1,
      };
      expect(route.request().method()).toBe("GET");
      await route.fulfill({ json: orderRes });
    }
  });

  await page.goto("http://localhost:5173");
}

test("home page", async ({ page }) => {
  await page.goto("http://localhost:5173");

  expect(await page.title()).toBe("JWT Pizza");
});

test("register", async ({ page }) => {
  await basicInit(page);
  await page.getByRole("link", { name: "Register" }).click();
  await expect(page.getByRole("heading")).toContainText("Welcome to the party");
  await page.getByRole("textbox", { name: "Full name" }).fill("Tester McTesty");
  await page.getByRole("textbox", { name: "Email address" }).fill("t@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("diner");
  await page.getByRole("button", { name: "Register" }).click();

  await expect(page.getByRole("link", { name: "TM" })).toBeVisible();
});

test("purchase with login", async ({ page }) => {
  await basicInit(page);
  await expect(page.getByRole("heading")).toContainText("The web's best pizza");
  await page.getByRole("button", { name: "Order now" }).click();
  await page.getByRole("combobox").selectOption("4");
  await page.getByRole("link", { name: "Image Description Veggie A" }).click();
  await page.getByRole("link", { name: "Image Description Pepperoni" }).click();
  await page.getByRole("button", { name: "Checkout" }).click();
  await page.getByRole("textbox", { name: "Email address" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("d@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("diner");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.locator("tfoot")).toContainText("0.008 ₿");
  await expect(page.getByRole("heading")).toContainText("So worth it");
  await expect(page.getByRole("main")).toContainText(
    "Send me those 2 pizzas right now!",
  );
  await page.getByRole("button", { name: "Pay now" }).click();
  await expect(page.getByRole("heading")).toContainText(
    "Here is your JWT Pizza!",
  );
  await page.getByTestId("diner-page").click();
  await expect(page.getByRole("heading")).toContainText("Your pizza kitchen");
});

test("check out views", async ({ page }) => {
  await basicInit(page);
  await page
    .getByRole("contentinfo")
    .getByRole("link", { name: "Franchise" })
    .click();
  await expect(page.getByRole("main")).toContainText(
    "So you want a piece of the pie?",
  );
  await page.getByRole("link", { name: "About" }).click();
  await expect(page.getByRole("main")).toContainText("The secret sauce");
  await page.getByRole("link", { name: "History" }).click();
  await expect(page.getByRole("heading")).toContainText("Mama Rucci, my my");
  await page.getByRole("link", { name: "Register" }).click();
  await expect(page.getByRole("heading")).toContainText("Welcome to the party");
  await page.getByRole("main").getByText("Login").click();
  await page.getByRole("textbox", { name: "Email address" }).fill("d@jwt.com");
  await page.getByRole("textbox", { name: "Email address" }).press("Tab");
  await page.getByRole("textbox", { name: "Password" }).fill("diner");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.getByRole("heading")).toContainText("The web's best pizza");
  await page.getByRole("link", { name: "Logout" }).click();
  await expect(page.getByRole("heading")).toContainText("The web's best pizza");
});

test("admin creation", async ({ page }) => {
  await basicInit(page);
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Email address" }).press("Tab");
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: "Admin" }).click();
  await expect(page.locator("h3")).toContainText("Franchises");
  await page.getByRole("button", { name: "Add Franchise" }).click();
  await page.getByRole("textbox", { name: "franchise name" }).click();
  await page.getByRole("textbox", { name: "franchise name" }).fill("topSpot");
  await page.getByRole("textbox", { name: "franchisee admin email" }).click();
  await page
    .getByRole("textbox", { name: "franchisee admin email" })
    .fill("d@jwt.com");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.getByRole("table")).toContainText("topSpot");
  // await page
  //   .getByRole("row", { name: "topSpot pizza diner Close" })
  //   .getByRole("button")
  //   .click();
  // await page.getByRole("button", { name: "Close" }).click();
  await page.getByRole("link", { name: "Logout" }).click();
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("f@jwt.com");
  await page.getByRole("textbox", { name: "Email address" }).press("Tab");
  await page.getByRole("textbox", { name: "Password" }).fill("franchise");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: "Pf" }).click();
  await page
    .getByLabel("Global")
    .getByRole("link", { name: "Franchise" })
    .click();
  await expect(page.getByRole("heading")).toContainText("topSpot");
  await page.getByRole("button", { name: "Create store" }).click();
  await page.getByRole("textbox", { name: "store name" }).click();
  await page.getByRole("textbox", { name: "store name" }).fill("Lindon");
  await page.getByRole("button", { name: "Create" }).click();
  await expect(page.locator("tbody")).toContainText("Lindon");
  await page.getByRole("button", { name: "Close" }).click();
  await expect(page.getByRole("main")).toContainText(
    "Are you sure you want to close the topSpot store Lindon ? This cannot be restored. All outstanding revenue will not be refunded.",
  );
  await page.getByRole("button", { name: "Close" }).click();
  await page.getByRole("link", { name: "Logout" }).click();
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Email address" }).press("Tab");
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: "Admin" }).click();
  await page
    .getByRole("row", { name: "topSpot Close" })
    .getByRole("button")
    .click();
  await expect(page.getByRole("main")).toContainText(
    "Are you sure you want to close the topSpot franchise? This will close all associated stores and cannot be restored. All outstanding revenue will not be refunded.",
  );
  await page.getByRole("button", { name: "Close" }).click();
});
