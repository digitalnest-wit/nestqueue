"use client";

import Image from "next/image";

interface OtherUserProps {
  name: string;
  title: string;
  location: string;
  avatar?: string;
  link: string;
}

export default function OtherUser({
  name,
  title,
  location,
  avatar,
  link,
}: OtherUserProps) {
  return (
    <article className="hover:shadow-emerald-400 shadow-2xl cursor-pointer drop-shadow-1xl bg-white w-100  rounded-2xl p-5 my-2 sm:my-5 flex flex-row items-center">
      <Image
        className="rounded-full mr-4 cursor-pointer"
        width={75}
        height={75}
        src={avatar || "/default-avatar.png"}
        alt={`${name}'s profile picture`}
      />
      <div className="block">
        <h1 className="-my-1 font-bold text-lg">{name}</h1>
        <h2 className="-my-1 text-base text-sky-800">{title}</h2>
        <h2 className="-my-1 text-base">{location}</h2>
        {/* <h2 className="m-0">{link}</h2> */}
      </div>
    </article>
  );
}
