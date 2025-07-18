import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(RolesGuard) //RolesGuard 전체 적용
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  // 전체 유저 조회
  @Get('users')
  @Roles('ADMIN')
  getAllUsers() {
    return;
  }
  //
  @Patch()
  @Roles('ADMIN')
  patchUsers() {
    return;
  }

  // 단일 유저 삭제
  @Delete()
  @Roles('ADMIN')
  deleteUsers() {
    return;
  }

  // 신고 누적 유저 밴?
  @Post()
  @Roles('ADMIN')
  banUsers() {
    return;
  }
}
