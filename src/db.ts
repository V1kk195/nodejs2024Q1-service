import { Track } from './track/interfaces/track.interface';
import { Album } from './album/entity/album.entity';
import { Artist } from './artist/interfaces/artist.interface';
import { Favorites } from './favourite/interfaces/favourite.interface';
import { User } from './user/entity/user.entity';

export const db: {
  users: User[];
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
  favourites: Favorites;
} = {
  users: [],
  tracks: [],
  albums: [],
  artists: [],
  favourites: { albums: [], artists: [], tracks: [] },
};
