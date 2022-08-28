import { AutoIncrement, Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table
export class Image extends Model<Image> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id: number;

  @Column
  public imageName!: string
}