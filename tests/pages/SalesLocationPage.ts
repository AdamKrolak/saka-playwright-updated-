import { type Page, type Locator, expect } from "@playwright/test";

export class SalesLocationPage {
  constructor(private page: Page) {}

  async verifyLocPageUrl(): Promise<void> {
    await expect(this.page).toHaveURL("https://saka.fi/en/locations");
  }

  async closePromoBanner(): Promise<void> {
    const closeBtn = this.page
      .getByRole("button", { name: "Close", exact: true })
      .first();
    if (await closeBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await closeBtn.click();
      await closeBtn
        .waitFor({ state: "hidden", timeout: 3000 })
        .catch(() => {});
    }
  }

  async selectLocationFromDropdown(locationName: string): Promise<void> {
    const dropdown = this.locationDropdown();
    const listbox = this.locationDropdownList();

    // Dismiss cookie banner if it reappeared or wasn't fully dismissed
    await this.dismissCookieBannerIfPresent();

    await dropdown.scrollIntoViewIfNeeded();
    await dropdown.click();

    try {
      await listbox.waitFor({ state: "visible", timeout: 3000 });
    } catch {
      await this.dismissCookieBannerIfPresent();
      await dropdown.click();
      await listbox.waitFor({ state: "visible", timeout: 5000 });
    }

    await this.page.getByRole("option", { name: locationName }).click();
  }

  private async dismissCookieBannerIfPresent(): Promise<void> {
    const cookieDialog = this.page.locator("#CybotCookiebotDialog");
    if (await cookieDialog.isVisible({ timeout: 500 }).catch(() => false)) {
      const allowBtn = this.page.getByRole("button", { name: "Allow all" });
      if (await allowBtn.isVisible({ timeout: 500 }).catch(() => false)) {
        await allowBtn.click();
        await cookieDialog
          .waitFor({ state: "hidden", timeout: 5000 })
          .catch(() => {});
      }
    }
  }

  pageTitle(): Locator {
    return this.page.getByRole("heading", { level: 1 });
  }
  map(): Locator {
    return this.page.getByRole("list", { name: "Dealership Locations" });
  }

  location1(): Locator {
    return this.page.getByRole("listitem", { name: "Express" });
  }
  location2(): Locator {
    return this.page.getByRole("listitem", { name: "Lappeenranta" });
  }
  location3(): Locator {
    return this.page.getByRole("listitem", { name: "Koivuhaka" });
  }
  locationHyvinkää(): Locator {
    return this.page.getByRole("heading", { name: "Hyvinkää", level: 1 });
  }

  locationDropdown(): Locator {
    return this.page.getByRole("combobox", { name: "Location" });
  }
  locationDropdownList(): Locator {
    return this.page.getByRole("listbox");
  }

  location1Name(): Locator {
    return this.page
      .getByRole("listitem", { name: "Pakkala" })
      .getByText("Pakkala")
      .first();
  }
  location1Address(): Locator {
    return this.page
      .getByRole("listitem", { name: "Pakkala" })
      .getByText("Pakkalantie 15");
  }
  location1State(): Locator {
    return this.page
      .getByRole("listitem", { name: "Pakkala" })
      .getByText("Mon-Fri");
  }
  location1Phone(): Locator {
    return this.page
      .getByRole("listitem", { name: "Pakkala" })
      .getByText("10.00 - 18.00");
  }
  location1CarsBtn(): Locator {
    return this.page
      .getByRole("listitem", { name: "Pakkala" })
      .getByRole("link", { name: "Dealership Information" });
  }
  location1CallBtn(): Locator {
    return this.page
      .getByRole("listitem", { name: "Pakkala" })
      .getByText("10.00 - 16.00");
  }

  locationMap(): Locator {
    return this.page.locator("a[href*='maps.google.com/maps']").first();
  }
  locationHyvinkääAddress(): Locator {
    return this.page.getByText("Helletorpankatu 5, 05840 Hyvinkää");
  }
  locationaSalespeopleTitle(): Locator {
    return this.page.getByRole("heading", { name: "Salespeople & Contacts" });
  }
  locationaSalespeople1(): Locator {
    return this.page
      .getByRole("region", { name: "Salespeople & Contacts" })
      .getByRole("group")
      .first();
  }
  locationaSalespeople2(): Locator {
    return this.page
      .getByRole("region", { name: "Salespeople & Contacts" })
      .getByRole("group")
      .nth(1);
  }
  locationDescription(): Locator {
    return this.page.getByRole("heading", {
      name: "Saka Hyvinkää",
      level: 4,
    });
  }
}
