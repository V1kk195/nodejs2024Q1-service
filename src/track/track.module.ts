import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { FavouriteModule } from '../favourite/favourite.module';

@Module({
  imports: [FavouriteModule],
  controllers: [TrackController],
  providers: [TrackService],
})
export class TrackModule {}
