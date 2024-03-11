import { Track } from './track/interfaces/track.interface';
import { Album } from './album/interfaces/album.interface';
import { Artist } from './artist/interfaces/artist.interface';
import { Favorites } from './favourite/interfaces/favourite.interface';

export const db: {
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
  favourites: Favorites;
} = {
  tracks: [],
  albums: [],
  artists: [],
  favourites: { albums: [], artists: [], tracks: [] },
};
