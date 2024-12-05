"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/features/auth/api/use-currentUser";
import { useLogout } from "@/features/auth/api/use-logout";
import { Button } from "@/components/ui/button";

export default function Home() {
  const router = useRouter();
  const { mutate } = useLogout()
  const { data, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!data && !isLoading) {
      router.push("/sign-in");
    }
  }, [data, isLoading]);

  return (
    <div className="">
      <Button onClick={() => mutate()}>Logout</Button>
    </div>
  );
}
