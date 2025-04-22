import { Injectable } from "@nestjs/common";
import { DataSource as DS, Repository } from "typeorm";
import { Growing } from "./entities/growing.entity";


@Injectable()
export class GrowingRepository extends Repository<Growing> {
    constructor (private dataSource: DS) {
        super(Growing, dataSource.createEntityManager());
    }
}