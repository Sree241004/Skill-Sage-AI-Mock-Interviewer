"use client";
import React, { useState } from "react";
import { 
  Settings, 
  Target, 
  Brain, 
  Clock, 
  Info, 
  Monitor, 
  Users, 
  CheckCircle2, 
  Play, 
  LoaderCircle 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { chatSession } from "@/utils/GeminiAIModal";
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { db } from "@/utils/db";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { Button } from "@/components/ui/button";

const interviewTypes = [
  {
    id: "technical",
    title: "Technical Interview",
    description: "Coding, algorithms, and technical problem-solving",
    icon: <Monitor className="w-5 h-5 text-blue-400" />,
  },
  {
    id: "behavioral",
    title: "Behavioral Interview",
    description: "Past experiences, soft skills, and situational questions",
    icon: <Brain className="w-5 h-5 text-pink-400" />,
  },
  {
    id: "hr",
    title: "HR Interview",
    description: "Company culture, motivation, and general questions",
    icon: <Users className="w-5 h-5 text-purple-400" />,
  },
];

const difficulties = [
  { id: "easy", label: "Easy", desc: "Basic questions to build confidence", color: "text-green-600", bg: "bg-green-100" },
  { id: "medium", label: "Medium", desc: "Standard interview difficulty", color: "text-yellow-600", bg: "bg-yellow-100" },
  { id: "hard", label: "Hard", desc: "Challenging questions for advanced preparation", color: "text-red-600", bg: "bg-red-100" },
];

export default function SetupInterviewPage() {
  const [jobRole, setJobRole] = useState("");
  const [type, setType] = useState("technical");
  const [experience, setExperience] = useState("Mid-level (1-3 years)");
  const [difficulty, setDifficulty] = useState("medium");
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user } = useUser();
  const router = useRouter();

  const handleStart = async (e) => {
    e.preventDefault();
    if (!jobRole.trim()) {
      setError("Please specify a Job Role");
      return;
    }
    setError("");
    setLoading(true);

    const interviewTypeLabel = interviewTypes.find((t) => t.id === type)?.title;

    const inputPrompt = `Job role/position: ${jobRole}, Interview Type: ${interviewTypeLabel}, Experience Level: ${experience}, Difficulty Level: ${difficulty}. Based on these parameters, provide us exactly ${numQuestions} Interview questions along with concise answers (max 2-3 sentences each) in JSON format. Provide the response strictly as an array of JSON objects, where each object has "question" and "answer" fields. Example:
    [
      {
        "question": "Your question here",
        "answer": "Your concise answer here"
      }
    ]`;

    try {
      const result = await chatSession.sendMessage(inputPrompt);
      const responseText = await result.response.text();

      const cleanedText = responseText.replace(/```json/gi, "").replace(/```/gi, "").trim();
      const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
      
      if (!jsonMatch) {
         console.error("AI Response Text:", responseText);
         throw new Error("No valid JSON array found in the response");
      }

      const jsonResponsePart = jsonMatch[0];
      const mockResponse = JSON.parse(jsonResponsePart.trim());
      const jsonString = JSON.stringify(mockResponse);
      const jobDescPayload = `Type: ${interviewTypeLabel}, Difficulty: ${difficulty}, Questions: ${numQuestions}`;

      const res = await db.insert(MockInterview)
        .values({
          mockId: uuidv4(),
          jsonMockResp: jsonString,
          jobPosition: jobRole,
          jobDesc: jobDescPayload,
          jobExperience: experience.split(" ")[0], // grab "Mid-level" etc.
          createdBy: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format("DD-MM-YYYY"),
        })
        .returning({ mockId: MockInterview.mockId });
        
      if(res && res[0]?.mockId) {
         router.push(`/dashboard/interview/${res[0]?.mockId}`);
      } else {
         throw new Error("Failed to insert into database");
      }
    } catch (err) {
      console.error("Error setting up interview:", err);
      setError("Failed to generate interview. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedTypeObj = interviewTypes.find((t) => t.id === type);
  const selectedDiffObj = difficulties.find((d) => d.id === difficulty);

  return (
    <div className="min-h-[calc(100vh-80px)] bg-slate-50 py-10 px-4 md:px-8 font-sans">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Setup Your Interview</h1>
          <p className="text-slate-500 text-center">
            Customize your mock interview experience to match your goals
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-10">
          {/* Left Form Settings */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Job Role Section */}
            <div className="bg-[#0b101e] rounded-2xl p-6 border border-slate-800 shadow-xl">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-5 h-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-white">Job Role</h2>
              </div>
              <p className="text-slate-400 text-sm mb-4">What position are you preparing for?</p>
              <input
                type="text"
                placeholder="e.g., Software Engineer, Product Manager, Data Scientist"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="w-full bg-[#131b2f] border border-slate-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-slate-500"
              />
            </div>

            {/* Interview Type Section */}
            <div className="bg-[#0b101e] rounded-2xl p-6 border border-slate-800 shadow-xl">
              <div className="flex items-center gap-2 mb-1">
                <Brain className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">Interview Type</h2>
              </div>
              <p className="text-slate-400 text-sm mb-5">Choose the type of interview you want to practice</p>
              <div className="space-y-3">
                {interviewTypes.map((t) => {
                  const isSelected = type === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setType(t.id)}
                      className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border ${
                        isSelected
                          ? "bg-blue-50 border-blue-200 text-slate-900"
                          : "bg-[#131b2f] border-slate-700 hover:border-slate-500 text-white"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-white shadow-sm' : 'bg-[#1b2541]'}`}>
                           {t.icon}
                        </div>
                        <div>
                          <h3 className={`font-semibold ${isSelected ? "text-slate-900" : "text-white"}`}>{t.title}</h3>
                          <p className={`text-sm ${isSelected ? "text-slate-600" : "text-slate-400"}`}>{t.description}</p>
                        </div>
                      </div>
                      {isSelected && <CheckCircle2 className="w-6 h-6 text-blue-500" />}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Experience and Difficulty Grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-[#0b101e] rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col">
                <div className="mb-5 flex-1">
                  <h2 className="text-xl font-semibold text-white mb-1">Experience Level</h2>
                  <p className="text-slate-400 text-sm">Your professional experience</p>
                </div>
                <div className="relative">
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full bg-[#131b2f] border border-slate-700 text-white rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
                  >
                    <option value="Entry-level (0-1 years)">Entry-level (0-1 years)</option>
                    <option value="Mid-level (1-3 years)">Mid-level (1-3 years)</option>
                    <option value="Senior-level (3-5 years)">Senior-level (3-5 years)</option>
                    <option value="Expert-level (5+ years)">Expert-level (5+ years)</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              <div className="bg-[#0b101e] rounded-2xl p-6 border border-slate-800 shadow-xl">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold text-white mb-1">Difficulty</h2>
                  <p className="text-slate-400 text-sm">Question complexity level</p>
                </div>
                <div className="space-y-3">
                  {difficulties.map((d) => {
                    const isSelected = difficulty === d.id;
                    return (
                      <div
                        key={d.id}
                        onClick={() => setDifficulty(d.id)}
                        className={`p-3 rounded-xl cursor-pointer transition-all border flex items-center justify-between ${
                          isSelected
                            ? "bg-blue-50 border-blue-200"
                            : "bg-[#131b2f] border-slate-700 hover:border-slate-500"
                        }`}
                      >
                         <div>
                            <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-1 ${d.bg} ${d.color}`}>
                                {d.label}
                            </div>
                            <p className={`text-xs ${isSelected ? "text-slate-600" : "text-slate-400"}`}>{d.desc}</p>
                         </div>
                         {isSelected && <CheckCircle2 className="w-5 h-5 text-blue-500" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Questions Slider */}
            <div className="bg-[#0b101e] rounded-2xl p-6 border border-slate-800 shadow-xl">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-5 h-5 text-orange-400" />
                <h2 className="text-xl font-semibold text-white">Number of Questions</h2>
              </div>
              <p className="text-slate-400 text-sm mb-6">How many questions would you like to practice?</p>
              
              <div className="mb-2 flex justify-between items-center text-slate-300">
                 <span className="text-sm">Questions</span>
                 <div className="w-8 h-8 rounded-full bg-[#131b2f] border border-slate-700 flex items-center justify-center font-bold text-white">
                    {numQuestions}
                 </div>
              </div>

              <input
                type="range"
                min="3"
                max="15"
                step="1"
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
                style={{
                  background: `linear-gradient(to right, #3b82f6 ${(numQuestions - 3) / 12 * 100}%, #3b82f6 ${(numQuestions - 3) / 12 * 100}%, #334155 ${(numQuestions - 3) / 12 * 100}%, #334155 100%)`
                }}
              />
              
              <div className="flex justify-between items-center text-xs text-slate-500 mt-4">
                 <span>3 (Quick)</span>
                 <span>~{Math.round(numQuestions * 3)} minutes</span>
                 <span>15 (Comprehensive)</span>
              </div>
            </div>

          </div>

          {/* Right Sidebar Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#0b101e] rounded-2xl border border-slate-800 shadow-xl sticky top-8">
              <div className="p-6 border-b border-slate-800">
                <div className="flex items-center gap-2">
                   <Info className="w-5 h-5 text-blue-500" />
                   <h2 className="text-xl font-bold text-white">Interview Summary</h2>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                 <div>
                    <p className="text-sm text-slate-400 mb-1">Job Role</p>
                    <p className={`font-medium ${jobRole ? 'text-white' : 'text-slate-600 italic'}`}>
                       {jobRole || "Not specified"}
                    </p>
                 </div>
                 
                 <div>
                    <p className="text-sm text-slate-400 mb-1">Type</p>
                    <p className="font-medium text-slate-300">{selectedTypeObj?.title}</p>
                 </div>

                 <div>
                    <p className="text-sm text-slate-400 mb-1">Experience</p>
                    <p className="font-medium text-slate-300">{experience.split(' ')[0]}</p>
                 </div>

                 <div>
                    <p className="text-sm text-slate-400 mb-2">Difficulty</p>
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${selectedDiffObj?.bg} ${selectedDiffObj?.color}`}>
                        {selectedDiffObj?.label}
                    </div>
                 </div>

                 <div>
                    <p className="text-sm text-slate-400 mb-1">Duration</p>
                    <p className="font-medium text-slate-300">~{Math.round(numQuestions * 3)} minutes</p>
                 </div>
                 
                 <div className="bg-[#131b2f] border border-slate-700 p-4 rounded-xl flex items-start gap-3 mt-4">
                    <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-300 leading-relaxed">
                      You'll receive real-time feedback and a comprehensive analysis at the end.
                    </p>
                 </div>

                 {error && (
                    <div className="bg-red-500/10 text-red-400 p-3 rounded-xl text-center border border-red-500/20 text-sm font-medium">
                      {error}
                    </div>
                 )}

                 <Button 
                   onClick={handleStart} 
                   disabled={loading}
                   className="w-full bg-gradient-to-r from-[#4f3cca] to-[#5a4add] hover:from-[#4331af] hover:to-[#4b3dcc] text-white py-6 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(90,74,221,0.3)] transition-all hover:scale-[1.02]"
                 >
                   {loading ? (
                       <><LoaderCircle className="animate-spin w-5 h-5" /> Generating Form...</>
                   ) : (
                       <><Play className="w-5 h-5" /> Start Interview <span>→</span></>
                   )}
                 </Button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
