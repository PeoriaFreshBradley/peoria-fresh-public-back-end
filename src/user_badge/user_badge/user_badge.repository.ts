import { Injectable } from "@nestjs/common";
import { DataSource as DS, Repository } from "typeorm";
import { User_badge } from "./entities/user_badge";


@Injectable()
export class User_badgeRepository extends Repository<User_badge> {
    constructor (private dataSource: DS) {
        super(User_badge, dataSource.createEntityManager());
    }
}