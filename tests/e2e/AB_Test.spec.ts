import { test, expect } from "../fixtures/fixtures";
import { CategoryPage } from "../pages/CategoryPage";

// test.beforeEach(async ({ page, homePage }) => {
//   page.on("pageerror", (err) => {
//     if (
//       err.message.includes("fbq is not defined") ||
//       err.message.includes("Cannot read properties of undefined")
//     ) {
//       // Suppress known third-party errors
//     }
//   });
//   await homePage.acceptAllCookies();
// });

test.describe("E2E tests for product card CTA event firing", () => {
  test("Test group 1a — Set experiment cookie to 'control' -  card renders speech bubble ", async ({
    page,
    categoryPage,
  }) => {
    await page.goto("https://saka-stage-ctfl-dev.vercel.app/en/cars", {
      waitUntil: "domcontentloaded",
    });

    await page.context().addCookies([
      {
        name: "saka_exp_assignment_product_card_cta_speech_bubble_vs_direct",
        value: "control",
        domain: "saka-stage-ctfl-dev.vercel.app",
        path: "/",
      },
    ]);

    await page.reload({ waitUntil: "domcontentloaded" });

    const cookies = await page.context().cookies();
    const experimentCookie = cookies.find(
      (c) =>
        c.name ===
        "saka_exp_assignment_product_card_cta_speech_bubble_vs_direct",
    );

    expect(
      experimentCookie?.value,
      "Cookie 'saka_exp_assignment_product_card_cta_speech_bubble_vs_direct' should be set to 'control'",
    ).toBe("control");

    await expect(categoryPage.speachBubble().first()).toBeVisible();
    await categoryPage.speachBubble().first().click();
    await expect(categoryPage.bubblePhoneButton()).toBeVisible();
    await expect(categoryPage.bubbleWhatsappButton()).toBeVisible();
  });

  test("Test group 1b — Set experiment cookie to 'test' - card renders Soita + WhatsApp buttons", async ({
    page,
    categoryPage,
  }) => {
    await page.goto("https://saka-stage-ctfl-dev.vercel.app/en/cars", {
      waitUntil: "domcontentloaded",
    });

    await page.context().addCookies([
      {
        name: "saka_exp_assignment_product_card_cta_speech_bubble_vs_direct",
        value: "test",
        domain: "saka-stage-ctfl-dev.vercel.app",
        path: "/",
      },
    ]);

    await page.reload({ waitUntil: "domcontentloaded" });

    const cookies = await page.context().cookies();
    const experimentCookie = cookies.find(
      (c) =>
        c.name ===
        "saka_exp_assignment_product_card_cta_speech_bubble_vs_direct",
    );

    expect(
      experimentCookie?.value,
      "Cookie 'saka_exp_assignment_product_card_cta_speech_bubble_vs_direct' should be set to 'test'",
    ).toBe("test");

    await expect(categoryPage.speachBubble().first()).toBeHidden();
    await expect(categoryPage.phoneButton()).toBeVisible();
    await expect(categoryPage.whatsappButton()).toBeVisible();
  });

  test("Test group 2 — Control variant events (flag off)", async ({
    page,
    navigationMenu,
  }) => {
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await navigationMenu.langFlag().click({ force: true });
    await navigationMenu.fiFlag().click();
    await expect(page).toHaveURL(/https:\/\/saka\.fi\/fi/);
  });

  test("Test group 3 — Variant B events (flag on)", async ({
    page,
    navigationMenu,
  }) => {
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await navigationMenu.langFlag().click({ force: true });
    await navigationMenu.fiFlag().click();
    await expect(page).toHaveURL(/https:\/\/saka\.fi\/fi/);
  });

  test("Test group 4 — Carousel exclusion (negative case)", async ({
    page,
    navigationMenu,
  }) => {
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await navigationMenu.langFlag().click({ force: true });
    await navigationMenu.fiFlag().click();
    await expect(page).toHaveURL(/https:\/\/saka\.fi\/fi/);
  });
});
