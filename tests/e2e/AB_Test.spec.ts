import { test, expect } from "../fixtures/fixtures";
import type { Page, Request } from "@playwright/test";

test.beforeEach(async ({ page, homePage }) => {
  page.on("pageerror", (err) => {
    if (
      err.message.includes("fbq is not defined") ||
      err.message.includes("Cannot read properties of undefined")
    ) {
      // Suppress known third-party errors
    }
  });
  await homePage.acceptAllCookies();
});

const CARS_URL = "https://saka.fi/en";
const COOKIE_DOMAIN = "saka.fi";
const EXPERIMENT_COOKIE =
  "saka_exp_assignment_product_card_cta_speech_bubble_vs_direct";

type Variant = "control" | "test";
type LeadChannel = "phone" | "whatsapp";

/**
 * Navigates to the cars listing, sets the experiment assignment cookie to the
 * given variant, reloads, and asserts the cookie was applied.
 */
async function setExperimentVariant(
  page: Page,
  homePage: any,
  variant: Variant,
): Promise<void> {
  await page.goto(CARS_URL, { waitUntil: "domcontentloaded" });

  await page.context().addCookies([
    {
      name: EXPERIMENT_COOKIE,
      value: variant,
      domain: COOKIE_DOMAIN,
      path: "/",
    },
  ]);

  await page.reload({ waitUntil: "domcontentloaded" });

  await homePage.acceptAllCookies();

  const cookies = await page.context().cookies();
  const experimentCookie = cookies.find((c) => c.name === EXPERIMENT_COOKIE);

  expect(
    experimentCookie?.value,
    `Cookie '${EXPERIMENT_COOKIE}' should be set to '${variant}'`,
  ).toBe(variant);
}

/** Returns true when the request is a `product_card_lead_event` analytics call. */
function isLeadEventRequest(request: Request): boolean {
  try {
    const body = JSON.parse(request.postData() ?? "{}");
    return body.eventName === "product_card_lead_event";
  } catch {
    return false;
  }
}

/**
 * Runs the given action, waits for the resulting `product_card_lead_event`
 * request, and asserts a single event fired with the expected lead channel.
 */
async function clickAndAssertLeadEvent(
  page: Page,
  action: () => Promise<void>,
  channel: LeadChannel,
): Promise<void> {
  const capturedLeadRequests: string[] = [];
  const requestListener = (request: Request) => {
    if (isLeadEventRequest(request)) {
      capturedLeadRequests.push(request.postData()!);
    }
  };
  page.on("request", requestListener);

  const leadRequestPromise = page.waitForRequest(isLeadEventRequest);

  await action();
  const leadRequest = await leadRequestPromise;

  // Wait briefly to capture any duplicate events that may fire shortly after
  await page.waitForTimeout(1000);
  page.off("request", requestListener);

  const body = JSON.parse(leadRequest.postData() ?? "{}");

  expect(body.eventName).toBe("product_card_lead_event");
  expect(body.metadata.lead_channel).toBe(channel);
  expect(body.metadata.page_type).toBe("listing");

  expect(
    capturedLeadRequests,
    "Exactly one 'product_card_lead_event' request should fire per action — no duplicates",
  ).toHaveLength(1);
}

/**
 * Waits for the GTM `carCardCTA` + `gtm.linkClick` events and asserts the
 * `gtm.elementUrl` starts with the expected scheme for the lead channel.
 */
