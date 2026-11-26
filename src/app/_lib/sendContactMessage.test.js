// Tests for sendContactMessage: it drops a bot caught by the honeypot and refuses invalid fields
// without sending, sends one request to the CMS's contact route with the message and photos, maps
// a 400's field messages onto the form, and reports any other failure without logging anything.
import { describe, expect, it, vi } from "vitest";

import { mockFetch } from "@/test/helpers";
import { sendContactMessage } from "./sendContactMessage";

const VALID_MESSAGE = {
  full_name: "Test Visitor",
  email: "visitor@example.com",
  message: "Hello there.",
};

function toFormData(fields, photos = []) {
  const formData = new FormData();
  for (const [name, value] of Object.entries(fields)) {
    formData.append(name, value);
  }
  for (const photo of photos) {
    formData.append("photos", photo);
  }
  return formData;
}

function stubCmsEnv() {
  vi.stubEnv("HEADLESS_CMS_API_URL", "https://cms.test");
  vi.stubEnv("HEADLESS_CMS_API_KEY", "test-api-key");
}

describe("sendContactMessage", () => {
  it("reports success without calling fetch when the honeypot is filled", async () => {
    stubCmsEnv();
    const fetchMock = mockFetch({ status: 201, body: {} });

    const result = await sendContactMessage(
      toFormData({ ...VALID_MESSAGE, contactCode: "bot" }),
    );

    expect(result).toEqual({ isSent: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each(["full_name", "email", "message"])(
    "refuses a missing %s without calling fetch",
    async (field) => {
      stubCmsEnv();
      const fetchMock = mockFetch({ body: {} });

      const result = await sendContactMessage(
        toFormData({ ...VALID_MESSAGE, [field]: "  " }),
      );

      expect(result.isSent).toBe(false);
      expect(result.errors[field]).toEqual(expect.any(String));
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );

  it("refuses a bad email without calling fetch", async () => {
    stubCmsEnv();
    const fetchMock = mockFetch({ body: {} });

    const result = await sendContactMessage(
      toFormData({ ...VALID_MESSAGE, email: "not-an-email" }),
    );

    expect(result).toEqual({
      isSent: false,
      errors: {
        full_name: null,
        email: "Please enter a valid email",
        message: null,
      },
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reports a failure without calling fetch when the CMS URL is unset", async () => {
    const fetchMock = mockFetch({ status: 201, body: {} });

    const result = await sendContactMessage(toFormData(VALID_MESSAGE));

    expect(result).toEqual({ isSent: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends one request to the CMS's contact route with the message's fields", async () => {
    stubCmsEnv();
    const fetchMock = mockFetch({
      status: 201,
      body: { data: { received: true } },
    });

    const result = await sendContactMessage(toFormData(VALID_MESSAGE));

    expect(result).toEqual({ isSent: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://cms.test/api/public/contact");
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({
      Authorization: "Bearer test-api-key",
      "X-CSRF-Protection": "1",
      "Content-Type": "application/json",
    });
    expect(JSON.parse(init.body)).toEqual({
      name: "Test Visitor",
      email: "visitor@example.com",
      message: "Hello there.",
    });
  });

  it("sends each photo as base64, in order, and skips an empty file part", async () => {
    stubCmsEnv();
    const fetchMock = mockFetch({
      status: 201,
      body: { data: { received: true } },
    });
    const photos = [
      new File(["first"], "photo-1.jpg", { type: "image/jpeg" }),
      new File([], "", { type: "application/octet-stream" }),
      new File(["second"], "photo-2.jpg", { type: "image/jpeg" }),
    ];

    await sendContactMessage(toFormData(VALID_MESSAGE, photos));

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.images).toEqual([
      { content: Buffer.from("first").toString("base64") },
      { content: Buffer.from("second").toString("base64") },
    ]);
  });

  it("maps a 400's field messages onto the form's fields", async () => {
    stubCmsEnv();
    mockFetch({
      status: 400,
      body: {
        error: {
          message: "Please fix the highlighted fields.",
          fields: {
            name: "Name is too long.",
            email: "Please enter a valid email.",
            "images.0.content": "Each image must be a jpg, png or webp.",
          },
        },
      },
    });

    const result = await sendContactMessage(toFormData(VALID_MESSAGE));

    expect(result).toEqual({
      isSent: false,
      errors: {
        full_name: "Name is too long.",
        email: "Please enter a valid email.",
        photos: "Each image must be a jpg, png or webp.",
      },
    });
  });

  it("reports a general failure when a 400's fields name no form field", async () => {
    stubCmsEnv();
    mockFetch({
      status: 400,
      body: {
        error: {
          message: "Please fix the highlighted fields.",
          fields: { "extras.0.label": "Too long." },
        },
      },
    });

    const result = await sendContactMessage(toFormData(VALID_MESSAGE));

    expect(result).toEqual({ isSent: false });
  });

  it.each([
    [413, "Request body is too large."],
    [429, "Too many requests. Please try again later."],
    [500, "Something went wrong, please try again."],
  ])(
    "reports a general failure without logging when the CMS answers %i",
    async (status, message) => {
      stubCmsEnv();
      mockFetch({ status, body: { error: { message } } });
      const logSpies = ["log", "info", "warn", "error"].map((method) =>
        vi.spyOn(console, method),
      );

      const result = await sendContactMessage(toFormData(VALID_MESSAGE));

      expect(result).toEqual({ isSent: false });
      logSpies.forEach((spy) => expect(spy).not.toHaveBeenCalled());
    },
  );

  it("reports a failure when the request itself fails", async () => {
    stubCmsEnv();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    const result = await sendContactMessage(toFormData(VALID_MESSAGE));

    expect(result).toEqual({ isSent: false });
  });
});
