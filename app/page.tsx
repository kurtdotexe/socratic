"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from 'next/image';

export default function LandingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleClick = () => {
    if (session) {
      router.push("/dashboard");
    } else {
      router.push("/auth/signin");
    }
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header Section */}
      <div className="w-full h-[50vh] relative">
        {/* Socrates Image */}
        <div className="absolute inset-0 z-[1]">
          <Image
            src="/assets/socrates.png"
            alt="Socrates Statue"
            fill
            style={{ objectFit: 'contain', objectPosition: 'center right' }}
            priority={true}
            className="opacity-75"
          />
        </div>

        {/* Blue Overlay */}
        <div className="absolute inset-0 z-[0]" style={{ backgroundColor: '#609EDB', opacity: 1 }}></div>

        {/* Header Content */}
        <div className="relative z-[2] flex flex-col justify-between h-full text-white p-8">
          {/* Top section with logo and title */}
          <div className="flex items-center ml-24 mt-8">
            <img src="/assets/logo_white.png" alt="Socratic Logo" className="h-24 w-24 mr-4" />
            <div>
              <h1 className="text-6xl font-bold font-serif font-light">SOCRATIC</h1>
              <p className="text-xl">Expand. Be more.</p>
            </div>
          </div>

          {/* Quote */}
          <div className="absolute top-8 right-16 text-right text-base italic">
            <p>"The only true wisdom</p>
            <p>is in knowing you know nothing"</p>
          </div>

          {/* Bottom bar with navigation and button */}
          <div className="w-full max-w-4xl bg-white rounded-full py-3 px-6 flex items-center justify-between shadow-lg self-center">
            <div className="flex items-center">
              <img src="/assets/logo_blue.png" alt="Learner Icon" className="h-8 w-8 mr-2" />
              <span className="text-[#609EDB] text-base font-semibold">Welcome, Learner!</span>
            </div>
            <button
              onClick={handleClick}
              className="px-6 py-2 bg-[#609EDB] text-white rounded-full text-base font-semibold shadow-md hover:bg-[#4a8acb] transition-colors"
              disabled={status === "loading"}
            >
              {session ? "Get Started" : "Sign In"}
            </button>
          </div>
        </div>
      </div>

      {/* Content Section - New Hero Section */}
      <div className="relative w-full px-8 pb-0 bg-[#f1f7fb] overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 lg:w-2/3 mb-8 md:mb-0">
            <h2 className="text-4xl lg:text-5xl font-bold mb-16 leading-tight ml-8" style={{ color: '#131757' }}>Want to learn? Get started<br />with Socratic!</h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-xl ml-8">
              <span className="font-bold">Join the Learning Revolution!</span> Whether you're trying to understand
              philosophy or explore new ideas, <span className="font-bold italic">SOCRATIC</span> makes the learning
              journey <span className="font-bold italic">personal, meaningful, and intellectually empowering.</span>
            </p>
          </div>
          <div className="md:w-1/2 lg:w-1/3 relative flex justify-center items-center h-[400px] mr-16 mt-0 mb-0">
             {/* Shapes Image */}
             <img
               src="/assets/shapes.png"
               alt="Abstract Shapes"
               style={{ width: '100%', height: '100%', objectFit: 'contain' }}
             />
          </div>
        </div>
      </div>

      {/* Transition Image Container */}
      <div style={{ backgroundColor: '#82B0D8' }}>
        <img
          src="/assets/transition.png"
          alt="Section Transition"
          style={{ width: '100%', display: 'block' }}
        />
      </div>

      {/* Section Below Transition */}
      <div className="relative w-full px-8 py-16" style={{ backgroundColor: '#82B0D8' }}>
        {/* Background Overlay Image */}
        <div className="absolute inset-0 z-0 bg-[url('/assets/bg.png')] bg-cover bg-no-repeat opacity-30"></div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-16">
          {/* About Socratic Header - Removed */}

          {/* What is SOCRATIC? Section */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              {/* New About Socratic Text */}
              <p className="text-3xl font-semibold mb-4 ml-1" style={{ color: '#131757' }}>About Socratic</p>
              <h3 className="text-4xl font-bold mb-2 text-white" style={{ textShadow: '2px 2px 4px #131757' }}>What is SOCRATIC?</h3>
              <div className="bg-[#32597D] p-6 rounded-lg shadow-lg text-white">
                <p className="text-lg leading-relaxed">
                  SOCRATIC is an AI-powered learning companion designed to
                  teach through questioning just like the ancient Greek
                  philosopher Socrates.
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  Instead of spoon-feeding information, SOCRATIC guides
                  learners through a journey of discovery, helping them think
                  critically, reflect deeply, and truly understand the topics they
                  care about.
                </p>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="/assets/book.png"
                alt="Book and plant on a table"
                className="w-full h-auto max-w-sm rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Our Mission Section */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
             <div className="md:w-1/2">
              <h3 className="text-4xl font-bold mb-2 text-white" style={{ textShadow: '2px 2px 4px #131757' }}>Our Mission</h3>
              <div className="bg-[#32627D] p-6 rounded-lg shadow-lg text-white">
                <p className="text-lg leading-relaxed">
                  Our mission is to transform the way people learn and develop
                  their thinking. With the aid of our dialogue-based AI, Lino, we
                  make education interactive, reflective, and deeply personalized.
                </p>
                <p className="text-lg leading-relaxed mt-4">
                  We aim to help users achieve their learning goal one Socratic
                  question at a time.
                </p>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="/assets/greek.png"
                alt="Greek statue with butterfly"
                className="w-full h-auto max-w-sm rounded-lg shadow-lg"
              />
            </div>
          </div>

          {/* Why the Socratic Method? Section */}
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h3 className="text-4xl font-bold mb-2 text-white" style={{ textShadow: '2px 2px 4px #131757' }}>Why the Socratic Method?</h3>
              <div className="bg-[#3C708E] p-6 rounded-lg shadow-lg text-white">
                <p className="text-lg leading-relaxed">
                  We believe real learning doesn't come from memorizing facts, it
                  comes from asking the right questions. The Socratic method
                  helps you:
                </p>
                <ul className="list-disc list-inside text-lg leading-relaxed mt-4 ml-4">
                  <li className="font-bold">Think independently</li>
                  <li className="font-bold">Challenge assumptions</li>
                  <li className="font-bold">Develop deeper understanding</li>
                  <li className="font-bold">Retain information through active inquiry</li>
                </ul>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="/assets/keyb.png"
                alt="Laptop and notebook on a table"
                className="w-full h-auto max-w-sm rounded-lg shadow-lg"
              />
            </div>
          </div>

        </div>
      </div>

      {/* How It Works Section */}
      <div className="w-full px-8 py-16" style={{ backgroundColor: '#f1f7fb' }}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start gap-16">
          {/* Text Content (Numbered List) */}
          <div className="md:w-1/2 ml-8 mt-16">
            <h2 className="text-5xl font-bold text-[#131757] mb-8">How It Works</h2>
            <ol className="list-decimal list-outside text-lg text-gray-700 leading-loose space-y-6 ml-4">
              <li>
                <span className="font-bold text-black">Choose a Topic</span><br />
                Tell SOCRATIC what you want to learn and
                how many days you want to learn it.
              </li>
              <li>
                <span className="font-bold text-black">Get a Personalized Plan</span><br />
                Our AI builds a structured daily learning
                schedule just for you.
              </li>
              <li>
                <span className="font-bold text-black">Learn Through Dialogue</span><br />
                Each day, you'll engage in conversation with
                our virtual Socrates, <span className="font-bold italic">Lino</span>. Lino will be asking
                thought-provoking questions to guide your
                learning.
              </li>
              <li>
                <span className="font-bold text-black">Reflect and Grow</span><br />
                After each session, you'll be prompted to
                write in your <span className="font-bold italic">Socratic Reflection Journal</span>,
                helping you internalize what you've learned.
              </li>
              <li>
                <span className="font-bold text-black">Track Your Growth</span><br />
                Visual dashboards show how much you've
                learned, what's left, and what you've
                mastered.
              </li>
            </ol>
          </div>

          {/* Images */}
          <div className="md:w-1/2 flex flex-col gap-4">
            {/* cont.png */}
            <img
              src="/assets/cont.png"
              alt="The Creation of Adam style hands reaching towards a seated philosopher"
              className="w-full h-auto rounded-lg shadow-lg"
            />
            {/* lino.png and lino2.png */}
            <div className="flex flex-row gap-4">
              <img
                src="/assets/lino.png"
                alt="Cartoon illustration of Socrates"
                className="w-1/2 h-64 object-cover rounded-lg shadow-lg"
              />
              <img
                src="/assets/lino2.png"
                alt="Ancient Greek ruins"
                className="w-1/2 h-64 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Who is SOCRATIC for? Section */}
      <div className="relative w-full px-8 py-16" style={{ backgroundColor: '#f1f7fb' }}>
        {/* Background Overlay Image */}
        <div className="absolute inset-0 z-0 bg-[url('/assets/bg2.png')] bg-contain bg-center bg-no-repeat opacity-50"></div>

        <div className="relative z-10 max-w-7xl mx-auto flex flex-col gap-16">
          {/* Section Heading */}
          <h2 className="text-5xl font-bold text-[#131757] mb-8 ml-8">Who is SOCRATIC for?</h2>

          {/* Content Columns */}
          <div className="flex flex-col md:flex-row items-start gap-8">
            {/* Left Column */}
            <div className="md:w-1/2 flex flex-col items-center">
              <img
                src="/assets/noob.png"
                alt="Students studying"
                className="w-full h-auto rounded-lg shadow-lg mb-6"
              />
              <div className="w-full p-0 text-gray-700">
                 <h3 className="text-xl font-bold mb-2">Socratic is for</h3>
                 <p className="text-lg leading-relaxed">
                   Students seeking smarter study tools and<br />
                   Self-learners exploring new subjects
                 </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="md:w-1/2 flex flex-col items-center">
               <img
                 src="/assets/pro.png"
                 alt="Student smiling"
                 className="w-full h-auto rounded-lg shadow-lg mb-6"
               />
               <div className="w-full p-0 text-gray-700">
                 <h3 className="text-xl font-bold mb-2">Socratic is also for</h3>
                 <p className="text-lg leading-relaxed">
                   Lifelong learners with curious minds and<br />
                   Anyone who wants to learn <span className="font-bold">how to think</span>, not<br />
                   just <span className="font-bold">what to think</span>
                 </p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}