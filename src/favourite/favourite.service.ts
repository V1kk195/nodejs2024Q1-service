import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UpdateFavouriteDto } from './dto/update-favourite.dto';
import { Favorites, FavoritesResponse } from './interfaces/favourite.interface';
import { Track } from '../track/interfaces/track.interface';
import { validateUuid } from '../helpers';
import { db } from '../db';
import { Album } from '../album/interfaces/album.interface';

@Injectable()
export class FavouriteService {
  private favourites: Favorites = { albums: [], artists: [], tracks: [] };

  addTrack(id: string): Track {
    validateUuid(id);

    const track = db.tracks.find((item) => id === item.id);

    if (!track) {
      throw new UnprocessableEntityException(`Track ${id} not found`);
    }

    this.favourites.tracks.push(id);

    return track;
  }

  addAlbum(id: string): Album {
    validateUuid(id);

    const album = db.albums.find((item) => id === item.id);

    if (!album) {
      throw new UnprocessableEntityException(`Album ${id} not found`);
    }

    this.favourites.albums.push(id);

    return album;
  }

  findAll(): FavoritesResponse {
    const services = {
      albums: db.albums,
      artists: db.artists,
      tracks: db.tracks,
    };

    return Object.entries(this.favourites).reduce((acc, [key, arr]) => {
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

    const track = this.favourites.tracks.find((item) => item === id);

    if (!track) {
      throw new NotFoundException(`Track ${id} is not favourite`);
    }

    this.favourites.tracks = this.favourites.tracks.filter(
      (item) => item !== id,
    );
  }

  removeAlbum(id: string): void {
    validateUuid(id);

    const album = this.favourites.albums.find((item) => item === id);

    if (!album) {
      throw new NotFoundException(`Album ${id} is not favourite`);
    }

    this.favourites.albums = this.favourites.albums.filter(
      (item) => item !== id,
    );
  }
}
