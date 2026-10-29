import assert from "node:assert/strict";
import test from "node:test";

import { releaseMetadata } from "../scripts/release-metadata.mjs";

test("stable release tags publish to latest", () => {
  assert.deepEqual(releaseMetadata("v0.2.1", "0.2.1"), {
    version: "0.2.1",
    npmTag: "latest",
  });
});

test("prerelease tags publish to next", () => {
  assert.deepEqual(releaseMetadata("v0.2.0-rc.1", "0.2.0-rc.1"), {
    version: "0.2.0-rc.1",
    npmTag: "next",
  });
});

test("release tags must exactly match the package version", () => {
  assert.throws(
    () => releaseMetadata("v0.2.0", "0.2.0-rc.1"),
    /must exactly match v0\.2\.0-rc\.1/,
  );
});

