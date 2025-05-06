export const MAX_ASSET_TERM = 50;

export const MAX_BUSINESS_GROWTH_RATE = 12;

export const MAX_DEBT_TERM = 50;

export const MAX_INSURABLE_RATE = 12;

export const MIN_TAX_FREEZE_AT_YEAR = new Date().getFullYear();
export const MAX_TAX_FREEZE_AT_YEAR = MIN_TAX_FREEZE_AT_YEAR + 20;

export const MIN_INCOME_PERCENTAGE = 5;

export { ASSET_TYPES } from "./asset-types";

export { type BaseFormProps } from "./form";

export { HEALTH_CLASSES } from "./health-classes";

export { INSURERS } from "./insurers";

export { type LetterType } from "./letters";

export { CANADIAN_PROVINCES, type ProvinceInitials } from "./provinces";

export { SEX_OPTIONS } from "./sex";

export { SUCCESS_URL, CANCEL_URL, RETURN_URL } from "./stripe";

export { type TaxBracket, TAX_BRACKETS } from "./tax";
