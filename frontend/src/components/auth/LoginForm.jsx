import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginStudent } from "../../services/api";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const LoginForm = () => {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (!formData.email.trim() || !formData.password) {

      setError("Please fill in all fields.");

      return;

    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {

      setError("Please enter a valid email address.");

      return;

    }

    setLoading(true);

    try {

      const response = await loginStudent({

        email: formData.email,

        password: formData.password,

      });

      if (response.status === 200 && response.data.success) {

  localStorage.setItem(
    "token",
    response.data.access_token
  );

  localStorage.setItem(
    "user",
    JSON.stringify(response.data.user)
  );

  const role = response.data.user.role;

  if (role === "student") {

    navigate("/student/dashboard");

  } else if (role === "supervisor") {

    navigate("/supervisor/dashboard");

  } else {

    setError("Unknown user role.");
  }

      } else {

        setError(
          response.data.detail ||
          response.data.message ||
          "Login failed."
        );

      }

    } catch (err) {

      console.error(err);

      setError("Unable to connect to the server.");

    } finally {

      setLoading(false);

    }

  };

  return (

    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      {/* Error Message */}

      {error && (

        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 text-sm">

          {error}

        </div>

      )}

      {/* Email */}

      <div>

        <label className="block text-sm text-gray-300 mb-2">
          University Email
        </label>

        <div className="relative">

          <FaEnvelope
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@university.edu"
            className="
            w-full
            bg-[#111827]
            border
            border-white/10
            rounded-xl
            py-4
            pl-12
            pr-4
            text-white
            placeholder:text-gray-500
            outline-none
            focus:border-blue-500
            transition
            "
          />

        </div>

      </div>

      {/* Password */}

      <div>

        <label className="block text-sm text-gray-300 mb-2">
          Password
        </label>

        <div className="relative">

          <FaLock
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
          />

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="
            w-full
            bg-[#111827]
            border
            border-white/10
            rounded-xl
            py-4
            pl-12
            pr-14
            text-white
            placeholder:text-gray-500
            outline-none
            focus:border-blue-500
            transition
            "
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-gray-500
            hover:text-blue-400
            transition
            "
          >

            {showPassword ? <FaEyeSlash /> : <FaEye />}

          </button>

        </div>

      </div>

      {/* Remember Me */}

      <div className="flex items-center justify-between">

        <label className="flex items-center gap-2 text-gray-400 text-sm">

          <input
            type="checkbox"
            className="accent-blue-600"
          />

          Remember me

        </label>

        <Link
          to="/forgot-password"
          className="text-blue-400 hover:text-blue-300 text-sm"
        >
          Forgot Password?
        </Link>

      </div>

      {/* Login Button */}

      <button
        type="submit"
        disabled={loading}
        className="
        w-full
        py-4
        rounded-xl
        bg-gradient-to-r
        from-blue-600
        to-indigo-600
        text-white
        font-semibold
        text-lg
        hover:scale-[1.02]
        transition-all
        duration-300
        shadow-xl
        disabled:opacity-50
        "
      >

        {loading ? "Logging in..." : "Login"}

      </button>

      {/* Divider */}

      <div className="flex items-center gap-4">

        <div className="flex-1 h-px bg-white/10"></div>

        <span className="text-gray-500 text-sm">
          OR
        </span>

        <div className="flex-1 h-px bg-white/10"></div>

      </div>

      {/* Register */}

      <p className="text-center text-gray-400">

        Don't have an account?

        <Link
          to="/register"
          className="text-blue-400 ml-2 hover:text-blue-300"
        >
          Create Account
        </Link>

      </p>

    </form>

  );

};

export default LoginForm;