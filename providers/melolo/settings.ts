import { ProviderContext } from "../types";
export const getSettingsSchema = async function ({ providerContext }: { providerContext: ProviderContext }) {
  return [{
    key: "apiKey",
    type: "text",
    label: "APIShort API Key",
    description: "Stored in Melolo provider settings. Do not publish this key in source code.",
    placeholder: "Paste your APIShort key",
    defaultValue: "",
  }];
};
