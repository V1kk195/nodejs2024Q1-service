import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './interfaces/artist.interface';
import { validateUuid } from '../helpers';
import { User } from '../user/interfaces/user.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

  create(createArtistDto: CreateArtistDto): Artist {
    if (!createArtistDto.name || createArtistDto.grammy === undefined) {
      throw new BadRequestException('Missing field name or grammy');
    }

    const artist: Artist = {
      ...createArtistDto,
      id: uuidv4(),
    };
    this.artists.push(artist);

    return artist;
  }

  findAll(): Artist[] {
    return this.artists;
  }

  findOne(id: string): Artist {
    validateUuid(id);

    const artist = this.artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new NotFoundException(`Artist ${id} not found`);
    }

    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto): Artist {
    validateUuid(id);

    const artistIndex = this.artists.findIndex((artist) => artist.id === id);

    if (artistIndex === -1) {
      throw new NotFoundException(`User ${id} not found`);
    }

    this.artists[artistIndex] = {
      ...this.artists[artistIndex],
      ...updateArtistDto,
    };

    return this.artists[artistIndex];
  }

  remove(id: string): void {
    validateUuid(id);

    const artist = this.artists.find((artist) => artist.id === id);

    if (!artist) {
      throw new NotFoundException(`User ${id} not found`);
    }

    this.artists = this.artists.filter((artist) => artist.id !== id);
  }
}
