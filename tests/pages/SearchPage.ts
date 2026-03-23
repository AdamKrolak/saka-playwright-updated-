import { type Page, type Locator } from "@playwright/test";

export class SearchPage {
  constructor(private page: Page) {}

  heroBanner(): Locator {
    return this.page.locator('[class*="bg-cover"][class*="overflow-hidden"]');
  }
  heroTitle(): Locator {
    return this.page.locator("h1");
  }
  carsCounter(): Locator {
    return this.page.locator(".inline-block.text-sm.text-foreground");
  }
  filters(): Locator {
    return this.page.locator(":nth-child(2) > .lg\\:block");
  }
  sortingOptions(): Locator {
    return this.page.locator('[title="Sort By"]');
  }
  pagination(): Locator {
    return this.page.locator(".mx-auto > .flex-row > :nth-child(2) > .flex");
  }
  nextPage(): Locator {
    return this.page.locator(":nth-child(3) > .border-primary-400");
  }

  car1(): Locator {
    return this.page.locator(":nth-child(1) > .grid > :nth-child(1)");
  }
  car1Image(): Locator {
    return this.page.locator(
      ':nth-child(1) > .grid > :nth-child(1) [data-slot="card-header"] img',
    );
  }
  car2Price(): Locator {
    return this.page.locator(
      ':nth-child(1) > .grid > :nth-child(2) [data-slot="card-footer"] > div > div:first-child',
    );
  }
  car2Accessories(): Locator {
    return this.page.locator(":nth-child(2) > .flex-1 > .w-min");
  }
  car2CompareBtn(): Locator {
    return this.page.locator(
      ':nth-child(1) > .grid > :nth-child(2) [data-slot="card-footer"] button[title="Compare"]',
    );
  }

  filterVechicelType(): Locator {
    return this.page.locator("#Vehicle\\ Type-button");
  }
  filterModel(): Locator {
    return this.page.locator("#Model-button");
  }
  modelList(): Locator {
    return this.page.locator("#Model-list");
  }
  activeFilters(): Locator {
    return this.page.locator(".lg\\:block > .flex-wrap");
  }
  clearAllBtn(): Locator {
    return this.page.locator(".bg-black");
  }
}
