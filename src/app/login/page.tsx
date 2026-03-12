"use client"; // this decorator now denotes this is a CLIENT component. we can use useEffect, useState etc.

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // this is the router to redirect users to home page once they sign up!
import axios from "axios";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter(); // must add router to change pages.
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("Login success", response.data);
      toast.success(response.data.message);
      setTimeout(() => {
        router.push("/profile");
      }, 1500);
    } catch (error: any) {
      console.log("Login failed", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{loading ? "Processing" : "Login"}</h1>
      <hr />
      <label htmlFor="email">email</label>
      <input
        className="p-2 border-gray-300 rounded-lg mb-4 focus:online-none focus:border-gray-600 bg-white text-black"
        type="text"
        id="email"
        value={user.email}
        onChange={(event) => setUser({ ...user, email: event.target.value })}
        placeholder="email"
      />
      <label htmlFor="password">password</label>
      <input
        className="p-2 border-gray-300 rounded-lg mb-4 focus:online-none focus:border-gray-600 bg-white text-black"
        type="password"
        id="password"
        value={user.password}
        onChange={(event) => setUser({ ...user, password: event.target.value })}
        placeholder="password"
      />
      <button
        onClick={onLogin}
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 cursor-pointer"
        disabled={buttonDisabled}
      >
        Login here
      </button>
      <Link href="/signup">Visit sign up page</Link>
    </div>
  );
}
