import { Injectable } from "@nestjs/common";
import { DataSource as DS, Repository } from "typeorm";
import { Team as TeamObj } from "src/team/entities/team.entity";


@Injectable()
export class TeamRepository extends Repository<Location> {
    constructor (private dataSource: DS) {
        super(TeamObj, dataSource.createEntityManager());
    }
}