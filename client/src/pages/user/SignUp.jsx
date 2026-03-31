import { useState } from "react";
import styles from "../../index";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../../components/OAuth";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// validation
const schema = z.object({
  username: z.string().min(3, { message: "minimum 3 characters required" }),
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(4, { message: "minimum 4 characters required" }),
});

function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      setLoading(false);

      if (!res.ok) {
        setError(true);
        console.log(data);
        return;
      }

      setError(false);
      alert("Signup successful ✅");
      navigate("/signin");
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div className="pb-10 max-w-lg mx-auto mt-16 shadow-2xl rounded-lg">
      <div className="bg-green-500 px-6 py-2 flex justify-between items-center">
        <h1 className="text-2xl text-white">Sign Up</h1>
        <Link to="/">X</Link>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-5 p-5"
      >
        <input
          type="text"
          placeholder="Username"
          {...register("username")}
          className="p-3 bg-gray-100"
        />
        {errors.username && <p>{errors.username.message}</p>}

        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="p-3 bg-gray-100"
        />
        {errors.email && <p>{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Password"
          {...register("password")}
          className="p-3 bg-gray-100"
        />
        {errors.password && <p>{errors.password.message}</p>}

        <button disabled={isLoading} className="bg-green-500 text-white p-3">
          {isLoading ? "Loading..." : "Register"}
        </button>

        {isError && <p className="text-red-500">Something went wrong</p>}
      </form>

      <OAuth />
    </div>
  );
}

export default SignUp;