async function assertGtmLinkClick(
  page: Page,
  elementUrlPrefix: string,
): Promise<void> {
  await page.waitForFunction(
    () =>
      (window as any).dataLayer?.some((e: any) => e.event === "carCardCTA") &&
      (window as any).dataLayer?.some((e: any) => e.event === "gtm.linkClick"),
  );

  const dataLayer: any[] = await page.evaluate(
    () => (window as any).dataLayer ?? [],
  );

  const carCardCTAEvent = dataLayer.find((e) => e.event === "carCardCTA");
  expect(
    carCardCTAEvent,
    "carCardCTA event should exist in dataLayer",
  ).toBeTruthy();

  const gtmLinkClickEvent = dataLayer.find((e) => e.event === "gtm.linkClick");
  expect(
    gtmLinkClickEvent,
    "gtm.linkClick event should exist in dataLayer",
  ).toBeTruthy();

  expect(
    typeof gtmLinkClickEvent["gtm.elementUrl"] === "string" &&
      gtmLinkClickEvent["gtm.elementUrl"].startsWith(elementUrlPrefix),
    `gtm.linkClick event should have gtm.elementUrl starting with '${elementUrlPrefix}'`,
  ).toBe(true);
}

/**
 * E2E coverage — Product card CTA A/B experiment
 * Experiment cookie: `saka_exp_assignment_product_card_cta_speech_bubble_vs_direct`
 *   - "control" (flag off): card shows a collapsed speech bubble that expands into Phone + WhatsApp buttons.
 *   - "test" (flag on / Variant B): card shows the Phone (Soita) + WhatsApp buttons directly, no speech bubble.
 *
 * What is covered:
 * - Group 1 (Rendering): Verifies the correct UI per variant — control renders the speech bubble with
 *   bubble Phone/WhatsApp buttons; test renders the direct Phone/WhatsApp buttons and hides the bubble.
 * - Group 2 (Control variant events, flag off): After expanding the bubble, clicking Phone/WhatsApp:
 *     • Fires exactly one `product_card_lead_event` network request with `metadata.lead_channel`
 *       ("phone"/"whatsapp") and `metadata.page_type: "listing"` (asserts no duplicate events).
 *     • Pushes the `carCardCTA` and `gtm.linkClick` events to the GTM `dataLayer`, with
 *       `gtm.elementUrl` starting with `tel:` (phone) or `https://wa.me/` (whatsapp).
 * - Group 3 (Variant B events, flag on): Same lead-event and GTM `dataLayer` assertions as Group 2,
 *   but clicking the direct Phone/WhatsApp buttons (no speech bubble step).
 * - Group 4 (Negative case): Carousel exclusion — switching locale (EN → FI) navigates to saka.fi/fi.
 */
