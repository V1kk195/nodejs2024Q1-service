import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './interfaces/artist.interface';
import { validateUuid } from '../helpers';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';

@Injectable()
export class ArtistService {
  create(createArtistDto: CreateArtistDto): Artist {
    const artist: Artist = {
      ...createArtistDto,
      id: uuidv4(),
    };
    db.artists.push(artist);

    return artist;
  }

  findAll(): Artist[] {
    return db.artists;
  }

  findOne(id: string): Artist {
    validateUuid(id);

    const artist = db.artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new NotFoundException(`Artist ${id} not found`);
    }

    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    validateUuid(id);

    const artistIndex = db.artists.findIndex((artist) => artist.id === id);

    if (artistIndex === -1) {
      throw new NotFoundException(`Artist ${id} not found`);
    }

    db.artists[artistIndex] = {
      ...db.artists[artistIndex],
      ...updateArtistDto,
    };

    return db.artists[artistIndex];
  }

  remove(id: string): void {
    validateUuid(id);

    const artist = db.artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new NotFoundException(`Artist ${id} not found`);
    }

    db.artists = db.artists.filter((artist) => artist.id !== id);
    db.favourites.artists = db.favourites.artists.filter((item) => item !== id);
    db.tracks.forEach((track) => {
      if (track.artistId === id) {
        track.artistId = null;
      }
    });
    db.albums.forEach((album) => {
      if (album.artistId === id) {
        album.artistId = null;
      }
    });
  }
}
