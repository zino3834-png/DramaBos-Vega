import { Post, ProviderContext } from "../types";
import { asArray, encodeRef, request, Source } from "./api";
const toPosts = (items:any[],source:Source):Post[] => items.filter(item => item && (item.id ?? item.dramaId) && item.title).map(item => ({
  title:String(item.title),link:encodeRef({source,id:String(item.id ?? item.dramaId)}),image:String(item.cover ?? item.image ?? item.poster ?? ""),provider:"dramaBos",
  tag:item.status ? String(item.status) : undefined,cornerTag:item.episodes ? String(item.episodes) + " EP" : undefined
}));
export const getPosts = async function({filter,page,signal,providerContext}:{filter:string;page:number;providerValue:string;signal:AbortSignal;providerContext:ProviderContext}):Promise<Post[]> {
  const parts=filter.split("|"); const sourceRaw=parts[0]; const mode=parts[1]; const genre=parts[2];
  if(sourceRaw!=="dramabox" && sourceRaw!=="dramabite") return [];
  const source=sourceRaw as Source;
  const response=mode==="genre" ? await request(providerContext,source,"genre",{type:genre,page},signal) : await request(providerContext,source,"home",{page},signal);
  return toPosts(asArray(response.results ?? response.data),source);
};
export const getSearchPosts = async function({searchQuery,page,signal,providerContext}:{searchQuery:string;page:number;providerValue:string;signal:AbortSignal;providerContext:ProviderContext}):Promise<Post[]> {
  const sources:Source[]=["dramabox","dramabite"];
  const results=await Promise.all(sources.map(async source=>{
    const response=await request(providerContext,source,"search",{keyword:searchQuery,page},signal);
    return toPosts(asArray(response.results ?? response.data),source);
  }));
  return results.flat();
};
