
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { ResumeData, TemplateId, ATSAnalysis, User } from './types';
import { Editor } from './components/Editor';
import { ResumePreview } from './components/ResumePreview';
import { LandingPage } from './components/LandingPage';
import { PaymentModal } from './components/PaymentModal';
import { AuthModal } from './components/AuthModal';
import { analyzeATS, parseResumeFromText } from './services/geminiService';
import { extractTextFromFile } from './services/fileParserService';
import { generateDocx } from './services/docxService';
import { authService } from './services/authService';
import saveAs from 'file-saver';
import { FileText, Download, Layout, Sparkles, CheckCircle, AlertCircle, X, Check, Lock, Zap, ArrowLeft, Plus, Eye, SplitSquareHorizontal, Printer, FileType, Save, LogOut, User as UserIcon, Loader2 } from 'lucide-react';

// Declare html2pdf for TypeScript
declare const html2pdf: any;

const initialData: ResumeData = {
  personal: {
    fullName: 'Alex Morgan',
    jobTitle: 'Senior Full Stack Engineer',
    email: 'alex.morgan@example.com',
    phone: '+1 (555) 123-4567',
    linkedin: 'linkedin.com/in/alexmorgan',
    github: 'github.com/alexmorgan',
    website: 'alexmorgan.dev',
    location: 'San Francisco, CA',
    summary: 'Innovative Software Engineer with 5+ years of experience in full-stack development. Proven track record of delivering high-quality web applications. Passionate about clean code and user-centric design.',
    photo: '' 
  },
  experience: [
    {
      id: '1',
      role: 'Senior Frontend Developer',
      company: 'TechNova Solutions',
      startDate: '2021',
      endDate: 'Present',
      current: true,
      description: 'Led a team of 5 developers to rebuild the core product dashboard using React and TypeScript, resulting in a 40% improvement in load times. Implemented CI/CD pipelines to streamline deployment.'
    },
    {
      id: '2',
      role: 'Web Developer',
      company: 'Creative Pulse',
      startDate: '2018',
      endDate: '2021',
      current: false,
      description: 'Developed responsive websites for diverse clients using HTML, CSS, and JavaScript. Collaborated with designers to ensure pixel-perfect implementation of UI/UX designs.'
    }
  ],
  projects: [
    {
      id: '1',
      name: 'E-Commerce Platform',
      link: 'github.com/alexmorgan/shop-app',
      description: 'Built a fully functional e-commerce platform using Next.js, Stripe, and MongoDB. Features include user authentication, cart management, and secure checkout.'
    }
  ],
  education: [
    {
      id: '1',
      degree: 'B.S. Computer Science',
      school: 'University of Tech',
      year: '2018'
    }
  ],
  skills: ['JavaScript', 'React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'Git', 'Agile']
};

const TEMPLATES: { id: TemplateId; name: string; description: string; isPremium?: boolean; hasPhoto?: boolean }[] = [
  { id: 'modern', name: 'Modern', description: 'Clean and structured with blue accents, perfect for tech roles.', hasPhoto: true },
  { id: 'classic', name: 'Classic', description: 'Traditional serif font layout, elegant and timeless.', hasPhoto: true },
  { id: 'minimal', name: 'Minimal', description: 'Simple, side-bar layout that focuses on content over style.', hasPhoto: true },
  { id: 'polished', name: 'Polished', description: 'Modern layout with profile photo, great for general use.', hasPhoto: true },
  { id: 'elegant', name: 'Elegant', description: 'Sophisticated centered design with photo support.', hasPhoto: true },
  { id: 'professional', name: 'Professional', description: 'A serious, two-column layout suitable for corporate environments.', isPremium: true, hasPhoto: true },
  { id: 'creative', name: 'Creative', description: 'Bold colors and serif headings for design and creative roles.', isPremium: true, hasPhoto: true },
  { id: 'executive', name: 'Executive', description: 'High-end dark sidebar design with photo for senior roles.', isPremium: true, hasPhoto: true },
];

// Helper Components for Visualization
const CircularProgress = ({ score, size = 120, strokeWidth = 10 }: { score: number; size?: number; strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;
  
  const color = score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500';
  const bgColor = score >= 80 ? 'text-green-100' : score >= 60 ? 'text-yellow-100' : 'text-red-100';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className={bgColor}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`transition-all duration-1000 ease-out ${color}`}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-3xl font-bold text-gray-900`}>{score}</span>
        <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Score</span>
      </div>
    </div>
  );
};

const ScoreBar = ({ label, score }: { label: string; score: number }) => {
  const color = score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">{score}/100</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className={`h-2 rounded-full transition-all duration-1000 ${color}`} style={{ width: `${score}%` }}></div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'builder'>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [isGuestPro, setIsGuestPro] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [resumeData, setResumeData] = useState<ResumeData>(initialData);
  const [activeTemplate, setActiveTemplate] = useState<TemplateId>('modern');
  const [analysis, setAnalysis] = useState<ATSAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isDownloading, setIsDownloading] = useState<'pdf' | 'docx' | null>(null);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showTemplateGallery, setShowTemplateGallery] = useState(false);
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);
  // Dedicated ref for PDF generation
  const pdfComponentRef = useRef<HTMLDivElement>(null);

  // Check authentication status on mount
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  // Load saved resume OR Reset for New User
  useEffect(() => {
    const loadResume = async () => {
      if (user) {
        const saved = await authService.getResume(user.id);
        if (saved) {
          setResumeData(saved);
        } else {
          // NEW USER: Reset "Alex Morgan" data to User's default
          const newData = JSON.parse(JSON.stringify(initialData)) as ResumeData;
          newData.personal.fullName = user.name;
          newData.personal.email = user.email;
          newData.personal.phone = '';
          newData.personal.summary = '';
          newData.personal.linkedin = '';
          newData.personal.github = '';
          newData.personal.website = '';
          newData.personal.location = '';
          // Use the photo from google login if available
          newData.personal.photo = user.photoUrl || '';
          newData.experience = [];
          newData.projects = [];
          newData.education = [];
          newData.skills = [];
          setResumeData(newData);
        }
      }
    };
    loadResume();
  }, [user]);

  // Independent effect to sync photo if user has one but resume doesn't
  useEffect(() => {
    if (user?.photoUrl && !resumeData.personal.photo) {
      setResumeData(prev => ({
        ...prev,
        personal: {
           ...prev.personal,
           photo: user.photoUrl || ''
        }
      }));
    }
  }, [user?.photoUrl]);

  // Effect for triggering PDF download once the temporary view is rendered
  useEffect(() => {
    if (isDownloading === 'pdf' && pdfComponentRef.current) {
      // Give a small delay to ensure DOM paint
      setTimeout(() => {
        const element = pdfComponentRef.current;
        if (!element) return;

        const opt = {
          margin: 0,
          filename: `${resumeData.personal.fullName.replace(/\s+/g, '_')}_Resume.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, scrollY: 0 }, // Removed windowWidth to fix right margin issue
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        if (typeof html2pdf !== 'undefined') {
          html2pdf().from(element).set(opt).save().then(() => {
             setIsDownloading(null);
          });
        } else {
          alert('PDF library not loaded. Please check your internet connection.');
          setIsDownloading(null);
        }
      }, 200);
    }
  }, [isDownloading, resumeData]);

  const isPro = user?.isPro || isGuestPro;

  // Compute Optimized Data for Comparison
  const optimizedData = useMemo(() => {
    if (!analysis) return null;
    const clone = JSON.parse(JSON.stringify(resumeData)) as ResumeData;
    
    if (analysis.rewrittenSummary) {
      clone.personal.summary = analysis.rewrittenSummary;
    }

    if (analysis.missingKeywords && analysis.missingKeywords.length > 0) {
      const existingSkillsLower = clone.skills.map(s => s.toLowerCase());
      const newKeywords = analysis.missingKeywords.filter(k => !existingSkillsLower.includes(k.toLowerCase()));
      clone.skills = [...clone.skills, ...newKeywords];
    }
    
    return clone;
  }, [resumeData, analysis]);

  const handlePrint = () => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const handleDownloadPDF = () => {
    setIsDownloading('pdf');
  };

  const handleDownloadDOCX = async () => {
    setIsDownloading('docx');
    try {
      const blob = await generateDocx(resumeData);
      saveAs(blob, `${resumeData.personal.fullName.replace(/\s+/g, '_')}_Resume.docx`);
    } catch (error) {
      console.error("DOCX generation failed", error);
      alert("Failed to generate Word document.");
    } finally {
      setIsDownloading(null);
    }
  };

  const handleImportResume = async (file: File) => {
    setIsImporting(true);
    try {
      const rawText = await extractTextFromFile(file);
      const parsedData = await parseResumeFromText(rawText);
      setResumeData(parsedData);
      setCurrentView('builder');
      alert("Resume imported successfully! Please review the data.");
    } catch (error) {
      console.error("Import failed", error);
      alert("Failed to import resume. Please check the file format (PDF/DOCX) and try again.");
    } finally {
      setIsImporting(false);
    }
  };

  const runAnalysis = async () => {
    if (!isPro) {
      setShowPaymentModal(true);
      return;
    }

    setIsAnalyzing(true);
    setShowAnalysisModal(true);
    setAnalysis(null); 
    
    try {
      const result = await analyzeATS(resumeData);
      setAnalysis(result);
    } catch (error) {
      console.error("Full error:", error);
      setAnalysis({
        score: 0,
        breakdown: { keywords: 0, impact: 0, formatting: 0 },
        suggestions: ["Could not complete analysis. Please check your internet connection or API Key."],
        missingKeywords: [],
        rewrittenSummary: ""
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAutoApply = (type: 'all' | 'keywords' | 'summary') => {
    if (!analysis) return;
    let newData: ResumeData = JSON.parse(JSON.stringify(resumeData));
    let newAnalysis = { ...analysis };
    let changesMade = false;

    if (type === 'all' || type === 'keywords') {
      if (analysis.missingKeywords && analysis.missingKeywords.length > 0) {
        const existingSkillsLower = newData.skills.map(s => s.toLowerCase());
        const newKeywords = analysis.missingKeywords.filter(k => !existingSkillsLower.includes(k.toLowerCase()));
        
        if (newKeywords.length > 0) {
          newData.skills = [...newData.skills, ...newKeywords];
          changesMade = true;
        }
        newAnalysis.missingKeywords = [];
      }
    }

    if (type === 'all' || type === 'summary') {
      if (analysis.rewrittenSummary) {
        if (analysis.rewrittenSummary !== newData.personal.summary) {
          newData.personal.summary = analysis.rewrittenSummary;
          changesMade = true;
        }
        newAnalysis.rewrittenSummary = ""; 
      }
    }

    setResumeData(newData);
    setAnalysis(newAnalysis);

    if (changesMade) {
      alert('Optimizations applied successfully! Your resume has been updated.');
    } else {
      alert('Suggestions have been applied or were already present in your resume.');
    }
  };

  const handleSave = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    
    setIsSaving(true);
    try {
      await authService.saveResume(user.id, resumeData);
      alert("Resume saved successfully!");
    } catch (e) {
      alert("Failed to save resume.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setIsGuestPro(false);
    setResumeData(initialData); 
  };

  const selectTemplate = (templateId: TemplateId, isPremium: boolean = false) => {
    if (isPremium && !isPro) {
      setShowTemplateGallery(false);
      setShowPaymentModal(true);
      return;
    }
    setActiveTemplate(templateId);
    setShowTemplateGallery(false);
  };

  const handlePaymentSuccess = async () => {
    if (user) {
      await authService.upgradeUser(user.id);
      // Refresh user state from source of truth to ensure consistency
      const updatedUser = authService.getCurrentUser();
      if (updatedUser) setUser(updatedUser);
    } else {
      // Allow guest access for this session
      setIsGuestPro(true);
    }
    setShowPaymentModal(false);
    if (currentView === 'landing') setCurrentView('builder');
  };

  if (currentView === 'landing') {
    return (
      <>
        <LandingPage 
          onStart={() => setCurrentView('builder')} 
          onSubscribe={() => {
            // For landing page, we encourage login but allow guest payment
            if (!user) {
               setShowAuthModal(true);
            } else {
               setShowPaymentModal(true);
            }
          }}
          onImport={handleImportResume}
          isImporting={isImporting}
          user={user}
          onLoginClick={() => setShowAuthModal(true)}
          onLogout={handleLogout}
        />
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLogin={(u) => {
             setUser(u);
             setShowAuthModal(false);
             if (!u.isPro) setShowPaymentModal(true); // Optional: prompt upgrade after login from landing page
          }}
        />
        <PaymentModal 
          isOpen={showPaymentModal} 
          onClose={() => setShowPaymentModal(false)} 
          onSuccess={handlePaymentSuccess}
          userData={user ? { name: user.name, email: user.email, phone: '' } : undefined}
        />
      </>
    );
  }

  return (
    <>
      <div id="app-content" className="min-h-screen bg-gray-100 flex flex-col font-sans">
        {/* Navigation */}
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentView('landing')}>
              <div className="bg-blue-600 p-1.5 rounded text-white">
                <FileText size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-900">ResumeAI</span>
              {isPro && <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full ml-2">PRO</span>}
            </div>
            
            <div className="flex items-center gap-3">
              {/* Auth State */}
              {user ? (
                 <div className="flex items-center gap-3 mr-2">
                    {user.photoUrl ? (
                       <img src={user.photoUrl} alt={user.name} className="w-8 h-8 rounded-full border border-gray-200 object-cover" />
                    ) : (
                       <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xs">
                          {user.name.charAt(0)}
                       </div>
                    )}
                    <span className="text-sm font-medium text-gray-700 hidden md:block">Hi, {user.name}</span>
                    <button 
                      onClick={handleSave}
                      className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded transition-colors"
                    >
                      {isSaving ? <div className="animate-spin h-3 w-3 border-2 border-blue-600 border-t-transparent rounded-full"/> : <Save size={16}/>}
                      Save
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="text-gray-400 hover:text-red-500 p-1.5 rounded hover:bg-gray-100"
                      title="Logout"
                    >
                       <LogOut size={18} />
                    </button>
                 </div>
              ) : (
                <div className="flex items-center gap-2 mr-2">
                   <button 
                     onClick={() => setShowAuthModal(true)}
                     className="text-sm font-bold text-gray-700 hover:text-blue-600 px-3 py-2"
                   >
                     Log In
                   </button>
                   <button 
                     onClick={() => setShowAuthModal(true)}
                     className="text-sm font-bold bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                   >
                     Sign Up
                   </button>
                </div>
              )}
              
              {!isPro && (
                <button 
                  onClick={() => setShowPaymentModal(true)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 font-bold transition-colors text-sm border border-yellow-200"
                >
                  <Lock size={14} /> Upgrade to Pro
                </button>
              )}

              <button 
                onClick={() => setShowTemplateGallery(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
              >
                <Layout size={18} />
                <span className="hidden sm:inline">Templates</span>
              </button>

              <div className="h-6 w-px bg-gray-300 mx-1 hidden sm:block"></div>

              <button 
                onClick={runAnalysis}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors border ${
                  isPro 
                  ? 'bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-200' 
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border-gray-200'
                }`}
              >
                {isPro ? <Sparkles size={18} /> : <Lock size={14} />}
                <span className="hidden sm:inline">ATS Check</span>
              </button>

              <button 
                onClick={() => setShowFullPreview(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 font-medium shadow-sm transition-colors"
                title="Preview Resume"
              >
                <Eye size={18} />
                <span className="hidden sm:inline">Preview</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
          
          {/* Left: Editor */}
          <div className="w-full lg:w-1/2 xl:w-5/12 overflow-y-auto max-h-[calc(100vh-6rem)] custom-scrollbar pr-2">
             <div className="mb-4 lg:hidden">
                <button onClick={() => setCurrentView('landing')} className="text-sm text-gray-500 flex items-center gap-1">
                   <ArrowLeft size={14} /> Back to Home
                </button>
             </div>
            <Editor 
              data={resumeData} 
              onChange={setResumeData} 
              isPro={isPro} 
              onUpgrade={() => setShowPaymentModal(true)} 
            />
          </div>

          {/* Right: Live Preview (Screen Only) */}
          <div className="w-full lg:w-1/2 xl:w-7/12 hidden lg:flex justify-center items-start sticky top-24">
            <div className="relative group w-full flex justify-center">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-purple-200 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-200"></div>
              <div className="relative shadow-xl ring-1 ring-black/5 bg-white rounded-sm overflow-hidden">
                {/* Scale Down for Split View or Single View */}
                 <div className={`scale-[0.6] lg:scale-[0.65] xl:scale-[0.75] origin-top transition-all duration-300 ${isCompareMode ? 'flex gap-8' : ''}`}>
                   
                   {/* Original / Current */}
                   <div>
                     {isCompareMode && <div className="text-center mb-2 font-bold text-gray-500 uppercase tracking-wider text-sm">Original</div>}
                     {/* Note: previewRef is used here for visual DOM manipulations if needed */}
                     <ResumePreview data={resumeData} template={activeTemplate} previewRef={previewRef} />
                   </div>

                   {/* Optimized (Compare Mode) */}
                   {isCompareMode && optimizedData && (
                     <div>
                       <div className="text-center mb-2 font-bold text-purple-600 uppercase tracking-wider text-sm flex items-center justify-center gap-2">
                         <Sparkles size={14} /> AI Optimized
                       </div>
                       <ResumePreview data={optimizedData} template={activeTemplate} />
                     </div>
                   )}
                 </div>
              </div>
            </div>
          </div>

          {/* Mobile Preview */}
          <div className="lg:hidden w-full overflow-x-auto bg-gray-200 p-4 rounded">
            <div className="min-w-[210mm] scale-[0.5] origin-top-left bg-white shadow-lg">
              <ResumePreview data={resumeData} template={activeTemplate} />
            </div>
          </div>
        </main>

        {/* Full Screen Preview Modal */}
        {showFullPreview && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-gray-100 rounded-lg w-full h-full max-w-[95vw] max-h-[95vh] flex flex-col overflow-hidden relative">
               {/* Toolbar */}
               <div className="bg-white p-4 border-b flex flex-wrap gap-4 justify-between items-center shadow-sm z-10">
                  <div className="flex items-center gap-4">
                     <h3 className="font-bold text-lg text-gray-900">Preview & Download</h3>
                     {isCompareMode ? (
                       <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded font-medium flex items-center gap-1">
                         <SplitSquareHorizontal size={14}/> Split View
                       </span>
                     ) : (
                       <span className="text-sm text-gray-500">A4 Format</span>
                     )}
                  </div>
                  <div className="flex items-center gap-3">
                     {analysis && (
                       <button
                         onClick={() => setIsCompareMode(!isCompareMode)}
                         className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium transition-colors border ${
                           isCompareMode ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-purple-600 border-purple-200 hover:bg-purple-50'
                         }`}
                       >
                         <SplitSquareHorizontal size={18} />
                         <span className="hidden sm:inline">{isCompareMode ? 'Exit Compare' : 'Compare vs AI'}</span>
                       </button>
                     )}

                     {/* Download DOCX */}
                     <button 
                      onClick={handleDownloadDOCX}
                      disabled={isDownloading !== null}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 font-medium transition-colors disabled:opacity-50"
                     >
                       {isDownloading === 'docx' ? <div className="animate-spin h-4 w-4 border-2 border-blue-700 border-t-transparent rounded-full"/> : <FileType size={18} />}
                       <span className="hidden sm:inline">Word (DOCX)</span>
                     </button>

                     {/* Download PDF */}
                     <button 
                      onClick={handleDownloadPDF}
                      disabled={isDownloading !== null}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-sm transition-colors disabled:opacity-50"
                     >
                       {isDownloading === 'pdf' ? <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"/> : <Download size={18} />}
                       Download PDF
                     </button>
                     
                     {/* Native Print */}
                     <button 
                      onClick={handlePrint}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                      title="Print"
                     >
                        <Printer size={20} />
                     </button>

                     <button onClick={() => setShowFullPreview(false)} className="p-2 text-gray-500 hover:bg-gray-100 rounded-full">
                       <X size={24} />
                     </button>
                  </div>
               </div>
               
               {/* Preview Area */}
               <div className="flex-1 overflow-auto bg-gray-500/50 p-8 flex justify-center">
                  <div className={`transition-all duration-300 ${isCompareMode ? 'flex gap-10' : ''}`}>
                     {/* Original */}
                     <div className={`shadow-2xl bg-white ${isCompareMode ? 'scale-[0.8] origin-top' : ''}`}>
                        {isCompareMode && <div className="bg-white/90 backdrop-blur p-2 mb-2 text-center font-bold text-gray-700 rounded shadow-sm">Current Version</div>}
                        <ResumePreview data={resumeData} template={activeTemplate} />
                     </div>

                     {/* Optimized */}
                     {isCompareMode && optimizedData && (
                       <div className="shadow-2xl bg-white scale-[0.8] origin-top">
                          <div className="bg-purple-600 text-white p-2 mb-2 text-center font-bold rounded shadow-sm flex items-center justify-center gap-2">
                            <Sparkles size={16}/> AI Optimized
                          </div>
                          <ResumePreview data={optimizedData} template={activeTemplate} />
                       </div>
                     )}
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Template Gallery Modal */}
        {showTemplateGallery && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-xl lg:max-w-6xl h-[90vh] flex flex-col overflow-hidden">
              <div className="p-6 bg-white border-b flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Choose a Template</h3>
                  <p className="text-gray-500 text-sm">Select a design that best fits your industry and style.</p>
                </div>
                <button onClick={() => setShowTemplateGallery(false)} className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {TEMPLATES.map((template) => (
                    <div 
                      key={template.id}
                      onClick={() => selectTemplate(template.id, template.isPremium)}
                      className={`group relative rounded-xl overflow-hidden cursor-pointer transition-all duration-300 border-2 ${
                        activeTemplate === template.id 
                          ? 'border-blue-600 ring-4 ring-blue-50 shadow-xl' 
                          : 'border-transparent hover:border-gray-300 hover:shadow-lg'
                      }`}
                    >
                      <div className="bg-gray-200 h-[400px] overflow-hidden relative">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 scale-[0.35] origin-top mt-4 shadow-lg pointer-events-none select-none bg-white">
                           <ResumePreview data={resumeData} template={template.id} />
                        </div>
                        
                        {template.isPremium && !isPro && (
                          <div className="absolute top-3 right-3 bg-yellow-400 text-yellow-900 p-1.5 rounded-full shadow-lg z-10">
                            <Lock size={16} />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                           <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform flex items-center gap-2">
                             {template.isPremium && !isPro ? <><Lock size={14}/> Unlock</> : 'Use Template'}
                           </button>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 border-t">
                        <div className="flex justify-between items-center">
                          <h4 className="font-bold text-lg text-gray-900">{template.name}</h4>
                          {activeTemplate === template.id && (
                            <span className="bg-blue-100 text-blue-700 p-1 rounded-full">
                              <Check size={16} />
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                        {template.hasPhoto && (
                           <p className="text-xs text-blue-600 mt-2 font-medium flex items-center gap-1">
                              <Sparkles size={10} /> Supports Photo
                           </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Modal */}
        {showAnalysisModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-slideIn">
              <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-purple-50 to-white">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="text-purple-600" /> ATS Optimization Analysis
                </h3>
                <button onClick={() => setShowAnalysisModal(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                    <p className="text-gray-500 animate-pulse">Analyzing content with Gemini AI...</p>
                  </div>
                ) : analysis ? (
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                      <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-shrink-0">
                          <CircularProgress score={analysis.score} />
                        </div>
                        
                        <div className="flex-1 w-full space-y-4">
                          {analysis.breakdown && (
                            <>
                               <ScoreBar label="Keywords" score={analysis.breakdown.keywords} />
                               <ScoreBar label="Impact & Achievements" score={analysis.breakdown.impact} />
                               <ScoreBar label="Formatting & Clarity" score={analysis.breakdown.formatting} />
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="mt-4 text-center md:text-left">
                         <p className="text-sm text-gray-600">
                          Your resume is <strong>{analysis.score}%</strong> optimized for standard ATS algorithms.
                          {analysis.score >= 80 ? ' Excellent work!' : ' Apply suggestions below to improve.'}
                        </p>
                      </div>
                    </div>

                    {analysis.rewrittenSummary && (
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
                          <h5 className="font-semibold text-gray-900 flex items-center gap-2">
                             Suggested Summary
                          </h5>
                          <button 
                            onClick={() => handleAutoApply('summary')}
                            className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-full hover:bg-purple-700 transition-colors flex items-center gap-1 shadow-sm"
                          >
                            <Check size={12} /> Apply
                          </button>
                        </div>
                        <div className="p-4 text-sm text-gray-700 leading-relaxed italic">
                          "{analysis.rewrittenSummary}"
                        </div>
                      </div>
                    )}

                    {analysis.missingKeywords && analysis.missingKeywords.length > 0 && (
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <div className="flex justify-between items-center mb-3">
                          <h5 className="font-semibold text-gray-900 flex items-center gap-2">
                            <CheckCircle size={16} className="text-blue-500" /> Missing Keywords
                          </h5>
                          <button 
                            onClick={() => handleAutoApply('keywords')}
                            className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-full hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-sm"
                          >
                            <Plus size={12} /> Add Keywords
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {analysis.missingKeywords.map((kw, i) => (
                            <span key={i} className="text-xs font-medium bg-white text-blue-700 px-2 py-1 rounded-full border border-blue-200 shadow-sm">
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {((analysis.missingKeywords && analysis.missingKeywords.length > 0) || analysis.rewrittenSummary) && (
                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-100 text-center">
                         <h5 className="font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                           <Zap size={16} className="text-purple-600" /> Boost Your Score
                         </h5>
                         <button 
                          onClick={() => handleAutoApply('all')}
                          className="w-full py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-md"
                         >
                           <Sparkles size={16} /> Apply All Suggestions
                         </button>
                      </div>
                    )}

                    <div>
                      <h5 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <AlertCircle size={16} className="text-orange-500" /> Improvement Tips
                      </h5>
                      <ul className="space-y-2">
                        {analysis.suggestions.map((sugg, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                             <span className="mt-0.5 text-orange-500">•</span> {sugg}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-3">
                      <AlertCircle size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Analysis Failed</h3>
                    <p className="text-gray-500 max-w-xs mx-auto mb-4">
                      We couldn't complete the ATS check. This usually happens if the API key is invalid or network is unreachable.
                    </p>
                    <button 
                      onClick={runAnalysis} 
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </div>
              
              <div className="bg-gray-50 p-4 flex justify-end">
                <button 
                  onClick={() => setShowAnalysisModal(false)}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          onLogin={(u) => {
            setUser(u);
            setShowAuthModal(false);
          }}
        />

        <PaymentModal 
          isOpen={showPaymentModal} 
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
          userData={user ? { name: user.name, email: user.email, phone: '' } : undefined}
        />
      </div>

      {/* PDF Generation Overlay - Only visible during generation to ensure correct layout capture */}
      {isDownloading === 'pdf' && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                <p className="text-gray-700 font-medium">Preparing PDF...</p>
            </div>
            {/* Off-screen render container - Fixed to A4 width at top-left */}
            <div className="fixed left-0 top-0 w-[210mm] bg-white z-[-1] opacity-0 pointer-events-none">
                <div ref={pdfComponentRef}>
                   <ResumePreview data={resumeData} template={activeTemplate} staticMode={true} />
                </div>
            </div>
        </div>
      )}

      {/* PRINT CONTENT - Only visible during browser print action */}
      <div id="print-content">
         <ResumePreview data={resumeData} template={activeTemplate} staticMode={true} />
      </div>
    </>
  );
};

export default App;
