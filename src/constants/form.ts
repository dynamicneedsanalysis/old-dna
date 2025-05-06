import type { TAnyZodSafeFunctionHandler } from "zsa";

// Base props for all forms.
export interface BaseFormProps {
  onCloseDialog: () => void;
  serverAction: TAnyZodSafeFunctionHandler;
  submitButtonText: string;
  submitLoadingText: string;
  successMessage: string;
}
