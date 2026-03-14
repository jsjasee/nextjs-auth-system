"use client";
import axios from "axios";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState("");

  const logout = async () => {
    try {
      const response = await axios.get("/api/users/logout");
      toast.success(`Logout successful! ${response.data.message}`);

      // push user back to the login page
      router.push("/login");
    } catch (error: any) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  const getUserDetails = async () => {
    const res = await axios.get("/api/users/me");

    console.log(res.data);
    setData(res.data.matchedUser._id);
  };

  // instead of a button to getUserDetails, we can use a useEffect hook instead as well so when the page loads, the user details are loaded.

  return (
    // we can dynamically inject a link component in the h2 to redirect user to the profile link.
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile</h1>
      <hr />
      <p>Profile page</p>
      <h2>
        {data === "" ? (
          "Nothing"
        ) : (
          <Link href={`/profile/${data}`}>{data}</Link>
        )}
      </h2>
      <hr />
      <button
        onClick={logout}
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
      >
        Logout
      </button>

      <button
        onClick={getUserDetails}
        className="bg-purple-500 mt-4 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
      >
        Get user details
      </button>
    </div>
  );
}
// this file is for the route "/profile" only.
