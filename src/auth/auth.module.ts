import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BcryptWorkerService } from 'src/workers/bcrypt.service';

@Module({
  providers: [AuthService, BcryptWorkerService],
  exports: [AuthService],
})
export class AuthModule {}
