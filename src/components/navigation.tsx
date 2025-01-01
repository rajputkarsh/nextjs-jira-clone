"use client";

import { ROUTES } from "@/constants/routes"
import { usePathname } from "next/navigation";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspaceId";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";

function Navigation() {
  const translations = useTranslations("Navigation");
  const workspaceId = useWorkspaceId();
  const pathName = usePathname();
  
  return (
    <div className="flex flex-col">
      {
        ROUTES.map((item) => {
          const fullHref = `/workspaces/${workspaceId}${item.href}`

          const isActive = pathName === fullHref;
          const Icon = isActive ? item.activeIcon : item.icon;

          return (
            <Link href={item.href} key={fullHref}>
              <div className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
                isActive ? "bg-white shadow-sm hover:opacity-100 text-primary" : ""
              )}>
                <Icon className="size-5 text-neutral-500" />
                {translations(item.label)}
              </div>
            </Link>
          );
        })
      }
    </div>
  )
}

export default Navigation