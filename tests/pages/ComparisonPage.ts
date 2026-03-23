import { type Page, type Locator } from "@playwright/test";

export class ComparisonPage {
  constructor(private page: Page) {}

  // Add a car to comparison via the two-click popup flow:
  // 1. Click the nth Compare button on the car card grid (opens action popup)
  // 2. Click the Compare button inside the popup (adds car to comparison)
  // 3. Close the popup to keep button indices consistent
  async addCarToComparison(nth: number): Promise<void> {
    // Dismiss the promo banner if visible
    const promoBanner = this.page.locator(
      'button:has(> p:text("Close")):not(form button)',
    );
    if (
      await promoBanner
        .first()
        .isVisible({ timeout: 1000 })
        .catch(() => false)
    ) {
      await promoBanner.first().click();
      await promoBanner
        .first()
        .waitFor({ state: "hidden", timeout: 3000 })
        .catch(() => {});
    }
    const carCompareBtn = this.page.locator('button[title="Compare"]').nth(nth);
    await carCompareBtn.scrollIntoViewIfNeeded();
    await carCompareBtn.click({ force: true });
    // Wait for the popup to render then click its Compare button
    const popupCompare = this.page.locator(
      ':has(> a[title="Call"]) > button[title="Compare"]',
    );
    await popupCompare.waitFor({ state: "visible", timeout: 5000 });
    await popupCompare.click();
    // Wait for sidebar to update
    await this.page.locator('form[action="/comparison"]').waitFor({
      state: "attached",
      timeout: 5000,
    });
    // Close the popup to restore clean button indices
    const closePopup = this.page.locator(
      ':has(> a[title="Call"]) > button[title="Close"]',
    );
    if (await closePopup.isVisible({ timeout: 2000 }).catch(() => false)) {
      await closePopup.click();
      await closePopup
        .waitFor({ state: "hidden", timeout: 3000 })
        .catch(() => {});
    }
  }

  // Category page compare buttons - each car card has a button[title="Compare"]
  // Car grid positions: 1=1st car, 3=2nd car, 4=3rd car, 5=4th car, 6=5th car (position 2 is an ad banner)
  compareCar1Cat(): Locator {
    return this.page.locator('button[title="Compare"]').nth(0);
  }
  compareCar2Cat(): Locator {
    return this.page.locator('button[title="Compare"]').nth(1);
  }
  compareCar3Cat(): Locator {
    return this.page.locator('button[title="Compare"]').nth(2);
  }
  compareCar4Cat(): Locator {
    return this.page.locator('button[title="Compare"]').nth(3);
  }
  compareCar5Cat(): Locator {
    return this.page.locator('button[title="Compare"]').nth(4);
  }

  // Comparison sidebar - the form inside the fixed aside on the left
  comparisonSidebar(): Locator {
    return this.page.locator('form[action="/comparison"]');
  }
  // First car item in sidebar
  sidebarCar1(): Locator {
    return this.page.locator('form[action="/comparison"] .rounded-3xl').first();
  }
  // Three car items in sidebar (when sidebar is full with 3 cars)
  sidebarCar31(): Locator {
    return this.page.locator('form[action="/comparison"] .rounded-3xl').nth(0);
  }
  sidebarCar32(): Locator {
    return this.page.locator('form[action="/comparison"] .rounded-3xl').nth(1);
  }
  sidebarCar33(): Locator {
    return this.page.locator('form[action="/comparison"] .rounded-3xl').nth(2);
  }
  // Toast notification shown when trying to add a 4th car (comparison is full)
  sidebarMessage(): Locator {
    return this.page.locator('aside:first-of-type li[role="status"]');
  }

  // Toggle button to collapse/expand the comparison sidebar (target visible child div)
  closeOpenSidebar(): Locator {
    return this.page
      .locator("aside.fixed.left-0 button.bottom-0 > div")
      .first();
  }
  // Remove button inside each sidebar car item (inside .rounded-3xl car card)
  removeCarButton(): Locator {
    return this.page
      .locator('form[action="/comparison"] .rounded-3xl button')
      .first();
  }
  // Submit button to navigate to the comparison page (direct child of form, not nested Remove buttons)
  goToComparePageBtn(): Locator {
    return this.page.locator(
      'form[action="/comparison"] > button[type="submit"]',
    );
  }

  // Comparison page elements
  title(): Locator {
    return this.page.locator("h1");
  }
  descripiton(): Locator {
    return this.page.locator("h2.sr-only").first();
  }

  // Sticky car headers at top of comparison page
  carHeader1(): Locator {
    return this.page.locator(".sticky .mx-auto > div:nth-child(1)").first();
  }
  carHeader2(): Locator {
    return this.page.locator(".sticky .mx-auto > div:nth-child(2)").first();
  }
  carHeader3(): Locator {
    return this.page.locator(".sticky .mx-auto > div:nth-child(3)").first();
  }

  // Car tile price elements (monthly price - text-primary-500)
  price1(): Locator {
    return this.page
      .locator(".justify-between > :nth-child(1) .text-primary-500")
      .first();
  }
  price2(): Locator {
    return this.page
      .locator(".justify-between > :nth-child(2) .text-primary-500")
      .first();
  }
  price3(): Locator {
    return this.page
      .locator(".justify-between > :nth-child(3) .text-primary-500")
      .first();
  }
  // Car tile cards in comparison details section
  carTile1(): Locator {
    return this.page.locator(".justify-between > :nth-child(1)").nth(1);
  }
  carTile2(): Locator {
    return this.page.locator(".justify-between > :nth-child(2)").nth(1);
  }
  carTile3(): Locator {
    return this.page.locator(".justify-between > :nth-child(3)").nth(1);
  }
}
