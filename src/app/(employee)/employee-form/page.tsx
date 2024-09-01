"use client";

import { useState, useEffect } from "react";
import { supabaseClient } from "@/lib/supabase";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

export default function Page() {
    const { getToken, userId } = useAuth();
    const { user } = useUser();
    
    const [countriesList, setCountriesList] = useState<ICountry[]>([]);
    const [statesList, setStatesList] = useState<IState[]>([]);
    const [citiesList, setCitiesList] = useState<ICity[]>([]);

    const [selectedCountry, setSelectedCountry] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedCity, setSelectedCity] = useState("");

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [resume, setResume] = useState<File | null>(null);
    const [workExperience, setWorkExperience] = useState("");
    const [education, setEducation] = useState("");
    const [skills, setSkills] = useState("");
    const [portfolio, setPortfolio] = useState("");
    const [availability, setAvailability] = useState("");

    useEffect(() => {
        setCountriesList(Country.getAllCountries());
    }, []);

    useEffect(() => {
        if (selectedCountry) {
            setStatesList(State.getStatesOfCountry(selectedCountry));
            setCitiesList([]);
            setSelectedState("");
        }
    }, [selectedCountry]);

    useEffect(() => {
        if (selectedState) {
            setCitiesList(City.getCitiesOfState(selectedCountry, selectedState));
        }
    }, [selectedState, selectedCountry]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const token = await getToken({ template: "supabase" });
        if (!token) return;

        const supabase = await supabaseClient(token);
        const { data, error } = await supabase
            .from('employee')
            .insert([
                {
                    name,
                    phone_no: phone,
                    location: { selectedCity },
                    work_ex: workExperience,
                    edu: education,
                    skills,
                    portfolio,
                    avail: availability,
                    email: user?.emailAddresses[0].emailAddress,
                    user_id: userId,
                }
            ]).select();

        if (error) {
            console.error("Error inserting data:", error);
        } else {
            console.log("Data inserted successfully:", data);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full sm:w-[80%] max-w-3xl p-6 border rounded-lg shadow-lg bg-white mt-10">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-semibold text-blue-500">Create Freelancer Profile</h1>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            type="text"
                            placeholder="Enter your full name"
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="Enter your phone number"
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="resume">Upload Resume</Label>
                        <input
                            id="resume"
                            type="file"
                            accept="application/pdf,application/vnd.ms-excel"
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            onChange={(e) => {
                                const files = e.target.files;
                                if (files) setResume(files[0]);
                            }}
                        />
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="country">Country</Label>
                        <select
                            id="country"
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                            <option value="">--Select Country--</option>
                            {countriesList.map((country) => (
                                <option key={country.isoCode} value={country.isoCode}>
                                    {country.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="state">State</Label>
                        <select
                            id="state"
                            value={selectedState}
                            onChange={(e) => setSelectedState(e.target.value)}
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            disabled={!selectedCountry}
                        >
                            <option value="">--Select State--</option>
                            {statesList.map((state) => (
                                <option key={state.isoCode} value={state.isoCode}>
                                    {state.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="city">City</Label>
                        <select
                            id="city"
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            disabled={!selectedState}
                        >
                            <option value="">--Select City--</option>
                            {citiesList.map((city) => (
                                <option key={city.name} value={city.name}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <Label htmlFor="work-experience">Work Experience</Label>
                        <Textarea
                            id="work-experience"
                            placeholder="Describe your work experience"
                            className="mt-1 w-full h-40 resize-none border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={workExperience}
                            onChange={(e) => setWorkExperience(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="education">Education</Label>
                        <Textarea
                            id="education"
                            placeholder="Describe your educational background"
                            className="mt-1 w-full h-40 resize-none border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={education}
                            onChange={(e) => setEducation(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="skills">Skills</Label>
                        <Input
                            id="skills"
                            type="text"
                            placeholder="List your skills"
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={skills}
                            onChange={(e) => setSkills(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="portfolio">Portfolio Link</Label>
                        <Input
                            id="portfolio"
                            type="url"
                            placeholder="Enter the link to your portfolio"
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={portfolio}
                            onChange={(e) => setPortfolio(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="availability">Availability</Label>
                        <Textarea
                            id="availability"
                            placeholder="Describe your availability and preferred work hours"
                            className="mt-1 w-full h-40 resize-none border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={availability}
                            onChange={(e) => setAvailability(e.target.value)}
                        />
                    </div>
                    <div className="text-center">
                        <Button type="submit" className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md mt-5">
                            Submit Profile
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}