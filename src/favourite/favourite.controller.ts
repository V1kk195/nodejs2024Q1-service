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

@Controller('favs')
export class FavouriteController {
  constructor(private readonly favouriteService: FavouriteService) {}

  @Post('track/:id')
  create(@Param('id') id: string) {
    return this.favouriteService.addTrack(id);
  }

  @Get()
  async findAll(): Promise<FavoritesResponse> {
    return this.favouriteService.findAll();
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
}
