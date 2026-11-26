// @vitest-environment jsdom
// Tests the contact form end to end in a browser-like DOM: a valid message goes through the real
// sendContactMessage (with the network mocked) and the success modal, a CMS field message or the
// general failure message appears; the photo picker takes at most 3 photos and they are sent.
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { mockFetch } from "@/test/helpers";
import ContactForm from "./ContactForm";

afterEach(cleanup);

beforeEach(() => {
  vi.stubEnv("HEADLESS_CMS_API_URL", "https://cms.test");
  vi.stubEnv("HEADLESS_CMS_API_KEY", "test-api-key");
});

// jsdom can't decode images or draw on a canvas, so the browser's image APIs that shrinkPhoto
// uses are stubbed: every photo decodes as 4000 × 3000 and encodes as a small jpg.
function stubImageApis() {
  vi.stubGlobal(
    "createImageBitmap",
    vi.fn().mockResolvedValue({ width: 4000, height: 3000, close() {} }),
  );
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    drawImage() {},
  });
  vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(
    (callback) => callback(new Blob(["shrunk"], { type: "image/jpeg" })),
  );
}

// Picks one photo and waits until the picker lists it.
async function addPhoto(name) {
  fireEvent.change(screen.getByLabelText("Photos (optional, up to 3)"), {
    target: { files: [new File(["photo"], name, { type: "image/jpeg" })] },
  });
  await screen.findByText(name);
}

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
    mockFetch({ status: 201, body: { data: { received: true } } });
    render(<ContactForm />);

    fillAndSend();

    expect(await screen.findByText("Message Sent!")).toBeTruthy();
  });

  it("shows the CMS's field message when it refuses a field", async () => {
    mockFetch({
      status: 400,
      body: {
        error: {
          message: "Please fix the highlighted fields.",
          fields: { email: "Please enter a valid email." },
        },
      },
    });
    render(<ContactForm />);

    fillAndSend();

    expect(
      await screen.findByText("*Please enter a valid email."),
    ).toBeTruthy();
    expect(screen.queryByText("Message Sent!")).toBeNull();
  });

  it("shows the failure message when the send fails", async () => {
    mockFetch({
      status: 500,
      body: { error: { message: "Something went wrong, please try again." } },
    });
    render(<ContactForm />);

    fillAndSend();

    expect(
      await screen.findByText("*Message failed to send. Please try again"),
    ).toBeTruthy();
    expect(screen.queryByText("Message Sent!")).toBeNull();
  });

  it("turns the photo picker off once 3 photos are added", async () => {
    stubImageApis();
    render(<ContactForm />);

    for (const n of [1, 2, 3]) await addPhoto(`photo-${n}.jpg`);

    expect(screen.getByLabelText("Photos (optional, up to 3)").disabled).toBe(
      true,
    );
  });

  it("sends the added photos with the message", async () => {
    stubImageApis();
    const fetchMock = mockFetch({
      status: 201,
      body: { data: { received: true } },
    });
    render(<ContactForm />);

    await addPhoto("photo-1.jpg");
    await addPhoto("photo-2.jpg");
    fillAndSend();
    await screen.findByText("Message Sent!");

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.images).toHaveLength(2);
  });
});
