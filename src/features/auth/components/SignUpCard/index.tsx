import { z } from "zod";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { SignUpFormDefaultValues, SignUpFormSchema } from "./schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { DottedSeparator } from "@/components/dotter-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function SignUpCard() {
  const translations = useTranslations("SignUpCard");

  const signUpForm = useForm<z.infer<typeof SignUpFormSchema>>({
    defaultValues: SignUpFormDefaultValues,
    resolver: zodResolver(SignUpFormSchema),
  });

  const formSubmit = (values: z.infer<typeof SignUpFormSchema>) => {
    console.log(`values - `, { values });
  };

  return (
    <Card className="w-full h-full md:w-[486px] border-none shadow-none">
      <CardHeader className="flex items-center justify-center text-center p-7">
        <CardTitle className="text-2xl">{translations("sign_up")}</CardTitle>
        <CardDescription>
          {translations("form_description")}
          <Link href="/terms-conditions">
            <span className="text-blue-700 hover:underline">
              {translations("terms_of_service")}
            </span>
          </Link>
          {` & `}
          <Link href="/privacy">
            <span className="text-blue-700 hover:underline">
              {translations("privacy_policy")}
            </span>
          </Link>
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...signUpForm}>
          <form
            onSubmit={signUpForm.handleSubmit(formSubmit)}
            className="space-y-4"
          >
            <FormField
              name={"name"}
              control={signUpForm.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={translations("name_placeholder")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name={"email"}
              control={signUpForm.control}
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
              control={signUpForm.control}
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
            <Button disabled={false} size={"lg"} className="w-full">
              {translations("sign_up")}
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
          disabled={false}
          variant={"secondary"}
        >
          <FcGoogle className="mr-2 size-5" />
          {translations("signup_with_google")}
        </Button>
        <Button
          size={"lg"}
          className="w-full"
          disabled={false}
          variant={"secondary"}
        >
          <FaGithub className="mr-2 size-5" />
          {translations("signup_with_github")}
        </Button>
      </CardContent>
    </Card>
  );
}
