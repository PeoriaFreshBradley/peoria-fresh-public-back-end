import { Injectable } from "@nestjs/common";
import { GrowingRepository } from "src/growing/growing.repository";
import { RequestRepository } from "src/request/request.repository";
import { Location } from "src/location/entities/location.entity";
import { DeliveryRepository } from "src/delivery/delivery.repository";

export const toMySQLDate = (d: Date) => {
    let date = d.getUTCFullYear() + '-' +
        ('00' + (d.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + d.getUTCDate()).slice(-2) + ' ' + 
        ('00' + d.getUTCHours()).slice(-2) + ':' + 
        ('00' + d.getUTCMinutes()).slice(-2) + ':' + 
        ('00' + d.getUTCSeconds()).slice(-2);
    return date;
}

/**
 * Because JS/TS Sets compare by reference, not value.
 * This class aims to actually compare by value.
 */
export class SetByValue<T> {
    #obj = {} as any;

    constructor(inSet: Set<T> | undefined = undefined) {
        let set = new Set<string>();
        if (inSet) {
            for (let i of inSet) {
                let json = JSON.stringify(i);
                this.#obj[json] = 1;
            }
        }
    }

    has(lookup:T) {
        let json = JSON.stringify(lookup);
        return (1 && this.#obj[json]);
    }

    add(insert:T) {
        let json = JSON.stringify(insert);
        this.#obj[json] = 1;
    }

    delete(del:T) {
        let json = JSON.stringify(del);
        delete this.#obj[json];
    }

    *[Symbol.iterator]() {
        let keys = Object.keys(this.#obj);
        for (let i of keys) {
            yield JSON.parse(i) as T;
        }
    }

}

@Injectable()
/**
 * This class is for aggregating data for use in the Community Request logic.
 * It ensures that the shown amount of requested produce shown to Gardeners accounts for the amount of produce being grown currently.
 */
export class ExtraProduceQueryAction {
    constructor (
        private requestRepo: RequestRepository,
        private growingRepo: GrowingRepository,
        private deliveryRepo: DeliveryRepository
    ) {}

    async aggregateLocations(): Promise<Map<number, SetByValue<Location>>> {
        let allLocations = new Map<number, SetByValue<Location>>();
        const requestInfo = await this.requestRepo
            .createQueryBuilder("request")
            .innerJoinAndSelect("request.produce", "reqProduce")
            .innerJoinAndSelect('request.location', "reqLoc")
            .where("request.location IS NOT NULL")
            .getMany();
        for (let i of requestInfo) {
            if (allLocations.get(i.produce.id) === undefined) allLocations.set(i.produce.id, new SetByValue<Location>());
            let loc = i.location;
            if (loc !== undefined)
                delete loc.id;
                delete loc.updatedAt;
                delete loc.createdAt;
                
                let tmp = allLocations.get(i.produce.id);
                tmp.add(loc);
                allLocations.set(i.produce.id,
                    tmp
                );
        }
        return allLocations;
    }

    async aggregateGrowing(): Promise<Map<number, number>> {
        let totals = new Map<number, number>();
        const growingInfo = await this.growingRepo
            .createQueryBuilder("growing")
            .innerJoin('growing.produce', 'growProduce')
            .select("growProduce.id, SUM(growing.amount) AS sum")
            .where("growing.createdAt > :yearAgoToday", {yearAgoToday : new Date(new Date().getTime() - new Date(1000 * 24 * 3600 * 365).getTime()) })
            .groupBy("growProduce.id")
            .getRawMany();
        for (let i of growingInfo) {
            if (totals.get(i.id) === undefined) totals.set(i.id, 0);
            totals.set(i.id,parseInt(i.sum));
        }
        return totals;
    }

    async aggregateRequestAmount(): Promise<Map<number, number>> {
        let totals = new Map<number, number>();
        const requestInfo = await this.requestRepo
            .createQueryBuilder("request")
            .innerJoin("request.produce", "reqProduce")
            .select("request.produce.id, SUM(request.amount) AS sum")
            .groupBy("request.produce.id")
            .where("request.createdAt > :yearAgoToday", {yearAgoToday : new Date(new Date().getTime() - new Date(1000 * 24 * 3600 * 365).getTime()) })
            .getRawMany();
        for (let i of requestInfo) {
            if (totals.get(i.produceId) === undefined) totals.set(i.produceId, 0);
            totals.set(i.produceId,parseInt(i.sum));
        }
        return totals;
    }

    async aggregateDeliveryAmount(): Promise<Map<number, number>> {
        let totals = new Map<number, number>();
        const deliveryInfo = await this.deliveryRepo.query(`SELECT t0.produceId, SUM(IF(t0.verifiedAmount > 0 AND t0.verifiedAmount IS NOT NULL, t0.verifiedAmount, t0.amount)) as sum FROM \`delivery\` t0 WHERE t0.createdAt > '${toMySQLDate(new Date(new Date().getTime() - new Date(1000 * 24 * 3600 * 365).getTime()))}' GROUP BY t0.produceId`)
        for (let i of deliveryInfo) {
            if (totals.get(i.produceId) === undefined) totals.set(i.produceId, 0);
            totals.set(i.produceId,parseInt(i.sum));
        }
        return totals;
    }

    async produceTotalsByUser(gardenerId: number): Promise<Map<string, number>> {
        let totals = new Map<string, number>();
        const deliveryInfo = await this.deliveryRepo.query(`SELECT LOWER(t1.name) as produceName, SUM(IF(t0.verifiedAmount > 0 AND t0.verifiedAmount IS NOT NULL, t0.verifiedAmount, t0.amount)) as sum FROM \`delivery\` t0 INNER JOIN \`produce\` t1 ON t0.produceId = t1.id WHERE t0.providerId = ${gardenerId} AND t0.isVerified = 1 GROUP BY t0.produceId`)
        for (let i of deliveryInfo) {
            if (totals.get(i.produceName) === undefined) totals.set(i.produceName, 0);
            totals.set(i.produceName,parseInt(i.sum));
        }
        return totals;
    }

    async getLeaderboard(): Promise<any> {
        let totals = {} as any;
        const now = new Date();
        const currentYear = now.getFullYear();
    
        // Calculate day of year (0-365)
        const startOfYear = new Date(currentYear, 0, 0);
        const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / 86400000);
    
        // Define season start dates (using 0-based month index)
        const springStart = new Date(currentYear, 2, 20);  // March 20
        const summerStart = new Date(currentYear, 5, 20);  // June 20
        const fallStart = new Date(currentYear, 8, 22);    // September 22
        const winterStart = new Date(currentYear, 11, 21); // December 21
    
        // Calculate day of year for each season start
        const springStartDay = Math.floor((springStart.getTime() - startOfYear.getTime()) / 86400000);
        const summerStartDay = Math.floor((summerStart.getTime() - startOfYear.getTime()) / 86400000);
        const fallStartDay = Math.floor((fallStart.getTime() - startOfYear.getTime()) / 86400000);
        const winterStartDay = Math.floor((winterStart.getTime() - startOfYear.getTime()) / 86400000);
    
        // Determine which season we're in and set the appropriate start date
        let seasonStartDate;
        if (dayOfYear < springStartDay) {
            // Winter (from previous year's winter start)
            seasonStartDate = new Date(currentYear - 1, 11, 21);
        } else if (dayOfYear < summerStartDay) {
            seasonStartDate = springStart;
        } else if (dayOfYear < fallStartDay) {
            seasonStartDate = summerStart;
        } else if (dayOfYear < winterStartDay) {
            seasonStartDate = fallStart;
        } else {
            seasonStartDate = winterStart;
        }
    
        // Calculate season end date
        const seasonEndDate = this.getSeasonEndDate(seasonStartDate);
        
        // Get season name
        const seasonName = this.getSeasonName(seasonStartDate);
        
        // Calculate days remaining
        const daysRemaining = Math.floor((seasonEndDate.getTime() - now.getTime()) / 86400000);

        // Get current and previous season dates
        const currentDate = new Date();
        
        // Calculate previous season (season before current one)
        let previousSeasonStart: Date;
        let previousSeasonEnd: Date;

        if (dayOfYear < springStartDay) {
            // Current season is Winter, previous was Fall
            previousSeasonStart = new Date(currentYear - 1, 8, 22);  // Sep 22
            previousSeasonEnd = new Date(currentYear - 1, 11, 21);   // Dec 21
        } else if (dayOfYear < summerStartDay) {
            // Current is Spring, previous was Winter
            previousSeasonStart = new Date(currentYear - 1, 11, 21); // Dec 21
            previousSeasonEnd = new Date(currentYear, 2, 20);        // Mar 20
        } else if (dayOfYear < fallStartDay) {
            // Current is Summer, previous was Spring
            previousSeasonStart = new Date(currentYear, 2, 20);      // Mar 20
            previousSeasonEnd = new Date(currentYear, 5, 20);       // Jun 20
        } else if (dayOfYear < winterStartDay) {
            // Current is Fall, previous was Summer
            previousSeasonStart = new Date(currentYear, 5, 20);     // Jun 20
            previousSeasonEnd = new Date(currentYear, 8, 22);       // Sep 22
        } else {
            // Current is Winter, previous was Fall
            previousSeasonStart = new Date(currentYear, 8, 22);     // Sep 22
            previousSeasonEnd = new Date(currentYear, 11, 21);      // Dec 21
        }
    
        const startDate = toMySQLDate(seasonStartDate);
        const leaderboardInfo = await this.deliveryRepo.query(`
            SELECT d.providerId, d.amount, d.verifiedAmount, p.multiplierForScoring, p.priceForScoring, g.name, g.visibility 
            FROM \`delivery\` d 
            INNER JOIN \`produce\` p ON d.produceId = p.id 
            INNER JOIN \`gardener\` g ON d.providerId = g.id 
            WHERE g.isPlayer = 1 AND d.isVerified = 1 AND d.createdAt > '${startDate}'
        `);

        // Get previous season's leaderboard
        const prevSeasonStartDate = toMySQLDate(previousSeasonStart);
        const prevSeasonEndDate = toMySQLDate(previousSeasonEnd);

        const prevSeasonLeaderboardInfo = await this.deliveryRepo.query(`
            SELECT d.providerId, SUM(d.amount) as totalAmount, 
                   SUM(d.verifiedAmount) as totalVerifiedAmount,
                   g.name, g.visibility 
            FROM \`delivery\` d 
            INNER JOIN \`gardener\` g ON d.providerId = g.id 
            WHERE g.isPlayer = 1 
              AND d.isVerified = 1 
              AND d.createdAt BETWEEN '${prevSeasonStartDate}' AND '${prevSeasonEndDate}'
            GROUP BY d.providerId
            ORDER BY SUM(d.amount) DESC
            LIMIT 5
        `);

         // Add previous season winners to response
        const previousSeasonWinners = prevSeasonLeaderboardInfo.map((row, index) => ({
            position: index + 1,
            id: row.providerId,
            name: row.visibility === "public" ? row.name : `Gardener ${row.providerId}`,
            score: row.totalVerifiedAmount || row.totalAmount
        }));
    
        for (let row of leaderboardInfo) {
            if (totals[+row.providerId] === undefined) {
                totals[+row.providerId] = {
                    id: row.providerId,
                    name: row.visibility === "public" ? row.name : `Gardener ${row.providerId}`,
                    score: 0,
                    visibility: row.visibility
                };
            }
            
            let score = Math.ceil(((row.amount/16) * row.priceForScoring * row.multiplierForScoring * 100));
            totals[row.providerId].score = totals[row.providerId].score + score;
        }
    
        return {
            leaderboard: totals,
            seasonInfo: {
                currentSeason: seasonName,
                startDate: seasonStartDate.toISOString().split('T')[0],
                endDate: seasonEndDate.toISOString().split('T')[0],
                daysRemaining: daysRemaining,
                previousSeasonWinners: previousSeasonWinners
            }
        };
    }
    
    private getSeasonName(startDate: Date): string {
        const month = startDate.getMonth();
        if (month === 2) return 'Spring';  // March
        if (month === 5) return 'Summer';  // June
        if (month === 8) return 'Fall';    // September
        return 'Winter';                   // December
    }
    
    private getSeasonEndDate(startDate: Date): Date {
        const nextSeason = new Date(startDate);
        const month = startDate.getMonth();
        
        if (month === 2) {
            // Spring ends June 20
            nextSeason.setMonth(5, 20);
        } else if (month === 5) {
            // Summer ends September 22
            nextSeason.setMonth(8, 22);
        } else if (month === 8) {
            // Fall ends December 21
            nextSeason.setMonth(11, 21);
        } else {
            // Winter ends March 20 of next year
            nextSeason.setFullYear(nextSeason.getFullYear() + 1, 2, 20);
        }
        
        return nextSeason;
    }

}