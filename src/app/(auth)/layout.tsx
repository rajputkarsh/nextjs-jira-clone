'use client';

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {

  const translations = useTranslations("auth");
  const pathname = usePathname();

  const isSignIn = pathname === "/sign-in";

  return (
    <div className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-3xl p-4">
        <nav className="flex justify-between items-center">
          <Image src="/logo/heera.png" width={152} height={56} alt="Logo" />
          <Button asChild variant="secondary">
            <Link href={ isSignIn ? "sign-up" : "sign-in"}>
              { isSignIn
                ? translations("sign_up")
                : translations("login")}
            </Link>
          </Button>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
