"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="mb-4 text-5xl font-bold text-red-600">404</h1>
      <p className="mb-6 text-xl">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link href="/" className="text-blue-500 underline hover:text-blue-700">
        Go back home
      </Link>
    </div>
  );
}
