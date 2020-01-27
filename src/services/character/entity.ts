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

export type CharacterParams = {
  character_class: CharacterClass;
  charisma: number;
  conditions: Condition[];
  constitution: number;
  current_hp: number;
  dexterity: number;
  equipment: Equipment[];
  experience: number;
  features: Feature[];
  intelligence: number;
  languages: Language[];
  level: number;
  magic_school: MagicSchool;
  max_hp: number;
  name: string;
  proficiencies: Proficiency[];
  race: Race;
  skills: Skill[];
  speed: number;
  spells: Spell[];
  strength: number;
  user: User;
  wisdom: number;
};

export const characterRelations = [
  "character_class",
  "conditions",
  "equipment",
  "features",
  "race",
  "languages",
  "magic_school",
  "proficiencies",
  "skills",
  "spells",
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
      character.character_class = params.character_class;
      character.charisma = params.charisma;
      character.conditions = params.conditions;
      character.constitution = params.constitution;
      character.dexterity = params.dexterity;
      character.equipment = params.equipment;
      character.features = params.features;
      character.intelligence = params.intelligence;
      character.languages = params.languages;
      character.magic_school = params.magic_school;
      character.max_hp = params.max_hp;
      character.name = params.name;
      character.proficiencies = params.proficiencies;
      character.race = params.race;
      character.skills = params.skills;
      character.spells = params.spells;
      character.strength = params.strength;
      character.user = params.user;
      character.wisdom = params.wisdom;

      const saved = await character.save();
      return Character.findOne({ where: { id: saved.id }, relations: characterRelations });
    } catch (error) {
      return error;
    }
  }

  async updateFromParams(params: CharacterParams): Promise<Character | Error> {
    try {
      this.character_class = params.character_class || this.character_class;
      this.charisma = params.charisma || this.charisma;
      this.constitution = params.constitution || this.constitution;
      this.current_hp = params.current_hp || this.current_hp;
      this.dexterity = params.dexterity || this.dexterity;
      this.experience = params.experience || this.experience;
      this.intelligence = params.intelligence || this.intelligence;
      this.level = params.level || this.level;
      this.magic_school = params.magic_school || this.magic_school;
      this.max_hp = params.max_hp || this.max_hp;
      this.name = params.name || this.name;
      this.race = params.race || this.race;
      this.strength = params.strength || this.strength;
      this.wisdom = params.wisdom || this.wisdom;

      params.equipment?.forEach((eq) => this.equipment.push(eq));

      params.features?.forEach((feat) => {
        if (!this.features.find((existing) => existing.id === feat.id)) {
          this.features.push(feat);
        }
      });

      params.languages?.forEach((lang) => {
        if (!this.languages.find((existing) => existing.id === lang.id)) {
          this.languages.push(lang);
        }
      });

      params.proficiencies?.forEach((prof) => {
        if (!this.proficiencies.find((existing) => existing.id === prof.id)) {
          this.proficiencies.push(prof);
        }
      });

      params.skills?.forEach((skill) => {
        if (!this.skills.find((existing) => existing.id === skill.id)) {
          this.skills.push(skill);
        }
      });

      params.spells?.forEach((spell) => {
        if (!this.spells.find((existing) => existing.id === spell.id)) {
          this.spells.push(spell);
        }
      });

      params.conditions?.forEach((cond) => {
        if (!this.conditions.find((existing) => existing.id === cond.id)) {
          this.conditions.push(cond);
        }
      });

      const saveResult = await this.save();
      if (!saveResult.id) {
        throw new Error('There was a problem saving the character.');
      }

      return this;
    } catch (error) {
      return error;
    }
  }
}



export default Character;
