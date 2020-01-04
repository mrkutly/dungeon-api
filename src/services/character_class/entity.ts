import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
} from 'typeorm';

@Entity()
class CharacterClass extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column()
  name!: string;

  @Column()
  resource_url!: string;

  @Column({ nullable: true })
  spellcasting_url?: string;
}

export default CharacterClass;