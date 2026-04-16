"use client";
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import AddNewInterview from "./_components/AddNewInterview";
import { Play, History, BarChart, Target, Trophy, Clock, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { db } from "@/utils/db";
import { MockInterview, UserAnswer } from "@/utils/schema";
import { eq, desc } from "drizzle-orm";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import moment from "moment";

const Dashboard = () => {
  const { user } = useUser();
  const [totalInterviews, setTotalInterviews] = useState(0);
  const [averageScore, setAverageScore] = useState("0.0");
  const [timePracticed, setTimePracticed] = useState("0m");
  const [streak, setStreak] = useState(0);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (user) {
      GetDashboardData();
    }
  }, [user]);

  const GetDashboardData = async () => {
    // Fetch Total Interviews
    const interviews = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.createdBy, user?.primaryEmailAddress?.emailAddress));
    
    setTotalInterviews(interviews.length);

    // Fetch User Answers for Stats and Charts
    const answers = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.userEmail, user?.primaryEmailAddress?.emailAddress));

    if (answers.length > 0) {
      // Calculate Average Score
      let totalRating = 0;
      let validRatings = 0;
      const chartMap = {};
      const uniqueDays = new Set();
      
      answers.forEach(ans => {
        const ratingMatch = ans.rating?.match(/\d+(\.\d+)?/);
        if (ratingMatch) {
          const ratingVal = parseFloat(ratingMatch[0]);
          totalRating += ratingVal;
          validRatings += 1;

          if (!chartMap[ans.createdAt]) {
            chartMap[ans.createdAt] = { total: 0, count: 0 };
          }
          chartMap[ans.createdAt].total += ratingVal;
          chartMap[ans.createdAt].count += 1;
        }

        if (ans.createdAt) {
           uniqueDays.add(ans.createdAt);
        }
      });

      if (validRatings > 0) {
        setAverageScore((totalRating / validRatings).toFixed(1));
      }

      // Time Practiced (approx 2 mins per question)
      const totalMinutes = answers.length * 2;
      if (totalMinutes > 60) {
        setTimePracticed(`${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`);
      } else {
        setTimePracticed(`${totalMinutes}m`);
      }

      // Streak (Unique Days active)
      setStreak(uniqueDays.size);

      // Build Chart Data
      const cData = Object.keys(chartMap).map(date => ({
        date: date,
        score: parseFloat((chartMap[date].total / chartMap[date].count).toFixed(1))
      }));
      // Sort by date using moment
      cData.sort((a,b) => moment(a.date, "DD-MM-YYYY").diff(moment(b.date, "DD-MM-YYYY")));
      setChartData(cData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Greeting Banner */}
      <div className="bg-[#5a4add] rounded-xl p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-2">
            Good morning, {user?.firstName || 'User'}! 👋
          </h2>
          <p className="text-indigo-100">
            Ready to practice and improve your interview skills?
          </p>
        </div>
        <div className="flex gap-4">
          <AddNewInterview>
            <Button className="bg-white text-[#5a4add] hover:bg-gray-100 px-6 py-6 text-base font-semibold rounded-xl flex items-center gap-2">
              <Play className="w-5 h-5" /> Start Interview
            </Button>
          </AddNewInterview>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-gray-500">
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                <Target className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm">Total Interviews</span>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-800">{totalInterviews}</h3>
            <p className="text-xs text-gray-400 mt-2 font-medium flex justify-between">
               <span>Generated</span> <span>Lifetime</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-gray-500">
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm">Average Score</span>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-800">{averageScore} <span className="text-lg text-gray-400 font-medium">/10</span></h3>
            <p className="text-xs text-gray-400 mt-2 font-medium flex justify-between">
               <span>Overall Rating</span> <span>All time</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-gray-500">
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                <Clock className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm">Time Practiced</span>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-800">{timePracticed}</h3>
            <p className="text-xs text-gray-400 mt-2 font-medium flex justify-between">
               <span className="text-green-500">Based on answers</span> <span>Total Time</span>
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-gray-500">
              <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                <Activity className="w-5 h-5" />
              </div>
              <span className="font-semibold text-sm">Days Active</span>
            </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-gray-800">{streak}</h3>
            <p className="text-xs text-gray-400 mt-2 font-medium flex justify-between">
               <span className="text-green-500">Unique Days</span> <span>Lifetime</span>
            </p>
          </div>
        </div>
      </div>

      {/* Grid for Chart and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm lg:col-span-2">
          <h3 className="font-bold text-lg mb-1 flex items-center gap-2 text-gray-800">
            <Activity className="w-5 h-5 text-blue-500"/> Performance Trend
          </h3>
          <p className="text-sm text-gray-500 mb-6">Your interview scores over time</p>
          <div className="h-64 w-full text-sm">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{fill: '#888'}} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 10]} tick={{fill: '#888'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                       contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line type="monotone" dataKey="score" stroke="#5a4add" strokeWidth={3} dot={{r: 4, fill: '#5a4add'}} activeDot={{r: 6}} />
                 </LineChart>
              </ResponsiveContainer>
            ) : (
               <div className="w-full h-full bg-gray-50 border border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-400">
                 Not enough data to generate chart. Complete an interview!
               </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
           <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-gray-800">
            <Target className="w-5 h-5 text-blue-500"/> Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <AddNewInterview>
              <div className="border border-gray-100 shadow-sm hover:shadow-md transition-all rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer h-full group">
                <div className="bg-blue-50 text-blue-600 p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-sm">Start Interview</h4>
                <p className="text-xs text-gray-500 mt-1">Begin a new mock interview</p>
              </div>
            </AddNewInterview>

            <Link href="/dashboard/history" className="border border-gray-100 shadow-sm hover:shadow-md transition-all rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer h-full group">
              <div className="bg-purple-50 text-purple-600 p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                <History className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-sm">View History</h4>
              <p className="text-xs text-gray-500 mt-1">Review your past interviews</p>
            </Link>

            <Link href="/dashboard/analytics" className="border border-gray-100 shadow-sm hover:shadow-md transition-all rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer h-full group">
              <div className="bg-green-50 text-green-600 p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                <BarChart className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-sm">Analytics</h4>
            </Link>

            <Link href="/dashboard/achievements" className="border border-gray-100 shadow-sm hover:shadow-md transition-all rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer h-full group">
              <div className="bg-orange-50 text-orange-600 p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-sm">Practice Areas</h4>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
