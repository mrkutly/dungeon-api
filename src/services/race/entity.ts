import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
} from 'typeorm';

@Entity()
class Race extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column()
  name!: string;

  @Column()
  description!: string;

  @Column()
  bonuses_description!: string;

  @Column({ type: 'int2' })
  starting_speed!: number;

  @Column({ default: 0, type: 'int2' })
  strength_bonus: number;

  @Column({ default: 0, type: 'int2' })
  dexterity_bonus: number;

  @Column({ default: 0, type: 'int2' })
  constitution_bonus: number;

  @Column({ default: 0, type: 'int2' })
  wisdom_bonus: number;

  @Column({ default: 0, type: 'int2' })
  intelligence_bonus: number;

  @Column({ default: 0, type: 'int2' })
  charisma_bonus: number;
}

export default Race;