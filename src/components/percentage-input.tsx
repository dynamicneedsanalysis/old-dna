"use client";

import type { UseFormReturn, FieldValues, Path } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type TextInputProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  placeholder: string;
};

// Takes: A Form, the form name, a label for the form, and a placeholder value.
export function PercentageInput<T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
}: TextInputProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <div className="relative">
                <div className="absolute right-0 h-full border-l px-4"></div>
                <div className="text-muted-foreground absolute top-[50%] right-3 translate-y-[-50%] text-sm">
                  %
                </div>
                <Input
                  className="pr-10"
                  placeholder={placeholder}
                  type="text"
                  {...field}
                  onChange={field.onChange}
                  value={field.value}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
