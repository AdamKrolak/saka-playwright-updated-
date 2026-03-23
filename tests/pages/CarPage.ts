import { type Page, type Locator, expect } from "@playwright/test";

export class CarPage {
  constructor(private page: Page) {}

  async verifyCarpageUrl(): Promise<void> {
    await expect(this.page).toHaveURL(/\/cars\//);
  }

  carImage(): Locator {
    return this.page.locator("picture.aspect-\\[1076\\/694\\]").first();
  }
  firstGallImage(): Locator {
    return this.page.locator("button.w-16 > picture").first();
  }
  carName(): Locator {
    return this.page.locator("#car-title");
  }
  carShorDsc(): Locator {
    return this.page.locator("#car-title + h2");
  }
  carPrice(): Locator {
    return this.page
      .locator("div.flex.flex-col > span.text-2xl.font-bold")
      .first();
  }
  breadcrumbs(): Locator {
    return this.page.locator('a.absolute[href*="/cars/"]');
  }

  yearOfMan(): Locator {
    return this.page.locator("b.text-bold", { hasText: "Model Year" });
  }
  mileage(): Locator {
    return this.page.locator("b.text-bold", { hasText: "Mileage" });
  }
  type(): Locator {
    return this.page.locator("b.text-bold", { hasText: "Fuel Type" });
  }
  transmission(): Locator {
    return this.page.locator("b.text-bold", { hasText: "Transmission" });
  }

  financingBtn(): Locator {
    return this.page.getByRole("button", { name: /Finance/i });
  }
  financingCalc(): Locator {
    return this.page.locator("#finance-calculator-form");
  }

  fullScreenBtn(): Locator {
    return this.page.locator('button[title="Maximise Image Gallery"]');
  }
  fullImage(): Locator {
    return this.page.locator(".fixed.inset-0.z-50");
  }
  minimiseBtn(): Locator {
    return this.page.locator('button[title="Minimise Image Gallery"]');
  }

  equAcc(): Locator {
    return this.page.getByRole("tab", { name: "Equipment" });
  }
  equAccTitle(): Locator {
    return this.page.getByText("Equipment");
  }
  equAccContent(): Locator {
    return this.page.locator('[role="tabpanel"][id*="equipment"] dl').first();
  }

  basicInfoAcc(): Locator {
    return this.page.getByRole("tab", { name: "Car Information" });
  }
  basicInfoTitle(): Locator {
    return this.page.getByRole("tab", { name: "Car Information" });
  }
  basicInfoAccCont(): Locator {
    return this.page
      .locator('[role="tabpanel"][id*="carInformation"] .grid')
      .first();
  }

  techInfoAcc(): Locator {
    return this.page.getByRole("tab", { name: "Car Information" });
  }
  techInfoTitle(): Locator {
    return this.page.getByText("Power (hp)").first();
  }
  techInfoAccCont(): Locator {
    return this.page
      .locator('[role="tabpanel"][id*="carInformation"] .grid')
      .nth(1);
  }

  condRepotAcc(): Locator {
    return this.page.locator("button", {
      hasText: "Request Condition Report",
    });
  }
  condRepotTitle(): Locator {
    return this.page.getByText("Condition Report").first();
  }
  condRepotAccForm(): Locator {
    return this.page.locator('[role="dialog"] form');
  }

  relatedCarTitle(): Locator {
    return this.page
      .locator("h2.my-0.text-2xl.font-semibold", {
        hasText: "Related Vehicles",
      })
      .first();
  }
  relatedCarSection(): Locator {
    return this.page.locator("section.max-w-\\[1336px\\]").filter({
      has: this.page.locator("h2.my-0", { hasText: "Related Vehicles" }),
    });
  }
  relatedCarFirstCar(): Locator {
    return this.page
      .locator("section.max-w-\\[1336px\\]")
      .filter({
        has: this.page.locator("h2.my-0", { hasText: "Related Vehicles" }),
      })
      .locator('[role="group"]')
      .first();
  }

  sakaVarma(): Locator {
    return this.page
      .locator("footer a:visible", { hasText: "SakaVarma" })
      .first();
  }
  salesPeopleTitle(): Locator {
    return this.page
      .locator("section.max-w-\\[1336px\\]")
      .filter({ has: this.page.locator("h2", { hasText: "Salespeople" }) });
  }
  salesPeopleSection(): Locator {
    return this.page
      .locator("section.max-w-\\[1336px\\]")
      .filter({ has: this.page.locator("h2", { hasText: "Salespeople" }) })
      .locator('[aria-roledescription="carousel"]');
  }
  salesPeopleFirst(): Locator {
    return this.page
      .locator("section.max-w-\\[1336px\\]")
      .filter({ has: this.page.locator("h2", { hasText: "Salespeople" }) })
      .locator('[role="group"]')
      .first();
  }
}
