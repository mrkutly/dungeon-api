import {
  getConnection,
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

export type CharacterParams = {
  name: string;
  race: Race;
  character_class: CharacterClass;
  user: User;
  level: number;
  speed: number;
  strength: number;
  dexterity: number;
  constitution: number;
  wisdom: number;
  intelligence: number;
  charisma: number;
  max_hp: number;
  features: Feature[];
  equipment: Equipment[];
  magic_school: MagicSchool;
  proficiencies: Proficiency[];
  conditions: Condition[];
  languages: Language[];
  skills: Skill[];
  spells: Spell[];
};

export const characterRelations = [
  "race",
  "character_class",
  "features",
  "languages",
  "spells",
  "magic_school",
  "equipment",
  "conditions",
  "proficiencies"
];

@Entity()
class Character extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => User, (user) => user.characters)
  user!: User;

  @ManyToOne(() => Race, race => race.id)
  @JoinColumn()
  race: Race;

  @ManyToOne(() => MagicSchool)
  @JoinColumn()
  magic_school: MagicSchool;

  @ManyToOne(() => CharacterClass)
  @JoinColumn()
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

  static async createFromCharacterParams(params: CharacterParams): Promise<Character | undefined | Error> {
    try {
      const character = new Character();
      character.name = params.name;
      character.race = params.race;
      character.character_class = params.character_class;
      character.features = params.features;
      character.proficiencies = params.proficiencies;
      character.languages = params.languages;
      character.equipment = params.equipment;
      character.conditions = params.conditions;
      character.magic_school = params.magic_school;
      character.charisma = params.charisma;
      character.max_hp = params.max_hp;
      character.dexterity = params.dexterity;
      character.constitution = params.constitution;
      character.strength = params.strength;
      character.intelligence = params.intelligence;
      character.wisdom = params.wisdom;
      character.spells = params.spells;

      const saved = await character.save();
      return Character.findOne({ where: { id: saved.id }, relations: characterRelations });
    } catch (error) {
      return error;
    }
  }
}


export default Character;
