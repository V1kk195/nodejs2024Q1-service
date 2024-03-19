import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from './entity/album.entity';
import { validateUuid } from '../helpers';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db';

@Injectable()
export class AlbumService {
  create(createAlbumDto: CreateAlbumDto): Album {
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

    db.albums = db.albums.filter((album) => album.id !== id);
    db.favourites.albums = db.favourites.albums.filter((item) => item !== id);
    db.tracks.forEach((track) => {
      if (track.albumId === id) {
        track.albumId = null;
      }
    });
  }
}
