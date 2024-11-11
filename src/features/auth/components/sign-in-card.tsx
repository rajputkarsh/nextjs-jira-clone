
import { DottedSeparator } from "@/components/dotter-separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";

export function SignInCard() {
  const translations = useTranslations("SignInCard");
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
        <form className="space-y-4">
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
            {translations("login")}
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
          {translations("login_with_google")}
        </Button>
        <Button
          size={"lg"}
          className="w-full"
          disabled={false}
          variant={"secondary"}
        >
          {translations("login_with_github")}
        </Button>
      </CardContent>
    </Card>
  );
}