import { test, expect } from "bun:test";
import { calculateWant } from "./utils";

test("Calculates want with 50% priority", () => {
  const want = calculateWant(2468101214, 50);

  expect(want).toBe(1234050607);
});

test("Calculates want with 90% priority", () => {
  const want = calculateWant(369121519, 90);

  expect(want).toBe(332209367.1);
});

test("Calculates want with 0% priority", () => {
  const want = calculateWant(369121519, 0);

  expect(want).toBe(0.0);
});

test("Calculates want with 100% priority", () => {
  const want = calculateWant(369121519, 100);

  expect(want).toBe(369121519);
});

test("Calculates want with 60% priority and no need", () => {
  const want = calculateWant(0, 60);

  expect(want).toBe(0.0);
});

test("Calculates want with 30% priority and negative need", () => {
  expect(() => calculateWant(-369121519, 30)).toThrow(
    "Need and priority must be positive, and priority must be less than or equal to 100"
  );
});

test("Calculates want with negative priority", () => {
  expect(() => calculateWant(369121519, -30)).toThrow(
    "Need and priority must be positive, and priority must be less than or equal to 100"
  );
});

test("Calculates want with priority greater than 100", () => {
  expect(() => calculateWant(369121519, 160)).toThrow(
    "Need and priority must be positive, and priority must be less than or equal to 100"
  );
});
