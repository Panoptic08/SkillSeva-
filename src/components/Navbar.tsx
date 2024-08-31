import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-[#F2F1E8] w-screen h-[80px] flex flex-row items-center justify-between px-24">
      <Link href="/" className="text-2xl font-bold">Skill<span className="text-green-700">Seva.</span></Link>
      <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  );
}
