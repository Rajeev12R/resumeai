import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BrainCircuit, Target, FileSearch, Sparkles, UploadCloud, ArrowRight, CheckCircle2, Shield, Zap } from 'lucide-react';
import { getCookie } from '../utils/cookie';

const LandingPage = () => {
  const user = getCookie('user');
  const getStartedLink = user ? "/dashboard" : "/auth";
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6">
        
        {/* Background Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-[radial-gradient(circle,rgba(37,99,235,0.06)_0%,rgba(255,255,255,0)_70%)] rounded-full -z-10" />
        <div className="absolute top-[10%] right-[-15%] w-[50vw] h-[50vw] bg-[radial-gradient(circle,rgba(139,92,246,0.06)_0%,rgba(255,255,255,0)_70%)] rounded-full -z-10" />
        
        <div className={`container mx-auto max-w-5xl text-center transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          <div className="inline-flex items-center gap-2 bg-muted/50 px-4 py-1.5 rounded-full border mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Powered by Advanced LangGraph AI</span>
          </div>
          
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-6xl lg:leading-tight mb-6 text-foreground">
            Turn your Resume into an <br className="hidden sm:block" />
            <span className="bg-linear-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">Interview Magnet.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-175 mx-auto mb-10 leading-relaxed">
            Stop guessing what Applicant Tracking Systems want. Instantly analyze your resume against any job description, uncover critical missing keywords, and generate hyper-targeted interview questions based on your specific projects.
          </p>
          
          <div className="flex gap-4 justify-center items-center">
            <Link 
              to={getStartedLink} 
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 py-2 text-base font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {user ? 'Go to Dashboard' : 'Get Started Free'} <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
          
          <div className="flex justify-center gap-8 mt-12 text-sm font-medium text-muted-foreground">
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> No credit card required</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Private & Secure</span>
          </div>
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-24 bg-muted/30 border-y">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-20">
            <h2 className="scroll-m-20 pb-4 text-3xl font-bold tracking-tight sm:text-4xl">Outsmart the ATS</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Our proprietary AI engine dissects your resume the exact same way enterprise recruitment software does.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-8 transition-all duration-300 hover:shadow-md hover:border-primary/50 group">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight mb-3">Keyword Precision</h3>
              <p className="text-muted-foreground leading-relaxed">We map your exact skills to the JD, calculating a highly accurate 4-factor ATS match score to ensure you pass the initial screen.</p>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-8 transition-all duration-300 hover:shadow-md hover:border-violet-500/50 group">
              <div className="h-12 w-12 rounded-lg bg-violet-500/10 flex items-center justify-center mb-6 text-violet-500 group-hover:scale-110 transition-transform">
                <FileSearch className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight mb-3">Native PDF Highlighting</h3>
              <p className="text-muted-foreground leading-relaxed">Don't just read about your mistakes. See them highlighted directly on your original PDF document with interactive AI feedback.</p>
            </div>

            <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-8 transition-all duration-300 hover:shadow-md hover:border-emerald-500/50 group">
              <div className="h-12 w-12 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-500 group-hover:scale-110 transition-transform">
                <BrainCircuit className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight mb-3">Predictive Interviews</h3>
              <p className="text-muted-foreground leading-relaxed">We generate 10 hyper-relevant technical questions based strictly on the intersection of your past projects and the new job requirements.</p>
            </div>
            
          </div>
        </div>
      </section>

      {/* How It Works Layer */}
      <section className="py-24 bg-background">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="scroll-m-20 pb-6 text-3xl font-bold tracking-tight lg:text-4xl">Lightning Fast <br/> Parallel Processing</h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                We don't make you wait. Our advanced architecture uses LangGraph to run complex ATS formatting analysis and deep technical question generation simultaneously. Get your results in seconds, not minutes.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 font-medium"><Zap className="h-5 w-5 text-primary" /> Millisecond PDF Parsing</li>
                <li className="flex items-center gap-3 font-medium"><Shield className="h-5 w-5 text-primary" /> Built-in Rate Limit Protection</li>
                <li className="flex items-center gap-3 font-medium"><CheckCircle2 className="h-5 w-5 text-primary" /> 99.9% Prompt Accuracy</li>
              </ul>
            </div>
            <div className="relative rounded-2xl border bg-card shadow-sm p-12 min-h-100 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-violet-500/5" />
              <UploadCloud className="h-32 w-32 text-primary/80" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-slate-950 mt-auto text-center">
        <div className="container mx-auto max-w-3xl px-6">
          <h2 className="scroll-m-20 text-3xl font-bold tracking-tight sm:text-4xl text-white mb-6">Ready to land your next role?</h2>
          <p className="text-lg text-slate-300 mb-10">Join top professionals who have optimized their resumes for the modern ATS era.</p>
          <Link 
            to={getStartedLink} 
            className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 py-2 text-base font-medium text-slate-950 shadow-sm transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {user ? 'Go to Dashboard' : 'Start Analyzing Now'}
          </Link>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
