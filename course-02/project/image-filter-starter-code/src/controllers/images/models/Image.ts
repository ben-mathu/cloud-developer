import { AutoIncrement, BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "../../users/models/User";

@Table
export class Image extends Model<Image> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @Column
  public imageName!: string;

  @ForeignKey(() => User)
  @Column
  public userId: number;

  @BelongsTo(() => User)
  public user!: User;
}