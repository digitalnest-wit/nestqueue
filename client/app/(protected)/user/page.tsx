"use client"
import OtherUser from "@/components/userinfo/OtherUser";
import { useEffect, useState } from "react";
import Profile from "@/components/userinfo/Profile";

export default function UserPage() {

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
        .then((json) => setData(json));
    }, []);
    if (!data) {
        return <div>Loading...</div>;
    }
    

    return (
        <main className="py-0 px-0 flex flex-col h-100vh xl:flex-row md:px-30  sm:py-40 sm:px-20">
            
            <Profile name={data.name} role={data.role} title={data.title} location={data.location} phone={data.phone} email={data.email} bio={data.bio} avatar={data.avatar}/>
            {/* Other Profiles */}
            <section className="w-full text-black flex flex-col">
                <div className="text-white text-1xl flex flex-col justify-end items-center">
                    Related People
                </div>
                <div className="flex flex-col items-center justify-center">
                    <OtherUser name={data.related[0].name} title={data.related[0].title} location={data.related[0].location} avatar={data.related[0].avatar} link={data.related[0].link} />
                    <OtherUser name={data.related[1].name} title={data.related[1].title} location={data.related[1].location} avatar={data.related[1].avatar} link={data.related[1].link} />
                    <OtherUser name={data.related[2].name} title={data.related[2].title} location={data.related[2].location} avatar={data.related[2].avatar} link={data.related[2].link} />
                </div>
            </section>
        </main>
);
}