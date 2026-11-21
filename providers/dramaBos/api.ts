import { ProviderContext } from "../types";
export type Source = "dramabox" | "dramabite";
export const API_BASE = "https://dramabos.live";
export const encodeRef = (value:Record<string,string|number>) => encodeURIComponent(JSON.stringify(value));
export const decodeRef = <T extends Record<string,any>>(value:string):T => {
  try { return JSON.parse(decodeURIComponent(value)) as T; }
  catch { throw new Error("Invalid DramaBos reference. Reopen the title and try again."); }
};
export async function request(ctx:ProviderContext,source:Source,path:string,params:Record<string,any>={},signal?:AbortSignal):Promise<any> {
  const url = API_BASE + "/" + source + "/api/v1/" + path.replace(/^\//,"");
  const response = await ctx.axios.get(url,{params,headers:ctx.commonHeaders,signal});
  if (response.data?.status === false || response.data?.success === false) throw new Error(response.data?.message || response.data?.error || "DramaBos API request failed");
  return response.data;
}
export const asArray = (value:any):any[] => Array.isArray(value) ? value : value && typeof value === "object" ? [value] : [];
