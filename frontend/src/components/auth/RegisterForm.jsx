import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerStudent } from "../../services/api";

import {
  FaUser,
  FaEnvelope,
  FaIdCard,
  FaGraduationCap,
  FaLock,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";

const RegisterForm = () => {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    registration_number: "",
    degree_programme: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const handleChange = (e) => {

    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.full_name.trim() ||
      !formData.email.trim() ||
      !formData.registration_number.trim() ||
      !formData.degree_programme.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {

      setError("Please fill in all fields.");

      return;

    }

    if (formData.full_name.trim().length < 3) {

  setError("Full name must contain at least 3 characters.");

  return;

}

if (formData.registration_number.trim().length < 5) {

  setError("Please enter a valid registration number.");

  return;

}

if (formData.degree_programme.trim().length < 3) {

  setError("Please enter your degree programme.");

  return;

}

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {

      setError("Please enter a valid email address.");

      return;

    }

    if (formData.password.length < 8) {

      setError("Password must contain at least 8 characters.");

      return;

    }

    if (formData.password !== formData.confirmPassword) {

      setError("Passwords do not match.");

      return;

    }

    if (!formData.terms) {

      setError("Please accept the Terms and Conditions.");

      return;

    }

    setLoading(true);

    try {

      const response = await registerStudent({

        full_name: formData.full_name,

        email: formData.email,

        registration_number: formData.registration_number,

        degree_programme: formData.degree_programme,

        password: formData.password,

      });

      if (response.status === 201) {

        setSuccess(
          "Registration successful! Redirecting to Login..."
        );

        setTimeout(() => {

          navigate("/login");

        }, 1500);

      } else {

        setError(
          response.data.detail ||
          response.data.message ||
          "Registration failed."
        );

      }

    } catch (err) {

      setError("Unable to connect to the server.");

    } finally {

   setLoading(false);

}
};

  return (

    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >

          {/* Success Message */}

      {success && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl p-3 text-sm">
          {success}
        </div>
      )}

      {/* Error Message */}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-3 text-sm">
          {error}
        </div>
      )}

      {/* Full Name */}

      <div>

        <label className="block text-sm text-gray-300 mb-2">
          Full Name
        </label>

        <div className="relative">

          <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="e.g. B.A. Pinsara"
            className="w-full bg-[#111827] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-500 outline-none focus:border-blue-500 transition"
          />

        </div>

      </div>

      {/* Email */}

      <div>

        <label className="block text-sm text-gray-300 mb-2">
          University Email
        </label>

        <div className="relative">

          <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@university.edu"
            className="w-full bg-[#111827] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-500 outline-none focus:border-blue-500 transition"
          />

        </div>

      </div>

      {/* Registration Number */}

      <div>

        <label className="block text-sm text-gray-300 mb-2">
          Student Registration Number
        </label>

        <div className="relative">

          <FaIdCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

          <input
            type="text"
            name="registration_number"
            value={formData.registration_number}
            onChange={handleChange}
            placeholder="IT20234567"
            className="w-full bg-[#111827] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-500 outline-none focus:border-blue-500 transition"
          />

        </div>

      </div>

      {/* Degree */}

      <div>

        <label className="block text-sm text-gray-300 mb-2">
          Degree Programme
        </label>

        <div className="relative">

          <FaGraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

          <input
            type="text"
            name="degree_programme"
            value={formData.degree_programme}
            onChange={handleChange}
            placeholder="BSc (Hons) Information Technology"
            className="w-full bg-[#111827] border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-gray-500 outline-none focus:border-blue-500 transition"
          />

        </div>

      </div>

      {/* Password */}

      <div>

        <label className="block text-sm text-gray-300 mb-2">
          Password
        </label>

        <div className="relative">

          <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Minimum 8 characters"
            className="w-full bg-[#111827] border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white placeholder:text-gray-500 outline-none focus:border-blue-500 transition"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-400"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>

        </div>

      </div>

      {/* Confirm Password */}

      <div>

        <label className="block text-sm text-gray-300 mb-2">
          Confirm Password
        </label>

        <div className="relative">

          <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />

          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter password"
            className="w-full bg-[#111827] border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white placeholder:text-gray-500 outline-none focus:border-blue-500 transition"
          />

          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-400"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>

        </div>

      </div>

      {/* Terms */}

      <label className="flex items-center gap-2 text-gray-400 text-sm">

        <input
          type="checkbox"
          name="terms"
          checked={formData.terms}
          onChange={handleChange}
          className="accent-blue-600"
        />

        I agree to the Terms & Conditions

      </label>

      {/* Button */}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-lg hover:scale-[1.02] transition-all duration-300 shadow-xl disabled:opacity-50"
      >
        {loading ? "Creating Account..." : "Create Account"}
      </button>

      {/* Divider */}

      <div className="flex items-center gap-4">

        <div className="flex-1 h-px bg-white/10"></div>

        <span className="text-gray-500 text-sm">
          OR
        </span>

        <div className="flex-1 h-px bg-white/10"></div>

      </div>

      {/* Login */}

      <p className="text-center text-gray-400">

        Already have an account?

        <Link
          to="/login"
          className="text-blue-400 ml-2 hover:text-blue-300"
        >
          Login
        </Link>

      </p>
          </form>

  );

};

export default RegisterForm;