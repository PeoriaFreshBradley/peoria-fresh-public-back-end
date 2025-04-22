import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { TeamModule } from 'src/team/team.module';
import { TeamUser } from './entities/teamuser.entity';
import { TeamUserController } from './teamuser.controller';
import { TeamUserService } from './teamuser.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TeamUser]),
    forwardRef(() => AuthModule),
    forwardRef(() => TeamModule),
    forwardRef(() => UserModule)
  ],
  controllers: [TeamUserController],
  providers: [TeamUserService],
  exports: [TeamUserService],
})
export class TeamUserModule {}
