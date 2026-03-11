"use client"; // this decorator now denotes this is a CLIENT component. we can use useEffect, useState etc.

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // this is the router to redirect users to home page once they sign up!
import { axios } from "axios";

export default function LoginPage() {
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const onLogin = async () => {};

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Login</h1>
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
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
      >
        Login here
      </button>
      <Link href="/signup">Visit sign up page</Link>
    </div>
  );
}
