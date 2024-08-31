"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { buttonVariants } from "@/components/ui/button";

export default function Landing() {
  const { isLoaded, isSignedIn } = useUser();
  return (
      <main className="w-screen min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-24 bg-[#F2F1E8]">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-[64px] font-semibold">
            India's Freelance Future Together!
          </h1>
          <p className="text-xl text-gray-500">
            India's Freelance Future Together!
          </p>
          {isLoaded && isSignedIn && (
            <Link
              className={buttonVariants({ variant: "default" })}
              href="/get-work"
            >
              Get Work
            </Link>
          )}
          {isLoaded && !isSignedIn && (
            <Link
              className={buttonVariants({ variant: "default" })}
              href="/sign-in"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
