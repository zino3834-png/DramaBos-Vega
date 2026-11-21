import { Source } from "./api";

const genreList = ["romance", "action", "thriller", "comedy", "fantasy", "horror", "historical", "modern"];

export const catalog = (["dramabox", "dramabite"] as Source[]).map((source) => ({
  title: source === "dramabox" ? "DramaBox" : "DramaBite",
  filter: source + "|home",
}));

export const genres = (["dramabox", "dramabite"] as Source[]).flatMap((source) =>
  genreList.map((genre) => ({
    title: (source === "dramabox" ? "DramaBox" : "DramaBite") + " · " + genre[0].toUpperCase() + genre.slice(1),
    filter: source + "|genre|" + genre,
  })),
);
