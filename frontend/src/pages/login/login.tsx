import { login } from "../../services/userService";
import Form from "../../components/form/form";

import styles from "./login.module.css";
import { toast } from "react-toastify/unstyled";

const Login = () => {
  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
    } catch (err) {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <div className={styles.login}>
      <h2>Login</h2>
      <Form submitButtonText="Login" onSubmit={handleLogin} />
    </div>
  );
};

export default Login;
