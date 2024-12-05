import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

export const useCurrentUser = () => {
  const mutation = useQuery({
    queryKey: ["current"],
    queryFn: async () => {
      const response = await client.api.auth["current-user"].$get();

      if(!response.ok) {
        return null;
      }

      const { data } = await response.json();
      return data;
    },
  });

  return mutation;
};
