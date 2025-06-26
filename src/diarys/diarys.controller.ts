import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DiarysService } from './diarys.service';
import { CreateDiaryDto } from './dto/create-diary.dto';
import { UpdateDiaryDto } from './dto/update-diary.dto';

@Controller('diarys')
export class DiarysController {
  constructor(private readonly diarysService: DiarysService) {}

  @Post()
  create(@Body() createDiaryDto: CreateDiaryDto) {
    return this.diarysService.create(createDiaryDto);
  }

  @Get()
  findAll() {
    return this.diarysService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.diarysService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiaryDto: UpdateDiaryDto) {
    return this.diarysService.update(+id, updateDiaryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.diarysService.remove(+id);
  }
}
