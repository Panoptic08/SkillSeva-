import React from "react";
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
} from "lucide-react";

function Page() {
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
        {/* <div className=" items-center justify-center w-3/5 h-3/5 text-2xl text-black bg-gray-700 rounded-lg">
        <hr />
        <div>
            <img src="https://muffingroup.com/blog/wp-content/uploads/2021/08/Bow-Valley-College.jpg" alt=""  className='h-64  w-full'/>
        </div>
        <hr />
              <hr />
               <h1 className='text-center mt-10a'>Make a WebSite for my school</h1>
        </div> */}
        <div className="max-w-[60ch] flex flex-col gap-3">
          <h2 className="text-2xl font-bold">
            Web Developer Needed for E-commerce Platform
          </h2>
          <p className="text-sm text-gray-700">
            Looking for an experienced web developer to build an e-commerce
            platform for a clothing brand. The platform should have user
            authentication, product listing, a shopping cart, and payment
            gateway integration.
          </p>
          <p>Budget: ₹55,000</p>
          <p>Deadline: September 30, 2024</p>
          <p>
            Skills Required: HTML, CSS, JavaScript, React, Node.js, Payment
            Gateway Integration
          </p>
        </div>
        <div className="max-w-[60ch] flex flex-col gap-3">
          <h2 className="text-2xl font-bold">
            Mobile App Developer for Fitness Tracker
          </h2>
          <p className="text-sm text-gray-700">
            Seeking a mobile app developer to create a fitness tracking
            application for both Android and iOS. The app should include
            features such as step counting, calorie tracking, and integration
            with fitness wearables.
          </p>
          <p>Budget: ₹33,500</p>
          <p>Deadline: October 15, 2024</p>
          <p>
            Skills Required: React Native, Flutter, Firebase, API Integration,
            Wearable Device Integration
          </p>
        </div>

        <div className="max-w-[60ch] flex flex-col gap-3">
          <h2 className="text-2xl font-bold">
            Graphic Designer for Marketing Materials
          </h2>
          <p className="text-sm text-gray-700">
            We need a creative graphic designer to develop digital and print
            marketing materials for our new product launch. This includes
            flyers, brochures, and social media graphics.
          </p>
          <p>Budget: ₹9,000</p>
          <p>Deadline: September 20, 2024</p>
          <p>
            Skills Required: Adobe Photoshop, Adobe Illustrator, InDesign,
            Branding Design, Print Design
          </p>
        </div>

        <div className="max-w-[60ch] flex flex-col gap-3">
          <h2 className="text-2xl font-bold">
            Content Writer for Blog Articles
          </h2>
          <p className="text-sm text-gray-700">
            We're looking for a content writer to create engaging blog articles
            on various technology topics. Each article should be SEO-optimized
            and range between 800-1,200 words.
          </p>
          <p>Budget: ₹5,000</p>
          <p>Deadline: Ongoing</p>
          <p>
            Skills Required: SEO, Content Writing, Blogging, WordPress, Keyword
            Research
          </p>
        </div>

        <div className="max-w-[60ch] flex flex-col gap-3">
          <h2 className="text-2xl font-bold">
            Social Media Manager for Startup
          </h2>
          <p className="text-sm text-gray-700">
            A startup is seeking a social media manager to build and manage
            their online presence. The role involves creating and scheduling
            content, engaging with followers, and analyzing social media
            performance.
          </p>
          <p>Budget: ₹15,000/month</p>
          <p>Deadline: Ongoing</p>
          <p>
            Skills Required: Social Media Strategy, Content Creation, Analytics,
            Community Management, Paid Advertising
          </p>
        </div>
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
