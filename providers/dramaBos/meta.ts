import { Info, ProviderContext } from "../types";
import { decodeRef, encodeRef, request, Source } from "./api";
export const getMeta = async function({link,providerContext}:{link:string;providerContext:ProviderContext}):Promise<Info> {
  const ref=decodeRef<{source:Source;id:string}>(link);
  if(ref.source!=="dramabox" && ref.source!=="dramabite") throw new Error("Unknown DramaBos source");
  const response=await request(providerContext,ref.source,"detail/" + encodeURIComponent(ref.id));
  const drama=response.drama ?? response.data ?? response;
  return {
    title:String(drama.title ?? "Untitled"),image:String(drama.cover ?? drama.image ?? drama.poster ?? ""),
    synopsis:String(drama.synopsis ?? drama.description ?? ""),imdbId:"",type:"series",
    tags:Array.isArray(drama.genre) ? drama.genre.map(String) : drama.genre ? [String(drama.genre)] : [],
    rating:drama.rating !== undefined ? String(drama.rating) : undefined,
    webUrl:drama.url ? String(drama.url) : undefined,
    linkList:[{title:"Episodes",episodesLink:encodeRef({source:ref.source,id:ref.id})}]
  };
};
