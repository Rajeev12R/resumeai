# ResumeAI

Turn your Resume into an **Interview Magnet**. 

ResumeAI is a modern, AI-powered application that instantly analyzes your resume against any job description, uncovers critical missing keywords, calculates ATS match scores, and generates a massive bank of hyper-targeted interview questions based on your specific projects and skills.

## Features

- **Intelligent ATS Scoring:** Get a detailed 0-100 breakdown of your resume's Keyword Match (40%), Formatting (30%), Section Completeness (20%), and Experience Alignment (10%).
- **Native PDF Feedback:** View your original uploaded PDF directly in the browser with interactive, color-coded highlights overlaying the exact text where the AI found mistakes, good matches, or areas for improvement.
- **Predictive Question Bank:** Generates 30 highly targeted, incredibly relevant interview questions tailored to your experience level (15 Domain/Topic questions and 15 Project-specific questions).
- **Parallel AI Processing:** Built on top of LangChain and LangGraph to analyze your resume and generate questions simultaneously for maximum speed using Google's `gemini-flash` models.
- **Sleek, Modern UI:** A fully responsive, premium Shadcn-inspired user interface built with the brand new Tailwind CSS v4 and React. 

## Tech Stack

### Frontend
- **React (Vite)**
- **Tailwind CSS v4** (Utility-first CSS framework with native CSS variables)
- **Lucide React** (Beautiful, consistent icons)
- **React-PDF** (Native PDF rendering inside the browser)
- **React Router** (Client-side routing)

### Backend
- **Node.js & Express**
- **LangChain & LangGraph** (Stateful, parallel AI orchestration)
- **Google Generative AI** (Gemini models)
- **Multer** (Handling multipart/form-data for PDF uploads)
- **pdf-parse** (Extracting raw text from PDF files)
- **MongoDB & Mongoose** (Database for users and resume histories)
- **JWT** (Authentication)

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed along with a [MongoDB](https://www.mongodb.com/) cluster and a [Google Gemini API Key](https://aistudio.google.com/).

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Rajeev12R/resumeai.git
   cd resumeai
   ```

2. **Setup the Backend:**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory and add your keys:
   ```env
   PORT=3000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   GOOGLE_API_KEY=your_gemini_api_key
   ```
   Start the backend server:
   ```bash
   npm start
   ```

3. **Setup the Frontend:**
   Open a new terminal window and navigate to the client folder:
   ```bash
   cd client
   npm install
   ```
   Start the Vite development server:
   ```bash
   npm run dev
   ```

4. **Open the app:**
   Visit `http://localhost:5173` in your browser. 

## Contributing
Contributions, issues, and feature requests are welcome! 

## License
This project is open-source and available under the [MIT License](LICENSE).