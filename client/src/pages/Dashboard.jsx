import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, FileText, Loader2, Target, History, CheckCircle2, BrainCircuit, ChevronRight } from 'lucide-react';
import api from '../api';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Intermediate');
  const [error, setError] = useState(null);
  const [fetching, setFetching] = useState(true);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const loadingSteps = [
    "Uploading Document securely...",
    "Extracting PDF Text & Layout...",
    "Calculating ATS Keyword Matrix...",
    `Generating Predictive Question Bank (${experienceLevel})...`,
    "Finalizing Analysis Engine..."
  ];

  useEffect(() => {
    fetchResumes();
  }, []);

  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, 2500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading, experienceLevel]);

  const fetchResumes = async () => {
    try {
      const { data } = await api.get('/resume');
      setResumes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setError('Please upload a PDF file.');
        setFile(null);
      } else {
        setError(null);
        setFile(selectedFile);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !jd) {
      setError('Please provide both a Resume (PDF) and a Job Description.');
      return;
    }

    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jd);
    formData.append('experienceLevel', experienceLevel);

    try {
      const { data } = await api.post('/resume/process', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setTimeout(() => navigate(`/analysis`, { state: { resume: data } }), 500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process resume. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl py-12 px-6">
      
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-all duration-300">
          <div className="w-full max-w-md rounded-xl border bg-card p-8 shadow-lg">
            <h3 className="mb-8 flex items-center justify-center gap-3 text-xl font-semibold">
              <BrainCircuit className="text-primary h-7 w-7" /> 
              <span>Processing Analysis</span>
            </h3>
            <div className="flex flex-col gap-6">
              {loadingSteps.map((step, index) => (
                <div key={index} 
                  className={`flex items-center gap-4 transition-all duration-500 ease-in-out ${
                    loadingStep >= index ? 'opacity-100 translate-x-1' : 'opacity-40 translate-x-0'
                  }`}
                >
                  {loadingStep > index ? (
                    <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                  ) : loadingStep === index ? (
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  ) : (
                    <div className="h-6 w-6 rounded-full border-2 border-muted" />
                  )}
                  <span className={`text-sm ${loadingStep === index ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground'}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Upload your latest resume and target job description to begin.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* New Analysis Card */}
        <div>
          <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
            <Target className="h-6 w-6 text-primary" /> 
            Start Analysis
          </h2>
          
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div 
                className={`relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 text-center transition-colors hover:bg-muted/50 ${
                  file ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
                }`}
                onClick={() => fileInputRef.current.click()}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                <UploadCloud className={`mb-4 h-12 w-12 transition-colors ${file ? 'text-primary' : 'text-muted-foreground'}`} />
                <h3 className={`text-lg font-medium mb-1 ${file ? 'text-primary' : 'text-foreground'}`}>
                  {file ? file.name : 'Click to upload your Resume (PDF)'}
                </h3>
                {!file && <p className="text-sm text-muted-foreground">Drag and drop or click to select</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Job Description
                </label>
                <textarea 
                  className="flex min-h-40 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                  placeholder="Paste the complete job description here..."
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Experience Level
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  {['Fresher', 'Intermediate', 'Advanced'].map(level => (
                    <label 
                      key={level} 
                      className={`flex flex-1 items-center justify-center rounded-md border px-4 py-3 text-sm font-medium cursor-pointer transition-colors ${
                        experienceLevel === level 
                          ? 'border-primary bg-primary/10 text-primary shadow-sm' 
                          : 'border-input bg-transparent text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      }`}
                    >
                      <input 
                        type="radio" 
                        name="experienceLevel" 
                        value={level} 
                        checked={experienceLevel === level}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                        className="hidden"
                      />
                      {level}
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <div className="rounded-md bg-destructive/15 p-3">
                  <div className="text-sm font-medium text-destructive">{error}</div>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading || !file || !jd}
                className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                <BrainCircuit className="mr-2 h-5 w-5" />
                Analyze & Generate Questions
              </button>
            </form>
          </div>
        </div>

        {/* Recent History Card */}
        <div>
          <h2 className="mb-6 flex items-center gap-2 text-xl font-semibold">
            <History className="h-6 w-6 text-secondary-foreground" /> 
            Recent Analyses
          </h2>
          
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
            {fetching ? (
              <div className="flex justify-center items-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : resumes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 px-6 text-center text-muted-foreground">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <p className="text-lg font-medium text-foreground">No past analyses found.</p>
                <p className="text-sm">Your processed resumes will appear here.</p>
              </div>
            ) : (
              <div className="flex flex-col divide-y">
                {resumes.map((r) => {
                  let totalScore = 0;
                  if (r.atsBreakdown && typeof r.atsBreakdown.totalScore === 'number') {
                    totalScore = r.atsBreakdown.totalScore;
                  } else {
                    totalScore = r.score || 0; 
                  }

                  let scoreBadgeColor = "bg-destructive text-destructive-foreground";
                  if (totalScore >= 80) scoreBadgeColor = "bg-emerald-500 text-white";
                  else if (totalScore >= 60) scoreBadgeColor = "bg-amber-500 text-white";

                  return (
                    <div 
                      key={r._id} 
                      className="flex items-center justify-between p-6 transition-colors hover:bg-muted/50 cursor-pointer group"
                      onClick={() => navigate('/analysis', { state: { resume: r } })}
                    >
                      <div className="flex items-center gap-5">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-lg font-bold shadow-sm ${scoreBadgeColor}`}>
                          {totalScore}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground mb-1">
                            {new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{r.experienceLevel}</span>
                            <span>•</span>
                            <span>ATS Breakdown</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Dashboard;
