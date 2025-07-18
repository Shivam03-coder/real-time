"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import LocationSelector from "@/components/ui/location-input";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneInput } from "@/components/ui/phone-input";
import { PasswordInput } from "@/components/ui/password-input";
import { useTransitionRouter } from "next-view-transitions";
import Spinner from "@/components/global/spinner";
import { useAppToasts } from "@/hooks/use-app-toast";
import { signUpSchema, type SignUpSchemaType } from "@/schema/auth-schema";
import { useSignUpMutation } from "@/apis/auth-api";

export default function SignUpForm() {
  const [_, setCountryName] = useState<string>("");
  const [stateName, setStateName] = useState<string>("");
  const [signupUser, { isLoading }] = useSignUpMutation();
  const { ErrorToast, SuccessToast } = useAppToasts();
  const router = useTransitionRouter();

  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      phoneNumber: "",
      email: "",
      password: "",
      address: "",
      city: "",
      pincode: "",
      countryandstate: ["", ""],
      isAccepted: false,
    },
  });

  async function onSubmit(values: SignUpSchemaType) {
    try {
      const { status, message } = await signupUser(values).unwrap();
      if (status === "success") {
        SuccessToast({
          title: message,
        });
        router.push("/sign-in");
        form.reset();
      } else if (status === "failed") {
        ErrorToast({
          title: message,
        });
      }
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || err?.message || "An unexpected error occurred";
      ErrorToast({ title: errorMessage });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6 sm:space-y-8 sm:px-6"
      >
        <h3 className="text-primary text-center text-xl font-semibold sm:text-2xl">
          CREATE YOUR ACCOUNT
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* First Name */}
          <FormField
            disabled={isLoading}
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Shivam Anand" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            disabled={isLoading}
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Email */}
          <FormField
            disabled={isLoading}
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="shivam850anand@gmail.com"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormField
            disabled={isLoading}
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel>Phone number</FormLabel>
                <FormControl className="w-full">
                  <PhoneInput
                    placeholder="Enter phone number"
                    {...field}
                    defaultCountry="TR"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Address */}
        <FormField
          disabled={isLoading}
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter your full address, including street, city, and zip code"
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* City */}
          <FormField
            disabled={isLoading}
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Pincode */}
          <FormField
            control={form.control}
            name="pincode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pincode</FormLabel>
                <FormControl>
                  <Input placeholder="847239" type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Country */}
        <FormField
          disabled={isLoading}
          control={form.control}
          name="countryandstate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Country</FormLabel>
              <FormControl>
                <div className="flex flex-col">
                  <LocationSelector
                    onCountryChange={(country) => {
                      setCountryName(country?.name || "");
                      form.setValue(field.name, [
                        country?.name || "",
                        stateName || "",
                      ]);
                    }}
                    onStateChange={(state) => {
                      setStateName(state?.name || "");
                      form.setValue(field.name, [
                        form.getValues(field.name)[0] || "",
                        state?.name || "",
                      ]);
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Terms and Conditions */}
        <FormField
          control={form.control}
          disabled={isLoading}
          name="isAccepted"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md p-2 sm:p-4">
              <FormControl>
                <Checkbox
                  // @ts-ignore
                  checked={field.value!}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Accept Terms and Conditions</FormLabel>
                <FormDescription className="text-xs sm:text-sm">
                  You must agree to our terms and conditions before proceeding.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button className="w-full" type="submit">
          {isLoading ? <Spinner /> : " SIGN-UP"}
        </Button>
      </form>
    </Form>
  );
}
