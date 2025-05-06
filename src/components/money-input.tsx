"use client";

import type { UseFormReturn, FieldValues, Path } from "react-hook-form";
import CurrencyInput from "react-currency-input-field";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type TextInputProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
};

// Takes: A Form, the form name, a label for the form, and a placeholder value.
export function MoneyInput<T extends FieldValues>(props: TextInputProps<T>) {
  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>{props.label}</FormLabel>
            <FormControl>
              {/* 
                Formats inputs to like `$123.45`. 
                Converts values to float when returning values after change.  
              */}
              <CurrencyInput
                defaultValue={field.value}
                intlConfig={{ locale: "en-CA", currency: "CAD" }}
                prefix="$"
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50"
                decimalsLimit={2}
                onValueChange={(_, __, values) => field.onChange(values?.float)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
