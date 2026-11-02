import { createAuthClient } from "better-auth/react";
import { jwtClient, adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [jwtClient(), adminClient()],
  baseURL: process.env.BETTER_AUTH_URL,
});
