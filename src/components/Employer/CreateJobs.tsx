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
import { Country, State, City } from 'country-state-city';

export default function CreateJobs() {
  const { getToken, userId } = useAuth();
  
  // Define state types
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [selectedState, setSelectedState] = useState<any>(null);
  const [selectedCity, setSelectedCity] = useState<any>(null);

  const [countriesList, setCountriesList] = useState<any[]>([]);
  const [stateList, setStateList] = useState<any[]>([]);
  const [cityList, setCityList] = useState<any[]>([]);
  const [languagesList, setLanguagesList] = useState<any[]>([]); // Replace with appropriate language data type

  useEffect(() => {
    setCountriesList(Country.getAllCountries());
    // Fetch languages here
    // setLanguagesList(await fetchLanguages());
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      setStateList(State.getStatesOfCountry(selectedCountry.isoCode));
    } else {
      setStateList([]);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState && selectedCountry) {
      setCityList(City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode));
    } else {
      setCityList([]);
    }
  }, [selectedState, selectedCountry]);

  console.log(selectedCity)

  const [jobDetails, setJobDetails] = useState({
    title: "",
    description: "",
    skills: [] as string[],
    budget: 0,
    category: "",
    job_type: "individual",
    location: {},
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
    const token = await getToken({ template: "supabase" });
    console.log(token);

    // Submit data via axios
    const resp = await axios.post(
      `/api/create-job?userId=${userId}`,
      jobDetails,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(resp);
  };

  useEffect(() => {
    setJobDetails((prevDetails) => ({
      ...prevDetails,
      skills: Array.from(tags),
    }));
  }, [tags]);

  useEffect(()=>{
    setJobDetails((prevDetails) => ({
        ...prevDetails,
        location: selectedCity,
      }));
  }, [selectedCity])

  console.log(jobDetails)

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
            {tags.size > 0 &&
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
            onChange={(e) => setCurrentTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (currentTag.trim().length > 0) {
                  setTags((prevTags) => new Set(prevTags).add(currentTag.trim()));
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
            value={jobDetails.category}
            onValueChange={(value) => handleInputChange({ target: { name: "category", value } } as React.ChangeEvent<HTMLSelectElement>)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="web-development">Web Development</SelectItem>
              <SelectItem value="mobile-development">Mobile Development</SelectItem>
              <SelectItem value="design">Design</SelectItem>
              <SelectItem value="writing">Writing</SelectItem>
              <SelectItem value="marketing">Marketing</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Job Type</Label>
          <RadioGroup
            value={jobDetails.job_type}
            onValueChange={(value) => setJobDetails((prev) => ({ ...prev, job_type: value }))}
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
        <div>
          <Label htmlFor="country">Country</Label>
          <Select
            value={selectedCountry?.isoCode ?? ""}
            onValueChange={(value) => {
              const country = countriesList.find((c) => c.isoCode === value) || null;
              setSelectedCountry(country);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a country" />
            </SelectTrigger>
            <SelectContent>
              {countriesList.map((country) => (
                <SelectItem key={country.isoCode} value={country.isoCode}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="state">State</Label>
          <Select
            value={selectedState?.isoCode ?? ""}
            onValueChange={(value) => {
              const state = stateList.find((s) => s.isoCode === value) || null;
              setSelectedState(state);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
            <SelectContent>
              {stateList.map((state) => (
                <SelectItem key={state.isoCode} value={state.isoCode}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Select
            value={selectedCity?.name ?? ""}
            onValueChange={(value) => {
              const city = cityList.find((c) => c.name === value) || null;
              setSelectedCity(city);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent>
              {cityList.map((city) => (
                <SelectItem key={city.id} value={city.name}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleSubmit}>Create Job</Button>
      </form>
    </div>
  );
}
