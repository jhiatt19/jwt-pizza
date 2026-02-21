import { test, expect } from "playwright-test-coverage";

test("home page", async ({ page }) => {
  await page.goto("http://localhost:5173");

  expect(await page.title()).toBe("JWT Pizza");
});

test("purchase with login", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await expect(page.getByRole("heading")).toContainText("The web's best pizza");
  await page.getByRole("button", { name: "Order now" }).click();
  await page.getByRole("combobox").selectOption("1");
  await page.getByRole("link", { name: "Image Description Veggie A" }).click();
  await page.getByRole("link", { name: "Image Description Pepperoni" }).click();
  await page.getByRole("button", { name: "Checkout" }).click();
  await page.getByRole("textbox", { name: "Email address" }).click();
  await page.getByRole("textbox", { name: "Email address" }).fill("d@jwt.com");
  await page.getByRole("textbox", { name: "Password" }).click();
  await page.getByRole("textbox", { name: "Password" }).fill("diner");
  await page.getByRole("textbox", { name: "Password" }).press("Enter");
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
});
