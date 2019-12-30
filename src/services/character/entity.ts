import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne
} from 'typeorm';

import User from '../user/entity';

@Entity()
class Character extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => User, (user) => user.characters)
  user!: User;

  @CreateDateColumn()
  created_at!: string;

  @UpdateDateColumn()
  updated_at!: string;

  @Column({ type: 'int2', default: 1 })
  level: number;

  @Column({ type: 'int4', default: 0 })
  experience: number;

  @Column({ type: 'int2', default: 0 })
  speed: number;

  @Column({ type: 'int2', default: 0 })
  strength: number;

  @Column({ type: 'int2', default: 0 })
  dexterity: number;

  @Column({ type: 'int2', default: 0 })
  constitution: number;

  @Column({ type: 'int2', default: 0 })
  wisdom: number;

  @Column({ type: 'int2', default: 0 })
  intelligence: number;

  @Column({ type: 'int2', default: 0 })
  charisma: number;

  @Column({ type: 'int2', default: 0 })
  current_hp: number;

  @Column({ type: 'int2', default: 0 })
  max_hp: number;
}

export default Character;