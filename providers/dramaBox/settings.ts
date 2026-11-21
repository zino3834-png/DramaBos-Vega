import { ProviderContext } from "../types";
export const getSettingsSchema = async function ({ providerContext }: { providerContext: ProviderContext }) {
  return [{
    key: "apiKey", type: "text", label: "APIShort API Key",
    description: "Stored in this provider's local settings. Never share it or publish it in source code.",
    placeholder: "Paste your APIShort key", defaultValue: "",
  }];
};
