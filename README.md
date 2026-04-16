# Skill-Sage: AI Mock Interviewer

Skill-Sage is an AI-powered mock interview platform designed to help users prepare for technical interviews through realistic interview simulations. The platform generates role-specific interview questions using AI and allows users to practice answering them in a structured environment. 

By combining AI-generated questions, speech-to-text technology, and automated feedback, Skill-Sage enables users to improve their communication skills, technical knowledge, and interview confidence.

## 🌟 Key Highlights

- **Dynamic Immersive Setup**: Seamless custom interview creation tailored by job role, tech stack, and experience.
- **AI-Generated Questions**: Realistic mock interview workflows relying on the power of the latest Gemini API.
- **Voice & Video Recording**: Interactive web stream inputs, and speech-to-text conversion for immediate transcription.
- **AI-Driven Feedback**: Automated ratings (out of 10) evaluating the strength and accuracy of technical answers.
- **Advanced Performance Analytics**: Deep-dive Drizzle integrated dashboards tracking lifetime interviews, average AI scores, streak metrics, and live `Recharts` visualizations.
- **Secure Authentication**: Instant login states handled rigorously by Clerk and Next.js middleware.

## 🎯 Problem Statement

Preparing for technical interviews can be challenging due to the lack of structured practice environments and real-time feedback. Many candidates struggle to simulate real interview scenarios or evaluate their answers effectively. Skill-Sage addresses this problem by providing an AI-driven mock interview system that dynamically generates interview questions and helps users practice answering them in a live interactive space.

## 🛠 Tech Stack

**Frontend:**
- Next.js 14
- React
- TailwindCSS
- Recharts (Analytics Data Visualization)
- Lucide React (Icons)

**Backend:**
- Node.js & Next.js API Routes
- Gemini API (Prompt Engineering & Feedback Parsing)

**Database:**
- PostgreSQL
- Drizzle ORM

**Authentication & Deployment:**
- Clerk Authentication
- Vercel

## 🚀 System Workflow

1. **Secure Entry**: User logs into the platform smoothly via Clerk.
2. **Interview Setup**: User enters targeted interview details (e.g. Job role, Tech Stack, Years of Experience).
3. **Generation**: AI dynamically parses the prompt and generates highly relevant interview questions.
4. **Practice Area**: User answers standard questions via a live webcam environment using voice or text.
5. **Transcription**: Native Speech-to-text hooks convert spoken responses into readable text in real-time.
6. **Evaluation**: AI reviews the response side-by-side with the correct solution and provides an unbiased rating and professional feedback.
7. **Analytics**: User can track their progression timeline across a fully charted Next.js Dashboard.

## ⚙️ Installation Guide

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Sree241004/Skill-Sage-AI-Mock-Interviewer.git
   ```

2. **Navigate to project folder:**
   ```bash
   cd Skill-Sage-AI-Mock-Interviewer
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Environment Variables (.env.local):**
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

   NEXT_PUBLIC_DRIZZLE_DB_URL=your_postgres_database_url
   
   NEXT_PUBLIC_INFORMATION="Enable Video Web Cam and Microphone to Start your AI Mock Interview."
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open the app in your browser:**
   ```
   http://localhost:3000
   ```

## 🔮 Future Improvements

- [ ] Support for multiple structured language-specific coding problems
- [ ] Add AI follow-up questions mid-interview based on poor responses
- [ ] Implement difficulty-scaled interview generation (Easy/Medium/Hard toggles)

---
*Built to redefine practice for developers.*
