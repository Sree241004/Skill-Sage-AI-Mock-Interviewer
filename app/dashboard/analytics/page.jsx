"use client";
import React, { useEffect, useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, Legend } from 'recharts';
import moment from "moment";
import { Activity, Target, Brain, Clock, HelpCircle } from "lucide-react";

export default function AnalyticsPage() {
  const { user } = useUser();
  const [chartData, setChartData] = useState([]);
  const [questionStats, setQuestionStats] = useState({ totalAttempted: 0, averageRating: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      GetAnalyticsData();
    }
  }, [user]);

  const GetAnalyticsData = async () => {
    setLoading(true);
    const answers = await db
      .select()
      .from(UserAnswer)
      .where(eq(UserAnswer.userEmail, user?.primaryEmailAddress?.emailAddress));

    if (answers.length > 0) {
      let totalRating = 0;
      const chartMap = {};
      
      answers.forEach(ans => {
        const ratingMatch = ans.rating?.match(/\d+(\.\d+)?/);
        if (ratingMatch) {
          const ratingVal = parseFloat(ratingMatch[0]);
          totalRating += ratingVal;

          // Chart logic
          if (!chartMap[ans.createdAt]) {
            chartMap[ans.createdAt] = { total: 0, count: 0 };
          }
          chartMap[ans.createdAt].total += ratingVal;
          chartMap[ans.createdAt].count += 1;
        }
      });

      setQuestionStats({
        totalAttempted: answers.length,
        averageRating: (totalRating / answers.length).toFixed(1)
      });

      // Build Chart Data
      const cData = Object.keys(chartMap).map(date => ({
        date: date,
        score: parseFloat((chartMap[date].total / chartMap[date].count).toFixed(1)),
        questions: chartMap[date].count
      }));
      
      cData.sort((a,b) => moment(a.date, "DD-MM-YYYY").diff(moment(b.date, "DD-MM-YYYY")));
      setChartData(cData);
    }
    setLoading(false);
  };

  return (
    <div className="p-10 space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
           <Activity className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Analytics & Progress</h1>
          <p className="text-gray-500">Deep dive into your performance metrics</p>
        </div>
      </div>

      {!loading && chartData.length === 0 ? (
        <div className="bg-white p-10 rounded-xl border border-gray-200 text-center text-gray-500">
           <p>Detailed performance analytics and statistics will appear here.</p>
           <p className="text-sm mt-2">Check back after you complete your first mock interview!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex items-center justify-between">
               <div>
                  <p className="text-indigo-600 font-medium mb-1">Total Questions Answered</p>
                  <h3 className="text-4xl font-bold text-gray-900">{questionStats.totalAttempted}</h3>
               </div>
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-indigo-500">
                  <HelpCircle className="w-8 h-8" />
               </div>
            </div>
            
            <div className="bg-green-50 border border-green-100 rounded-xl p-6 flex items-center justify-between">
               <div>
                  <p className="text-green-600 font-medium mb-1">Cumulative Answer Rating</p>
                  <h3 className="text-4xl font-bold text-gray-900">{questionStats.averageRating} <span className="text-lg text-gray-500">/ 10</span></h3>
               </div>
               <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-green-500">
                  <Brain className="w-8 h-8" />
               </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm mt-8">
            <h3 className="font-bold text-xl mb-2 text-gray-800">Historical Performance Graph</h3>
            <p className="text-gray-500 mb-8">Your average rating tracked by date practiced</p>
            
            <div className="w-full h-96">
              <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={chartData} margin={{ top: 10, right: 30, bottom: 10, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="date" tick={{fill: '#6B7280'}} axisLine={true} stroke="#D1D5DB" />
                    <YAxis domain={[0, 10]} tick={{fill: '#6B7280'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                       contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                       cursor={{stroke: '#e0e7ff', strokeWidth: 2}}
                    />
                    <Line 
                       type="monotone" 
                       dataKey="score" 
                       name="Average Score" 
                       stroke="#4f46e5" 
                       strokeWidth={4} 
                       dot={{r: 6, fill: '#ffffff', stroke: '#4f46e5', strokeWidth: 2}} 
                       activeDot={{r: 8, fill: '#4f46e5'}} 
                    />
                 </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm mt-8">
            <h3 className="font-bold text-xl mb-2 text-gray-800">Daily Question Volume</h3>
            <p className="text-gray-500 mb-8">Number of questions attempted per day</p>
            
            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                 <RechartsBarChart data={chartData} margin={{ top: 10, right: 30, bottom: 10, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="date" tick={{fill: '#6B7280'}} axisLine={true} stroke="#D1D5DB" />
                    <YAxis tick={{fill: '#6B7280'}} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip 
                       contentStyle={{ borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                       cursor={{fill: '#f3f4f6'}}
                    />
                    <Bar dataKey="questions" name="Questions Answered" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                 </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
