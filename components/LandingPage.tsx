
import React, { useRef } from 'react';
import { Check, ArrowRight, Sparkles, Layout, Shield, Zap, FileUp, FileText, LogIn, UserPlus } from 'lucide-react';
import { User } from '../types';

interface LandingPageProps {
  onStart: () => void;
  onSubscribe: () => void;
  onImport: (file: File) => void;
  isImporting: boolean;
  user: User | null;
  onLoginClick: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onSubscribe, onImport, isImporting, user, onLoginClick }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImport(e.target.files[0]);
    }
  };

  const handleStart = () => {
    if (user) {
      onStart();
    } else {
      onLoginClick();
    }
  };

  const handleImportClick = () => {
    if (user) {
      fileInputRef.current?.click();
    } else {
      onLoginClick();
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.location.reload()}>
          <div className="bg-blue-600 p-1.5 rounded text-white">
            <FileText size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight text-gray-900">ResumeAI</span>
        </div>
        
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700 hidden sm:block">Hi, {user.name}</span>
              <button 
                onClick={onStart}
                className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={onLoginClick}
                className="text-sm font-bold text-gray-600 hover:text-gray-900 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <LogIn size={16} /> Log In
              </button>
              <button 
                onClick={onLoginClick}
                className="text-sm font-bold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-all shadow-sm hover:shadow-md"
              >
                <UserPlus size={16} /> Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white pt-10 pb-32 px-6 flex-1 flex flex-col justify-center">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-8 animate-fade-in-up">
            <Sparkles size={16} />
            <span>Powered by Gemini AI 2.0</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight mb-6 leading-tight">
            Build your resume <br/>
            <span className="text-blue-600">faster with AI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Create professional, ATS-friendly resumes in minutes. Our AI analyzes your profile and optimizes it for your dream job.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={handleStart}
              className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200 flex items-center justify-center gap-2"
            >
              Create From Scratch <ArrowRight size={20} />
            </button>
            
            <div className="relative">
              <input 
                type="file" 
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.docx,.doc"
                onChange={handleFileChange}
              />
              <button 
                onClick={handleImportClick}
                disabled={isImporting}
                className="w-full px-8 py-4 bg-white text-gray-700 border border-gray-300 rounded-full font-bold text-lg hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
              >
                {isImporting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                    Parsing...
                  </>
                ) : (
                  <>
                    <FileUp size={20} /> Import Resume
                  </>
                )}
              </button>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500">Supported formats: PDF, DOCX</p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">AI Optimization</h3>
            <p className="text-gray-600 leading-relaxed">
              Get instant feedback on your resume. Our AI suggests improvements, keywords, and rewrites your summary for maximum impact.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <Layout size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Premium Templates</h3>
            <p className="text-gray-600 leading-relaxed">
              Choose from a gallery of professionally designed templates. Switch designs instantly without losing any data.
            </p>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-900">ATS Friendly</h3>
            <p className="text-gray-600 leading-relaxed">
              Ensure your resume gets past the bots. We analyze your content against industry standards to improve pass rates.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div id="pricing" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-gray-600">Start for free, upgrade for power.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition-colors">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-gray-900">₹0</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-gray-600 mb-8">Perfect for trying out the builder.</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-700">
                  <Check size={20} className="text-green-500" /> 3 Basic Templates
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <Check size={20} className="text-green-500" /> PDF Download
                </li>
                <li className="flex items-center gap-3 text-gray-700">
                  <Check size={20} className="text-green-500" /> Live Preview
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <Check size={20} className="text-gray-300" /> <span className="line-through">AI Optimization</span>
                </li>
                <li className="flex items-center gap-3 text-gray-400">
                  <Check size={20} className="text-gray-300" /> <span className="line-through">Premium Designs</span>
                </li>
              </ul>
              <button 
                onClick={handleStart}
                className="w-full py-3 px-6 border-2 border-gray-900 text-gray-900 rounded-xl font-bold hover:bg-gray-900 hover:text-white transition-colors"
              >
                Get Started Free
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-blue-600 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                Recommended
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-gray-900">₹499</span>
                <span className="text-gray-500">/month</span>
              </div>
              <p className="text-gray-600 mb-8">Everything you need to get hired.</p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-900 font-medium">
                  <div className="bg-blue-100 p-1 rounded-full text-blue-600"><Check size={14} /></div>
                  Unlimited AI Optimization
                </li>
                <li className="flex items-center gap-3 text-gray-900 font-medium">
                  <div className="bg-blue-100 p-1 rounded-full text-blue-600"><Check size={14} /></div>
                  Access to All 5+ Templates
                </li>
                <li className="flex items-center gap-3 text-gray-900 font-medium">
                  <div className="bg-blue-100 p-1 rounded-full text-blue-600"><Check size={14} /></div>
                  ATS Keyword Analysis
                </li>
                <li className="flex items-center gap-3 text-gray-900 font-medium">
                  <div className="bg-blue-100 p-1 rounded-full text-blue-600"><Check size={14} /></div>
                  Auto-Apply Suggestions
                </li>
                <li className="flex items-center gap-3 text-gray-900 font-medium">
                  <div className="bg-blue-100 p-1 rounded-full text-blue-600"><Check size={14} /></div>
                  Priority Support
                </li>
              </ul>
              <button 
                onClick={onSubscribe}
                className="w-full py-3 px-6 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Zap size={18} /> Upgrade to Pro
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
