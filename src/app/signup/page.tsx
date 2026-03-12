"use client"; // this decorator now denotes this is a CLIENT component. we can use useEffect, useState etc.

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // this is the router to redirect users to home page once they sign up!
import axios from "axios";
import toast from "react-hot-toast";

export default function SignupPage() {
  const router = useRouter();

  const [user, setUser] = React.useState({
    email: "",
    password: "",
    username: "",
  });

  const [buttonDisabled, setButtonDisabled] = React.useState(true);

  const [loading, setLoading] = React.useState(false);
  const onSignup = async () => {
    try {
      setLoading(true);
      // make a request - make sure url is accurate. axios is used to make requests to our backend!
      const response = await axios.post("/api/users/signup", user);

      console.log("signup success", response.data);
      toast.success("Signup successful");
      setTimeout(() => {
        router.push("/login"); // this is to redirect the user to a new page! we wait a bit then redirect so user can see the message.
      }, 1500);
    } catch (error: any) {
      console.log("sign up failed", error.message); // note: any errors in the client side, aka "use client" at the top, appears in browser, the console. for backend side aka the api, it appears in the console!

      toast.error(error.message);
    } finally {
      setLoading(false); // no matter what happens, loading has to go away.
    }
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]); // the button being active or disabled depends on the user

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{loading ? "Processing sign up" : "Signup"}</h1>
      <hr />
      <label htmlFor="username">username</label>
      <input
        className="p-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 bg-white text-black"
        type="text"
        id="username"
        value={user.username}
        onChange={(event) => setUser({ ...user, username: event.target.value })}
        placeholder="username"
      />
      <label htmlFor="email">email</label>
      <input
        className="p-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 bg-white text-black"
        type="text"
        id="email"
        value={user.email}
        onChange={(event) => setUser({ ...user, email: event.target.value })}
        placeholder="email"
      />
      <label htmlFor="password">password</label>
      <input
        className="p-2 border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 bg-white text-black"
        type="password"
        id="password"
        value={user.password}
        onChange={(event) => setUser({ ...user, password: event.target.value })}
        placeholder="password"
      />
      <button
        onClick={onSignup}
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 cursor-pointer"
        disabled={buttonDisabled}
      >
        {buttonDisabled ? "No signup" : "Signup here"}
      </button>
      <Link href="/login">Visit login page</Link>
    </div>
  );
}

// note the syntax for the button is { (if some condition) ? "do something" : "something else"}
