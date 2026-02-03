import { test, expect } from "playwright-test-coverage";

test("has title", async ({ page }) => {
  await page.goto("https:///");
});
