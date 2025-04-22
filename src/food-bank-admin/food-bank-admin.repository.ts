import { Injectable } from "@nestjs/common";
import { DataSource as DS, Repository } from "typeorm";
import { FoodBankAdmin } from "./entities/food-bank-admin.entity";


@Injectable()
export class FoodBankAdminRepository extends Repository<FoodBankAdmin> {
    constructor (private dataSource: DS) {
        super(FoodBankAdmin, dataSource.createEntityManager());
    }
}