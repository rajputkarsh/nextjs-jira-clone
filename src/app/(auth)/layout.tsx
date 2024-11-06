import { ReactNode } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-3xl p-4">
        <nav className="flex justify-between items-center">
          <Image src="/logo/heera.png" width={152} height={56} alt="Logo" />
          <Button variant="secondary">Sign Up</Button>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
