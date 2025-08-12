import http from "./httpService";
import config from "../config.json";

export function getTodos() {
  return http.get(config.todoApi);
}

export function createTodo(content: string) {
  return http.post(config.todoApi, { content });
}

export function updateTodo(uuid: string, content: string) {
  return http.patch(config.todoApi, { uuid, content });
}

export function deleteTodo(uuid: string) {
  return http.delete(config.todoApi, { data: { uuid } });
}

export default {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
};
