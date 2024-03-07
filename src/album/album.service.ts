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

@Injectable()
export class AlbumService {
  private albums: Album[] = [];

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
    this.albums.push(album);

    return album;
  }

  findAll(): Album[] {
    return this.albums;
  }

  findOne(id: string): Album {
    validateUuid(id);

    const album = this.albums.find((album) => album.id === id);

    if (!album) {
      throw new NotFoundException(`Album ${id} not found`);
    }

    return album;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto): Album {
    validateUuid(id);

    const albumIndex = this.albums.findIndex((album) => album.id === id);

    if (albumIndex === -1) {
      throw new NotFoundException(`Album ${id} not found`);
    }

    this.albums[albumIndex] = {
      ...this.albums[albumIndex],
      ...updateAlbumDto,
    };

    return this.albums[albumIndex];
  }

  remove(id: string): void {
    validateUuid(id);

    const album = this.albums.find((album) => album.id === id);

    if (!album) {
      throw new NotFoundException(`Album ${id} not found`);
    }

    this.albums = this.albums.filter((track) => track.id !== id);
  }
}
