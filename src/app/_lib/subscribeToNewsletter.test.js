// Tests for subscribeToNewsletter: it drops honeypot signups and bad emails without sending, sends
// one request to Buttondown with the email and the visitor's IP, and reports a failure without
// logging anything.
import { headers } from "next/headers";
import { describe, expect, it, vi } from "vitest";

import { mockFetch } from "@/test/helpers";
import { subscribeToNewsletter } from "./subscribeToNewsletter";

vi.mock("next/headers", () => ({ headers: vi.fn() }));

const EMAIL = "reader@example.com";

function stubRequestHeaders(values = {}) {
  vi.mocked(headers).mockResolvedValue(new Headers(values));
}

describe("subscribeToNewsletter", () => {
  it("tells a bot that filled the honeypot it succeeded, without calling fetch", async () => {
    const fetchMock = mockFetch({ status: 201, body: {} });

    const result = await subscribeToNewsletter({
      email: EMAIL,
      website: "https://spam.example",
    });

    expect(result).toEqual({ isSubscribed: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("refuses a bad email without calling fetch", async () => {
    const fetchMock = mockFetch({ status: 201, body: {} });

    const result = await subscribeToNewsletter({
      email: "not-an-email",
      website: "",
    });

    expect(result).toEqual({ isSubscribed: false, isInvalidEmail: true });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends one request to Buttondown with the email and the visitor's IP", async () => {
    vi.stubEnv("BUTTONDOWN_API_KEY", "test-buttondown-key");
    stubRequestHeaders({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" });
    const fetchMock = mockFetch({ status: 201, body: {} });

    const result = await subscribeToNewsletter({ email: EMAIL, website: "" });

    expect(result).toEqual({ isSubscribed: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://api.buttondown.com/v1/subscribers");
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({
      Authorization: "Token test-buttondown-key",
      "Content-Type": "application/json",
      "X-API-Version": "2026-11-10",
    });
    expect(JSON.parse(init.body)).toEqual({
      email_address: EMAIL,
      ip_address: "203.0.113.7",
    });
  });

  it("reports a failure without logging when Buttondown answers with an error", async () => {
    vi.stubEnv("BUTTONDOWN_API_KEY", "test-buttondown-key");
    stubRequestHeaders();
    mockFetch({ status: 400, body: {} });
    const logSpies = ["log", "info", "warn", "error"].map((method) =>
      vi.spyOn(console, method),
    );

    const result = await subscribeToNewsletter({ email: EMAIL, website: "" });

    expect(result).toEqual({ isSubscribed: false });
    logSpies.forEach((spy) => expect(spy).not.toHaveBeenCalled());
  });

  it("reports a failure when the request itself fails", async () => {
    stubRequestHeaders();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    const result = await subscribeToNewsletter({ email: EMAIL, website: "" });

    expect(result).toEqual({ isSubscribed: false });
  });
});
