"use client";
import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/context/auth";

interface ProfileProps {
  name: string;
  role: string;
  title: string;
  location: string;
  phone: string;
  email: string;
  bio: string;
  avatar: string;
}

export default function Profile({
  name,
  role,
  title,
  location,
  phone,
  email,
  bio,
  avatar,
}: ProfileProps) {
  const [bioValue, setBioValue] = useState(bio);
  const [editMode, setEditMode] = useState(false);
  const { user } = useAuth();

  const handleLogout = async () => {
    window.location.href = "/";
  };

  const handleEdit = () => setEditMode(true);
  const handleSave = () => setEditMode(false);

  return (
    <section className="px-0 flex flex-col items-center sm:px-20">
      <div className="z-1 drop-shadow-lg bg-white w-full text-black rounded-2xl py-30 px-10 flex flex-col items-center">
        {!editMode ? (
          <div id="profileCurrent" className="flex flex-col items-center">
            <Image
              onClick={handleLogout}
              className="drop-shadow-sm rounded-full cursor-pointer"
              width={100}
              height={100}
              src={user?.photoURL || "/default-profile-pic.jpg"}
              alt=""
            />
            <h1 className="my-2 text-xl">{name}</h1>
            <h2 className="text-l drop-shadow-md bg-amber-400 w-auto rounded-3xl px-3">
              {role}
            </h2>
            <h2 className="mt-2 mb-8 text-l text-sky-800">{title}</h2>
            <h2 className="text-base">📍 {location}</h2>
            <div className="flex flex-row">
              <h2 className="text-base mx-1 text-neutral-500 cursor-pointer hover:text-emerald-500 underline">
                {phone}
              </h2>
              <h2 className="text-base mx-1 text-neutral-500 cursor-pointer hover:text-emerald-500 underline">
                {email}
              </h2>
            </div>
            <h2 className="w-full text-base">{bioValue}</h2>
            <button
              onClick={handleEdit}
              className="bg-green text-base z-10 rounded-full text-black mx-1 my-4 px-3 py-1 cursor-pointer"
            >
              Edit profile
            </button>
          </div>
        ) : (
          <form
            className="flex flex-col items-center self-center w-full"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <Image
              onClick={handleLogout}
              className="drop-shadow-sm rounded-full cursor-pointer"
              width={100}
              height={100}
              src={user?.photoURL || "/default-profile-pic.jpg"}
              alt=""
            />
            <button
              className="p-2 cursor-pointer shadow-md bg-white shadow-gray-500 rounded-xl text-center hover:underline"
              type="button"
            >
              change photo
            </button>
            <h1 className="my-2 text-xl">{name}</h1>
            <h2 className="text-l drop-shadow-md bg-amber-400 w-auto rounded-3xl px-3">
              {role}
            </h2>
            <h2 className="mt-2 mb-8 text-l text-sky-800">{title}</h2>
            <label>Location</label>
            <input
              type="text"
              defaultValue={location}
              className="mx-1 border-1 rounded-md text-base mb-2"
            />
            <fieldset className="flex flex-row mb-2 w-full">
              <div className="flex flex-col w-1/2">
                <label htmlFor="phone">Phone #</label>
                <input
                  className="mx-1 border-1 rounded-md"
                  id="phone"
                  name="phoneNum"
                  type="tel"
                  defaultValue={phone}
                />
              </div>
              <div className="flex flex-col w-1/2">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  className="mx-1 border-1 rounded-md"
                  type="email"
                  defaultValue={email}
                />
              </div>
            </fieldset>
            <label>Bio</label>
            <textarea
              name="bio"
              className="resize-y w-full field-sizing-content text-wrap mx-1 border-1 rounded-md text-base mb-2"
              value={bioValue}
              onChange={(e) => setBioValue(e.target.value)}
            ></textarea>
            <button
              type="submit"
              className="bg-emerald-300 text-base z-10 rounded-full text-black mx-1 my-4 px-3 py-1 cursor-pointer"
            >
              Save
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
