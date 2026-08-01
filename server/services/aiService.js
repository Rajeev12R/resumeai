import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { StateGraph, END, START } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { z } from "zod";
import 'dotenv/config';

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-flash-latest",
  maxOutputTokens: 8192,
});

const GraphState = {
  resumeText: {
    value: (x, y) => y,
    default: () => ""
  },
  jobDescription: {
    value: (x, y) => y,
    default: () => ""
  },
  experienceLevel: {
    value: (x, y) => y,
    default: () => "Intermediate"
  },
  atsBreakdown: {
    value: (x, y) => y,
    default: () => ({ keywordMatch: 0, formatting: 0, sectionCompleteness: 0, experienceAlignment: 0, totalScore: 0 })
  },
  resumeTextAnalysis: {
    value: (x, y) => y,
    default: () => []
  },
  interviewQuestions: {
    value: (x, y) => y,
    default: () => []
  }
};

const analyzeResumeNode = async (state) => {
  const { resumeText, jobDescription } = state;
  
  const schema = z.object({
    atsBreakdown: z.object({
      keywordMatch: z.number().describe("Score 0-100 for Keyword Match (weight: 40%). Compares terms in resume against skills, tools, and job titles in JD."),
      formatting: z.number().describe("Score 0-100 for Formatting and Parsability (weight: 30%). Evaluates layout simplicity."),
      sectionCompleteness: z.number().describe("Score 0-100 for Section Completeness (weight: 20%). Checks for standard headings like 'Experience', 'Education', 'Skills'."),
      experienceAlignment: z.number().describe("Score 0-100 for Experience Alignment (weight: 10%). Assesses job title accuracy, employment dates, and years of experience against role requirements."),
      totalScore: z.number().describe("Weighted total score 0-100 based on the weights above.")
    }),
    resumeTextAnalysis: z.array(z.object({
      quote: z.string().describe("Exact 2-5 word quote from the parsed resume text to highlight"),
      type: z.enum(['Mistake', 'Good Match', 'Bad Match', 'Suggestion']),
      feedback: z.string().describe("Detailed feedback on why this is highlighted")
    }))
  });

  const structuredLlm = llm.withStructuredOutput(schema);

  const prompt = `You are an expert ATS (Applicant Tracking System). Analyze the following resume against the given job description.
  
Provide an extremely accurate score breakdown based on these EXACT criteria:
- Keyword Match (40% weight)
- Formatting and Parsability (30% weight)
- Section Completeness (20% weight)
- Experience Alignment (10% weight)

CRITICAL INSTRUCTION: The Resume text below was extracted from a PDF using a basic text parser. Because of this, it may contain artificial flaws like missing spaces between words (e.g., "React.jsandTailwind" instead of "React.js and Tailwind"), weird line breaks, or missing bullet points. 
DO NOT penalize the candidate for these parsing artifacts! DO NOT highlight missing spaces or concatenation as a "Mistake" or lower their formatting score for it. Assume the original PDF is visually well-formatted. Grade ONLY the actual content, semantic meaning, keyword usage, and structural completeness.

Provide a 'resumeTextAnalysis' array. Identify specific small phrases or words in the resume (max 2-5 words for 'quote') that are Mistakes (content-wise), Good Matches, Bad Matches, or Suggestions, and provide feedback for each.

Resume:
${resumeText}

Job Description:
${jobDescription}`;

  const parsed = await structuredLlm.invoke([new HumanMessage(prompt)]);
  return { 
    atsBreakdown: parsed.atsBreakdown,
    resumeTextAnalysis: parsed.resumeTextAnalysis
  };
};

const generateQuestionsNode = async (state) => {
  const { resumeText, jobDescription, experienceLevel } = state;
  const schema = z.object({
    questions: z.array(
      z.object({
        category: z.enum(['Topic', 'Project']).describe("Whether this is a general Domain/Topic question or a specific Project question"),
        topicName: z.string().describe("The name of the topic (e.g. 'React.js', 'System Design') or the specific Project name"),
        question: z.string().describe("Interview question")
      })
    )
  });

  const structuredLlm = llm.withStructuredOutput(schema);

  const prompt = `You are an expert technical interviewer. Based on the candidate's resume and the job description, generate 30 highly targeted, incredibly relevant interview questions specifically tailored for a candidate with an experience level of: **${experienceLevel}**.

Requirements:
- Generate exactly 30 'Topic' questions.
- Generate exactly 20 'Project' questions.
- Focus purely on generating the most highly relevant, difficult, and specific questions based on the intersection of the candidate's actual resume and the job description. DO NOT provide answers.

CRITICAL INSTRUCTIONS FOR 'Topic' CATEGORY:
These test core domain knowledge based on the skills listed in their resume that overlap with the JD. Ensure they are specific to their ${experienceLevel} level.

CRITICAL INSTRUCTIONS FOR 'Project' CATEGORY:
These test specific projects built by the candidate. Drill down into technical implementation details, trade-offs, architecture, and potential edge cases they might have faced in those projects.

Resume:
${resumeText}

Job Description:
${jobDescription}`;

  const parsed = await structuredLlm.invoke([new HumanMessage(prompt)]);
  return { interviewQuestions: parsed.questions };
};

const buildGraph = () => {
  const workflow = new StateGraph({ channels: GraphState })
    .addNode("analyze", analyzeResumeNode)
    .addNode("generate_questions", generateQuestionsNode)
    // Parallel Execution
    .addEdge(START, "analyze")
    .addEdge(START, "generate_questions")
    .addEdge("analyze", END)
    .addEdge("generate_questions", END);
    
  return workflow.compile();
};

export const processResumeWithAI = async (resumeText, jobDescription, experienceLevel) => {
  const app = buildGraph();
  const finalState = await app.invoke({
    resumeText,
    jobDescription,
    experienceLevel
  });
  return finalState;
};
