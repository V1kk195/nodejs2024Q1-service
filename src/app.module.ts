import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ArtistModule } from './artist/artist.module';
import { TrackModule } from './track/track.module';
import { AlbumModule } from './album/album.module';
import { FavouriteModule } from './favourite/favourite.module';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { HttpLoggerMiddleware } from './logger/httpLogger.middleware';

const dataSourceOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'db',
  port: +process.env.POSTGRES_PORT || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  synchronize: true,
  logging: true,
  autoLoadEntities: true,
};

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
