"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/hooks/use-auth";

import OtherUser from "@/components/userinfo/OtherUser";
import Profile from "@/components/userinfo/Profile";

export default function UserPage() {
  const { user } = useAuth();
  
  type RelatedUser = {
    name: string;
    title: string;
    location: string;
    avatar: string;
    link: string;
  };

  type UserData = {
    name: string;
    role: string;
    title: string;
    location: string;
    phone: string;
    email: string;
    bio: string;
    avatar: string;
    related: RelatedUser[];
  };

  const [data, setData] = useState<UserData | null>(null);

  useEffect(() => {
    fetch("/dummy-data.json")
      .then((res) => res.json())
      .then((json) => {
        // Merge dummy data with authenticated user info
        const userData = {
          ...json,
          name: user?.displayName || user?.email || json.name,
          email: user?.email || json.email,
          avatar: user?.photoURL || json.avatar,
          role: json.role || "Member",
        };
        setData(userData);
      });
  }, [user]);

  if (!data || !user) {
    return <div>Loading...</div>;
  }

  return (
    <main className="py-0 px-0 flex flex-col h-100vh xl:flex-row md:px-30  sm:py-40 sm:px-20">
      <Profile
        name={data.name}
        role={data.role}
        title={data.title}
        location={data.location}
        phone={data.phone}
        email={data.email}
        bio={data.bio}
        avatar={data.avatar}
      />

      <section className="w-full text-black flex flex-col">
        <div className="text-white text-1xl flex flex-col justify-end items-center">
          Related People
        </div>
        <div className="flex flex-col items-center justify-center">
          {data.related.map((user) => (
            <OtherUser
              key={[user.name, user.title, user.link].join("$")}
              name={user.name}
              title={user.title}
              location={user.location}
              avatar={user.avatar}
              link={user.link}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
