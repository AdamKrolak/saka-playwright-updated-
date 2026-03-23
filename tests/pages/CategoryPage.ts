import { type Page, type Locator } from "@playwright/test";

export class CategoryPage {
  constructor(private page: Page) {}

  car1(): Locator {
    return this.page
      .locator('[data-slot="card"]')
      .first()
      .locator('a[href*="/car/"]');
  }
  heroBanner(): Locator {
    return this.page.locator(".z-1");
  }
  heroBannerTitle(): Locator {
    return this.page.locator("h1");
  }
  heroBannerDesc(): Locator {
    return this.page.locator(".z-1 .mx-auto");
  }

  carCounter(): Locator {
    return this.page.locator(".inline-block.text-sm.text-foreground");
  }
  pagination(): Locator {
    return this.page.locator(".mx-auto > .flex-row > :nth-child(2) > .flex");
  }
  nextPage(): Locator {
    return this.page.locator(":nth-child(3) > .border-primary-400");
  }
  sorting(): Locator {
    return this.page.locator('[title="Sort By"]');
  }
  filters(): Locator {
    return this.page.locator(":nth-child(2) > .lg\\:block");
  }

  car1Image(): Locator {
    return this.page
      .locator('[data-slot="card"]')
      .first()
      .locator('a[href*="/car/"]');
  }
  car4Price(): Locator {
    return this.page.locator(
      '[data-slot="card"]:nth-child(4) [data-slot="card-footer"] .h-11',
    );
  }
  car4Accessories(): Locator {
    return this.page.locator(":nth-child(4) > .flex-1 > .w-min");
  }
  car4CompareBtn(): Locator {
    return this.page.locator(':nth-child(4) button[title="Compare"]');
  }
  car1Diesel(): Locator {
    return this.page
      .locator('[data-slot="card"]')
      .first()
      .locator('span[title="Diesel"]');
  }
  car4(): Locator {
    return this.page.locator('[data-slot="card"] a[href*="/car/"]').nth(3);
  }
}
