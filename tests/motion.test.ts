import test from "node:test";
import assert from "node:assert/strict";
import { clamp, smoothstep } from "../src/lib/motion.ts";

test("clamp keeps scroll and pointer values in range", () => {
  assert.equal(clamp(-100), 0);
  assert.equal(clamp(100), 1);
  assert.equal(clamp(0.5), 0.5);
  assert.equal(clamp(180, 0, 255), 180);
  assert.equal(clamp(300, 0, 255), 255);
});

test("smoothstep has stable endpoints and a symmetric midpoint", () => {
  assert.equal(smoothstep(0.1, 0.55, -1), 0);
  assert.equal(smoothstep(0.1, 0.55, 0.1), 0);
  assert.equal(smoothstep(0.1, 0.55, 0.55), 1);
  assert.equal(smoothstep(0.1, 0.55, 10), 1);
  assert.ok(Math.abs(smoothstep(0.1, 0.55, 0.325) - 0.5) < 1e-12);
});

test("the scroll story never reverses as progress increases", () => {
  let previous = 0;
  for (let i = 0; i <= 100; i++) {
    const value = smoothstep(0.1, 0.55, i / 100);
    assert.ok(value >= previous);
    assert.ok(value >= 0 && value <= 1);
    previous = value;
  }
});
