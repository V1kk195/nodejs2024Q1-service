import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { ArtistEntity } from './entity/artist.entity';
import { validateUuid } from '../helpers';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Artist } from '../types/interfaces';

@Injectable()
export class ArtistService {
  constructor(
    @InjectRepository(ArtistEntity)
    private artistRepository: Repository<ArtistEntity>,
  ) {}

  create(createArtistDto: CreateArtistDto): Promise<Artist> {
    return this.artistRepository.save(createArtistDto);
  }

  findAll(): Promise<Artist[]> {
    return this.artistRepository.find();
  }

  async findOne(id: string): Promise<Artist> {
    validateUuid(id);

    const artist = await this.artistRepository.findOneBy({ id });

    if (!artist) {
      throw new NotFoundException(`Artist ${id} not found`);
    }

    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    validateUuid(id);

    const artist = await this.artistRepository.findOneBy({ id });

    if (!artist) {
      throw new NotFoundException(`Artist ${id} not found`);
    }

    return this.artistRepository.save({
      ...artist,
      ...updateArtistDto,
    });
  }

  async remove(id: string): Promise<void> {
    validateUuid(id);

    const artist = await this.artistRepository.findOneBy({ id });

    if (!artist) {
      throw new NotFoundException(`Artist ${id} not found`);
    }

    await this.artistRepository.delete(id);

    // db.favourites.artists = db.favourites.artists.filter((item) => item !== id);
    // db.tracks.forEach((track) => {
    //   if (track.artistId === id) {
    //     track.artistId = null;
    //   }
    // });
    // db.albums.forEach((album) => {
    //   if (album.artistId === id) {
    //     album.artistId = null;
    //   }
    // });
  }
}
