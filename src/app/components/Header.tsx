"use client";

export default function Header() {
  return (
    <header className="flex items-center p-5 bg-black">
      <h1 className="text-white text-xl">NestQueue</h1>
      <nav className="text-white ml-8 mr-auto">
        <ul className="flex gap-8">
          <li id="nav-tickets">Tickets</li>
          <li id="nav-analytics">Analytics</li>
        </ul>
      </nav>
    </header>
  );
}
