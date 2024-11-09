import { getRequestConfig } from "next-intl/server";

export const DEFAULT_LOCALE = "en";

export default getRequestConfig(async () => {

  return {
    DEFAULT_LOCALE,
    messages: (await import(`../../messages/${DEFAULT_LOCALE}.json`)).default,
  };
});
