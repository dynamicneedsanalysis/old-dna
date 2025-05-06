import { test, expect } from "bun:test";
import { findSelectedBracket } from "./utils";

test("should calculate the correct bracket based on the annual income of 0 in Alberta", () => {
  const province = "AB";
  const annualIncome = 0;
  const bracket = findSelectedBracket(province, annualIncome);

  expect(bracket).toEqual({
    minIncome: 0,
    taxRate: 25.0,
    dividendEligible: 2.57,
    dividendNonEligible: 15.86,
  });
});

test("should calculate the correct bracket based on the annual income of 65000 in Alberta", () => {
  const province = "AB";
  const annualIncome = 65000;
  const bracket = findSelectedBracket(province, annualIncome);

  expect(bracket).toEqual({
    minIncome: 53359,
    taxRate: 30.5,
    dividendEligible: 10.16,
    dividendNonEligible: 22.18,
  });
});

test("should calculate the correct bracket based on the annual income of 120000 in Ontario", () => {
  const province = "ON";
  const annualIncome = 120000;
  const bracket = findSelectedBracket(province, annualIncome);

  expect(bracket).toEqual({
    minIncome: 106717,
    taxRate: 43.41,
    dividendEligible: 25.38,
    dividendNonEligible: 36.1,
  });
});

test("should calculate the correct bracket based on the annual income of 247525 in Quebec", () => {
  const province = "QC";
  const annualIncome = 247525;
  const bracket = findSelectedBracket(province, annualIncome);

  expect(bracket).toEqual({
    minIncome: 235675,
    taxRate: 53.31,
    dividendEligible: 40.11,
    dividendNonEligible: 48.7,
  });
});

test("should return 'No bracket found' based on the annual income of -250000 in British Columbia", () => {
  const province = "BC";
  const annualIncome = -250000;

  expect(() => findSelectedBracket(province, annualIncome)).toThrow(
    "No bracket found"
  );
});
