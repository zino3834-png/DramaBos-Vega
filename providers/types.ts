import { AxiosStatic } from "axios";
import * as cheerio from "cheerio";
export interface Post { title: string; link: string; image: string; provider?: string; tag?: string; cornerTag?: string; }
export interface Stream { server: string; link: string; type: string; quality?: string; subtitles?: {title:string;language:string;type:"text/vtt";uri:string}[]; }
export interface Info { title:string; image:string; synopsis:string; imdbId:string; type:string; linkList:{title:string;episodesLink?:string;directLinks?:{title:string;link:string;type?:"movie"|"series"}[];quality?:string}[]; tags?:string[]; rating?:string; webUrl?:string; }
export interface EpisodeLink { title:string; link:string; description?:string; image?:string; }
export interface ProviderContext { axios:AxiosStatic; commonHeaders:Record<string,string>; cheerio:typeof cheerio; openWebView:(url:string,options?:any)=>Promise<any>; kvStore:{get:<T=unknown>(key:string)=>Promise<T|undefined>;set:(key:string,value:unknown)=>Promise<void>;delete:(key:string)=>Promise<boolean>;keys:()=>Promise<string[]>;clear:()=>Promise<void>}; }
