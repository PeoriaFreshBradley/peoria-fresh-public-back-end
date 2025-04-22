import { Injectable } from "@nestjs/common";
import { DataSource as DS, Repository } from "typeorm";
import { Empty } from "./entities/empty";


@Injectable()
export class EmptyRepository extends Repository<Empty> {
    constructor (private dataSource: DS) {
        super(Empty, dataSource.createEntityManager());
    }
}