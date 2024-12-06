"use client";

import { Loader } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DottedSeparator } from "@/components/dotter-separator";

import { useLogout } from "../../api/use-logout";
import { useCurrentUser } from "../../api/use-currentUser";

function UserButton() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) {
    return (
      <div className="size-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-200">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const { name, email } = user;

  const avatarFallback =
    (name ? name.charAt(0).toUpperCase() : email.charAt(0).toUpperCase()) ??
    "U";

  return (
    <Avatar className="size-10 hover:opacity-75 transition border border-neutral-300">
      <AvatarFallback className="bg-neutral-200 font-medium text-neutral-500 flex items-center justify-center">
        {avatarFallback}
      </AvatarFallback>
    </Avatar>
  );
}

export default UserButton;
