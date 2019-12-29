import bcrypt from 'bcrypt';
import {
  BaseEntity,
  BeforeInsert,
  Entity,
  Column,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';

import * as TokenManager from '../../../utils/TokenManager';
import { Character } from './Character';

@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column()
  email!: string;

  @Column()
  password!: string;

  @OneToMany(() => Character, (character) => character.user)
  characters: Character[];

  @CreateDateColumn()
  created_at!: string;

  @UpdateDateColumn()
  updated_at!: string;

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
  }

  async authenticate(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  static parseFromWebToken(token: string): Promise<User | undefined> {
    const { userId } = TokenManager.parseToken(token);
    return User.findOne({ id: userId });
  }
}