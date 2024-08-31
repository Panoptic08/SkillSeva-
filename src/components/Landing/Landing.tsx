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
          <h1 className="text-[64px] font-semibold max-w-[25ch]">
            Building India's Freelance Future Together!
          </h1>
          <p className="text-xl text-gray-500 max-w-[60ch]">
          Skills are the driving force. You can even have small jobs. Right here. Transform talent into triumph. Register and earn.  
          </p>
          {isLoaded && isSignedIn && (
            <Link
              className={buttonVariants({ variant: "default" })}
              href="/dashboard"
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
