import { Injectable } from "@nestjs/common";
import { DataSource as DS, Repository } from "typeorm";
import { FoodBank } from "./entities/food-bank.entity";


@Injectable()
export class FoodBankRepository extends Repository<FoodBank> {
    constructor (private dataSource: DS) {
        super(FoodBank, dataSource.createEntityManager());
    }
}