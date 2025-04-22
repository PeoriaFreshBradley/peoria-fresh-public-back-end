import { Injectable } from "@nestjs/common";
import { DataSource as DS, Repository } from "typeorm";
import { TeamUser as TeamUserObj } from "src/teamuser/entities/teamuser.entity";

@Injectable()
export class TeamUserRepository extends Repository<TeamUserObj> {
    constructor (private dataSource: DS) {
        super(TeamUserObj, dataSource.createEntityManager());
    }
}