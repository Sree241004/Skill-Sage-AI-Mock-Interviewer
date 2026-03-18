Skill-Sage: AI Mock Interviewer

Skill-Sage is an AI-powered mock interview platform designed to help users prepare for technical interviews through realistic interview simulations. The platform generates role-specific interview questions using AI and allows users to practice answering them in a structured environment.
By combining AI-generated questions, speech-to-text technology, and automated feedback, Skill-Sage enables users to improve their communication skills, technical knowledge, and interview confidence.

Key Highlights:
AI-generated interview questions based on role, tech stack, and experience
Realistic mock interview workflow
Voice-based answer recording
Speech-to-text conversion for responses
AI-driven feedback on answers
Authentication-based user dashboard
Clean and responsive UI for a smooth interview experience

Problem Statement:
Preparing for technical interviews can be challenging due to the lack of structured practice environments and real-time feedback. Many candidates struggle to simulate real interview scenarios or evaluate their answers effectively.
Skill-Sage addresses this problem by providing an AI-driven mock interview system that dynamically generates interview questions and helps users practice answering them in an interactive environment.

Solution:
Skill-Sage leverages AI to generate interview questions tailored to specific roles and technologies. Users can practice answering questions using voice or text, and the platform processes responses to provide meaningful feedback.
This approach helps users simulate real interview conditions and improve both their technical and communication skills.

Tech Stack:
Frontend:
Next.js
React
TailwindCSS

Backend:
Node.js
Next.js API Routes

Database:
PostgreSQL
Drizzle ORM

AI Integration:
Gemini API

Authentication:
Clerk Authentication

Deployment:
Vercel 

System Workflow:
User logs into the platform.
User enters interview details:
Job role
Tech stack
Years of experience
AI generates relevant interview questions.
User answers questions via voice or text.
Speech-to-text converts spoken responses into text.
AI evaluates responses and provides feedback.

Installation Guide:

Clone the repository:
git clone https://github.com/Sree241004/Skill-Sage-AI-Mock-Interviewer.git

Navigate to project folder:
cd Skill-Sage-AI-Mock-Interviewer

Install dependencies:
npm install
Run the development server
npm run dev

Open the app in your browser:
http://localhost:3000

Environment Variables:
Create a .env.local file and add the following:
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=your_database_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key


Project Structure:

app/
components/
utils/
database/
public/

Future Improvements:
Real-time AI interview feedback
Difficulty-based question generation
Performance analytics dashboard
Multiple interview domains (AI, Web Dev, Core Engineering)
AI follow-up questions during interview

