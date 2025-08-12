import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/userService";
import Form from "../../components/form/form";

import styles from "./register.module.css";

const Register = () => {
  const navigate = useNavigate();

  const handleRegisteration = async (email: string, password: string) => {
    try {
      const res = await register(email, password);
      const { message } = res.data;
      toast.success(message);
      navigate("/login");
    } catch (err) {
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className={styles.register}>
      <h2>Register</h2>
      <Form submitButtonText="Register" onSubmit={handleRegisteration} />
    </div>
  );
};

export default Register;
