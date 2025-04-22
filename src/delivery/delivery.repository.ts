import { Injectable } from "@nestjs/common";
import { DataSource as DS, Repository } from "typeorm";
import { Delivery } from "./entities/delivery.entity";

@Injectable()
export class DeliveryRepository extends Repository<Delivery> {
    constructor (private dataSource: DS) {
        super(Delivery, dataSource.createEntityManager());
    }
}