import { useEffect, useState } from "react";
import { Link, RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import Button from "./components/button/button";
import auth, { logout } from "./services/userService";
import Todos from "./pages/todos/todos";
import Register from "./pages/register/register";
import Login from "./pages/login/login";

import styles from "./App.module.css";

function App() {
  const [user, setUser] = useState<{ uuid: string; user_email: string } | null>(null);

  useEffect(() => {
    const user = auth.getCurrentUser();
    setUser(user);
  }, []);

  const handleLogout = () => {
    logout();
  };

  const Layout = () => (
    <>
      <nav className={styles.nav}>
        <div className={styles.left}>
          <Link to="/">Home</Link>
        </div>
        <div className={styles.right}>
          {!user ? (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </>
          ) : (
            <>
              <span>{`Logged in as ${user.user_email}`}</span>
              <Button text="Logout" onClick={handleLogout} />
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </>
  );

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Todos user={user} /> },
        {
          path: "register",
          element: <Register />,
        },
        {
          path: "login",
          element: <Login />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
