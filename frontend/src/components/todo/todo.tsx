import { getTimeDurationSince } from "../../utils/time";
import Button from "../button/button";

import styles from "./todo.module.css";

type TodoPropsType = {
  todo: {
    content: string;
    uuid: string;
    createdAt: string;
    updatedAt: string;
  };
  onEdit: () => void;
  onDelete: () => void;
};

const Todo = ({ todo, onEdit, onDelete }: TodoPropsType) => {
  const { content, createdAt, updatedAt } = todo;

  return (
    <div className={styles.todo}>
      <div>{content}</div>
      <div>{`Created ${getTimeDurationSince(createdAt)}`}</div>
      <div>{`Updated ${getTimeDurationSince(updatedAt)}`}</div>
      <Button text="Edit" onClick={onEdit} />
      <Button text="Delete" onClick={onDelete} />
    </div>
  );
};

export default Todo;
