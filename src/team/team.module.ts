import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Team } from './entities/team.entity';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';
import { UserModule } from 'src/user/user.module';



@Module({
  imports: [
    TypeOrmModule.forFeature([Team]),
    forwardRef(() => AuthModule),
    forwardRef(() => TeamModule),
    forwardRef(() => UserModule)
  ],
  controllers: [TeamController],
  providers: [TeamService],
  exports: [TeamService],
})
export class TeamModule {}
