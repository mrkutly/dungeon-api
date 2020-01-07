import {
  Entity,
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable
} from 'typeorm';

import User from '../user/entity';
import Race from '../race/entity';
import CharacterClass from '../character_class/entity';
import Feature from '../feature/entity';
import Equipment from '../equipment/entity';
import Condition from '../condition/entity';
import Language from '../language/entity';
import Proficiency from '../proficiency/entity';
import Skill from '../skill/entity';
import Spell from '../spell/entity';
import MagicSchool from '../magic_school/entity';

const int2 = process.env.NODE_ENV === 'test' ? 'int' : 'int2';
const int4 = process.env.NODE_ENV === 'test' ? 'int' : 'int4';

@Entity()
class Character extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => User, (user) => user.characters)
  user!: User;

  @JoinColumn()
  @ManyToOne(() => Race)
  race: Race;

  @JoinColumn()
  @ManyToOne(() => MagicSchool)
  magic_school: MagicSchool;

  @JoinColumn()
  @ManyToOne(() => CharacterClass)
  character_class: CharacterClass;

  @ManyToMany(() => Feature)
  @JoinTable()
  features: Feature[];

  @ManyToMany(() => Equipment)
  @JoinTable()
  equipment: Equipment[];

  @ManyToMany(() => Condition)
  @JoinTable()
  conditions: Condition[];

  @ManyToMany(() => Language)
  @JoinTable()
  languages: Language[];

  @ManyToMany(() => Proficiency)
  @JoinTable()
  proficiencies: Proficiency[];

  @ManyToMany(() => Skill)
  @JoinTable()
  skills: Skill[];

  @ManyToMany(() => Spell)
  @JoinTable()
  spells: Spell[];

  @CreateDateColumn()
  created_at!: string;

  @UpdateDateColumn()
  updated_at!: string;

  @Column({ type: int2, default: 1 })
  level: number;

  @Column({ type: int4, default: 0 })
  experience: number;

  @Column({ type: int2, default: 0 })
  speed: number;

  @Column({ type: int2, default: 0 })
  strength: number;

  @Column({ type: int2, default: 0 })
  dexterity: number;

  @Column({ type: int2, default: 0 })
  constitution: number;

  @Column({ type: int2, default: 0 })
  wisdom: number;

  @Column({ type: int2, default: 0 })
  intelligence: number;

  @Column({ type: int2, default: 0 })
  charisma: number;

  @Column({ type: int2, default: 0 })
  current_hp: number;

  @Column({ type: int2, default: 0 })
  max_hp: number;
}

export default Character;