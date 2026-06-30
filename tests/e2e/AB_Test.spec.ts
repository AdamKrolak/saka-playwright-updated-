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
  test("Test group 1a — Flag off - Set experiment cookie to 'control' -  card renders speech bubble ", async ({
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

  test("Test group 1b — Flag on - Set experiment cookie to 'test' - card renders Soita + WhatsApp buttons", async ({
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

  test("Test group 2 — Control variant events (flag off) - Phone - Call fires `product_card_lead_event` with `lead_channel: phone`", async ({
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

    const capturedLeadRequests: string[] = [];
    const requestListener = (request: import("@playwright/test").Request) => {
      try {
        const body = JSON.parse(request.postData() ?? "{}");
        if (body.eventName === "product_card_lead_event") {
          capturedLeadRequests.push(request.postData()!);
        }
      } catch {
        // ignore non-JSON requests
      }
    };
    page.on("request", requestListener);

    const leadRequestPromise = page.waitForRequest((request) => {
      try {
        const body = JSON.parse(request.postData() ?? "{}");
        return body.eventName === "product_card_lead_event";
      } catch {
        return false;
      }
    });

    await categoryPage.bubblePhoneButton().click();
    const leadRequest = await leadRequestPromise;

    // Wait briefly to capture any duplicate events that may fire shortly after
    await page.waitForTimeout(1000);
    page.off("request", requestListener);

    const body = JSON.parse(leadRequest.postData() ?? "{}");

    expect(body.eventName).toBe("product_card_lead_event");
    expect(body.metadata.lead_channel).toBe("phone");
    expect(body.metadata.page_type).toBe("listing");

    expect(
      capturedLeadRequests,
      "Exactly one 'product_card_lead_event' request should fire per action — no duplicates",
    ).toHaveLength(1);
  });

  test("Test group 2 — Control variant events (flag off) - Phone - GTM Event", async ({
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

    await categoryPage.bubblePhoneButton().click();

    await page.waitForFunction(
      () =>
        (window as any).dataLayer?.some((e: any) => e.event === "carCardCTA") &&
        (window as any).dataLayer?.some(
          (e: any) => e.event === "gtm.linkClick",
        ),
    );

    const dataLayer: any[] = await page.evaluate(
      () => (window as any).dataLayer ?? [],
    );
    const carCardCTAEvent = dataLayer.find((e) => e.event === "carCardCTA");
    expect(
      carCardCTAEvent,
      "carCardCTA event should exist in dataLayer",
    ).toBeTruthy();

    const gtmLinkClickEvent = dataLayer.find(
      (e) => e.event === "gtm.linkClick",
    );
    expect(
      gtmLinkClickEvent,
      "gtm.linkClick event should exist in dataLayer",
    ).toBeTruthy();

    expect(
      typeof gtmLinkClickEvent["gtm.elementUrl"] === "string" &&
        gtmLinkClickEvent["gtm.elementUrl"].startsWith("tel:"),
      "gtm.linkClick event should have gtm.elementUrl starting with 'tel:' (lead_channel: phone)",
    ).toBe(true);
  });

  test("Test group 2 — Control variant events (flag off) - Whatsapp - Call fires `product_card_lead_event` with `lead_channel: whatsapp`", async ({
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

    const capturedLeadRequests: string[] = [];
    const requestListener = (request: import("@playwright/test").Request) => {
      try {
        const body = JSON.parse(request.postData() ?? "{}");
        if (body.eventName === "product_card_lead_event") {
          capturedLeadRequests.push(request.postData()!);
        }
      } catch {
        // ignore non-JSON requests
      }
    };
    page.on("request", requestListener);

    const leadRequestPromise = page.waitForRequest((request) => {
      try {
        const body = JSON.parse(request.postData() ?? "{}");
        return body.eventName === "product_card_lead_event";
      } catch {
        return false;
      }
    });

    await categoryPage.bubbleWhatsappButton().click();
    const leadRequest = await leadRequestPromise;

    // Wait briefly to capture any duplicate events that may fire shortly after
    await page.waitForTimeout(1000);
    page.off("request", requestListener);

    const body = JSON.parse(leadRequest.postData() ?? "{}");

    expect(body.eventName).toBe("product_card_lead_event");
    expect(body.metadata.lead_channel).toBe("whatsapp");
    expect(body.metadata.page_type).toBe("listing");

    expect(
      capturedLeadRequests,
      "Exactly one 'product_card_lead_event' request should fire per action — no duplicates",
    ).toHaveLength(1);
  });

  test("Test group 2 — Control variant events (flag off) - WhatsApp - GTM Event", async ({
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
    await expect(categoryPage.bubbleWhatsappButton()).toBeVisible();

    await categoryPage.bubbleWhatsappButton().click();

    await page.waitForFunction(
      () =>
        (window as any).dataLayer?.some((e: any) => e.event === "carCardCTA") &&
        (window as any).dataLayer?.some(
          (e: any) => e.event === "gtm.linkClick",
        ),
    );

    const dataLayer: any[] = await page.evaluate(
      () => (window as any).dataLayer ?? [],
    );
    const carCardCTAEvent = dataLayer.find((e) => e.event === "carCardCTA");
    expect(
      carCardCTAEvent,
      "carCardCTA event should exist in dataLayer",
    ).toBeTruthy();

    const gtmLinkClickEvent = dataLayer.find(
      (e) => e.event === "gtm.linkClick",
    );
    expect(
      gtmLinkClickEvent,
      "gtm.linkClick event should exist in dataLayer",
    ).toBeTruthy();

    expect(
      typeof gtmLinkClickEvent["gtm.elementUrl"] === "string" &&
        gtmLinkClickEvent["gtm.elementUrl"].startsWith("https://wa.me/"),
      "gtm.linkClick event should have gtm.elementUrl starting with 'https://wa.me/' (lead_channel: whatsapp)",
    ).toBe(true);
  });

  test("Test group 3 — Variant B events (flag on) - Phone - Call fires `product_card_lead_event` with `lead_channel: phone`", async ({
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

    const capturedLeadRequests: string[] = [];
    const requestListener = (request: import("@playwright/test").Request) => {
      try {
        const body = JSON.parse(request.postData() ?? "{}");
        if (body.eventName === "product_card_lead_event") {
          capturedLeadRequests.push(request.postData()!);
        }
      } catch {
        // ignore non-JSON requests
      }
    };
    page.on("request", requestListener);

    const leadRequestPromise = page.waitForRequest((request) => {
      try {
        const body = JSON.parse(request.postData() ?? "{}");
        return body.eventName === "product_card_lead_event";
      } catch {
        return false;
      }
    });

    await categoryPage.phoneButton().click();
    const leadRequest = await leadRequestPromise;

    // Wait briefly to capture any duplicate events that may fire shortly after
    await page.waitForTimeout(1000);
    page.off("request", requestListener);

    const body = JSON.parse(leadRequest.postData() ?? "{}");

    expect(body.eventName).toBe("product_card_lead_event");
    expect(body.metadata.lead_channel).toBe("phone");
    expect(body.metadata.page_type).toBe("listing");

    expect(
      capturedLeadRequests,
      "Exactly one 'product_card_lead_event' request should fire per action — no duplicates",
    ).toHaveLength(1);
  });

  test("Test group 3 — Variant B events (flag on) - Phone - GTM Event", async ({
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

    await categoryPage.phoneButton().click();

    await page.waitForFunction(
      () =>
        (window as any).dataLayer?.some((e: any) => e.event === "carCardCTA") &&
        (window as any).dataLayer?.some(
          (e: any) => e.event === "gtm.linkClick",
        ),
    );

    const dataLayer: any[] = await page.evaluate(
      () => (window as any).dataLayer ?? [],
    );
    const carCardCTAEvent = dataLayer.find((e) => e.event === "carCardCTA");
    expect(
      carCardCTAEvent,
      "carCardCTA event should exist in dataLayer",
    ).toBeTruthy();

    const gtmLinkClickEvent = dataLayer.find(
      (e) => e.event === "gtm.linkClick",
    );
    expect(
      gtmLinkClickEvent,
      "gtm.linkClick event should exist in dataLayer",
    ).toBeTruthy();

    expect(
      typeof gtmLinkClickEvent["gtm.elementUrl"] === "string" &&
        gtmLinkClickEvent["gtm.elementUrl"].startsWith("tel:"),
      "gtm.linkClick event should have gtm.elementUrl starting with 'tel:' (lead_channel: phone)",
    ).toBe(true);
  });

  test("Test group 3 — Variant B events (flag on)  - Whatsapp - Call fires `product_card_lead_event` with `lead_channel: whatsapp`", async ({
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
    await expect(categoryPage.whatsappButton()).toBeVisible();

    const capturedLeadRequests: string[] = [];
    const requestListener = (request: import("@playwright/test").Request) => {
      try {
        const body = JSON.parse(request.postData() ?? "{}");
        if (body.eventName === "product_card_lead_event") {
          capturedLeadRequests.push(request.postData()!);
        }
      } catch {
        // ignore non-JSON requests
      }
    };
    page.on("request", requestListener);

    const leadRequestPromise = page.waitForRequest((request) => {
      try {
        const body = JSON.parse(request.postData() ?? "{}");
        return body.eventName === "product_card_lead_event";
      } catch {
        return false;
      }
    });

    await categoryPage.whatsappButton().click();
    const leadRequest = await leadRequestPromise;

    // Wait briefly to capture any duplicate events that may fire shortly after
    await page.waitForTimeout(1000);
    page.off("request", requestListener);

    const body = JSON.parse(leadRequest.postData() ?? "{}");

    expect(body.eventName).toBe("product_card_lead_event");
    expect(body.metadata.lead_channel).toBe("whatsapp");
    expect(body.metadata.page_type).toBe("listing");

    expect(
      capturedLeadRequests,
      "Exactly one 'product_card_lead_event' request should fire per action — no duplicates",
    ).toHaveLength(1);
  });

  test("Test group 3 — Variant B events (flag on) - Whatsapp - GTM Event", async ({
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
    await expect(categoryPage.whatsappButton()).toBeVisible();

    await categoryPage.whatsappButton().click();

    await page.waitForFunction(
      () =>
        (window as any).dataLayer?.some((e: any) => e.event === "carCardCTA") &&
        (window as any).dataLayer?.some(
          (e: any) => e.event === "gtm.linkClick",
        ),
    );

    const dataLayer: any[] = await page.evaluate(
      () => (window as any).dataLayer ?? [],
    );
    const carCardCTAEvent = dataLayer.find((e) => e.event === "carCardCTA");
    expect(
      carCardCTAEvent,
      "carCardCTA event should exist in dataLayer",
    ).toBeTruthy();

    const gtmLinkClickEvent = dataLayer.find(
      (e) => e.event === "gtm.linkClick",
    );
    expect(
      gtmLinkClickEvent,
      "gtm.linkClick event should exist in dataLayer",
    ).toBeTruthy();

    expect(
      typeof gtmLinkClickEvent["gtm.elementUrl"] === "string" &&
        gtmLinkClickEvent["gtm.elementUrl"].startsWith("https://wa.me/"),
      "gtm.linkClick event should have gtm.elementUrl starting with 'https://wa.me/' (lead_channel: whatsapp)",
    ).toBe(true);
  });
});
