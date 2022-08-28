import { Column, CreatedAt, Model, PrimaryKey, Table, UpdatedAt } from "sequelize-typescript";

@Table
export class User extends Model<User> {
  @PrimaryKey
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
}