import { ReactNode } from "react";
import Image from "next/image";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children } : AuthLayoutProps) => {
  return (
    <div className="bg-neutral-100 min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center">
          <nav className="flex items-center gap-2">
            <Image src="/logo/heera.png" width={152} height={56} alt="Logo" />
          </nav>
        </nav>
        {children}
      </div>
    </div>
  );
}

export default AuthLayout;
