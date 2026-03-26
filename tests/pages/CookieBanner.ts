import { type Page, type Locator } from "@playwright/test";

export class CookieBanner {
  constructor(private page: Page) {}

  cookieBanner(): Locator {
    return this.page.locator(".ot-sdk-container > .ot-sdk-row");
  }

  async acceptAllCookies(): Promise<void> {
    const btn = this.page.getByRole("button", { name: "Allow all" });
    if (await btn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await btn.click();
    }
  }
}
