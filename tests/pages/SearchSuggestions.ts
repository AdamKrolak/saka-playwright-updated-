import { type Page, type Locator } from "@playwright/test";

export class SearchSuggestions {
  constructor(private page: Page) {}

  searchSuggestions(): Locator {
    return this.page.locator('[role="region"][aria-label="Search results"]');
  }
  searchInput(): Locator {
    return this.page.locator('input[placeholder="Search for anything"]');
  }
  searchSugCarTitle1(): Locator {
    return this.page.locator(".-ml-3 > :nth-child(1) > .overflow-hidden");
  }
}
