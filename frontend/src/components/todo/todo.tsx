import { Button } from "../";
import styles from "./button.module.css";

type ButtonPropsType = {
  todo: {
    content: string;
    uuid: string;
    createdAt: string;
    updatedAt: string;
  };
  onEdit: () => void;
  onDelete: () => void;
};

export const Todo = ({ todo, onEdit, onDelete }: ButtonPropsType) => {
  const { content, createdAt, updatedAt } = todo;

  return (
    <div className={styles["todo-container"]}>
      <div className="content">{content}</div>
      <div className="created">{createdAt}</div>
      <div className="created">{updatedAt}</div>
      <Button text="Edit" onClick={onEdit} />
      <Button text="Delete" onClick={onDelete} />
    </div>
  );
};
