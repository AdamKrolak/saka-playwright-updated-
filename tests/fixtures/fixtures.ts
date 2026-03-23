import { test as base } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { NavigationMenu } from "../pages/NavigationMenu";
import { LoginPage } from "../pages/LoginPage";
import { RegistrationPage } from "../pages/RegistrationPage";
import { CarPage } from "../pages/CarPage";
import { CategoryPage } from "../pages/CategoryPage";
import { ComparisonPage } from "../pages/ComparisonPage";
import { SearchPage } from "../pages/SearchPage";
import { SearchSuggestions } from "../pages/SearchSuggestions";
import { MyAccount } from "../pages/MyAccount";
import { SalesLocationPage } from "../pages/SalesLocationPage";
import { SiteMap } from "../pages/SiteMap";
import { CookieBanner } from "../pages/CookieBanner";

type PageFixtures = {
  homePage: HomePage;
  navigationMenu: NavigationMenu;
  loginPage: LoginPage;
  registrationPage: RegistrationPage;
  carPage: CarPage;
  categoryPage: CategoryPage;
  comparisonPage: ComparisonPage;
  searchPage: SearchPage;
  searchSuggestions: SearchSuggestions;
  myAccount: MyAccount;
  salesLocationPage: SalesLocationPage;
  siteMap: SiteMap;
  cookieBanner: CookieBanner;
};

export const test = base.extend<PageFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  navigationMenu: async ({ page }, use) => {
    await use(new NavigationMenu(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registrationPage: async ({ page }, use) => {
    await use(new RegistrationPage(page));
  },
  carPage: async ({ page }, use) => {
    await use(new CarPage(page));
  },
  categoryPage: async ({ page }, use) => {
    await use(new CategoryPage(page));
  },
  comparisonPage: async ({ page }, use) => {
    await use(new ComparisonPage(page));
  },
  searchPage: async ({ page }, use) => {
    await use(new SearchPage(page));
  },
  searchSuggestions: async ({ page }, use) => {
    await use(new SearchSuggestions(page));
  },
  myAccount: async ({ page }, use) => {
    await use(new MyAccount(page));
  },
  salesLocationPage: async ({ page }, use) => {
    await use(new SalesLocationPage(page));
  },
  siteMap: async ({ page }, use) => {
    await use(new SiteMap(page));
  },
  cookieBanner: async ({ page }, use) => {
    await use(new CookieBanner(page));
  },
});

export { expect } from "@playwright/test";
