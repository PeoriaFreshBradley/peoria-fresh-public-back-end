import { Injectable } from "@nestjs/common";
import { DataSource as DS, Repository } from "typeorm";
import { Produce } from "./entities/produce.entity";


@Injectable()
export class ProduceRepository extends Repository<Produce> {
    constructor (private dataSource: DS) {
        super(Produce, dataSource.createEntityManager());
    }
}