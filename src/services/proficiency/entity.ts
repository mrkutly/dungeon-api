import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
} from 'typeorm';

@Entity()
class Proficiency extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column()
  name!: string;

  @Column()
  resource_url!: string;
}

export default Proficiency;