"use client";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const onForgotPassword = async (event: React.SubmitEvent) => {
    event.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/api/users/forgotpassword", {
        email,
      }); // this {email} is the request body
      console.log("Forgot Password success", response.data);
      toast.success(response.data.message);
    } catch (error: any) {
      console.log("Forgot Password failed", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (email.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [email]);

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 shadow-2xl p-8">
        <h1 className="text-2xl font-bold text-center text-white">
          Forgot Password
        </h1>

        <p className="mt-2 text-center text-sm text-gray-400">
          {loading
            ? "Processing..."
            : "Enter your email address to receive a reset link."}
        </p>

        <form onSubmit={onForgotPassword} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          <button
            // todo: set an onClick function here to check user.
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-medium text-white transition hover:bg-blue-700 active:scale-[0.99]"
            disabled={buttonDisabled}
          >
            Submit
          </button>
        </form>
      </div>
    </main>
  );
}
