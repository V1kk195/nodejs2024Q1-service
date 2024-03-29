import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './interfaces/track.interface';
import { validateUuid } from '../helpers';
import { v4 as uuidv4 } from 'uuid';
import { db } from 'src/db';

@Injectable()
export class TrackService {
  create(createTrackDto: CreateTrackDto): Track {
    const track: Track = {
      ...createTrackDto,
      id: uuidv4(),
    };
    db.tracks.push(track);

    return track;
  }

  findAll(): Track[] {
    return db.tracks;
  }

  findOne(id: string): Track {
    validateUuid(id);

    const track = db.tracks.find((track) => track.id === id);

    if (!track) {
      throw new NotFoundException(`Track ${id} not found`);
    }

    return track;
  }

  update(id: string, updateTrackDto: UpdateTrackDto): Track {
    validateUuid(id);

    const trackIndex = db.tracks.findIndex((track) => track.id === id);

    if (trackIndex === -1) {
      throw new NotFoundException(`Track ${id} not found`);
    }

    db.tracks[trackIndex] = {
      ...db.tracks[trackIndex],
      ...updateTrackDto,
    };

    return db.tracks[trackIndex];
  }

  remove(id: string): void {
    validateUuid(id);

    const track = db.tracks.find((track) => track.id === id);

    if (!track) {
      throw new NotFoundException(`Track ${id} not found`);
    }

    db.tracks = db.tracks.filter((track) => track.id !== id);
    db.favourites.tracks = db.favourites.tracks.filter((item) => item !== id);
  }
}
