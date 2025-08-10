import { DataTypes, Model, Optional } from "sequelize";
import database from "../db.js";

interface TodoAttributes {
  id: number;
  uuid: string;
  content: string;
  user_uuid: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface TodoCreationAttributes extends Optional<TodoAttributes, "id" | "uuid" | "createdAt" | "updatedAt"> {}

class Todo extends Model<TodoAttributes, TodoCreationAttributes> implements TodoAttributes {
  public id!: number;
  public uuid!: string;
  public content!: string;
  public user_uuid!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Todo.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },
    content: { type: DataTypes.STRING, allowNull: false },
    user_uuid: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize: database,
    modelName: "Todo",
    tableName: "todos",
    timestamps: true,
  }
);

export default Todo;
