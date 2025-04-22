import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService, CustomQuery } from 'src/abstraction/base.service';
import { ProduceService } from 'src/produce/produce.service';
import { Repository } from 'typeorm';
import { Team } from './entities/team.entity';
import { LocationService } from 'src/location/location.service';
import { TeamRepository } from './team.repository';
import { UserService } from 'src/user/user.service';



@Injectable()
export class TeamService extends BaseService<Team> {
  constructor(
    @InjectRepository(Team) protected repository: Repository<Team>,
    protected teamuser: TeamService,
    protected user: UserService
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
  override async update(id: number, updates: Partial<Team>) {
    // Verify that the thing is valid to be put into the database
    // or that it fits the criteria that your business logic requires to be a valid object
    // or that fits the criteria so that the object can be deleted
    // or changing the data on its way out of the API
    


    let result = await this.repository.update(id, updates as any);
    // do the database action you're wanting to do to this object
    await super.remove(id);
    return result;
  }


  /**
   * Fetch Growings along with the places they're requested from. This is displayed in the harvest dialog.
   */
  override async findAll(query: CustomQuery) {
    let result = await super.findAll(query);
    

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
  /* async create(data: Omit<Team, 'id'>) {
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
      } as Partial<Team>);
    }
    else 
      return super.create(data);
  }
  relations = ['team', 'user']; */
}
