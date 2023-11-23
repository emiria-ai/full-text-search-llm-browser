import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { crx, defineManifest } from "@crxjs/vite-plugin";

const manifest = defineManifest({
  manifest_version: 3,
  name: "Full Text Search LLM",
  version: "1.0.0",
  action: {
    default_popup: "index.html",
  },
  background: {
    service_worker: "src/background.ts",
    type: "module",
  },
  host_permissions: ["http://*/*", "https://*/*"],
  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["src/content.ts"],
    },
  ],
  permissions: ["unlimitedStorage", "storage"],
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), crx({ manifest })],
});
