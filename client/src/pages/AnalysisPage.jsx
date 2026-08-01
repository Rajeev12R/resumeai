import React, { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lightbulb, HelpCircle, CheckCircle2, Code2, FolderOpen, Target, FileText, AlertTriangle, Loader2 } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { BASE_URL } from '../api';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const QuestionCard = ({ question, topicName, index }) => (
  <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 mb-4 transition-all duration-200 hover:shadow-md hover:border-primary/50 group">
    <div className="flex items-start gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
        {index + 1}
      </div>
      <div>
        {topicName && (
          <span className="mb-2 inline-block rounded bg-primary/10 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-primary">
            {topicName}
          </span>
        )}
        <p className="text-base font-medium leading-relaxed text-foreground m-0">
          {question}
        </p>
      </div>
    </div>
  </div>
);

const AnalysisPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resume } = location.state || {};
  const [activeTab, setActiveTab] = useState('ats');
  const [hoveredFeedback, setHoveredFeedback] = useState(null);
  const [numPages, setNumPages] = useState(null);

  if (!resume) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center py-32 px-6">
        <h2 className="text-2xl font-bold tracking-tight mb-4 text-foreground">No analysis data found</h2>
        <button 
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
          onClick={() => navigate('/dashboard')}
        >
          Return Home
        </button>
      </div>
    );
  }

  const { atsBreakdown, resumeTextAnalysis, interviewQuestions, originalFile } = resume;

  if (!atsBreakdown) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center py-32 px-6 text-center">
        <h2 className="text-2xl font-bold tracking-tight mb-2 text-foreground">Legacy Resume Found</h2>
        <p className="text-muted-foreground mb-6 max-w-md">This resume was processed with an older algorithm. Please process it again to see the new dashboard.</p>
        <button 
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" 
          onClick={() => navigate('/dashboard')}
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const { keywordMatch, formatting, sectionCompleteness, experienceAlignment, totalScore } = atsBreakdown;

  let totalScoreColor = "bg-destructive";
  if (totalScore >= 80) totalScoreColor = "bg-emerald-500";
  else if (totalScore >= 50) totalScoreColor = "bg-amber-500";

  const topicQuestions = interviewQuestions?.filter(q => q.category === 'Topic') || [];
  const projectQuestions = interviewQuestions?.filter(q => q.category === 'Project') || [];

  const textRenderer = useCallback(
    (textItem) => {
      let str = textItem.str;
      if (!resumeTextAnalysis || resumeTextAnalysis.length === 0) return str;

      let matched = false;
      resumeTextAnalysis.forEach((item) => {
        if (matched) return;
        const quote = item.quote.trim();
        const chunk = str.trim();
        if (quote.length < 3 || chunk.length < 3) return;

        if (quote.toLowerCase().includes(chunk.toLowerCase()) || chunk.toLowerCase().includes(quote.toLowerCase())) {
          matched = true;
          const isNegative = item.type === 'Mistake' || item.type === 'Bad Match';
          const isPositive = item.type === 'Good Match';
          const color = isNegative ? 'rgba(239, 68, 68, 0.4)' : isPositive ? 'rgba(16, 185, 129, 0.4)' : 'rgba(245, 158, 11, 0.4)';
          const border = isNegative ? '#ef4444' : isPositive ? '#10b981' : '#f59e0b';
          
          str = `<mark data-type="${item.type}" data-feedback="${item.feedback.replace(/"/g, '&quot;')}" style="background-color: ${color}; border-bottom: 2px solid ${border}; color: transparent; cursor: help; padding: 0; border-radius: 4px;">${str}</mark>`;
        }
      });
      return str;
    },
    [resumeTextAnalysis]
  );

  const handleMouseOver = (e) => {
    let target = e.target;
    while (target && target !== e.currentTarget) {
      if (target.tagName === 'MARK') {
        setHoveredFeedback({
          type: target.getAttribute('data-type'),
          feedback: target.getAttribute('data-feedback')
        });
        return;
      }
      target = target.parentNode;
    }
    setHoveredFeedback(null);
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  return (
    <div className="mx-auto max-w-[1600px] p-6 lg:p-8">
      <button 
        className="inline-flex h-9 items-center justify-center rounded-full border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring mb-6"
        onClick={() => navigate('/dashboard')}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-140px)] items-start">
        
        <div className="flex h-full flex-col overflow-hidden">
          <div className="flex items-center gap-3 px-2 py-4">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold m-0">Original Resume Document</h3>
          </div>
          
          <div className={`flex h-25 shrink-0 items-center gap-4 rounded-xl px-6 py-4 transition-colors duration-200 overflow-y-auto mb-4 ${
            hoveredFeedback 
              ? (hoveredFeedback.type === 'Mistake' || hoveredFeedback.type === 'Bad Match' ? 'bg-destructive/10' : hoveredFeedback.type === 'Good Match' ? 'bg-emerald-500/10' : 'bg-amber-500/10') 
              : 'bg-muted/30 border'
          }`}>
            {hoveredFeedback ? (
              <>
                {hoveredFeedback.type === 'Mistake' || hoveredFeedback.type === 'Bad Match' ? (
                  <AlertTriangle className="h-6 w-6 shrink-0 text-destructive" />
                ) : hoveredFeedback.type === 'Good Match' ? (
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-500" />
                ) : (
                  <Lightbulb className="h-6 w-6 shrink-0 text-amber-500" />
                )}
                <div className="w-full">
                  <strong className="block text-foreground mb-1 font-semibold">{hoveredFeedback.type}</strong>
                  <span className="text-sm text-muted-foreground">{hoveredFeedback.feedback}</span>
                </div>
              </>
            ) : (
              <>
                <HelpCircle className="h-6 w-6 shrink-0 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Hover over the highlighted text in your original PDF below to see the AI's feedback.</span>
              </>
            )}
          </div>
          
          <div 
            className="flex-1 overflow-y-auto flex justify-center py-2 rounded-xl"
            onMouseOver={handleMouseOver}
          >
            <Document
              file={`${BASE_URL}/${originalFile}`}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={<div className="p-8 text-muted-foreground flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin"/> Rendering PDF...</div>}
              error={<div className="p-8 text-destructive">Failed to load PDF. Check backend port 3000.</div>}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <div key={`page_${index + 1}`} className="mb-8">
                  <Page
                    pageNumber={index + 1}
                    renderTextLayer={true}
                    renderAnnotationLayer={false}
                    customTextRenderer={textRenderer}
                    width={600}
                  />
                </div>
              ))}
            </Document>
          </div>
        </div>

        {/* Right Pane: ATS Metrics & Interview Prep */}
        <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm">
          
          {/* Tabs */}
          <div className="flex gap-2 border-b bg-muted/30 px-6">
            <button 
              onClick={() => setActiveTab('ats')}
              className={`flex items-center gap-2 border-b-2 px-2 py-4 text-sm font-semibold transition-colors ${
                activeTab === 'ats' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              <Target className="h-4 w-4" />
              ATS Score Breakdown
            </button>
            <button 
              onClick={() => setActiveTab('topic')}
              className={`flex items-center gap-2 border-b-2 px-2 py-4 text-sm font-semibold transition-colors ${
                activeTab === 'topic' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              <Code2 className="h-4 w-4" />
              Domain Questions
            </button>
            <button 
              onClick={() => setActiveTab('project')}
              className={`flex items-center gap-2 border-b-2 px-2 py-4 text-sm font-semibold transition-colors ${
                activeTab === 'project' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              <FolderOpen className="h-4 w-4" />
              Project Questions
            </button>
          </div>
          
          {/* Content Container */}
          <div className="flex-1 overflow-y-auto bg-background p-6 lg:p-8">
            
            {activeTab === 'ats' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex flex-col sm:flex-row items-center gap-6 rounded-xl border bg-card p-6 shadow-sm">
                  <div className={`flex h-28 w-28 shrink-0 items-center justify-center rounded-full text-4xl font-extrabold text-white shadow-md ${totalScoreColor}`}>
                    {totalScore}
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="mb-2 text-2xl font-bold tracking-tight text-foreground">Overall ATS Match</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {totalScore >= 80 ? 'Excellent match! Your resume is highly optimized for this role. You are very likely to pass the automated screen.' : totalScore >= 50 ? 'Good start, but your resume is missing some key elements required by the job description. Review the breakdown below.' : 'Poor match. Significant restructuring and keyword additions are required before you submit this.'}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-6 text-xl font-semibold tracking-tight text-foreground">Detailed Breakdown</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Keyword Match (40%)', score: keywordMatch },
                      { label: 'Formatting & Parsability (30%)', score: formatting },
                      { label: 'Section Completeness (20%)', score: sectionCompleteness },
                      { label: 'Experience Alignment (10%)', score: experienceAlignment }
                    ].map((metric, i) => {
                      let barColor = "bg-destructive";
                      if (metric.score >= 80) barColor = "bg-emerald-500";
                      else if (metric.score >= 50) barColor = "bg-amber-500";
                      
                      let textColor = "text-destructive";
                      if (metric.score >= 80) textColor = "text-emerald-500";
                      else if (metric.score >= 50) textColor = "text-amber-500";

                      return (
                        <div key={i} className="rounded-xl border bg-card p-6 shadow-sm">
                          <div className="mb-3 flex justify-between text-base font-semibold">
                            <span className="text-foreground">{metric.label}</span>
                            <span className={textColor}>{metric.score} / 100</span>
                          </div>
                          <div className="h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                            <div 
                              className={`h-full ${barColor} transition-all duration-1000 ease-out`}
                              style={{ width: `${metric.score}%` }} 
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'topic' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="mb-8">
                  <h3 className="mb-2 text-2xl font-bold tracking-tight text-foreground">Domain & Topic Questions</h3>
                  <p className="text-muted-foreground text-base">Highly targeted technical questions based on your stated skills and the job description.</p>
                </div>
                {topicQuestions.length > 0 ? (
                  topicQuestions.map((q, index) => (
                    <QuestionCard key={index} index={index} question={q.question} topicName={q.topicName} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <Code2 className="mb-4 h-12 w-12 opacity-20" />
                    <p>No questions available.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'project' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="mb-8">
                  <h3 className="mb-2 text-2xl font-bold tracking-tight text-foreground">Project Specific Questions</h3>
                  <p className="text-muted-foreground text-base">Deep-dive questions testing your architectural decisions on the projects listed in your resume.</p>
                </div>
                {projectQuestions.length > 0 ? (
                  projectQuestions.map((q, index) => (
                    <QuestionCard key={index} index={index} question={q.question} topicName={q.topicName} />
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                    <FolderOpen className="mb-4 h-12 w-12 opacity-20" />
                    <p>No questions available.</p>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
