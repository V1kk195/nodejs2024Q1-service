import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { FavouriteModule } from '../favourite/favourite.module';

@Module({
  imports: [FavouriteModule],
  controllers: [AlbumController],
  providers: [AlbumService],
})
export class AlbumModule {}
