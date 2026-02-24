import { test, expect } from "playwright-test-coverage";
import { Role, User } from "../src/service/pizzaService";
import { Page } from "@playwright/test";

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
            name: "pizza diner",
            email: "d@jwt.com",
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
  await page.route("*/**/api/user", async (route) => {
    if (route.request().method() === "GET") {
      const userReq = route.request().postDataJSON();
      const userRes = {
        users: [
          {
            name: "admin",
            email: "a@jwt.com",
            id: "1",
            roles: [{ role: Role.Admin }],
          },
          {
            name: "pizza diner",
            email: "d@jwt.com",
            id: "4",
            roles: [{ role: Role.Diner }],
          },
        ],
      };
      expect(route.request().method()).toBe("GET");
      await route.fulfill({ json: userRes });
    }
  });
  await page.route(`*/**/api/user/4`, async (route) => {
    if (route.request().method() === "PUT") {
      const userUpdate = route.request().postDataJSON();
      console.log(userUpdate);
      const updateRes = {
        email: "d@jwt.com",
        roles: [{ role: Role.Diner }],
        name: "pizza dinerx",
      };
      expect(route.request().method()).toBe("PUT");
      await route.fulfill({ json: updateRes });
    } else if (route.request().method() === "DELETE") {
      const deleteRes = {
        users: [
          {
            name: "admin",
            email: "a@jwt.com",
            id: "1",
            roles: [{ role: Role.Admin }],
          },
        ],
      };
      expect(route.request().method()).toBe("DELETE");
      await route.fulfill({ json: deleteRes });
    }
  });
  await page.goto("/");
}

test("updateUser", async ({ page }) => {
  await basicInit(page);
  await page.getByRole("link", { name: "Register" }).click();
  await page.getByRole("textbox", { name: "Full name" }).fill("pizza diner");
  await page.getByRole("textbox", { name: "Email address" }).fill("d@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("diner");
  await page.getByRole("button", { name: "Register" }).click();

  await page.getByRole("link", { name: "pd" }).click();

  await expect(page.getByRole("main")).toContainText("pizza diner");
  await page.getByRole("button", { name: "Edit" }).click();
  await expect(page.locator("h3")).toContainText("Edit user");
  await page.getByRole("textbox").first().click();
  await page.getByRole("textbox").first().fill("pizza dinerx");
  await page.getByRole("button", { name: "Update" }).click();
  await expect(page.getByRole("main")).toContainText("pizza dinerx");
});

test("listUsers", async ({ page }) => {
  await basicInit(page);
  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Email address" }).press("Tab");
  await page.getByRole("textbox", { name: "Password" }).fill("admin");

  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: "Admin" }).click();
  await page.getByRole("button", { name: "List Users" }).click();
  await expect(page.getByTestId("table-testy")).toContainText("Users");
  await expect(page.getByRole("main")).toContainText("Next Page");
  await page.getByRole("button", { name: "Next Page" }).click();
  await page.getByRole("button", { name: "Prev Page" }).click();
  await expect(page.getByRole("main")).toContainText("Back");
  await page.getByRole("button", { name: "Back" }).click();
});

test("deleteUsers", async ({ page }) => {
  await basicInit(page);

  await page.getByRole("link", { name: "Register" }).click();
  await expect(page.getByRole("heading")).toContainText("Welcome to the party");
  await page.getByRole("textbox", { name: "Full name" }).fill("pizza diner");
  await page.getByRole("textbox", { name: "Email address" }).fill("d@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).fill("diner");
  await page.getByRole("button", { name: "Register" }).click();

  await expect(page.getByRole("link", { name: "pd" })).toBeVisible();
  await page.getByRole("link", { name: "Logout" }).click();

  await page.getByRole("link", { name: "Login" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("a@jwt.com");
  await page.getByRole("textbox", { name: "Email address" }).press("Tab");
  await page.getByRole("textbox", { name: "Password" }).fill("admin");
  await page.getByRole("button", { name: "Login" }).click();
  await page.getByRole("link", { name: "Admin" }).click();
  await page.getByRole("button", { name: "List Users" }).click();

  await page
    .getByRole("row", { name: "pizza diner d@jwt.com diner" })
    .getByRole("button")
    .click();
  await expect(page.locator("tbody")).toContainText("a@jwt.com");
  await expect(page.locator("tbody")).toContainText("admin");
  await expect(page.locator("tbody")).toContainText("admin");
  await expect(page.getByRole("main")).toContainText("Back");
  await page.getByRole("button", { name: "Back" }).click();
});
