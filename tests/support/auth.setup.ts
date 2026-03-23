import { test as setup, expect } from "@playwright/test";
import path from "path";

const authFile = path.join(__dirname, "../../playwright/.auth/user.json");

setup("authenticate", async ({ page }) => {
  const email = process.env.TEST_EMAIL!;
  const password = process.env.TEST_PASSWORD!;

  await page.goto("/auth/login");

  // Accept cookie banner if present
  const cookieBtn = page.locator("#onetrust-accept-btn-handler");
  if (await cookieBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await cookieBtn.click();
  }

  await page.locator("#\\:R67rrtadfb\\:-form-item").fill(email);
  await page.locator("#\\:Ra7rrtadfb\\:-form-item").fill(password);
  await page.locator(".space-y-6 > .relative").click();

  // Wait for successful redirect to My Saka dashboard
  await page.waitForURL(/oma-saka|my-saka/, { timeout: 15000 });

  await page.context().storageState({ path: authFile });
});
