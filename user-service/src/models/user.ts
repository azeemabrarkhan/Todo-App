import { DataTypes, Model, Optional } from "sequelize";
import database from "../db.js";

interface UserAttributes {
  id: number;
  uuid: string;
  user_email: string;
  user_pwd: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "uuid" | "createdAt" | "updatedAt"> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public uuid!: string;
  public user_email!: string;
  public user_pwd!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      unique: true,
    },
    user_email: { type: DataTypes.STRING, allowNull: false, unique: true },
    user_pwd: { type: DataTypes.STRING, allowNull: false },
  },
  {
    sequelize: database,
    modelName: "User",
    tableName: "users",
    timestamps: true,
  }
);

export default User;
