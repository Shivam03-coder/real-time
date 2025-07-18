"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTransitionRouter } from "next-view-transitions";
import { signUpSchema, type SignUpSchemaType } from "@/schema/auth-schema";
import { useSignUpMutation } from "@/apis/auth-api";
import { useAppToasts } from "@/hooks/use-app-toast";
import { PasswordInput } from "@/components/ui/password-input";

export default function SignUpForm() {
  const [signupUser, { isLoading }] = useSignUpMutation();
  const { ErrorToast, SuccessToast } = useAppToasts();
  const router = useTransitionRouter();

  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
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

        <Button className="w-full" type="submit">
          {isLoading ? "Signing Up..." : " SIGN-UP"}
        </Button>
      </form>
    </Form>
  );
}
