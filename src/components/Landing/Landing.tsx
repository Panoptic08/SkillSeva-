"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { buttonVariants } from "@/components/ui/button";
import Image from "next/image";
import logo3 from "@/resources/logo3.png";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const { isLoaded, isSignedIn } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <main className="w-full flex flex-col items-center justify-center bg-[#F2F1E8] scroll-smooth">
      {/* Hero Section */}
      <section
        id="home"
        className="h-[calc(100vh-80px)] flex flex-col items-center justify-center px-8 bg-[#F2F1E8]"
      >
        <div className="flex flex-col items-center justify-center gap-4 text-center mt-16">
          {/* Logo Image */}
          <Image
            src={logo3}
            alt="SkillSeva Logo"
            width={120}
            height={120}
            className="mb-6"
          />

          {/* Heading */}
          <h1 className="text-2xl font-semibold max-w-[25ch]">
            Empowering India&apos;s Freelancers for a Brighter Future!
          </h1>

          {/* Conditional Buttons */}
          {isLoaded && isSignedIn && (
            <div className="mt-6">
              <Link
                className={buttonVariants({ variant: "default" })}
                href="/onboarding"
              >
                Get Started
              </Link>
            </div>
          )}
          {isLoaded && !isSignedIn && (
            <div className="mt-6">
              <Link
                className={buttonVariants({ variant: "default" })}
                href="/sign-in"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="h-screen flex flex-col items-center justify-center px-8 bg-white py-20"
      >
        <h2 className="text-4xl font-bold mb-10 text-gray-800">How It Works</h2>
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-20">
          {[
            "Create Your Profile",
            "Browse Jobs",
            "Submit Proposals",
            "Get Paid",
          ].map((step, index) => (
            <div
              key={index}
              className="max-w-[30ch] p-6 bg-gray-100 rounded-lg shadow-md text-center"
            >
              <h3 className="text-xl font-semibold">{step}</h3>
              <p className="text-gray-600 mt-2">
                {`Step ${
                  index + 1
                }: ${step} easily on SkillSeva. Our platform guides you through the process smoothly.`}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="h-screen flex flex-col items-center justify-center px-8 bg-[#F2F1E8] py-20"
      >
        <h2 className="text-4xl font-bold mb-6 text-gray-800">About Us</h2>
        <p className="text-xl text-gray-700 max-w-[60ch] text-center">
          Welcome to SkillSeva India&apos;s premier freelancing platform dedicated to
          connecting talented freelancers with businesses and entrepreneurs also
          with the aim to provide small jobs to the ones who have talent and skills
          but not work to do. We are a vibrant community of professionals, from
          graphic designers to software developers, content creators to digital
          marketers, high end workers to low wage workers, all united by a shared passion for excellence and
          innovation.
        </p>
      </section>
    </main>
  );
}
