import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { createTodo, deleteTodo, getTodos, updateTodo } from "../../services/todoService";
import Todo from "../../components/todo/todo";
import Button from "../../components/button/button";

import styles from "./todos.module.css";

type Todo = {
  content: string;
  uuid: string;
  createdAt: string;
  updatedAt: string;
};

type TodosPropsType = {
  user: { uuid: string; user_email: string } | null;
};

const Todos = ({ user }: TodosPropsType) => {
  const inputElement = useRef<HTMLInputElement>(null);
  const [removedTodo, setRemovedTodo] = useState<Todo | null>(null);
  const [editTodo, setEditTodo] = useState<Todo | null>(null);
  const [todos, setTodos] = useState<Array<Todo>>([]);

  useEffect(() => {
    if (!user?.uuid) return;
    getTodos().then((res) => {
      const { todos } = res.data;
      setTodos(todos);
    });
  }, [user?.uuid]);

  const handleEditButton = (uuid: string) => {
    if (!todos) return;

    const todoToEdit = todos.find((todo) => todo.uuid === uuid);
    if (todoToEdit && inputElement.current) {
      setEditTodo({ ...todoToEdit });
      inputElement.current.value = todoToEdit.content;
    }
  };

  const handleDeleteButton = async (uuid: string) => {
    if (!todos) return;

    try {
      const todoToDelete = todos.find((todo) => todo.uuid === uuid);
      if (todoToDelete) {
        setRemovedTodo({ ...todoToDelete });
        await deleteTodo(uuid);

        setTodos((todos) => todos.filter((todo) => todo.uuid !== uuid));
        setRemovedTodo(null);
        toast.success("Deletion successful.");
      }
    } catch (err) {
      toast.error("Deletion failed. Please try again.");
    }
  };

  const handleCreateOrUpdate = async () => {
    if (editTodo && inputElement.current) {
      const updatedTodo = { ...editTodo, content: inputElement.current.value };
      try {
        await updateTodo(editTodo.uuid, inputElement.current.value);
        toast.success("Update successful.");
        setTodos((todos) => [...todos.filter((todo) => todo.uuid !== updatedTodo.uuid), updatedTodo]);
        setEditTodo(null);
        if (inputElement.current) {
          inputElement.current.value = "";
        }
      } catch (err) {
        toast.error("Update failed. Please try again.");
      }
    } else if (inputElement.current) {
      try {
        const res = await createTodo(inputElement.current.value);
        const { todo } = res.data;
        setTodos((todos) => [...todos, todo]);
        toast.success("Creation successful.");
      } catch (err) {
        toast.error("Creation failed. Please try again.");
      }
    }
  };

  const handleEditCancel = async () => {
    setEditTodo(null);
    if (inputElement.current) {
      inputElement.current.value = "";
    }
  };

  const todosToRender = removedTodo ? todos?.filter((todo) => todo.uuid !== removedTodo.uuid) ?? [] : todos ?? [];

  return (
    <div className={styles.todos}>
      <h2>Todos</h2>
      {user !== null && (
        <div className={styles["todos-container"]}>
          {todosToRender.map((todo) => (
            <Todo
              key={todo.uuid}
              todo={todo}
              onEdit={() => handleEditButton(todo.uuid)}
              onDelete={() => handleDeleteButton(todo.uuid)}
            />
          ))}
          <div className={styles["input-container"]}>
            <div className={styles.input}>
              <input ref={inputElement}></input>
            </div>
            <Button text={!editTodo ? "CREATE" : "UPDATE"} isSecondary={true} onClick={handleCreateOrUpdate} />
            <Button text="CANCEL" isSecondary={true} onClick={handleEditCancel} isDisabled={!editTodo} />
          </div>
        </div>
      )}
      {user === null && <p>Please login to check out your todos</p>}
    </div>
  );
};

export default Todos;
