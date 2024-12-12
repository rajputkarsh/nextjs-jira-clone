import UserButton from "@/features/auth/components/UserButton";
import { useTranslations } from "next-intl"

function Navbar() {
  const translations = useTranslations("Navbar");
  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-2xl font-semibold">
          {translations("home")}
        </h1>
        <p className="text-muted-foreground">{translations("home_desc")}</p>
      </div>
      <UserButton />
    </nav>
  );
}

export default Navbar