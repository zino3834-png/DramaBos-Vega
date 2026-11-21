import { EpisodeLink, ProviderContext } from "../types";
import { asArray, decodeRef, encodeRef, request, Source } from "./api";
export const getEpisodes = async function({url,providerContext}:{url:string;providerContext:ProviderContext}):Promise<EpisodeLink[]> {
  const ref=decodeRef<{source:Source;id:string}>(url);
  if(ref.source!=="dramabox" && ref.source!=="dramabite") throw new Error("Unknown DramaBos source");
  const response=await request(providerContext,ref.source,"episodes/" + encodeURIComponent(ref.id),{page:1});
  const episodes=asArray(response.episodes ?? response.data);
  return episodes.filter(ep=>ep && (ep.number !== undefined || ep.id !== undefined)).map((ep,index)=>{
    const number=Number(ep.number ?? ep.episodeNumber ?? index+1);
    return {title:String(ep.title ?? "Episode " + number),link:encodeRef({source:ref.source,id:ref.id,episode:number}),description:ep.duration ? String(ep.duration) : undefined,image:ep.thumbnail ? String(ep.thumbnail) : undefined};
  });
};
