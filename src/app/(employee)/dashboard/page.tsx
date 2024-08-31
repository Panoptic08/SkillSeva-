"use client";

import React, { useEffect, useState } from "react";
import {
  Home,
  Search,
  Bell,
  Mail,
  Edit,
  Users,
  Verified,
  User,
  MoreHorizontal,
  MapPin
} from "lucide-react";

import { supabaseClient } from "@/lib/supabase";
import { useAuth } from "@clerk/nextjs";

function Page() {
  const { getToken, userId } = useAuth();
  const [jobs, setJobs] = useState<any>();

  async function getJobs() {
    const token = await getToken({ template: "supabase" });
    console.log(token);
    const supabase = await supabaseClient(token);
    let { data: jobs, error } = await supabase.from("jobs").select("*");

    console.log(supabase);
    if (error) {
      console.log(error);
    } else {
      setJobs(jobs);
    }
  }

  useEffect(() => {
    getJobs();
  }, []);

  return (
    <div className="flex h-screen bg-[#F2F1E8] text-black px-20">
      {/* Sidebar (Navbar) */}
      <aside className="flex flex-col items-start gap-4 py-5 w-1/5 bg-[#F2F1E8] text-black">
        <nav className="mt-10">
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-lg cursor-pointer hover:text-blue-400">
              <Home className="w-6 h-6" />
              Home
            </li>
            <li className="flex items-center gap-3 text-lg cursor-pointer hover:text-blue-400">
              <Search className="w-6 h-6" />
              Explore
            </li>
            <li className="flex items-center gap-3 text-lg cursor-pointer hover:text-blue-400">
              <Bell className="w-6 h-6" />
              Notifications
              <span className="ml-2 text-sm text-blue-400 bg-blue-800 rounded-full px-2 py-0.5">
                4
              </span>
            </li>
            <li className="flex items-center gap-3 text-lg cursor-pointer hover:text-blue-400">
              <Mail className="w-6 h-6" />
              Messages
            </li>
            <li className="flex items-center gap-3 text-lg cursor-pointer hover:text-blue-400">
              <Users className="w-6 h-6" />
              Communities
            </li>
            <li className="flex items-center gap-3 text-lg cursor-pointer hover:text-blue-400">
              <User className="w-6 h-6" />
              Profile
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className=" flex-grow py-5 max-h-screen overflow-y-auto">
        <section className="flex flex-col gap-5 w-full">
          {jobs &&
            jobs.length !== 0 &&
            jobs.map((job) => (
              <div className="max-w-[60ch] flex flex-col gap-3">
                <h2 className="text-2xl font-bold">{job.title}</h2>
                <p className="text-sm text-gray-700">{job.description}</p>
                <p>Budget: ₹{job.budget}</p>
                <p>Skills Required: {job.skills.join(", ")}</p>
                <div className="flex flex-row gap-1 items-center"><MapPin size={20}/>: {job.location ? `${job.location.name}, ${job.location.stateCode}, ${job.location.countryCode}` : "Remote"}</div>
              </div>
            ))}
          {jobs &&
            jobs.length !== 0 &&
            jobs.map((job) => (
              <div className="max-w-[60ch] flex flex-col gap-3">
                <h2 className="text-2xl font-bold">{job.title}</h2>
                <p className="text-sm text-gray-700">{job.description}</p>
                <p>Budget: ₹{job.budget}</p>
                <p>Skills Required: {job.skills.join(", ")}</p>
              </div>
            ))}
          {jobs &&
            jobs.length !== 0 &&
            jobs.map((job) => (
              <div className="max-w-[60ch] flex flex-col gap-3">
                <h2 className="text-2xl font-bold">{job.title}</h2>
                <p className="text-sm text-gray-700">{job.description}</p>
                <p>Budget: ₹{job.budget}</p>
                <p>Skills Required: {job.skills.join(", ")}</p>
              </div>
            ))}
        </section>
      </main>

      {/* Categories Section */}
      <aside className="flex flex-col gap-5 p-5 bg-[#F2F1E8] w-1/5">
        <h2 className="mb-2 text-xl">Categories</h2>
        <input
          className="px-4 py-2 transition bg-gray-700 rounded cursor-pointer hover:bg-gray-600"
          placeholder="Search"
        />
      </aside>
    </div>
  );
}

export default Page;
