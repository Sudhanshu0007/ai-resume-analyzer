import type { Config } from "@react-router/dev/config";

export default {
  // Disable SSR so Vercel can serve the static client build with SPA routing
  ssr: false,
} satisfies Config;
