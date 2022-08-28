import { AutoIncrement, Column, CreatedAt, HasMany, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";
import { Image } from "../../images/models/Image";

@Table
export class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id!: number;
  
  @Column
  public username!: string;

  @Column
  public password!: string;

  @Column
  @CreatedAt
  public createdAt: Date = new Date();

  @Column
  @UpdatedAt
  public updatedAt: Date = new Date();

  @HasMany(() => Image)
  public images!: Image[];
}