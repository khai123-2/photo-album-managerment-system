import { plainToInstance } from 'class-transformer';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  static plainToClass<T>(this: new (...arg: any[]) => T, obj: T): T {
    return plainToInstance(this, obj);
  }

  static plainToClassArray<T>(this: new (...arg: any[]) => T, obj: T[]): T[] {
    return plainToInstance(this, obj);
  }
}
