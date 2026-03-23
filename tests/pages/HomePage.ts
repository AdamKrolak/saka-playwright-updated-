import { type Page, type Locator, expect } from "@playwright/test";

export class HomePage {
  constructor(private page: Page) {}

  async verifyHomepageUrl(): Promise<void> {
    await expect(this.page).toHaveURL(/https:\/\/saka\.fi\/(en|fi)\/?$/);
  }

  titleBanner(): Locator {
    return this.page.locator("h1");
  }
  heroBanner(): Locator {
    return this.page.locator('[data-id="hero"]');
  }
  cookieBanner(): Locator {
    return this.page.locator(".ot-sdk-container > .ot-sdk-row");
  }

  async acceptAllCookies(): Promise<void> {
    // Try OneTrust cookie banner (legacy)
    const otBtn = this.page.locator("#onetrust-accept-btn-handler");
    if (await otBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await otBtn.click();
      return;
    }
    // Try Cookiebot "Allow all" button with longer timeout
    const cbBtn = this.page.getByRole("button", { name: "Allow all" });
    try {
      await cbBtn.waitFor({ state: "visible", timeout: 8000 });
      await cbBtn.click();
      // Wait for the dialog to be dismissed so the consent cookie is set
      await this.page
        .getByRole("dialog")
        .waitFor({ state: "hidden", timeout: 5000 })
        .catch(() => {});
    } catch {
      // Cookiebot dialog not found
    }
  }

  sakaLogo(): Locator {
    return this.page.locator(".ot-sdk-container > .ot-sdk-row");
  }
  searchIcon(): Locator {
    return this.page.locator(".sf-header__icons > .search");
  }

  homePageTop(): Locator {
    return this.page.locator('div[data-id="top-items"]');
  }
  homePageMid(): Locator {
    return this.page.locator('div[data-id="async-items"]');
  }

  latestCarTitle(): Locator {
    return this.page
      .locator('div[data-id="async-items"]')
      .getByRole("region")
      .first()
      .getByRole("heading");
  }
  latestCar1(): Locator {
    return this.page
      .locator('div[data-id="async-items"]')
      .getByRole("region")
      .first()
      .getByRole("group")
      .first()
      .getByRole("link")
      .first();
  }
  electricCarTitle(): Locator {
    return this.page
      .locator('div[data-id="async-items"]')
      .getByRole("region", { name: "Electric cars" })
      .getByRole("heading");
  }
  electricCar1(): Locator {
    return this.page
      .locator('div[data-id="async-items"]')
      .getByRole("region", { name: "Electric cars" })
      .getByRole("group")
      .first()
      .getByRole("link")
      .first();
  }
  famillyCarTitle(): Locator {
    return this.page
      .locator('div[data-id="async-items"]')
      .getByRole("region", { name: "Family cars" })
      .getByRole("heading");
  }
  famillyCar2(): Locator {
    return this.page
      .locator('div[data-id="async-items"]')
      .getByRole("region", { name: "Family cars" })
      .getByRole("group")
      .nth(1)
      .getByRole("link")
      .first();
  }

  serviceSupport(): Locator {
    return this.page
      .locator('div[data-id="async-items"]')
      .getByRole("heading", {
        name: "Our additional services to support your car purchase",
      })
      .first();
  }
  serviceSupportArt(): Locator {
    return this.page
      .locator('div[data-id="async-items"]')
      .locator("section")
      .filter({
        hasText: "Our additional services to support your car purchase",
      })
      .getByRole("link")
      .first();
  }
  articleSection(): Locator {
    return this.page
      .locator('div[data-id="async-items"]')
      .locator('[role="region"]')
      .filter({ hasText: "Saka customer experiences" });
  }
  article1(): Locator {
    return this.page
      .locator('div[data-id="async-items"]')
      .locator('[role="region"]')
      .filter({ hasText: "Saka customer experiences" })
      .getByRole("group")
      .first();
  }

  prefooter(): Locator {
    return this.page.locator(".min-h-\\[568px\\] > .mx-auto");
  }
  prefooterBanner(): Locator {
    return this.page.locator(".mx-auto > .relative > .object-cover");
  }

  footer(): Locator {
    return this.page.locator("footer");
  }
  footerLogo(): Locator {
    return this.page
      .getByRole("navigation", { name: "Main" })
      .getByRole("link", { name: "Saka" })
      .locator("img");
  }
  followUs(): Locator {
    return this.page.locator("footer").getByText("Follow us").last();
  }
  carCategoriesFooter(): Locator {
    return this.page.locator("footer").getByText("Car categories").last();
  }
  productNserviceces(): Locator {
    return this.page.locator("footer").getByText("Products & Services").last();
  }
  comapny(): Locator {
    return this.page
      .locator("footer")
      .getByText("Company", { exact: true })
      .last();
  }

  newsletter(): Locator {
    return this.page.locator('footer input[name="email"]').first();
  }
  newsletterBtn(): Locator {
    return this.page.locator("footer button[type='submit']").first();
  }
  newsletterMsg(): Locator {
    return this.page.locator(".max-h-screen > .group");
  }

  facebook(): Locator {
    return this.page
      .locator("footer")
      .locator('[aria-label="Follow us on Facebook"]')
      .last();
  }
  instagram(): Locator {
    return this.page
      .locator("footer")
      .locator('[aria-label="Follow us on Instagram"]')
      .last();
  }
  tiktok(): Locator {
    return this.page
      .locator("footer")
      .locator('[aria-label="Follow us on TikTok"]')
      .last();
  }
  linkedIn(): Locator {
    return this.page
      .locator("footer")
      .locator('[aria-label="Follow us on LinkedIn"]')
      .last();
  }
  youtube(): Locator {
    return this.page
      .locator("footer")
      .locator('[aria-label="Follow us on Youtube"]')
      .last();
  }

  background(): Locator {
    return this.page.locator(".pb-14");
  }
  html(): Locator {
    return this.page.locator(".__variable_897ac5");
  }
}
