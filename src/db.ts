import { Favorites } from './favourite/interfaces/favourite.interface';

import { Album, Artist, Track, User } from './types/interfaces';

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
