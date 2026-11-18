// @vitest-environment jsdom
// Tests the contact form end to end in a browser-like DOM: a valid message goes through the real
// sendContactMessage (with the network mocked) and the success modal appears.
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { mockFetch } from "@/test/helpers";
import ContactForm from "./ContactForm";

afterEach(cleanup);

function fillAndSend() {
  fireEvent.change(screen.getByLabelText("Full name*"), {
    target: { value: "Test Visitor" },
  });
  fireEvent.change(screen.getByLabelText("Email*"), {
    target: { value: "visitor@example.com" },
  });
  fireEvent.change(screen.getByLabelText("Your message*"), {
    target: { value: "Hello there." },
  });
  fireEvent.click(screen.getByRole("button", { name: "Send" }));
}

describe("ContactForm", () => {
  it("shows the success modal after a successful send", async () => {
    mockFetch({ body: {} });
    render(<ContactForm />);

    fillAndSend();

    expect(await screen.findByText("Message Sent!")).toBeTruthy();
  });

  it("shows the failure message when the send fails", async () => {
    mockFetch({ status: 400, body: {} });
    render(<ContactForm />);

    fillAndSend();

    expect(
      await screen.findByText("*Message failed to send. Please try again"),
    ).toBeTruthy();
    expect(screen.queryByText("Message Sent!")).toBeNull();
  });
});
