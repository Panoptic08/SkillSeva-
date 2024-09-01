"use client";

import { supabaseClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useAuth, useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function OnboardingPage() {
  const router = useRouter();
  const { getToken, userId } = useAuth();
  const { user } = useUser();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const token = await getToken({ template: "supabase" });
      if (!token || !userId) {
        setChecking(false);
        return;
      }

      const supabase = await supabaseClient(token);

      // Check employee table
      const { data: employeeData } = await supabase
        .from("employee")
        .select("user_id")
        .eq("user_id", userId)
        .single();

      if (employeeData) {
        router.push("/dashboard");
        return;
      }

      // Check employer table
      const { data: employerData } = await supabase
        .from("employer")
        .select("user_id")
        .eq("user_id", userId)
        .single();

      if (employerData) {
        router.push("/dashboard-employer");
        return;
      }

      // If not found in either table
      setIsOnboarded(false);
      setChecking(false);
    };

    checkOnboardingStatus();
  }, [getToken, userId, router]);

  const handleEmployerClick = async () => {
    setLoading(true);
    const token = await getToken({ template: "supabase" });
    const supabase = await supabaseClient(token!);
    const { data, error } = await supabase
      .from("employer")
      .insert([{ email: user?.emailAddresses[0].emailAddress, user_id: userId }])
      .select();
    if (data) {
      setLoading(false);
      router.push("/dashboard-employer");
    } else {
      setLoading(false);
      toast({
        title: "Something went wrong, please try again",
        description: error?.message,
        variant: "destructive",
      });
    }
  };

  if (checking) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        Checking...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Choose Your Role</h1>
      <div className="flex gap-8">
        <Link
          href="/employee-form"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          I'm an Employee
        </Link>
        <button
          disabled={loading}
          onClick={handleEmployerClick}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          {loading ? "Loading..." : "I'm an Employer"}
        </button>
      </div>
    </div>
  );
}
