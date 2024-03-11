import { Track } from './track/interfaces/track.interface';
import { Album } from './album/interfaces/album.interface';
import { Artist } from './artist/interfaces/artist.interface';

export const db: {
  tracks: Track[];
  albums: Album[];
  artists: Artist[];
} = {
  tracks: [],
  albums: [],
  artists: [],
};
