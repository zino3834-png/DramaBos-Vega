# DramaBos for Vega

One Vega provider with two strictly separate sources: DramaBox (dramabox) and DramaBite (dramabite). Every title and episode reference stores its source slug to prevent IDs from crossing between catalogs.

## Included
- Home and genre catalogs for both sources
- Search across both sources, retaining source identity
- Drama details and episode lists
- HLS playback when the API returns a direct HTTP(S) stream URL

Download support is intentionally omitted because the published download endpoint does not clearly define an episode-specific identifier.

## API paths used
- /{source}/api/v1/home
- /{source}/api/v1/genre
- /{source}/api/v1/search
- /{source}/api/v1/detail/{id}
- /{source}/api/v1/episodes/{id}
- /{source}/api/v1/play/{id}/{episode}

The DramaBos homepage currently states that its free tier does not require authentication. No API key is embedded in this repository.

## Status
Initial provider source only. It has not yet been built or tested in Vega. The official Vega template build infrastructure and generated dist output still need to be added before installation.
