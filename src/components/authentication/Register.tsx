import React, { useState, FormEvent, ChangeEvent, useContext } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const Register: React.FC = () => {
  const { register, authError } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { success } = await register(formData);
    if (success) {
      navigate("/");
      const toastId = "registration-success";
      toast.dismiss(toastId);
      toast.success("You have successfully registered.", {
        toastId,
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 bg-vault-bg bg-no-repeat bg-cover">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <input
          type="text"
          placeholder="First Name"
          name="first_name"
          value={formData?.first_name}
          onChange={handleChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="text"
          placeholder="Last Name"
          name="last_name"
          value={formData?.last_name}
          onChange={handleChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
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
          type="email"
          placeholder="Email"
          value={formData?.email}
          required
          name="email"
          onChange={handleChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <input
          type="password"
          name="password"
          required
          placeholder="Password"
          value={formData?.password}
          onChange={handleChange}
          className="mb-4 p-2 border border-gray-300 rounded w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded w-full"
        >
          Register
        </button>
        {authError && (
          <p data-testid="error" className="mt-4 text-center text-red-500">
            {authError}
          </p>
        )}
        <p className="mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
