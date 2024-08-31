import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
export default function Navbar() {
  return (
    <nav className="bg-[#F2F1E8] w-screen h-[80px] flex flex-row items-center justify-between px-24">
      <h1>Logo</h1>
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
