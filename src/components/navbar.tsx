"use client";

import UserButton from "@/features/auth/components/UserButton";
import { useTranslations } from "next-intl"
import MobileSidebar from "@/components/mobile-sidebar";
import { usePathname } from "next/navigation";

const PATHNAME_MAP = {
  home: {
    title: "home",
    description: "home_desc",
  },
  tasks: {
    title: "tasks",
    description: "tasks_desc",
  },
  projects: {
    title: "projects",
    description: "projects_desc",
  },
} as { [key: string]: { title: string, description: string } };

const getTitleAndDescription = (key: string) => {
  if (Object.keys(PATHNAME_MAP).includes(key)) return PATHNAME_MAP[key];
  return PATHNAME_MAP["home"];
}; 

function Navbar() {
  const translate = useTranslations("Navbar");
  const pathname = usePathname();

  const pathnameParts = pathname.split("/");

  const { title, description } = getTitleAndDescription(pathnameParts["3"]);

  return (
    <nav className="pt-4 px-6 flex items-center justify-between">
      <div className="flex-col hidden lg:flex">
        <h1 className="text-2xl font-semibold">{translate(title)}</h1>
        <p className="text-muted-foreground">{translate(description)}</p>
      </div>
      <MobileSidebar />
      <UserButton />
    </nav>
  );
}

export default Navbar