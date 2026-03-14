"use client";

// we have designed the backend, now we need to design the frontend so that there's a page when the user clicks on that link

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function VerifyEmailPage() {
  // when do we want to fetch the props in the VerifyEmailPage in nextjs? is there even a need to since we don't construct our components from scratch like in react? like writing the component like <VerifyEmailPage />
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  const verifyUserEmail = async () => {
    try {
      await axios.post("/api/users/verifyemail", { token });
      setVerified(true);
    } catch (error: any) {
      setError(true);
      console.log(error.response.data);
    }
  };

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || ""); // we also want to add this url to the middleware in case the user just visits "/verifyemail"
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token]); // this code will not run until the first useEffect runs which updates the token.

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl">Verify Email</h1>
      <h2 className="p-2 bg-orange-500 text-white">
        {token ? `${token}` : "No token found"}
      </h2>
      {verified && (
        <div>
          <h2 className="text-2xl">Email Verified</h2>
          <Link href="/login">Login</Link>
        </div>
      )}
      {error && (
        <div>
          <h2 className="text-2xl">Error</h2>
        </div>
      )}
    </div>
  );
}
