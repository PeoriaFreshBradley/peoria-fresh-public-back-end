import { Injectable } from "@nestjs/common";
import { DataSource as DS, Repository } from "typeorm";
import { Location } from "./entities/location.entity";

@Injectable()
export class LocationRepository extends Repository<Location> {
    constructor (private dataSource: DS) {
        super(Location, dataSource.createEntityManager());
    }
}