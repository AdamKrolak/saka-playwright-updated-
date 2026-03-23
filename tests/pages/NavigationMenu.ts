import { type Page, type Locator } from "@playwright/test";

export class NavigationMenu {
  constructor(private page: Page) {}

  mySakaIcon(): Locator {
    return this.page
      .getByRole("navigation", { name: "Main" })
      .getByRole("button", { name: "My Saka" });
  }
  loginDropdown(): Locator {
    return this.page.locator("[data-radix-menu-content]");
  }
  navMenu(): Locator {
    return this.page.getByRole("navigation", { name: "Main" });
  }

  signIn(): Locator {
    return this.page.getByRole("link", { name: "Sign in" });
  }
  signUp(): Locator {
    return this.page.getByRole("link", { name: "Sign up" });
  }
  logOutBtn(): Locator {
    return this.page.locator(".shadow-xl > .inline-flex");
  }

  searchIcon(): Locator {
    return this.page.locator('[data-id="desktop-search-trigger"]');
  }

  carsForSale(): Locator {
    return this.page
      .getByRole("navigation", { name: "Main" })
      .getByRole("button", { name: "Used Cars" });
  }
  carsForSale2(): Locator {
    return this.page
      .getByRole("navigation", { name: "Main" })
      .getByRole("button", { name: "Used Cars" });
  }
  dieselCars(): Locator {
    return this.page
      .getByRole("navigation", { name: "Main" })
      .getByRole("link", { name: "Diesel Cars" });
  }

  carsForSaleDrop(): Locator {
    return this.page
      .getByRole("navigation", { name: "Main" })
      .locator('div[data-state="open"]');
  }

  langFlag(): Locator {
    return this.page
      .getByRole("navigation", { name: "Main" })
      .getByRole("button", { name: "Open language selection" });
  }

  langDropdowm(): Locator {
    return this.page.locator("[data-radix-popper-content-wrapper]");
  }
  fiFlag(): Locator {
    return this.page
      .locator("[data-radix-popper-content-wrapper]")
      .getByRole("img", { name: "FI" });
  }
  svFlag(): Locator {
    return this.page
      .locator("[data-radix-popper-content-wrapper]")
      .getByRole("img", { name: "SV" });
  }
  enFlag(): Locator {
    return this.page
      .locator("[data-radix-popper-content-wrapper]")
      .getByRole("img", { name: "EN" });
  }

  sellYourCar(): Locator {
    return this.page
      .getByRole("navigation", { name: "Main" })
      .getByRole("button", { name: "Sell your car" });
  }
  modeSwitcher(): Locator {
    return this.page.locator(
      "[data-radix-menu-content] [role='group']:last-child",
    );
  }
  productsNServices(): Locator {
    return this.page
      .getByRole("navigation", { name: "Main" })
      .getByRole("button", { name: "Products & Services" });
  }
  articles(): Locator {
    return this.page
      .getByRole("navigation", { name: "Main" })
      .getByRole("link", { name: "News and Campaigns" });
  }
  salesLocation(): Locator {
    return this.page
      .getByRole("navigation", { name: "Main" })
      .getByRole("link", { name: "Sales Locations" });
  }
  comapny(): Locator {
    return this.page
      .getByRole("navigation", { name: "Main" })
      .getByRole("button", { name: "Company" });
  }
  logo(): Locator {
    return this.page
      .getByRole("navigation", { name: "Main" })
      .getByRole("link", { name: "Saka" });
  }
}
