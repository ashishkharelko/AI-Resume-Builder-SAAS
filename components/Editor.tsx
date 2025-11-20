
import React, { useState, useRef } from 'react';
import { ResumeData, Experience, Education, Project } from '../types';
import { Plus, Trash2, Sparkles, ChevronDown, ChevronUp, Loader2, Lock, Upload, X, Image as ImageIcon, Github } from 'lucide-react';
import { optimizeDescription } from '../services/geminiService';

interface EditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  isPro: boolean;
  onUpgrade: () => void;
}

export const Editor: React.FC<EditorProps> = ({ data, onChange, isPro, onUpgrade }) => {
  const [optimizingId, setOptimizingId] = useState<string | null>(null);
  const [expandedExp, setExpandedExp] = useState<string | null>(null);
  const [expandedProj, setExpandedProj] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (section: keyof ResumeData, value: any) => {
    onChange({ ...data, [section]: value });
  };

  const handlePersonalChange = (field: string, value: string) => {
    handleChange('personal', { ...data.personal, [field]: value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        handlePersonalChange('photo', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    handlePersonalChange('photo', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: crypto.randomUUID(),
      role: 'Job Title',
      company: 'Company Name',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    handleChange('experience', [newExp, ...data.experience]);
    setExpandedExp(newExp.id);
  };

  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    const updated = data.experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp);
    handleChange('experience', updated);
  };

  const removeExperience = (id: string) => {
    handleChange('experience', data.experience.filter(exp => exp.id !== id));
  };

  const addProject = () => {
    const newProj: Project = {
      id: crypto.randomUUID(),
      name: 'Project Name',
      link: '',
      description: ''
    };
    handleChange('projects', [newProj, ...data.projects]);
    setExpandedProj(newProj.id);
  };

  const updateProject = (id: string, field: keyof Project, value: any) => {
    const updated = data.projects.map(proj => proj.id === id ? { ...proj, [field]: value } : proj);
    handleChange('projects', updated);
  };

  const removeProject = (id: string) => {
    handleChange('projects', data.projects.filter(proj => proj.id !== id));
  };

  const handleOptimize = async (id: string, description: string, role: string) => {
    if (!isPro) {
      onUpgrade();
      return;
    }

    if (!description) return;
    setOptimizingId(id);
    try {
      const optimized = await optimizeDescription(description, role);
      // Check if it's an experience or project based on ID existence
      if (data.experience.some(e => e.id === id)) {
        updateExperience(id, 'description', optimized);
      } else if (data.projects.some(p => p.id === id)) {
        updateProject(id, 'description', optimized);
      }
    } catch (e) {
      alert('Failed to optimize. Check API Key.');
    } finally {
      setOptimizingId(null);
    }
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: crypto.randomUUID(),
      school: 'University',
      degree: 'Degree',
      year: '2024'
    };
    handleChange('education', [...data.education, newEdu]);
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    const updated = data.education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu);
    handleChange('education', updated);
  };

  const removeEducation = (id: string) => {
    handleChange('education', data.education.filter(edu => edu.id !== id));
  };

  const handleSkillsChange = (value: string) => {
    const skills = value.split(',').map(s => s.trim()).filter(s => s);
    handleChange('skills', skills);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Personal Details */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Details</h2>
        
        <div className="mb-6 flex items-start gap-4">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center overflow-hidden">
              {data.personal.photo ? (
                <img src={data.personal.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="text-gray-400" size={32} />
              )}
            </div>
            {data.personal.photo && (
              <button 
                onClick={removePhoto}
                className="absolute -top-1 -right-1 bg-red-500 text-white p-1 rounded-full shadow hover:bg-red-600 transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-2"
              >
                <Upload size={14} /> Upload Photo
              </button>
              <span className="text-xs text-gray-500">Max 2MB. Used in supported templates.</span>
            </div>
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handlePhotoUpload}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              value={data.personal.fullName}
              onChange={(e) => handlePersonalChange('fullName', e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              value={data.personal.email}
              onChange={(e) => handlePersonalChange('email', e.target.value)}
              placeholder="john@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              value={data.personal.phone}
              onChange={(e) => handlePersonalChange('phone', e.target.value)}
              placeholder="+1 234 567 890"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              value={data.personal.location}
              onChange={(e) => handlePersonalChange('location', e.target.value)}
              placeholder="New York, NY"
            />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn (Optional)</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              value={data.personal.linkedin}
              onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
              placeholder="linkedin.com/in/johndoe"
            />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">GitHub (Optional)</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              value={data.personal.github}
              onChange={(e) => handlePersonalChange('github', e.target.value)}
              placeholder="github.com/johndoe"
            />
          </div>
          <div className="col-span-2">
             <label className="block text-sm font-medium text-gray-700 mb-1">Website (Optional)</label>
            <input 
              type="text" 
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              value={data.personal.website}
              onChange={(e) => handlePersonalChange('website', e.target.value)}
              placeholder="portfolio.com"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Professional Summary</label>
            <textarea 
              rows={3}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              value={data.personal.summary}
              onChange={(e) => handlePersonalChange('summary', e.target.value)}
              placeholder="A brief overview of your career..."
            />
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Experience</h2>
          <button 
            onClick={addExperience}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus size={16} /> Add Position
          </button>
        </div>
        
        <div className="space-y-4">
          {data.experience.map((exp, index) => (
            <div key={exp.id} className="border rounded-lg p-4 bg-gray-50">
              <div 
                className="flex justify-between items-center cursor-pointer mb-2"
                onClick={() => setExpandedExp(expandedExp === exp.id ? null : exp.id)}
              >
                <div className="font-medium text-gray-900">{exp.role || 'New Role'} at {exp.company || 'Company'}</div>
                <div className="flex items-center gap-2">
                   <button 
                    onClick={(e) => { e.stopPropagation(); removeExperience(exp.id); }}
                    className="text-red-500 p-1 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                  {expandedExp === exp.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {expandedExp === exp.id && (
                <div className="grid grid-cols-2 gap-3 mt-4 animate-fadeIn">
                  <input 
                    className="col-span-2 p-2 border rounded bg-white" 
                    placeholder="Job Title" 
                    value={exp.role} 
                    onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                  />
                  <input 
                    className="col-span-2 p-2 border rounded bg-white" 
                    placeholder="Company" 
                    value={exp.company} 
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  />
                  <input 
                    className="p-2 border rounded bg-white" 
                    placeholder="Start Date" 
                    value={exp.startDate} 
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  />
                  <div className="flex gap-2">
                     <input 
                      className="p-2 border rounded bg-white flex-1" 
                      placeholder="End Date" 
                      value={exp.endDate} 
                      disabled={exp.current}
                      onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                    />
                    <label className="flex items-center gap-1 text-sm whitespace-nowrap">
                      <input 
                        type="checkbox" 
                        checked={exp.current}
                        onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                      /> Current
                    </label>
                  </div>
                  <div className="col-span-2 relative">
                    <div className="flex justify-between mb-1">
                      <label className="text-xs font-medium text-gray-600">Description</label>
                      <button 
                        onClick={() => handleOptimize(exp.id, exp.description, exp.role)}
                        disabled={optimizingId === exp.id || !exp.description}
                        className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
                      >
                        {optimizingId === exp.id ? <Loader2 size={12} className="animate-spin" /> : (isPro ? <Sparkles size={12} /> : <Lock size={12} />)}
                        {isPro ? 'AI Optimize' : 'Unlock AI'}
                      </button>
                    </div>
                    <textarea 
                      rows={4}
                      className="w-full p-2 border rounded bg-white"
                      placeholder="Describe your responsibilities..."
                      value={exp.description}
                      onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
          <button 
            onClick={addProject}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <Plus size={16} /> Add Project
          </button>
        </div>
        
        <div className="space-y-4">
          {data.projects.map((proj) => (
            <div key={proj.id} className="border rounded-lg p-4 bg-gray-50">
              <div 
                className="flex justify-between items-center cursor-pointer mb-2"
                onClick={() => setExpandedProj(expandedProj === proj.id ? null : proj.id)}
              >
                <div className="font-medium text-gray-900">{proj.name || 'Project Name'}</div>
                <div className="flex items-center gap-2">
                   <button 
                    onClick={(e) => { e.stopPropagation(); removeProject(proj.id); }}
                    className="text-red-500 p-1 hover:bg-red-50 rounded"
                  >
                    <Trash2 size={14} />
                  </button>
                  {expandedProj === proj.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </div>

              {expandedProj === proj.id && (
                <div className="grid grid-cols-2 gap-3 mt-4 animate-fadeIn">
                  <input 
                    className="col-span-2 md:col-span-1 p-2 border rounded bg-white" 
                    placeholder="Project Name" 
                    value={proj.name} 
                    onChange={(e) => updateProject(proj.id, 'name', e.target.value)}
                  />
                  <input 
                    className="col-span-2 md:col-span-1 p-2 border rounded bg-white" 
                    placeholder="Link (URL)" 
                    value={proj.link} 
                    onChange={(e) => updateProject(proj.id, 'link', e.target.value)}
                  />
                  <div className="col-span-2 relative">
                    <div className="flex justify-between mb-1">
                      <label className="text-xs font-medium text-gray-600">Description</label>
                      <button 
                        onClick={() => handleOptimize(proj.id, proj.description, "Project")}
                        disabled={optimizingId === proj.id || !proj.description}
                        className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50"
                      >
                        {optimizingId === proj.id ? <Loader2 size={12} className="animate-spin" /> : (isPro ? <Sparkles size={12} /> : <Lock size={12} />)}
                        {isPro ? 'AI Optimize' : 'Unlock AI'}
                      </button>
                    </div>
                    <textarea 
                      rows={3}
                      className="w-full p-2 border rounded bg-white"
                      placeholder="Describe the project..."
                      value={proj.description}
                      onChange={(e) => updateProject(proj.id, 'description', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
        <textarea
          className="w-full p-3 border rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="React, TypeScript, Tailwind CSS, Project Management (comma separated)"
          value={data.skills.join(', ')}
          onChange={(e) => handleSkillsChange(e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-2">Separate skills with commas.</p>
      </section>

      {/* Education */}
      <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Education</h2>
          <button onClick={addEducation} className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
            <Plus size={16} /> Add
          </button>
        </div>
        <div className="space-y-3">
          {data.education.map((edu) => (
            <div key={edu.id} className="flex gap-2 items-start">
              <div className="grid grid-cols-3 gap-2 flex-1">
                <input 
                  className="p-2 border rounded bg-gray-50 col-span-1" 
                  placeholder="School" 
                  value={edu.school} 
                  onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                />
                <input 
                  className="p-2 border rounded bg-gray-50 col-span-1" 
                  placeholder="Degree" 
                  value={edu.degree} 
                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                />
                <input 
                  className="p-2 border rounded bg-gray-50 col-span-1" 
                  placeholder="Year" 
                  value={edu.year} 
                  onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                />
              </div>
              <button onClick={() => removeEducation(edu.id)} className="p-2 text-gray-400 hover:text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
