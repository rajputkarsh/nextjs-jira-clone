import { useSearchParams } from "next/navigation";

function useCallbackUrl() {
  const searchParams = useSearchParams();
  return searchParams.get("callbackUrl");
}

export default useCallbackUrl;
