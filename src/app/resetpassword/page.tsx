"use client";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");

  const router = useRouter();

  const onResetPassword = async (event: React.SubmitEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/users/resetpassword", {
        password,
        confirmPassword,
        token,
      });
      console.log("Reset Password success", response.data);
      toast.success(response.data.message);
      router.push("/login");
    } catch (error: any) {
      console.log("Reset Password failed", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1]; // i guess this can only be ran in a useEffect function when the website fully loaded otherwise window is undefined??
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (password === confirmPassword) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [password, confirmPassword]);

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl p-8">
        <h1 className="text-2xl font-bold text-center text-white">
          Reset Password
        </h1>

        <p className="mt-2 text-center text-sm text-gray-400">
          {loading ? "Processing..." : "Enter your new password below"}
        </p>
        <p className="mt-2 text-center text-sm text-red-500">
          {buttonDisabled ? "Passwords do not match!" : ""}
        </p>

        <form onSubmit={onResetPassword} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              New Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter new password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Confirm Password
            </label>

            <input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <button
            type="submit"
            disabled={buttonDisabled}
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 active:scale-[0.99]"
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}
