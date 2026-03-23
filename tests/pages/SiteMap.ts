import { type Page, type Locator } from "@playwright/test";

export class SiteMap {
  constructor(private page: Page) {}

  description(): Locator {
    return this.page.locator('head > meta[name="description"]');
  }
  robots(): Locator {
    return this.page.locator('head > meta[name="robots"]');
  }
  canonical(): Locator {
    return this.page.locator('head > link[rel="canonical"]');
  }
}
