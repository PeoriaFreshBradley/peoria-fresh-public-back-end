import { IsObject, IsOptional, IsString } from 'class-validator';
import { BaseEntity } from 'src/abstraction/base.entity';
import { Produce } from 'src/produce/entities/produce.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class ProduceName extends BaseEntity {
  @Column()
  @IsString()
  name: string;

  @ManyToOne(() => Produce, (produce) => produce.otherNames)
  @IsOptional()
  @IsObject()
  produce: Produce;
}
