import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

export const useCurrentUser = () => {
  const router = useRouter();
  const mutation = useQuery({
    queryKey: ["current"],
    queryFn: async () => {
      const response = await client.api.auth["current-user"].$get();

      if(!response.ok || response.status >= 400) {
        router.push('/sign-in')
        return null;
      }

      const { data } = await response.json();
      return data;
    },
  });

  return mutation;
};
