import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './interfaces/album.interface';
import { validateUuid } from '../helpers';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';
import { FavouriteService } from '../favourite/favourite.service';

@Injectable()
export class AlbumService {
  constructor(private readonly favouriteService: FavouriteService) {}

  create(createAlbumDto: CreateAlbumDto): Album {
    if (
      !createAlbumDto.name ||
      !createAlbumDto.year ||
      createAlbumDto.artistId === undefined
    ) {
      throw new BadRequestException('Missing fields');
    }

    const album: Album = {
      ...createAlbumDto,
      id: uuidv4(),
    };
    db.albums.push(album);

    return album;
  }

  findAll(): Album[] {
    return db.albums;
  }

  findOne(id: string): Album {
    validateUuid(id);

    const album = db.albums.find((album) => album.id === id);

    if (!album) {
      throw new NotFoundException(`Album ${id} not found`);
    }

    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    validateUuid(id);

    const albumIndex = db.albums.findIndex((album) => album.id === id);

    if (albumIndex === -1) {
      throw new NotFoundException(`Album ${id} not found`);
    }

    db.albums[albumIndex] = {
      ...db.albums[albumIndex],
      ...updateAlbumDto,
    };

    return db.albums[albumIndex];
  }

  remove(id: string): void {
    validateUuid(id);

    const album = db.albums.find((album) => album.id === id);

    if (!album) {
      throw new NotFoundException(`Album ${id} not found`);
    }

    db.albums = db.albums.filter((track) => track.id !== id);
    this.favouriteService.removeTrack(id);
  }
}
