import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

export default function CreateJobs() {
  const [jobDetails, setJobDetails] = useState({
    title: '',
    description: '',
    skills: '',
    budget: '',
    category: '',
    jobType: 'individual'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log(jobDetails);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create a New Job</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          <Input
            id="skills"
            name="skills"
            value={jobDetails.skills}
            onChange={handleInputChange}
            required
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
            id="category"
            name="category"
            value={jobDetails.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a category</option>
            <option value="web-development">Web Development</option>
            <option value="mobile-development">Mobile Development</option>
            <option value="design">Design</option>
            <option value="writing">Writing</option>
            <option value="marketing">Marketing</option>
          </Select>
        </div>
        <div>
          <Label>Job Type</Label>
          <RadioGroup
            name="jobType"
            value={jobDetails.jobType}
            onValueChange={(value) => setJobDetails(prev => ({ ...prev, jobType: value }))}
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
        <Button type="submit">Create Job</Button>
      </form>
    </div>
  );
}
