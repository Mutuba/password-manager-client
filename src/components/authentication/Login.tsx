import React, { useState, FormEvent, ChangeEvent, useContext } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Login: React.FC = () => {
  const { login, authError } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const { success } = await login(formData);
      if (success) {
        navigate("/");
        const toastId = "login-success";
        toast.dismiss(toastId);
        toast.success("You have successfully logged.", {
          toastId,
        });
      }
    } catch (error) {}
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          type="text"
          placeholder="Username"
          name="username"
          required
          value={formData?.username}
          onChange={handleChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          required
          value={formData?.password}
          onChange={handleChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded w-full"
        >
          Login
        </button>
        {authError && (
          <p data-testid="error" className="mt-4 text-center text-red-500">
            {authError}
          </p>
        )}
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-500">
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
