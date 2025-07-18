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
import { PasswordInput } from "@/components/ui/password-input";
import { type SignInSchemaType, signinSchema } from "@/schema/auth-schema";
import { useTransitionRouter } from "next-view-transitions";
import { useAppToasts } from "@/hooks/use-app-toast";
import MainLink from "@/components/global/main-link";
import Spinner from "@/components/global/spinner";
import { useSignInMutation } from "@/apis/auth-api";
import { useLocalStorage } from "usehooks-ts";

export default function SignInForm() {
  const router = useTransitionRouter();
  const { SuccessToast, ErrorToast } = useAppToasts();
  const [signinUser, { isLoading }] = useSignInMutation();
  const [_, setUserValue] = useLocalStorage<string>("user-info", "");
  const form = useForm<SignInSchemaType>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInSchemaType) {
    try {
      const { message, result } = await signinUser(values).unwrap();
      setUserValue(JSON.stringify(result));
      SuccessToast({
        title: message,
      });
      form.reset();
      router.push("/shop");

      console.log("PUSH FAILED");
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
        className="mx-auto max-w-3xl space-y-8 py-10"
      >
        <h3 className="text-primary text-center text-xl font-semibold sm:text-2xl">
          LOGIN YOUR ACCOUNT
        </h3>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="shivam850anand@gmail.com"
                  type="email"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Enter your password"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? <Spinner /> : "Submit"}
        </Button>

        <div className="text-center text-sm">
          Don't have an account?{" "}
          <MainLink
            href="/sign-up"
            className="text-primary hover:text-primary/80 font-medium underline"
            title="signup"
          />
        </div>
      </form>
    </Form>
  );
}
