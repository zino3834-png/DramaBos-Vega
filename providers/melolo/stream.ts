import { ProviderContext, Stream } from "../types";
import { decodeRef, request } from "./api";

function collectStreams(value: any, output: Array<{ url: string; quality?: string }> = [], depth = 0): Array<{ url: string; quality?: string }> {
  if (!value || depth > 6) return output;
  if (Array.isArray(value)) {
    for (const item of value) collectStreams(item, output, depth + 1);
    return output;
  }
  if (typeof value !== "object") return output;
  for (const [key, raw] of Object.entries(value)) {
    if (typeof raw === "string" && /^(https?:\/\/)/i.test(raw) && /video|play|stream|source|url/i.test(key) && !/\.(jpg|jpeg|png|webp)(\?|$)/i.test(raw)) {
      output.push({ url: raw, quality: /1080|720|540|360/.exec(key)?.[0] });
    } else if (raw && typeof raw === "object") collectStreams(raw, output, depth + 1);
  }
  return output;
}
export const getStream = async function ({ link, providerContext, signal }: {
  link: string; type: string; signal?: AbortSignal; providerContext: ProviderContext; isDownload?: boolean;
}): Promise<Stream[]> {
  const ref = decodeRef<{ id: string; ep: number }>(link);
  if (!ref.id || !Number.isFinite(ref.ep) || ref.ep < 1) throw new Error("Invalid Melolo episode reference.");
  const payload = await request(providerContext, "video", { id: ref.id, ep: ref.ep }, signal);
  if (payload?.isLocked === true || payload?.is_locked === true || payload?.locked === true || payload?.isCharge === 1)
    return [];
  const found = collectStreams(payload);
  const seen = new Set<string>();
  return found.filter(item => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  }).map(item => ({
    server: item.quality ? "Melolo " + item.quality + "p" : "Melolo",
    link: item.url,
    type: /\.m3u8(?:$|\?)/i.test(item.url) ? "m3u8" : "mp4",
    quality: item.quality,
  }));
};
