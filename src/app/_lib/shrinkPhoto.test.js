// Tests for scaledSize, the part of shrinkPhoto that runs outside a browser: the long side fits
// within 1600 px, the aspect ratio is kept, and a small photo is never scaled up. The canvas
// encoding itself is checked by hand in the browser.
import { describe, expect, it } from "vitest";

import { scaledSize } from "./shrinkPhoto";

describe("scaledSize", () => {
  it("fits a landscape photo's width to 1600", () => {
    expect(scaledSize(4032, 3024)).toEqual({ width: 1600, height: 1200 });
  });

  it("fits a portrait photo's height to 1600", () => {
    expect(scaledSize(3024, 4032)).toEqual({ width: 1200, height: 1600 });
  });

  it("keeps a photo whose long side is exactly 1600", () => {
    expect(scaledSize(1600, 900)).toEqual({ width: 1600, height: 900 });
  });

  it("never scales a smaller photo up", () => {
    expect(scaledSize(800, 600)).toEqual({ width: 800, height: 600 });
  });

  it("rounds to whole pixels", () => {
    expect(scaledSize(3000, 2001)).toEqual({ width: 1600, height: 1067 });
  });
});
