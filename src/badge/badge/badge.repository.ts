import { Injectable } from "@nestjs/common";
import { DataSource as DS, Repository } from "typeorm";
import { Badge } from "./entities/badge";


@Injectable()
export class BadgeRepository extends Repository<Badge> {
    constructor (private dataSource: DS) {
        super(Badge, dataSource.createEntityManager());
    }
}