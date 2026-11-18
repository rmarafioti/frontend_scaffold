// Tests for sendContactMessage: it refuses invalid fields without sending, sends one request to
// EmailJS with the message, and reports a failed send without logging anything.
import { describe, expect, it, vi } from "vitest";

import { mockFetch } from "@/test/helpers";
import { sendContactMessage } from "./sendContactMessage";

const VALID_MESSAGE = {
  full_name: "Test Visitor",
  email: "visitor@example.com",
  message: "Hello there.",
};

function stubEmailEnv() {
  vi.stubEnv("EMAILJS_SERVICE_ID", "test-service");
  vi.stubEnv("EMAILJS_TEMPLATE_ID", "test-template");
  vi.stubEnv("EMAILJS_PUBLIC_KEY", "test-public-key");
  vi.stubEnv("EMAILJS_PRIVATE_KEY", "test-private-key");
}

describe("sendContactMessage", () => {
  it.each(["full_name", "email", "message"])(
    "refuses a missing %s without calling fetch",
    async (field) => {
      const fetchMock = mockFetch({ body: {} });

      const result = await sendContactMessage({
        ...VALID_MESSAGE,
        [field]: "  ",
      });

      expect(result.isSent).toBe(false);
      expect(result.errors[field]).toBe(true);
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );

  it("refuses a bad email without calling fetch", async () => {
    const fetchMock = mockFetch({ body: {} });

    const result = await sendContactMessage({
      ...VALID_MESSAGE,
      email: "not-an-email",
    });

    expect(result).toEqual({
      isSent: false,
      errors: { full_name: false, email: true, message: false },
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends one request to EmailJS with the message's fields", async () => {
    stubEmailEnv();
    const fetchMock = mockFetch({ body: {} });

    const result = await sendContactMessage(VALID_MESSAGE);

    expect(result).toEqual({ isSent: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.emailjs.com/api/v1.0/email/send");
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body)).toEqual({
      service_id: "test-service",
      template_id: "test-template",
      user_id: "test-public-key",
      accessToken: "test-private-key",
      template_params: VALID_MESSAGE,
    });
  });

  it("reports a failure without logging when EmailJS answers with an error", async () => {
    stubEmailEnv();
    mockFetch({ status: 400, body: {} });
    const logSpies = ["log", "info", "warn", "error"].map((method) =>
      vi.spyOn(console, method),
    );

    const result = await sendContactMessage(VALID_MESSAGE);

    expect(result).toEqual({ isSent: false });
    logSpies.forEach((spy) => expect(spy).not.toHaveBeenCalled());
  });

  it("reports a failure when the request itself fails", async () => {
    stubEmailEnv();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    const result = await sendContactMessage(VALID_MESSAGE);

    expect(result).toEqual({ isSent: false });
  });
});
