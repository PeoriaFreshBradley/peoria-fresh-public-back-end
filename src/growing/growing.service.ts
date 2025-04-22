import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService, CustomQuery } from 'src/abstraction/base.service';
import { Repository } from 'typeorm';
import { Growing } from './entities/growing.entity';
import { Delivery } from 'src/delivery/entities/delivery.entity';
import { Location as MyLocation } from 'src/location/entities/location.entity';
import { GardenerRepository } from 'src/gardener/gardener.repository';
import { DeliveryService } from 'src/delivery/delivery.service';
import { RequestRepository } from 'src/request/request.repository';
import { toMySQLDate } from 'src/otherlogic/fancyQueryProduce';
import { SetByValue } from 'src/otherlogic/fancyQueryProduce';

@Injectable()
export class GrowingService extends BaseService<Growing> {
  constructor(
    @InjectRepository(Growing) protected repository: Repository<Growing>,
    protected delivery: DeliveryService,
    protected gardener: GardenerRepository,
    protected requests: RequestRepository
  ) {
    super(repository);
  }

  /**
   * If a Growing is being converted to 'harvested', make it into a delivery. Additional information is required if this is the case.
   * 
   * @param id 
   * @param updates the things to be updated
   * @returns an updated Growing
   */
  override async update(id: number, updates: Partial<Growing>) {
    let altered = JSON.parse(JSON.stringify(updates)); //altered is a deep copy of updates
    if (updates.toDelivery) {
      delete altered.toDelivery;
    }
    let result = await this.repository.update(id, altered as any);
    if (updates.status && updates.status === 'harvested') {
      let entireGrowing = await this.repository.findOne({where: { id } as any, relations: ['gardener', 'produce']});
      let requiredDeliveryInfo = updates.toDelivery;
      await this.delivery.create( {
          amount: requiredDeliveryInfo.amountHarvested,
          expectedDeliveryDate: requiredDeliveryInfo.expectedDeliveryDate,
          provider: entireGrowing.gardener,
          location: {
            address: requiredDeliveryInfo.address,
            city: requiredDeliveryInfo.city,
            state: requiredDeliveryInfo.state,        //OMIT- looks for a location that matches all these properties OTHER than ID
            country: requiredDeliveryInfo.country,
            postal: parseInt(requiredDeliveryInfo.zip)
          } as Omit<MyLocation, 'id'>,
          produce: entireGrowing.produce,
          type: 'grown'
        } as Omit<Delivery, 'id'>
      );
      await super.remove(id);
    }
    return result;
  }


  /**
   * Fetch Growings along with the places they're requested from. This is displayed in the harvest dialog.
   */
  override async findAll(query: CustomQuery) {
    let include = (query.includeExtra && 1);
    let result = await super.findAll(query);
    if (include) {
      let requestLocs = await this.requests.query(`SELECT t0.produceId, t1.address, t1.city, t1.state, t1.country, t1.postal FROM request t0 INNER JOIN location t1 ON t1.id = t0.locationId WHERE t0.createdAt > '${toMySQLDate(new Date(new Date().getTime() - new Date(1000 * 24 * 3600 * 365).getTime()))}' AND t0.locationId IS NOT NULL`);
      let mapped = new Map<number, SetByValue<any>>();
      for (let i of requestLocs) {
        if (mapped.get(i.produceId) === undefined) {
          mapped.set(i.produceId, new SetByValue<any>(new Set<any>([i])));
        }
        else {
          let tmp = mapped.get(i.produceId);
          tmp.add(i);
          mapped.set(i.produceId, tmp);
        }
      }
      for (let i of result.data) {
        if (mapped.get(i.produce.id)) {
          i.extra = {
            requestingLocations: Array.from(mapped.get(i.produce.id))
          }
        }
        else {
          i.extra = {};
        }
      }
    }
    return result;
  }

  /* Do 2 things when creating a Growing:
  *
  * 1) Set everyone who accepts a Growing (puts it to their dashboard) as a legit gardener. Others may just be donating everything and this flag
  *     is used by the front-end to see where to send people after sign-in. Dashboard or to community requests every time.
  * 2) Check if there's already an accepted Growing for this produce for this gardener. If so, add the newly accepted amount to that instead of
  *     creating another Growing of the exact everything except amount. Specifically for accepted only, if the plants are already in the garden
  *     from their last accepted Growing, then we make a new Growing because we don't want to speak for them and assume they're all part of the
  *     same batch/harvest.
  */
  async create(data: Omit<Growing, 'id'>) {
    this.gardener.query(`UPDATE gardener SET hasGarden = TRUE WHERE id = ${data.gardener.id}`);
    let result = await this.repository.find({
      where: {
        gardener: data.gardener,
        produce: data.produce,
        status: 'accepted'
      }
    });
    if (result.length > 0) {
      this.repository.update(result[0].id, {
        amount: data.amount+result[0].amount
      } as Partial<Growing>);
    }
    else 
      return super.create(data);
  }
  relations = ['gardener', 'produce'];
}
