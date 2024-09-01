"use client";

import { supabaseClient } from "@/lib/supabase";
import { useAuth } from "@clerk/nextjs";
import { MapPin, EllipsisVertical } from "lucide-react";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import axios from "axios";
import { Button } from "@/components/ui/button";
import EscrowPaymentGateway from "../Payment";

export default function Dashboard() {
  const { getToken, userId } = useAuth();
  const [jobs, setJobs] = useState<any[] | null>(null);
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [proposals, setProposals] = useState<any[]>([]);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  async function getUserJobs() {
    setLoading(true);
    const token = await getToken({ template: "supabase" });
    if (!token) {
      console.log("No token");
      setLoading(false);
    } else {
      const supabase = await supabaseClient(token);
      let { data: jobs, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("user_id", userId);
      if (error) {
        console.log(error);
        setLoading(false);
      } else {
        setJobs(jobs);
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    getUserJobs();
  }, []);

  async function deleteJob(uuid: string) {
    const token = await getToken({ template: "supabase" });
    if (!token) {
      console.log("No token");
    } else {
      const supabase = await supabaseClient(token);
      let { error } = await supabase
        .from("jobs")
        .delete()
        .eq("uuid", uuid);
      if (error) {
        console.log(error);
        toast({ title: error.message });
      } else {
        toast({ title: "Job deleted" });
        getUserJobs(); // Refresh the job list
      }
    }
  }

  async function getProposals(jobUuid: string) {
    setSelectedJob(jobUuid);
    setProposals([])
    const token = await getToken({ template: "supabase" });
    if (!token) {
      console.log("No token");
    } else {
      const supabase = await supabaseClient(token);
      let { data: jobProposals, error } = await supabase
        .from("jobs")
        .select("proposal")
        .eq("uuid", jobUuid)
        .single();

      if (error) {
        console.log(error);
      } else if (jobProposals && jobProposals.proposal) {
        const proposalsWithUserInfo = await Promise.all(
          jobProposals.proposal.map(async (proposal: any) => {
            const userResponse = await axios.get(`/api/user/info?user_id=${proposal.user_id}`);
            console.log(userResponse)
            const userData = userResponse.data.user;
            return { ...proposal, userData, status: proposal.status || 'pending' };
          })
        );
        setProposals(proposalsWithUserInfo);
      }
    }
  }

  async function updateProposalStatus(proposalIndex: number, newStatus: 'accepted' | 'rejected') {
    const token = await getToken({ template: "supabase" });
    if (!token || !selectedJob) {
      console.log("No token or no selected job");
      return;
    }

    const supabase = await supabaseClient(token);
    
    // Update the local state first for immediate UI feedback
    setProposals(prevProposals => {
      const updatedProposals = prevProposals.map((proposal, index) => {
        if (index === proposalIndex) {
          return { ...proposal, status: newStatus };
        } else if (newStatus === 'accepted') {
          return { ...proposal, status: 'rejected' };
        }
        return proposal;
      });
      return updatedProposals;
    });

    // Then update in the database
    const { data, error } = await supabase
      .from('jobs')
      .update({ 
        proposal: proposals.map((proposal, index) => {
          if (index === proposalIndex) {
            return { ...proposal, status: newStatus };
          } else if (newStatus === 'accepted') {
            return { ...proposal, status: 'rejected' };
          }
          return proposal;
        })
      })
      .eq('uuid', selectedJob);

    if (error) {
      console.error("Error updating proposal status:", error);
      toast({ title: "Failed to update proposal status", variant: "destructive" });
    } else {
      toast({ title: `Proposal ${newStatus}`, variant: "success" });
    }
  }

  console.log(proposals)

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] w-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="min-h-[calc(100vh-80px)] w-screen flex items-center justify-center">
        <Link href="/create-job">Create Job</Link>
      </div>
    );
  }

  return (
    <section className="px-24 mt-10 flex flex-row">
      <div className="max-h-screen overflow-y-auto w-1/2">
        {jobs.map((job) => (
          <div
            key={job.uuid}
            className="w-fit flex flex-row justify-between items-start mb-6 cursor-pointer"
          >
            <div className="max-w-[65ch] flex flex-col gap-3">
              <h2 className="text-2xl font-bold" onClick={() => getProposals(job.uuid)}>{job.title}</h2>
              <p className="text-sm text-gray-700">{job.description}</p>
              <p>Salary: ₹{job.budget}</p>
              <p>Skills Required: {job.skills.join(", ")}</p>
              <div className="flex flex-row gap-1 items-center">
                <MapPin size={20} />:{" "}
                {job.location
                  ? `${job.location.name}, ${job.location.stateCode}, ${job.location.countryCode}`
                  : "Remote"}
              </div>
              {job.proposal && job.proposal.some((proposal: any) => proposal.status === 'accepted') && (
                <Link href={`/payment/${job.budget}`} className="bg-black text-white rounded-md py-2 px-4 w-fit">Payment</Link>
              )}
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisVertical size={20} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  className="text-red-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteJob(job.uuid);
                  }}
                >
                  Delete
                </DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}
      </div>
      <div className="w-1/2 max-h-screen overflow-y-auto">
        <h2 className="text-2xl font-semibold mb-4">Proposals</h2>
        {proposals.length !== 0 ? proposals.map((proposal, index) => (
          <div key={index} className="mb-4 p-4 border rounded">
            <h3 className="text-xl font-semibold">{proposal.userData.firstName} {proposal.userData.lastName}</h3>
            <p>Email: {proposal.userData.emailAddresses[0].emailAddress}</p>
            <p>Proposal: {proposal.proposal}</p>
            <p>Status: {proposal.status}</p>
            {proposal.status === 'pending' && (
              <div className="mt-2">
                <Button 
                  onClick={() => updateProposalStatus(index, 'accepted')}
                  className="mr-2 bg-green-500 hover:bg-green-600"
                >
                  Accept
                </Button>
                <Button 
                  onClick={() => updateProposalStatus(index, 'rejected')}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Reject
                </Button>
              </div>
            )}
          </div>
        )) : (<div>No proposals yet.</div>)}
      </div>
    </section>
  );
}
