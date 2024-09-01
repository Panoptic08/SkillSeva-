"use client";

import { useToast } from '@/hooks/use-toast';
import React, { useEffect, useState } from "react";
import {
  Home,
  Search,
  User,
  MapPin
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { supabaseClient } from "@/lib/supabase";
import { useAuth } from "@clerk/nextjs";
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface Job {
  uuid: string;
  title: string;
  description: string;
  budget: number;
  skills: string[];
  location?: {
    name: string;
    stateCode: string;
    countryCode: string;
  };
  proposal?: Array<{
    user_id: string;
    proposal: string;
    status: string | null;
  }>;
  user_id: string;
  category: string;
}

interface Proposal {
  user_id: string;
  proposal: string;
  status: string | null;
}

function Page() {
  const { getToken, userId } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [letter, setLetter] = useState<string>("");
  const [loader, setLoader] = useState<string | null>(null);
  const { toast } = useToast();
  const [userProposals, setUserProposals] = useState<Array<{job: Job, proposal: Proposal}>>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showAllJobs, setShowAllJobs] = useState(true);

  async function updateProposal(value: Job['proposal'], uuid: string) {
    const token = await getToken({ template: "supabase" });
    const supabase = await supabaseClient(token!);

    const { data, error } = await supabase
      .from('jobs')
      .update({ proposal: value })
      .eq('uuid', uuid)
      .select();

    if (error) {
      console.log(error);
    } else {
      toast({ title: "Proposal updated successfully!", variant: "success" });
      getJobs();
    }
  }

  async function getJobs() {
    const token = await getToken({ template: "supabase" });
    const supabase = await supabaseClient(token!);
    let { data: jobs, error } = await supabase.from("jobs").select("*");

    if (error) {
      console.log(error);
    } else {
      setJobs(jobs || []);
      setFilteredJobs(jobs || []);
      if (userId && jobs) {
        const userProposals = jobs.flatMap(job => 
          job.proposal?.filter((p: Proposal) => p.user_id === userId).map((p: Proposal) => ({ job, proposal: p })) || []
        );
        setUserProposals(userProposals);
      }
    }
  }

  function isUserIdPresent(job: Job) {
    return job.proposal?.some((proposal) => proposal.user_id === userId);
  }

  async function deleteData(jobUuid: string, userId: string) {
    setLoader("Deleting..."); // Show loader
    
    try {
      const token = await getToken({ template: "supabase" });
      const supabase = await supabaseClient(token!);

      // Fetch the job with the proposals
      const { data: job, error } = await supabase
        .from('jobs')
        .select('proposal')
        .eq('uuid', jobUuid)
        .single();

      if (error) throw error;

      const updatedProposals = job.proposal.filter((proposal: { user_id: string }) => proposal.user_id !== userId);

      // Update the job with the filtered proposals
      const { data, error: updateError } = await supabase
        .from('jobs')
        .update({ proposal: updatedProposals })
        .eq('uuid', jobUuid);

      if (updateError) throw updateError;

      setJobs(prevJobs => prevJobs.map(j => j.uuid === jobUuid ? { ...j, proposal: updatedProposals } : j));
      toast({ title: "Proposal deleted successfully!" });
      getJobs();

    } catch (error: any) {
      console.error("Error deleting proposal:", error);
      toast({ title: "Error deleting proposal", description: error.message });
    } finally {
      setLoader(null); // Hide loader
    }
  }

  useEffect(() => {
    getJobs();
  }, []);

  useEffect(() => {
    if (showAllJobs) {
      setFilteredJobs(jobs);
    } else if (selectedCategory) {
      setFilteredJobs(jobs.filter(job => job.category === selectedCategory));
    } else {
      setFilteredJobs([]);
    }
  }, [selectedCategory, jobs, showAllJobs]);

  return (
    <div className="flex h-screen bg-[#F2F1E8] text-black px-20">
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
              <User className="w-6 h-6" />
              Profile
            </li>
          </ul>
        </nav>
        <div className="mt-10">
          <h2 className="mb-2 text-xl">Categories</h2>
          <div className="flex items-center space-x-2 mb-2">
            <Checkbox
              id="show-all"
              checked={showAllJobs}
              onCheckedChange={(checked) => {
                setShowAllJobs(checked as boolean);
                if (checked) {
                  setSelectedCategory(null);
                }
              }}
            />
            <Label htmlFor="show-all">Show All Jobs</Label>
          </div>
          <RadioGroup
            value={selectedCategory || ""}
            onValueChange={(value) => {
              setSelectedCategory(value === selectedCategory ? null : value);
              setShowAllJobs(false);
            }}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="tech" id="tech" />
              <Label htmlFor="tech">Tech</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="non-tech" id="non-tech" />
              <Label htmlFor="non-tech">Non-Tech</Label>
            </div>
          </RadioGroup>
        </div>
      </aside>

      <main className="flex-grow py-5 max-h-screen overflow-y-auto">
        <section className="flex flex-col gap-5 w-full">
          {filteredJobs.length > 0 && filteredJobs.map((job) => (
            <div key={job.uuid} className="max-w-[60ch] flex flex-col gap-3">
              <div className="flex justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{job.title}</h2>
                </div>
                {isUserIdPresent(job) ? (
                    <Button
                      className="bg-gradient-to-r from-red-400 to-red-600 px-4 py-2 border-black text-white rounded-lg shadow-md transform transition-transform duration-700 ease-in-out hover:scale-110"
                      onClick={() => userId && deleteData(job.uuid, userId)}
                    >
                      Delete
                    </Button>
                ) : (
                  <Dialog>
                    <DialogTrigger
                      className="bg-gradient-to-r from-green-400 to-green-600 px-4 py-2 border-black text-white rounded-lg shadow-md transform transition-transform duration-700 ease-in-out hover:scale-110"
                    >
                      Create a Proposal
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create a Proposal</DialogTitle>
                        <DialogDescription>
                          <textarea
                            name="message"
                            id="message"
                            rows={5}
                            className="p-2 border-2 border-gray-300 rounded-lg w-11/12 h-64 text-black"
                            placeholder="Describe yourself in 100 words"
                            onChange={(e) => setLetter(e.target.value)}
                            value={letter}
                          ></textarea>
                        </DialogDescription>
                      </DialogHeader>
                      <button
                        className="bg-green-400 text-white w-20 py-2 px-2 rounded ml-96 hover:scale-110"
                        onClick={() => {
                          if (job.proposal && userId) {
                            updateProposal([...job.proposal, { user_id: userId, proposal: letter, status: null }], job.uuid);
                          } else if (userId) {
                            updateProposal([{ user_id: userId, proposal: letter, status: null }], job.uuid);
                          }
                        }}
                      >
                        Send
                      </button>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              <p className="text-sm text-gray-700">{job.description}</p>
              <p>Salary: ₹{job.budget}</p>
              <p>Skills Required: {job.skills.join(", ")}</p>
              <div className="flex justify-between">
                <div className="flex flex-row gap-1 items-center">
                  <MapPin size={20} />: {job.location ? `${job.location.name}, ${job.location.stateCode}, ${job.location.countryCode}` : "Remote"}
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      <aside className="flex flex-col gap-5 p-5 bg-[#F2F1E8] w-1/5">
        <h2 className="mb-2 text-xl">Your Proposals</h2>
        {userProposals.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold">{item.job.title}</h3>
            <p className="text-sm text-gray-600 mt-1">Status: {item.proposal.status || 'Waiting'}</p>
          </div>
        ))}
      </aside>
    </div>
  );
}

export default Page;