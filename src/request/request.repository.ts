import { Injectable } from "@nestjs/common";
import { DataSource as DS, Repository } from "typeorm";
import { Request as RequestObj } from "src/request/entities/request.entity";

@Injectable()
export class RequestRepository extends Repository<RequestObj> {
    constructor (private dataSource: DS) {
        super(RequestObj, dataSource.createEntityManager());
    }
}