"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";

export default function CreateJobs() {
  const { getToken, userId } = useAuth();

  const [jobDetails, setJobDetails] = useState({
    title: "",
    description: "",
    skills: [] as string[],
    budget: 0,
    category: "",
    job_type: "individual",
  });
  const [tags, setTags] = useState<Set<string>>(new Set([]));
  const [currentTag, setCurrentTag] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setJobDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const token = await getToken({template: "supabase"});
    console.log(token);
    const resp = await axios.post(`/api/create-job?userId=${userId}`, jobDetails,{
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

    console.log(resp);
  };

  useEffect(() => {
    setJobDetails((prevDetails) => ({
      ...prevDetails,
      skills: Array.from(tags),
    }));
  }, [tags]);

  console.log(jobDetails);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create a New Job</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="title">Job Title</Label>
          <Input
            id="title"
            name="title"
            value={jobDetails.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Job Description</Label>
          <Textarea
            id="description"
            name="description"
            value={jobDetails.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="skills">Required Skills</Label>
          <span className="flex flex-row gap-2 flex-wrap">
            {tags &&
              tags.size > 0 &&
              Array.from(tags).map((tag) => (
                <span
                  key={tag}
                  className="flex flex-row gap-1 items-center justify-center w-fit bg-gray-800 text-xs rounded-md p-2 text-white text-center"
                >
                  <p>{tag}</p>

                  <X
                    size={12}
                    className="cursor-pointer"
                    onClick={() => {
                      setTags((prevTags) => {
                        const newTags = new Set(prevTags);
                        newTags.delete(tag);
                        return newTags;
                      });
                    }}
                  />
                </span>
              ))}
          </span>
          <Input
            type="text"
            placeholder="Press Enter after typing a tag"
            value={currentTag}
            onChange={(e) => {
              setCurrentTag(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (currentTag.trim().length > 0) {
                  setTags((prevTags) =>
                    new Set(prevTags).add(currentTag.trim())
                  );
                  setCurrentTag("");
                }
              }
            }}
          />
        </div>
        <div>
          <Label htmlFor="budget">Budget (in ₹)</Label>
          <Input
            id="budget"
            name="budget"
            type="number"
            value={jobDetails.budget}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <Select
            name="category"
            value={jobDetails.category}
            onValueChange={(value) =>
              handleInputChange({
                target: { name: "category", value },
              } as React.ChangeEvent<HTMLSelectElement>)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="web-development">Web Development</SelectItem>
              <SelectItem value="mobile-development">
                Mobile Development
              </SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="writing">Writing</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Job Type</Label>
          <RadioGroup
            name="jobType"
            value={jobDetails.job_type}
            onValueChange={(value) =>
              setJobDetails((prev) => ({ ...prev, job_type: value }))
            }
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="individual" id="individual" />
              <Label htmlFor="individual">Individual</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="agency" id="agency" />
              <Label htmlFor="agency">Agency</Label>
            </div>
          </RadioGroup>
        </div>

        <Button
          //@ts-ignore
          onClick={handleSubmit}
        >
          Create Job
        </Button>
      </form>
    </div>
  );
}
