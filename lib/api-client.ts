import { api } from "@/lib/api";
import type { CreateClientConfig } from "@/src/api/generated/client.gen";

/**
 * Runtime config for the generated hey-api client.
 *
 * Reuses the shared axios instance so its auth, CSRF, refresh, and error
 * interceptors apply to generated calls. The generated client builds the full
 * URL itself and passes `baseURL: ''` to axios, so the API origin has to be
 * supplied here.
 *
 * Contract paths include the API mount (`/api/...`), while the app's axios
 * instance points at the mount (`/api` or `/api/v1`) for the handwritten
 * services. Strip that suffix so the generated URL is not double-prefixed.
 */
const apiOrigin = (api.defaults.baseURL ?? "").replace(
  /\/api(?:\/v1)?\/?$/,
  "",
);

export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  axios: api,
  baseURL: apiOrigin,
});
