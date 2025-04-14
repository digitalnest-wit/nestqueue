"use client";

import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

import NotFound from "../../components/NotFound";
import { tickets } from "../../mock/tickets";
import Header from "@/app/components/Header";

export default function TicketDetail() {
  const params = useParams();
  const router = useRouter();

  const { id } = params;
  const ticket = tickets.find((ticket) => ticket.id === id);
  if (!ticket) {
    return <NotFound message={`Couldn't find a ticket matching ID '${id}'.`} />;
  }

  return (
    <>
      <Header />
      <div>
        <button onClick={router.back}>&lt;- Back</button>
        <h1>ID: {ticket.id}</h1>
        <h1>Status: {ticket.status}</h1>
      </div>
    </>
  );
}
