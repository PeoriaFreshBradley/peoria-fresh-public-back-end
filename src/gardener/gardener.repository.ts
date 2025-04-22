import { Injectable } from "@nestjs/common";
import { DataSource as DS, Repository } from "typeorm";
import { Gardener } from "./entities/gardener.entity";


@Injectable()
export class GardenerRepository extends Repository<Gardener> {
    constructor (private dataSource: DS) {
        super(Gardener, dataSource.createEntityManager());
    }
}