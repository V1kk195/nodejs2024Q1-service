import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumEntity } from './entity/album.entity';
import { validateUuid } from '../helpers';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from '../types/interfaces';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(AlbumEntity)
    private albumRepository: Repository<AlbumEntity>,
  ) {}

  create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const album = new AlbumEntity();
    album.name = createAlbumDto.name;
    album.year = createAlbumDto.year;
    album.artistId = createAlbumDto.artistId;

    return this.albumRepository.save(album);
  }

  findAll(): Promise<Album[]> {
    return this.albumRepository.find();
  }

  async findOne(id: string): Promise<Album> {
    validateUuid(id);

    const album = await this.albumRepository.findOneBy({ id });

    if (!album) {
      throw new NotFoundException(`Album ${id} not found`);
    }

    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    validateUuid(id);

    const album = await this.albumRepository.findOneBy({ id });

    if (!album) {
      throw new NotFoundException(`Album ${id} not found`);
    }

    return await this.albumRepository.save({
      ...album,
      ...updateAlbumDto,
    });
  }

  async remove(id: string): Promise<void> {
    validateUuid(id);

    const album = await this.albumRepository.findOneBy({ id });

    if (!album) {
      throw new NotFoundException(`Album ${id} not found`);
    }

    await this.albumRepository.delete(id);

    // db.albums = db.albums.filter((album) => album.id !== id);
    // db.favourites.albums = db.favourites.albums.filter((item) => item !== id);
    // db.tracks.forEach((track) => {
    //   if (track.albumId === id) {
    //     track.albumId = null;
    //   }
    // });
  }
}
