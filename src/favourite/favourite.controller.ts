import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { UpdateFavouriteDto } from './dto/update-favourite.dto';
import { FavoritesResponse } from './interfaces/favourite.interface';
import { Album } from '../album/interfaces/album.interface';

@Controller('favs')
export class FavouriteController {
  constructor(private readonly favouriteService: FavouriteService) {}

  @Get()
  async findAll(): Promise<FavoritesResponse> {
    return this.favouriteService.findAll();
  }

  @Post('track/:id')
  create(@Param('id') id: string) {
    return this.favouriteService.addTrack(id);
  }

  @Post('album/:id')
  async createAlbum(@Param('id') id: string): Promise<Album> {
    return this.favouriteService.addAlbum(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.favouriteService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFavouriteDto: UpdateFavouriteDto,
  ) {
    return this.favouriteService.update(+id, updateFavouriteDto);
  }

  @Delete('track/:id')
  @HttpCode(204)
  async remove(@Param('id') id: string): Promise<void> {
    return this.favouriteService.removeTrack(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  async removeAlbum(@Param('id') id: string): Promise<void> {
    return this.favouriteService.removeAlbum(id);
  }
}
