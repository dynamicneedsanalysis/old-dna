"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useServerAction } from "zsa-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Award, Briefcase, MapPin, User, FileSearch } from "lucide-react";
import { FormSubmitButton } from "@/components/form-submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateUser } from "@/app/dashboard/settings/actions";
import {
  insertAdvisorSchema,
  type InsertAdvisor,
} from "@/app/dashboard/settings/lib/schema";
import {
  INSURERS,
  type ProvinceInitials,
  CANADIAN_PROVINCES,
} from "@/constants/index";

interface EditAdvisorProfileFormProps {
  initialValues: InsertAdvisor;
}

// Takes: Initial values for the form.
export function EditAdvisorProfileForm({
  initialValues,
}: EditAdvisorProfileFormProps) {
  const router = useRouter();

  // Define the server action for updating the User.
  const { isPending, execute } = useServerAction(updateUser);

  // Define form using insertAdvisorSchema and passed initial values.
  const form = useForm({
    resolver: zodResolver(insertAdvisorSchema),
    defaultValues: initialValues,
  });

  // On form submit, execute the updateUser action and redirect to the profile page.
  async function onSubmit(values: InsertAdvisor) {
    await execute({
      firstName: values.firstName,
      lastName: values.lastName,
      agencyName: values.agencyName,
      certifications: values.certifications,
      streetAddress: values.streetAddress,
      city: values.city,
      provinceOrState: values.provinceOrState,
      postcode: values.postcode,
      licensedProvinces: values.licensedProvinces,
      insurers: values.insurers,
    });
    router.replace("/dashboard/settings");
  }

  return (
    <Form {...form}>
      <form id="profile" onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-full overflow-hidden">
          <CardHeader className="bg-navbar p-6">
            <div className="flex items-center justify-between space-x-4 lg:space-x-0">
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white">
                  <User className="text-secondary h-12 w-12" />
                </div>
                <div>
                  <CardTitle className="flex flex-col gap-2 font-normal sm:flex-row">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="First name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input placeholder="Last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardTitle>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-2 pl-3 sm:flex-row">
                <Button
                  variant="secondary"
                  className="border-text-primary w-full border hover:bg-[#354675] lg:w-fit"
                  onClick={() => router.back()}
                  disabled={form.formState.isSubmitting}
                >
                  Cancel
                </Button>
                <FormSubmitButton
                  className="w-full lg:w-fit"
                  isPending={isPending || form.formState.isSubmitting}
                  value="Save"
                  loadingValue="Saving..."
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Certifications</h3>
                </div>
                <FormField
                  control={form.control}
                  name="certifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter certifications separated by commas"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Agency</h3>
                </div>
                <FormField
                  control={form.control}
                  name="agencyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter agency name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-2 space-y-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Address</h3>
                </div>
                <FormField
                  control={form.control}
                  name="streetAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter street address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter city" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="provinceOrState"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Enter province or state"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Enter postcode" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-2 space-y-4">
                <div className="flex items-center space-x-2">
                  <FileSearch className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Disclosure</h3>
                </div>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="licensedProvinces"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormDescription>
                            I am licensed as a life and health insurance agent
                            in:
                          </FormDescription>
                        </div>
                        <div className="flex flex-wrap gap-5">
                          {(
                            Object.keys(
                              CANADIAN_PROVINCES
                            ) as ProvinceInitials[]
                          ).map((item) => {
                            // Skip Quebec
                            if (item === "QC") return;
                            return (
                              <FormField
                                key={item}
                                control={form.control}
                                name="licensedProvinces"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={item}
                                      className="flex flex-row items-start space-y-0 space-x-2"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(item)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([
                                                  ...field.value,
                                                  item,
                                                ])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== item
                                                  )
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal">
                                        {item}
                                      </FormLabel>
                                    </FormItem>
                                  );
                                }}
                              />
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="insurers"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormDescription>
                            I represent the following insurers:
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {INSURERS.map((item) => (
                            <FormField
                              key={item.CompCode}
                              control={form.control}
                              name="insurers"
                              render={({ field }) => {
                                return (
                                  <FormItem className="flex flex-row items-start space-y-0 space-x-2">
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(
                                          item.CompCode
                                        )}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                item.CompCode,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) =>
                                                    value !== item.CompCode
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {item.Name}
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
