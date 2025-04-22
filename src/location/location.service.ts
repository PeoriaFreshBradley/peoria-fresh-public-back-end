import { Location } from './entities/location.entity';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { DeepPartial, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { LocationRepository } from './location.repository';

config();

const configService = new ConfigService();

export class LocationService {
  constructor(@InjectRepository(Location) protected repository: LocationRepository) {}

  // create resource
  async create(data: Partial<Location>) {
    if (data.address === undefined || data.city === undefined || data.state === undefined || data.postal === undefined || data.country === undefined)
      return null;
    try {
      data.deliveries = null;
      data.requestLocations = null;
      // Avoid uniqueness constraint failures
      const exists = () => {
        return this.repository.exist({
            where: { 
              address: data.address,
              city: data.city,
              state: data.state,
              postal: data.postal,
              country: data.country
            }
          });
      }
      if (!(await exists())) { // race condition being created without this final check.

        // The commented lines are supposed to verify that the address is indeed a real place with Google Maps, but unfortunately, it wasn't super accurate.
        // It would report that addresses I know to be correct were nonexistent, so that was a real bad thing for the application; now it's disabled.
        // If someone has time to figure out how to make it work, that would be a really good thing because validating data is kind of important.
        // It could especially make sure that nothing is being requested/delivered from/to addresses outside of the service area of the program (Peoria County currently). 

        //let resp = await axios.post(`https://addressvalidation.googleapis.com/v1:validateAddress?key=${configService.get('MAPS_API_KEY')}`, {
        //  address: {
        //    regionCode: data.country,
        //    addressLines: [
        //      `${data.address}`,
        //      `${data.city}, ${data.state}, ${data.postal as number}`
        //    ]
        //  }
        //});
          // Some logic to validate the addresses are somewhere we care about
          //if (resp.data.result.uspsData.county !== 'PEORIA') {
          //  return null;
          //}

          // If the address given is malformed, do not add it
          //if (resp.data.result.verdict.addressComplete) {
          return (await this.repository.save(data as DeepPartial<Location>)) as Partial<Location>;
          //}
          //else {
          //  console.log('i returned null');
          //  return null;
          //}
        }
        else {
          return {
            id: (await this.repository.findOne({
              where: { 
                address: data.address,
                city: data.city,
                state: data.state,
                postal: data.postal,
                country: data.country
              }
            })).id
          } as Partial<Location>;
        }
    }
    catch (e) {
      return {
        id: (await this.repository.findOne({
          where: { 
            address: data.address,
            city: data.city,
            state: data.state,
            postal: data.postal,
            country: data.country
          }
        })).id
      } as Partial<Location>;
    }
  }

  async getOne(findId: number) {
    let result = await this.repository.findOne({
      where: {
        id: findId
      }
    });

    return result;
  }

}
