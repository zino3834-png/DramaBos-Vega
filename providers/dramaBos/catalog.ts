import { Source } from "./api";
const genres = ["romance","action","thriller","comedy","fantasy","horror","historical","modern"];
export const catalog = (["dramabox","dramabite"] as Source[]).map(source => ({title:source === "dramabox" ? "DramaBox" : "DramaBite",filter:source + "|home"}));
export const genresCatalog = (["dramabox","dramabite"] as Source[]).flatMap(source => genres.map(genre => ({title:(source === "dramabox" ? "DramaBox" : "DramaBite") + " · " + genre[0].toUpperCase() + genre.slice(1),filter:source + "|genre|" + genre})));
export const genres = genresCatalog;
