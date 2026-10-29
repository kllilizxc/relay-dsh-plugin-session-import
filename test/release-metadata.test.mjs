import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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

test("release workflow uses guarded tokenless npm publishing", async () => {
  const workflow = await readFile(new URL("../.github/workflows/release.yml", import.meta.url), "utf8");
  assert.match(workflow, /id-token: write/);
  assert.match(workflow, /node scripts\/release-metadata\.mjs/);
  assert.match(workflow, /git merge-base --is-ancestor/);
  assert.match(workflow, /0a15e36e7f82b6ed45af6fa9759f29b40dcd965d/);
  assert.match(workflow, /npm publish --provenance --access public --tag/);
  assert.match(workflow, /Verify the published dist-tag/);
  assert.match(workflow, /npm view "\$\{package_name\}@\$\{npm_tag\}" version/);
  assert.ok(
    workflow.indexOf("npm install --global") > workflow.indexOf("Check whether this version already exists"),
    "the OIDC npm upgrade must not affect DSH build or verification",
  );
  assert.doesNotMatch(workflow, /NODE_AUTH_TOKEN|NPM_TOKEN/);
});
