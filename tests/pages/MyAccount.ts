import { type Page, type Locator, expect } from "@playwright/test";

export class MyAccount {
  constructor(private page: Page) {}

  async verifyMySakapageUrl(): Promise<void> {
    await expect(this.page).toHaveURL(/\/en\/my-saka/);
  }

  welcomeBanner(): Locator {
    return this.page
      .locator("div")
      .filter({ hasText: "Hi Adam, welcome to MySaka" })
      .nth(3);
  }
  welcomeText(): Locator {
    return this.page.getByRole("heading", {
      name: "Hi Adam, welcome to MySaka",
    });
  }

  dashboardBtn(): Locator {
    return this.page.locator(".\\!bg-neutral-black > .border-primary-400");
  }
  myCarsBtn(): Locator {
    return this.page.getByRole("link", { name: "My Cars" });
  }
  favouriteCarsBtn(): Locator {
    return this.page.locator(":nth-child(3) > .border-primary-400");
  }
  myProfileBtn(): Locator {
    return this.page.locator(":nth-child(4) > .border-primary-400");
  }
  offersBtn(): Locator {
    return this.page.locator(":nth-child(5) > .border-primary-400");
  }

  myPages(): Locator {
    return this.page.locator(".mb-6");
  }
  yourOffers(): Locator {
    return this.page.locator(":nth-child(1) > .my-4 > .mb-0");
  }
  yourFavCars(): Locator {
    return this.page.locator(":nth-child(3) > .my-4 > .mb-0");
  }
  ourArticles(): Locator {
    return this.page.locator(".my-0");
  }

  favouriteCar1(): Locator {
    return this.page.locator(
      ".md\\:flex-row > :nth-child(1) > .gap-4 > :nth-child(1)",
    );
  }
  favouriteCar2(): Locator {
    return this.page.locator(
      ".md\\:flex-row > :nth-child(1) > .gap-4 > :nth-child(2)",
    );
  }
  article1(): Locator {
    return this.page.locator(
      ".md\\:pb-2 > :nth-child(1) > .relative > .absolute",
    );
  }
  article2(): Locator {
    return this.page.locator(":nth-child(2) > .relative > .absolute");
  }

  myCarsTitle(): Locator {
    return this.page.locator(".my-8");
  }
  myCar1(): Locator {
    return this.page.locator(
      ":nth-child(2) > section > .gap-4 > :nth-child(1)",
    );
  }
  myCar2(): Locator {
    return this.page.locator(
      ":nth-child(2) > section > .gap-4 > :nth-child(2)",
    );
  }
  addCarBtn(): Locator {
    return this.page.locator(".overflow-hidden > .top-0");
  }
  addCar(): Locator {
    return this.page.getByRole("button", { name: "Add Your Car" });
  }
  fields(): Locator {
    return this.page.getByText("License PlateMakeAlfa");
  }
  addImage(): Locator {
    return this.page
      .locator("div")
      .filter({ hasText: /^Add A Picture Of Your Car$/ })
      .nth(1);
  }

  myFavCarsTitle(): Locator {
    return this.page.locator(".my-8");
  }
  myFavCar1(): Locator {
    return this.page.locator(".absolute.left-0.top-0").first();
  }
  myFavCar2(): Locator {
    return this.page.locator(".absolute.left-0.top-0").nth(1);
  }
  recommendedCarsTitle(): Locator {
    return this.page.locator(".py-4 > .flex.items-center > .text-lg");
  }
  recommendedCar1(): Locator {
    return this.page
      .locator(".w-full > .relative.flex.flex-col > .\\[\\.border-t\\]\\:pt-6")
      .first();
  }
  recommendedCarsNavigation(): Locator {
    return this.page.locator(".py-4 > .items-center > .border-primary-400");
  }

  myProfileTitle(): Locator {
    return this.page.locator(".mb-8");
  }
  firstName(): Locator {
    return this.page.getByText("First name");
  }
  lastName(): Locator {
    return this.page.getByText("Last name");
  }
  phoneNumber(): Locator {
    return this.page.getByText("Phone number");
  }
  email(): Locator {
    return this.page.getByText("Email");
  }
  editProfileBtn(): Locator {
    return this.page.getByText("Edit Profile");
  }

  offersTitle(): Locator {
    return this.page.locator(".mb-4");
  }
  offersContent(): Locator {
    return this.page.locator(".grid-cols-12");
  }

  myAccoutIcon(): Locator {
    return this.page.getByRole("button", { name: "My Saka" });
  }

  addCarForm(): Locator {
    return this.page.getByRole("button", { name: "Add Your Car" });
  }
}
