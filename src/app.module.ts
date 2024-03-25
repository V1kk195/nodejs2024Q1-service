import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { TrackModule } from './track/track.module';
import { AlbumModule } from './album/album.module';
import { FavouriteModule } from './favourite/favourite.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    ArtistModule,
    TrackModule,
    AlbumModule,
    FavouriteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
