import { Injectable } from "@nestjs/common";
import { DataSource as DS, Repository } from "typeorm";
import { ProduceName } from "./entities/produce-name.entity";


@Injectable()
export class ProduceNameRepository extends Repository<ProduceName> {
    constructor (private dataSource: DS) {
        super(ProduceName, dataSource.createEntityManager());
    }
}