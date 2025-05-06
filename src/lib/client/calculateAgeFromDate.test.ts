import { test, expect, beforeAll, setSystemTime } from "bun:test";
import { calculateAgeFromDate } from "./utils";

beforeAll(() => {
  const date = new Date("2024-06-05T00:00:00.000Z");
  setSystemTime(date); // Set system time to June 5, 2024
});

test("should return age of 0 when the birthday is today", () => {
  const birthDate = new Date();
  const age = calculateAgeFromDate(birthDate);

  expect(age).toBe(0);
});

test("should return age of 24 with the birthday of January 31, 2000", () => {
  const birthDate = new Date("2000-01-31T00:00:00.000Z");
  const age = calculateAgeFromDate(birthDate);

  expect(age).toBe(24);
});

test("should return age of 24 with the birthday of May 31, 2000", () => {
  const birthDate = new Date("2000-05-31T00:00:00.000Z");
  const age = calculateAgeFromDate(birthDate);

  expect(age).toBe(24);
});

test("should return age of 25 with the birthday of November 17, 1998", () => {
  const birthDate = new Date("1998-11-17T00:00:00.000Z");
  const age = calculateAgeFromDate(birthDate);

  expect(age).toBe(25);
});

test("should throw an error when the birth year is 3 years in the future", () => {
  const today = new Date();
  const futureBirthDate = new Date(
    today.getFullYear() + 3,
    today.getMonth(),
    today.getDate()
  );

  expect(() => calculateAgeFromDate(futureBirthDate)).toThrow(
    "Age cannot be negative"
  );
});