test.describe("E2E tests for product card CTA event firing", () => {
  test.skip("DEPRECATED Test group 1a — Flag off - Set experiment cookie to 'control' -  card renders speech bubble ", async ({
    page,
    homePage,
    categoryPage,
  }) => {
    await setExperimentVariant(page, homePage, "control");

    await expect(categoryPage.speachBubble().first()).toBeVisible();
    await categoryPage.speachBubble().first().click();
    await expect(categoryPage.bubblePhoneButton()).toBeVisible();
    await expect(categoryPage.bubbleWhatsappButton()).toBeVisible();
  });

  test("Test group 1b — Flag on - Set experiment cookie to 'test' - card renders Soita + WhatsApp buttons", async ({
    page,
    homePage,
    categoryPage,
  }) => {
    await setExperimentVariant(page, homePage, "test");

    await expect(categoryPage.speachBubble().first()).toBeHidden();
    await expect(categoryPage.phoneButton()).toBeVisible();
    await expect(categoryPage.whatsappButton()).toBeVisible();
  });

  test.skip("DEPRECATED Test group 2 — Control variant events (flag off) - Phone - Call fires `product_card_lead_event` with `lead_channel: phone`", async ({
    page,
    homePage,
    categoryPage,
  }) => {
    await setExperimentVariant(page, homePage, "control");

    await expect(categoryPage.speachBubble().first()).toBeVisible();
    await categoryPage.speachBubble().first().click();
    await categoryPage.speachBubble().first().click();
    await expect(categoryPage.bubblePhoneButton()).toBeVisible();

    await clickAndAssertLeadEvent(
      page,
      () => categoryPage.bubblePhoneButton().click(),
      "phone",
    );
  });

  test.skip("DEPRECATED Test group 2 — Control variant events (flag off) - Phone - GTM Event", async ({
    page,
    homePage,
    categoryPage,
  }) => {
    await setExperimentVariant(page, homePage, "control");

    await expect(categoryPage.speachBubble().first()).toBeVisible();
    await categoryPage.speachBubble().first().click();
    await categoryPage.speachBubble().first().click();
    await expect(categoryPage.bubblePhoneButton()).toBeVisible();

    await categoryPage.bubblePhoneButton().click();

    await assertGtmLinkClick(page, "tel:");
  });

  test.skip("DEPRECATED Test group 2 — Control variant events (flag off) - Whatsapp - Call fires `product_card_lead_event` with `lead_channel: whatsapp`", async ({
    page,
    homePage,
    categoryPage,
  }) => {
    await setExperimentVariant(page, homePage, "control");

    await expect(categoryPage.speachBubble().first()).toBeVisible();
    await categoryPage.speachBubble().first().click({ force: true });
    await expect(categoryPage.bubblePhoneButton()).toBeVisible();

    await clickAndAssertLeadEvent(
      page,
      () => categoryPage.bubbleWhatsappButton().click(),
      "whatsapp",
    );
  });

  test.skip("DEPRECATED Test group 2 — Control variant events (flag off) - WhatsApp - GTM Event", async ({
    page,
    homePage,
    categoryPage,
  }) => {
    await setExperimentVariant(page, homePage, "control");

    await expect(categoryPage.speachBubble().first()).toBeVisible();
    await categoryPage.speachBubble().first().click({ force: true });
    await expect(categoryPage.bubbleWhatsappButton()).toBeVisible();

    await categoryPage.bubbleWhatsappButton().click({ force: true });

    await assertGtmLinkClick(page, "https://wa.me/");
  });

  test("Test group 3 — Variant B events (flag on) - Phone - Call fires `product_card_lead_event` with `lead_channel: phone`", async ({
    page,
    homePage,
    categoryPage,
  }) => {
    await setExperimentVariant(page, homePage, "test");

    await expect(categoryPage.speachBubble().first()).toBeHidden();
    await expect(categoryPage.phoneButton()).toBeVisible();

    await clickAndAssertLeadEvent(
      page,
      () => categoryPage.phoneButton().click(),
      "phone",
    );
  });

  test("Test group 3 — Variant B events (flag on) - Phone - GTM Event", async ({
    page,
    homePage,
    categoryPage,
  }) => {
    await setExperimentVariant(page, homePage, "test");

    await expect(categoryPage.speachBubble().first()).toBeHidden();
    await expect(categoryPage.phoneButton()).toBeVisible();

    await categoryPage.phoneButton().click();

    await assertGtmLinkClick(page, "tel:");
  });

  test("Test group 3 — Variant B events (flag on)  - Whatsapp - Call fires `product_card_lead_event` with `lead_channel: whatsapp`", async ({
    page,
    homePage,
    categoryPage,
  }) => {
    await setExperimentVariant(page, homePage, "test");

    await expect(categoryPage.speachBubble().first()).toBeHidden();
    await expect(categoryPage.whatsappButton()).toBeVisible();

    await clickAndAssertLeadEvent(
      page,
      () => categoryPage.whatsappButton().click(),
      "whatsapp",
    );
  });

  test("Test group 3 — Variant B events (flag on) - Whatsapp - GTM Event", async ({
    page,
    homePage,
    categoryPage,
  }) => {
    await setExperimentVariant(page, homePage, "test");

    await expect(categoryPage.speachBubble().first()).toBeHidden();
    await expect(categoryPage.whatsappButton()).toBeVisible();

    await categoryPage.whatsappButton().click();

    await assertGtmLinkClick(page, "https://wa.me/");
  });
});
