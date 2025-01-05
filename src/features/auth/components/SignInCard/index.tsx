"use client";

import { z } from "zod";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DottedSeparator } from "@/components/dotter-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { SignInFormDefaultValues, SignInFormSchema } from "@/features/auth/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { useLogin } from "@/features/auth/api/use-login";
import useCallbackUrl from "@/features/auth/hooks/use-callbackUrl";
import { useRouter } from "next/navigation";

export function SignInCard() {
  const translations = useTranslations("SignInCard");
  const router = useRouter();
  const { mutate, isPending } = useLogin();
  const callbackUrl = useCallbackUrl();

  const signInForm = useForm<z.infer<typeof SignInFormSchema>>({
    defaultValues: SignInFormDefaultValues,
    resolver: zodResolver(SignInFormSchema),
  });

  const formSubmit = (values: z.infer<typeof SignInFormSchema>) => {
    mutate({
      json: values,
    }, {
      onSuccess: () => {
        if (callbackUrl) {
          router.push(callbackUrl);
        }
      }
    });
  }

  return (
    <Card className="w-full h-full md:w-[486px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">
          {translations("welcome_back")}
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...signInForm}>
          <form
            onSubmit={signInForm.handleSubmit(formSubmit)}
            className="space-y-4"
          >
            <FormField
              name={"email"}
              control={signInForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={translations("email_placeholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={"password"}
              control={signInForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      type={"password"}
                      placeholder={translations("password_placeholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isPending} size={"lg"} className="w-full">
              {translations("login")}
            </Button>
          </form>
        </Form>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex flex-col gap-y-4">
        <Button
          size={"lg"}
          className="w-full"
          variant={"secondary"}
          disabled={isPending}
        >
          <FcGoogle className="mr-2 size-5" />
          {translations("login_with_google")}
        </Button>
        <Button
          size={"lg"}
          className="w-full"
          disabled={isPending}
          variant={"secondary"}
        >
          <FaGithub className="mr-2 size-5" />
          {translations("login_with_github")}
        </Button>
      </CardContent>{" "}
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex items-center justify-center">
        <p>
          {translations("dont_have_an_account")}
          <Link
            className="text-blue-700 hover:underline"
            href={`/sign-up${
              callbackUrl
                ? `?callbackUrl=${encodeURIComponent(callbackUrl)}`
                : ""
            }`}
          >
            {translations("sign_up")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
