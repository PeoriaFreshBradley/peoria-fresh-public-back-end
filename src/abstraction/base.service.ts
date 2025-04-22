import { DeepPartial, FindOptionsOrder, Like, Repository } from 'typeorm';
import { BaseEntity } from './base.entity';

//handles business logic and implementation

export abstract class BaseService<T extends BaseEntity> {
  constructor(protected repository: Repository<T>) {}

  //  can be used to sort the items
  order?: FindOptionsOrder<T>;
  // list of relations that should be loaded by default
  relations = [];

  // Lists of functions that will sort and filter data when the object is queried
  sortList = [];
  filterList = [];

  // create resource
  async create(data: Omit<T, 'id'>) {
    return this.repository.save(data as DeepPartial<T>);
  }

  // get all resources
  async findAll(query: CustomQuery) {
    if (query.includeExtra) delete query.includeExtra; // in case not properly scrubbed
    let where = { ...query };
    // can be used to parse out search queries which are formatted like this: ?searchKey=name&searchValue=apple
    // where the searchKey is the column name and the searchValue is the value to search for
    if (!!query.searchKey) {
      where[`${query.searchKey}`] = Like(`%${query.searchValue}%`);
      delete where.searchKey;
      delete where.searchValue;
    }

    // we return the pagination metadata as well as the data so that the client can use it to paginate and know what page and pagesize the current data is
    const paginationMetadata = {
      page: 1,
      limit: 10,
    };
    if (query.page) {
      paginationMetadata.page = query.page;
      delete where.page;
    }
    if (query.limit) {
      if (query.limit == -1) {
        query.limit = 1000000;
        paginationMetadata.limit = 1000000;
        paginationMetadata.page = 1;
      }
      else
        paginationMetadata.limit = query.limit;
      delete where.limit;
    }

    // we need to convert the page and limit into skip and take for typeorm
    const pagination = {
      skip: (paginationMetadata.page - 1) * paginationMetadata.limit,
      take: paginationMetadata.limit,
    };

    let data;
    let count;

    // Apply the filter function
    // This will iterate through all defined filter functions and will use the last applicable filter to the query
    for (let filter of this.filterList) {
      let result = await filter(query, where);
      if (typeof result === 'undefined') {
        continue;
      }
      else {
        where = result;   
      }
    }

    let ordering;

    // Check that the query wants to be sorted
    if (query.sort) {
      // Apply the sorter function (if it applies to the query).
      // It will iterate through the list and ultimately apply the last relevant sorter onto the output
      for (let sorter of this.sortList) {
        let result = sorter(query.sort, where);
        if (typeof result === 'undefined') {
          continue;
        }
        else {
          ordering = result;
        }
      }

      // this stops *properly formatted* sort queries from crashing when a sort is included
      // Basically just get rid of the sort object so it doesn't try to do a WHERE statement on something that represents an ORDER BY
      delete where.sort;
    }

    if (typeof ordering === 'undefined') {
      ordering = this.order;
    }
    // execute the query with all sorts and filters applied
    [data, count] = await this.repository.findAndCount({
      where: where as any,
      order: ordering,
      relations: this.relations,
      ...pagination,
    });

    // this is used to merge the results of two queries, by default the secondaryQueryHandler is not set so this will not run
    // you can override this method in the child service to set the secondaryQueryHandler, see the produce service for an example
    if (this.secondaryQueryHandler) {
      const ids = data.map((item) => item.id);
      const secondaryData = await this.secondaryQueryHandler(query);
      secondaryData.forEach((item) => {
        if (!ids.includes(item.id)) {
          data.push(item);
          ids.push(item.id);
          count++;
        }
      });

      // resort
      if (this.order) {
        data.sort((a, b) => {
          const [key, order] = Object.entries(this.order)[0];
          if (a[key] < b[key]) {
            return order === 'ASC' ? -1 : 1;
          }
          if (a[key] > b[key]) {
            return order === 'ASC' ? 1 : -1;
          }
          return 0;
        });
      }
    }

    return {
      data,
      metadata: {
        pages: Math.ceil(count / (query.limit || 10)),
        count,
        ...paginationMetadata,
      },
    };
  }

  // get one resource by id
  findOne(id: number) {
    return this.repository.findOne({
      where: { id } as any,
      relations: this.relations,
    });
  }

  // update resource by id
  update(id: number, updates: Partial<T>) {
    return this.repository.update(id, updates as any);
  }

  // delete resource by id
  remove(id: number) {
    return this.repository.delete(id);
  }

  protected secondaryQueryHandler?: (query: CustomQuery) => Promise<T[]>;
}

export interface CustomQuery {
  searchKey?: string; //name of column
  searchValue?: string; //what your searching for
  page?: number;
  limit?: number; //-1 to do infinite requests
  alphabetFilter?: string; 
  includeExtra?: boolean; // this must be removed before passing to the overridden findAll function (or others)
  // anything else
  [key: string]: any;
}