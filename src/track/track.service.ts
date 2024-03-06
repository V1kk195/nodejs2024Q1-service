import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './interfaces/track.interface';
import { validateUuid } from '../helpers';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TrackService {
  private tracks: Track[] = [];

  create(createTrackDto: CreateTrackDto): Track {
    if (
      !createTrackDto.name ||
      !createTrackDto.duration ||
      createTrackDto.artistId === undefined ||
      createTrackDto.albumId === undefined
    ) {
      throw new BadRequestException('Missing fields');
    }

    const track: Track = {
      ...createTrackDto,
      id: uuidv4(),
    };
    this.tracks.push(track);

    return track;
  }

  findAll(): Track[] {
    return this.tracks;
  }

  findOne(id: string): Track {
    validateUuid(id);

    const track = this.tracks.find((track) => track.id === id);

    if (!track) {
      throw new NotFoundException(`Track ${id} not found`);
    }

    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto): Track {
    validateUuid(id);

    const trackIndex = this.tracks.findIndex((track) => track.id === id);

    if (trackIndex === -1) {
      throw new NotFoundException(`Track ${id} not found`);
    }

    this.tracks[trackIndex] = {
      ...this.tracks[trackIndex],
      ...updateTrackDto,
    };

    return this.tracks[trackIndex];
  }

  remove(id: string): void {
    validateUuid(id);

    const track = this.tracks.find((track) => track.id === id);

    if (!track) {
      throw new NotFoundException(`Track ${id} not found`);
    }

    this.tracks = this.tracks.filter((track) => track.id !== id);
  }
}
