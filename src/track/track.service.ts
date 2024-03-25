import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackEntity } from './entity/track.entity';
import { validateUuid } from '../helpers';
import { Track } from '../types/interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TrackService {
  constructor(
    @InjectRepository(TrackEntity)
    private tracksRepository: Repository<TrackEntity>,
  ) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    try {
      return await this.tracksRepository.save(createTrackDto);
    } catch (e) {
      throw new ForbiddenException(e.detail);
    }
  }

  findAll(): Promise<Track[]> {
    return this.tracksRepository.find();
  }

  async findOne(id: string): Promise<Track> {
    validateUuid(id);

    const track = await this.tracksRepository.findOneBy({ id });

    if (!track) {
      throw new NotFoundException(`Track ${id} not found`);
    }

    return track;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    validateUuid(id);

    const track = await this.tracksRepository.findOneBy({ id });

    if (!track) {
      throw new NotFoundException(`Track ${id} not found`);
    }

    return this.tracksRepository.save({
      ...track,
      ...updateTrackDto,
    });
  }

  async remove(id: string): Promise<void> {
    validateUuid(id);

    const track = await this.tracksRepository.findOneBy({ id });

    if (!track) {
      throw new NotFoundException(`Track ${id} not found`);
    }

    await this.tracksRepository.delete(id);

    // db.favourites.tracks = db.favourites.tracks.filter((item) => item !== id);
  }
}
