import { Stream, ProviderContext } from "../types";
import { decodeRef, request, Source } from "./api";
export const getStream = async function({link,signal,providerContext}:{link:string;type:string;signal?:AbortSignal;providerContext:ProviderContext;isDownload?:boolean}):Promise<Stream[]> {
  const ref=decodeRef<{source:Source;id:string;episode:number}>(link);
  if(ref.source!=="dramabox" && ref.source!=="dramabite") throw new Error("Unknown DramaBos source");
  if(!Number.isFinite(Number(ref.episode))) throw new Error("Invalid episode number");
  const response=await request(providerContext,ref.source,"play/" + encodeURIComponent(ref.id) + "/" + Number(ref.episode),{},signal);
  const streamUrl=response.streamUrl ?? response.url ?? response.data?.streamUrl;
  if(typeof streamUrl!=="string" || !/^https?:\/\//i.test(streamUrl)) throw new Error("DramaBos did not return a playable stream URL");
  const subtitles=Array.isArray(response.subtitles) ? response.subtitles.filter((item:any)=>item?.url).map((item:any)=>({title:String(item.lang ?? "Subtitle"),language:String(item.lang ?? "und"),type:"text/vtt" as const,uri:String(item.url)})) : [];
  const quality=Array.isArray(response.quality) ? response.quality[0] : response.quality;
  return [{server:"DramaBos CDN",link:streamUrl,type:streamUrl.includes(".m3u8") ? "m3u8" : "mp4",quality:quality ? String(quality).replace(/p$/i,"") : undefined,subtitles}];
};
