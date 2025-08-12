import axios from "axios";
import { toast } from "react-toastify";

axios.interceptors.response.use(null, (error) => {
  const expectedError = error.response && error.response.status >= 400 && error.response.status < 500;

  if (!expectedError) {
    toast("Something unexpected happened!");
  }
  return Promise.reject(error);
});

export function setJwt(jwt: string | null) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${jwt}`;
}

export default {
  get: axios.get,
  post: axios.post,
  patch: axios.patch,
  delete: axios.delete,
  setJwt,
};
