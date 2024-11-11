
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from "react-icons/fa";
import { DottedSeparator } from "@/components/dotter-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import Link from 'next/link';

export function SignUpCard() {
  const translations = useTranslations("SignUpCard");
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
        <form className="space-y-4">
          <Input
            required
            type={"name"}
            value={"name"}
            onChange={() => {}}
            placeholder={translations("name_placeholder")}
            disabled={false}
          />
          <Input
            required
            type={"email"}
            value={"email"}
            onChange={() => {}}
            placeholder={translations("email_placeholder")}
            disabled={false}
          />
          <Input
            required
            type={"password"}
            value={"word"}
            onChange={() => {}}
            placeholder={translations("password_placeholder")}
            disabled={false}
            min={8}
            max={256}
          />

          <Button disabled={false} size={"lg"} className="w-full">
            {translations("sign_up")}
          </Button>
        </form>
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