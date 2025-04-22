import { HttpService } from '@nestjs/axios';
import { forwardRef, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { BaseService, CustomQuery } from 'src/abstraction/base.service';
import { FindOptionsOrder, Like, Repository } from 'typeorm';
import { Badge } from './entities/badge';
import { ExtraProduceQueryAction } from 'src/otherlogic/fancyQueryProduce';
import { registerAs } from '@nestjs/config';
import { DeliveryService } from 'src/delivery/delivery.service';
import { Delivery } from 'src/delivery/entities/delivery.entity';
import { User_badgeService } from 'src/user_badge/user_badge/user_badge.service';
import { User_badge } from 'src/user_badge/user_badge/entities/user_badge';
import { all } from 'axios';
import { GardenerService } from 'src/gardener/gardener.service';

@Injectable()
export class BadgeService extends BaseService<Badge> {
  constructor(
    @InjectRepository(Badge) protected repository: Repository<Badge>,
    private readonly httpService: HttpService,
    private deliveryService: DeliveryService, // services you're dependent on need to be specified here
    private user_badgeService: User_badgeService, 
    private gardenerService: GardenerService,
    private fancyquery: ExtraProduceQueryAction
  ) {
    super(repository);
  }

  order = {
    name: 'ASC',
  } as FindOptionsOrder<Badge>;
  relations = [
  ];

  sortList = [
  ];

  // we override the create method so that we can add additional data to the produce from an external API
  override async create(data: Omit<Badge, 'id'>) {
    // validate and manipulate your data in this section before you commit to the database
    // clean up the response from the database and provide the response as the API should present it
    return null;
  }

  filterList = [
    
  ]

  async findCompletedBadges(userId: number) {
      
    let allAvailableBadges : any[] = await this.repository.find();
    let completedbadges = new Set<number>();
    let newBadges : Omit<User_badge, "id">[] = [];

    let myquery = {
      limit: -1 //-1 to do infinite requests
    } as CustomQuery;

    //that data array
    let thisGardener = (await this.gardenerService.findOne(userId));
    let unsortedLeaderboard = await this.fancyquery.getLeaderboard();
    let previousWinners = unsortedLeaderboard.seasonInfo.previousSeasonWinners;

    //need logic to get user_badges for a user
    let userBadges = (await this.user_badgeService.findAllforUser(userId));
    userBadges.forEach((badge) => {
      completedbadges.add(badge.badgeId)
    });

    //logic to get newly acquired badges (because we already have their completed badges in database)
    let produceTotals = (await this.fancyquery.produceTotalsByUser(userId));

    {/*if statements for all of the DONATION badges*/}
      //Banana
      if(completedbadges.has(1) == false && produceTotals.get("banana") != undefined && produceTotals.get("banana") >= 500){
          //adding to completedBadges a new user_badge
          newBadges.push({
            gardenerId: userId,
            badgeId: 1
          } as unknown as Omit<User_badge, "id">)
      }
      //Strawberry
      if(completedbadges.has(2) == false && produceTotals.get("strawberry") != undefined && produceTotals.get("strawberry") >= 40){
        //adding to completedBadges a new user_badge
        newBadges.push({
          gardenerId: userId,
          badgeId: 2
        } as unknown as Omit<User_badge, "id">)
      }
      //Peach
      if(completedbadges.has(3) == false && produceTotals.get("peach") != undefined && produceTotals.get("peach") >= 265){
        //adding to completedBadges a new user_badge
        newBadges.push({
          gardenerId: userId,
          badgeId: 3
        } as unknown as Omit<User_badge, "id">)
      }
      //Carrots
      if(completedbadges.has(4) == false && produceTotals.get("carrot") != undefined && produceTotals.get("carrot") >= 225){
        //adding to completedBadges a new user_badge
        newBadges.push({
          gardenerId: userId,
          badgeId: 4
        } as unknown as Omit<User_badge, "id">)
      }
      //Broccoli
      if(completedbadges.has(5) == false && produceTotals.get("broccoli") != undefined && produceTotals.get("broccoli") >= 100){
        //adding to completedBadges a new user_badge
        newBadges.push({
          gardenerId: userId,
          badgeId: 5
        } as unknown as Omit<User_badge, "id">)
      }
      //Melon
      if(completedbadges.has(6) == false && produceTotals.get("watermelon") != undefined && produceTotals.get("watermelon") >= 3200){
        //adding to completedBadges a new user_badge
        newBadges.push({
          gardenerId: userId,
          badgeId: 6
        } as unknown as Omit<User_badge, "id">)
      }
      //Blueberry
      if(completedbadges.has(7) == false && produceTotals.get("blueberry") != undefined && produceTotals.get("blueberry") >= 16){
        //adding to completedBadges a new user_badge
        newBadges.push({
          gardenerId: userId,
          badgeId: 7
        } as unknown as Omit<User_badge, "id">)
      }
      //Asparagus
      if(completedbadges.has(8) == false && produceTotals.get("asparagus") != undefined && produceTotals.get("asparagus") >= 16){
        //adding to completedBadges a new user_badge
        newBadges.push({
          gardenerId: userId,
          badgeId: 8
        } as unknown as Omit<User_badge, "id">)
      }
      //Bok Choy
      if(completedbadges.has(9) == false && produceTotals.get("bok choy") != undefined && produceTotals.get("bok choy") >= 160){
        //adding to completedBadges a new user_badge
        newBadges.push({
          gardenerId: userId,
          badgeId: 9
        } as unknown as Omit<User_badge, "id">)
      }
      //Cherry
      if(completedbadges.has(10) == false && produceTotals.get("cherry") != undefined && produceTotals.get("cherry") >= 18){
        //adding to completedBadges a new user_badge
        newBadges.push({
          gardenerId: userId,
          badgeId: 10
        } as unknown as Omit<User_badge, "id">)
      }
      //Sprite Sipper: lemons = limes
      if(completedbadges.has(11) == false && produceTotals.get("lemon") != undefined && produceTotals.get("lime") != undefined && produceTotals.get("lemon") == produceTotals.get("lime")){
        //adding to completedBadges a new user_badge
        newBadges.push({
          gardenerId: userId,
          badgeId: 11
        } as unknown as Omit<User_badge, "id">)
      }
      //Grape
      if(completedbadges.has(12) == false && produceTotals.get("grape") != undefined && produceTotals.get("grape") >= 18){
        //adding to completedBadges a new user_badge
        newBadges.push({
          gardenerId: userId,
          badgeId: 12
        } as unknown as Omit<User_badge, "id">)
      }
      //Spinach
      if(completedbadges.has(13) == false && produceTotals.get("spinach") != undefined && produceTotals.get("spinach") >= 9){
        //adding to completedBadges a new user_badge
        newBadges.push({
          gardenerId: userId,
          badgeId: 13
        } as unknown as Omit<User_badge, "id">)
      }
      //Potato
      if(completedbadges.has(14) == false && produceTotals.get("potato") != undefined && produceTotals.get("potato") >= 200){
        //adding to completedBadges a new user_badge
        newBadges.push({
          gardenerId: userId,
          badgeId: 14
        } as unknown as Omit<User_badge, "id">)
      }
      //Orange
      if(completedbadges.has(15) == false && produceTotals.get("orange") != undefined && produceTotals.get("orange") >= 138){
        //adding to completedBadges a new user_badge
        newBadges.push({
          gardenerId: userId,
          badgeId: 15
        } as unknown as Omit<User_badge, "id">)
      }
      //Pepper: banana pepper + cherry pepper + green bell pepper + green jalapeno + orange bell pepper + orange habanero + red bell pepper + red habanero + red jalapeno + yellow bell pepper + yellow jalapeno
      if(completedbadges.has(16) == false && produceTotals.get("banana pepper") != undefined && produceTotals.get("green bell pepper") != undefined && produceTotals.get("green jalapeno") != undefined && produceTotals.get("orange bell pepper") != undefined && produceTotals.get("orange habanero") != undefined && produceTotals.get("red bell pepper") != undefined && produceTotals.get("red habanero") != undefined && produceTotals.get("red jalapeno") != undefined && produceTotals.get("yellow bell pepper") != undefined && produceTotals.get("yellow jalapeno") != undefined){
        //adding to completedBadges a new user_badge
        newBadges.push({
          gardenerId: userId,
          badgeId: 16
        } as unknown as Omit<User_badge, "id">)
      }
      //Apple: fuji apple + gala apple + granny smith apple + honeycrisp apple + red delicious apple +
      if(completedbadges.has(17) == false && produceTotals.get("fuji apple") != undefined && produceTotals.get("gala apple") != undefined && produceTotals.get("granny smith apple") != undefined && produceTotals.get("honeycrisp apple") != undefined && produceTotals.get("red delicious apple") != undefined){
        //adding to completedBadges a new user_badge
        newBadges.push({
          gardenerId: userId,
          badgeId: 17
        } as unknown as Omit<User_badge, "id">)
      }

      //1st-5th place badges
      const badgeIdsByPosition ={0:18, 1:19, 2:20, 3:21, 4:22};
      //awards previous winners their respective badges
      previousWinners.forEach((winner, index) => {
        const badgeId = badgeIdsByPosition[index];

        if(!completedbadges.has(badgeId) && winner.id == thisGardener.id){
          newBadges.push({
            gardenerId: userId,
            badgeId: badgeId
          } as unknown as Omit<User_badge, "id">) 
        }
      });
      
      //Leaderboard Legion (badgeID: 23)
      if(completedbadges.has(23) == false && thisGardener.isPlayer == true){
        //adding to completedBadges a new user_badge
        newBadges.push({
          gardenerId: userId,
          badgeId: 23
        } as unknown as Omit<User_badge, "id">)
      }


    //save all badges earned
    for(let i of newBadges){      
      if (!completedbadges.has(i.badgeId))
        await this.user_badgeService.create(i)
    }

    //goes through all badges and adds an "earned" attribute if the current user has earned them
    allAvailableBadges.forEach((badge) => {
      badge.earned = false;

      if (completedbadges.has(badge.id))
        badge.earned = true;
      else if (newBadges.find((currentBadge) => currentBadge.badgeId == badge.id)) 
        badge.earned = true;
    })

    return allAvailableBadges;
  }
}
