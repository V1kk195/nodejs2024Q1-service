import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UpdateFavouriteDto } from './dto/update-favourite.dto';
import { FavoritesResponse } from './interfaces/favourite.interface';
import { validateUuid } from '../helpers';
import { db } from '../db';
import { AlbumEntity } from '../album/entity/album.entity';
import { ArtistEntity } from '../artist/entity/artist.entity';
import { Album, Track } from '../types/interfaces';

@Injectable()
export class FavouriteService {
  addTrack(id: string): Track {
    validateUuid(id);

    const track = db.tracks.find((item) => id === item.id);

    if (!track) {
      throw new UnprocessableEntityException(`Track ${id} not found`);
    }

    db.favourites.tracks.push(id);

    return track;
  }

  addAlbum(id: string): Album {
    validateUuid(id);

    const album = db.albums.find((item) => id === item.id);

    if (!album) {
      throw new UnprocessableEntityException(`Album ${id} not found`);
    }

    db.favourites.albums.push(id);

    return album;
  }

  addArtist(id: string): ArtistEntity {
    validateUuid(id);

    const artist = db.artists.find((item) => id === item.id);

    if (!artist) {
      throw new UnprocessableEntityException(`Artist ${id} not found`);
    }

    db.favourites.artists.push(id);

    return artist;
  }

  findAll(): FavoritesResponse {
    const services = {
      albums: db.albums,
      artists: db.artists,
      tracks: db.tracks,
    };

    return Object.entries(db.favourites).reduce((acc, [key, arr]) => {
      const items = arr.map((id) =>
        services[key].find((entry) => id === entry.id),
      );
      return {
        ...acc,
        [key]: items,
      };
    }, {} as FavoritesResponse);
  }

  findOne(id: number) {
    return `This action returns a #${id} favourite`;
  }

  update(id: number, updateFavouriteDto: UpdateFavouriteDto) {
    return `This action updates a #${id} favourite`;
  }

  removeTrack(id: string): void {
    validateUuid(id);

    const track = db.favourites.tracks.find((item) => item === id);

    if (!track) {
      throw new NotFoundException(`Track ${id} is not favourite`);
    }

    db.favourites.tracks = db.favourites.tracks.filter((item) => item !== id);
  }

  removeAlbum(id: string): void {
    validateUuid(id);

    const album = db.favourites.albums.find((item) => item === id);

    if (!album) {
      throw new NotFoundException(`Album ${id} is not favourite`);
    }

    db.favourites.albums = db.favourites.albums.filter((item) => item !== id);
  }

  removeArtist(id: string): void {
    validateUuid(id);

    const artist = db.favourites.artists.find((item) => item === id);

    if (!artist) {
      throw new NotFoundException(`Artist ${id} is not favourite`);
    }

    db.favourites.artists = db.favourites.artists.filter((item) => item !== id);
  }
}
