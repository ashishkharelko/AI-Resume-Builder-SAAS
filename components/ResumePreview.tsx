import React from 'react';
import { ResumeData, TemplateId } from '../types';
import { MapPin, Mail, Phone, Linkedin, Globe, Briefcase, GraduationCap, User, Github, FolderKanban } from 'lucide-react';

interface Props {
  data: ResumeData;
  template: TemplateId;
  previewRef?: React.RefObject<HTMLDivElement | null>;
}

/* --- MODERN TEMPLATE --- */
const ModernTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="w-full h-full bg-white p-8 text-gray-800">
    <header className="border-b-4 border-blue-600 pb-6 mb-6 flex justify-between items-end">
      <div className="flex items-center gap-6">
        {data.personal.photo && (
          <img src={data.personal.photo} alt={data.personal.fullName} className="w-24 h-24 rounded-full object-cover border-2 border-blue-600 flex-shrink-0" />
        )}
        <div>
          <h1 className="text-4xl font-bold text-blue-900 uppercase tracking-wide">{data.personal.fullName}</h1>
          <p className="text-lg text-blue-600 font-medium mt-1">Experienced Professional</p>
        </div>
      </div>
      <div className="text-right text-sm text-gray-600 space-y-1">
         <div className="flex items-center justify-end gap-2"><Mail size={14} /> {data.personal.email}</div>
         <div className="flex items-center justify-end gap-2"><Phone size={14} /> {data.personal.phone}</div>
         {data.personal.location && <div className="flex items-center justify-end gap-2"><MapPin size={14} /> {data.personal.location}</div>}
         {data.personal.linkedin && <div className="flex items-center justify-end gap-2"><Linkedin size={14} /> {data.personal.linkedin}</div>}
         {data.personal.github && <div className="flex items-center justify-end gap-2"><Github size={14} /> {data.personal.github}</div>}
      </div>
    </header>

    <div className="grid grid-cols-12 gap-8">
      <div className="col-span-8 space-y-6">
        <section>
          <h3 className="text-blue-900 font-bold text-xl border-b border-gray-200 pb-1 mb-3">Professional Summary</h3>
          <p className="text-sm leading-relaxed text-gray-700">{data.personal.summary || "No summary provided."}</p>
        </section>

        <section>
          <h3 className="text-blue-900 font-bold text-xl border-b border-gray-200 pb-1 mb-3">Experience</h3>
          <div className="space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <h4 className="font-bold text-gray-900">{exp.role}</h4>
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-sm font-semibold text-gray-600 mb-1">{exp.company}</div>
                <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">{exp.description}</p>
              </div>
            ))}
             {data.experience.length === 0 && <p className="text-sm text-gray-400 italic">Add experience to see it here.</p>}
          </div>
        </section>

        {data.projects.length > 0 && (
          <section>
            <h3 className="text-blue-900 font-bold text-xl border-b border-gray-200 pb-1 mb-3">Projects</h3>
            <div className="space-y-4">
              {data.projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline">
                    <h4 className="font-bold text-gray-900">{proj.name}</h4>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                        <Globe size={10} /> View
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed mt-1">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="col-span-4 space-y-6">
        <section className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-blue-900 font-bold text-lg mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, idx) => (
              <span key={idx} className="bg-white text-blue-800 text-xs font-medium px-2 py-1 rounded shadow-sm border border-blue-100">
                {skill}
              </span>
            ))}
             {data.skills.length === 0 && <p className="text-xs text-gray-400 italic">Add skills...</p>}
          </div>
        </section>

        <section>
          <h3 className="text-blue-900 font-bold text-lg border-b border-gray-200 pb-1 mb-3">Education</h3>
          <div className="space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <h4 className="font-bold text-sm">{edu.school}</h4>
                <p className="text-sm text-gray-700">{edu.degree}</p>
                <p className="text-xs text-gray-500">{edu.year}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  </div>
);

/* --- CLASSIC TEMPLATE --- */
const ClassicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="w-full h-full bg-white p-10 font-serif text-gray-900">
    <div className="text-center border-b-2 border-black pb-6 mb-6">
      {data.personal.photo && (
        <div className="flex justify-center mb-4">
          <img src={data.personal.photo} alt={data.personal.fullName} className="w-28 h-28 rounded-full object-cover border border-gray-300" />
        </div>
      )}
      <h1 className="text-3xl font-bold tracking-widest mb-2">{data.personal.fullName}</h1>
      <div className="flex justify-center gap-4 text-sm italic text-gray-700 flex-wrap">
        <span>{data.personal.email}</span>
        <span>•</span>
        <span>{data.personal.phone}</span>
        {data.personal.location && (
          <><span>•</span><span>{data.personal.location}</span></>
        )}
         {data.personal.linkedin && (
          <><span>•</span><span>{data.personal.linkedin}</span></>
        )}
        {data.personal.github && (
          <><span>•</span><span>{data.personal.github}</span></>
        )}
      </div>
    </div>

    <div className="space-y-6">
      {data.personal.summary && (
        <section>
          <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-3">Summary</h2>
          <p className="text-sm leading-7">{data.personal.summary}</p>
        </section>
      )}

      <section>
        <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-3">Professional Experience</h2>
        <div className="space-y-5">
          {data.experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-base">{exp.company}</h3>
                <span className="text-sm italic">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
              </div>
              <div className="text-sm font-semibold italic mb-2">{exp.role}</div>
              <p className="text-sm leading-6">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>

      {data.projects.length > 0 && (
        <section>
          <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-3">Projects</h2>
          <div className="space-y-4">
            {data.projects.map((proj) => (
              <div key={proj.id}>
                 <div className="flex justify-between items-baseline mb-1">
                   <h3 className="font-bold text-base">{proj.name}</h3>
                   {proj.link && <span className="text-sm italic">{proj.link}</span>}
                 </div>
                 <p className="text-sm leading-6">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-3">Education</h2>
        {data.education.map((edu) => (
          <div key={edu.id} className="mb-2">
            <div className="flex justify-between">
              <h3 className="font-bold text-base">{edu.school}</h3>
              <span className="text-sm">{edu.year}</span>
            </div>
            <p className="text-sm italic">{edu.degree}</p>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-lg font-bold uppercase border-b border-gray-400 mb-3">Key Skills</h2>
        <p className="text-sm leading-6">
          {data.skills.join(" • ")}
        </p>
      </section>
    </div>
  </div>
);

/* --- MINIMAL TEMPLATE --- */
const MinimalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="w-full h-full bg-white p-8 text-slate-800 font-sans">
    <div className="flex gap-8 h-full">
      {/* Left Sidebar */}
      <div className="w-1/3 border-r pr-6 space-y-8">
        <div>
          {data.personal.photo && (
            <div className="mb-6">
              <img src={data.personal.photo} alt={data.personal.fullName} className="w-32 h-32 rounded object-cover grayscale" />
            </div>
          )}
          <h1 className="text-3xl font-light tracking-tight text-slate-900 mb-4">{data.personal.fullName}</h1>
          <div className="text-xs space-y-2 text-slate-600">
             <div className="flex items-center gap-2"><Mail size={12} /> {data.personal.email}</div>
             <div className="flex items-center gap-2"><Phone size={12} /> {data.personal.phone}</div>
             {data.personal.location && <div className="flex items-center gap-2"><MapPin size={12} /> {data.personal.location}</div>}
             {data.personal.linkedin && <div className="flex items-center gap-2"><Linkedin size={12} /> {data.personal.linkedin}</div>}
             {data.personal.github && <div className="flex items-center gap-2"><Github size={12} /> {data.personal.github}</div>}
             {data.personal.website && <div className="flex items-center gap-2"><Globe size={12} /> {data.personal.website}</div>}
          </div>
        </div>

        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Education</h3>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="font-medium text-sm text-slate-900">{edu.school}</div>
                <div className="text-xs text-slate-600">{edu.degree}</div>
                <div className="text-xs text-slate-400 mt-1">{edu.year}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, idx) => (
              <span key={idx} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">
                {skill}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* Main Content */}
      <div className="w-2/3 space-y-8 pt-2">
        {data.personal.summary && (
          <section>
             <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Profile</h3>
             <p className="text-sm leading-relaxed text-slate-700">{data.personal.summary}</p>
          </section>
        )}

        <section>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">Work History</h3>
          <div className="space-y-8">
            {data.experience.map((exp) => (
              <div key={exp.id} className="relative border-l border-slate-200 pl-4 ml-1">
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                <div className="mb-1">
                  <h4 className="font-medium text-slate-900">{exp.role}</h4>
                  <div className="text-xs text-slate-500">{exp.company} | {exp.startDate} - {exp.current ? 'Present' : exp.endDate}</div>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed mt-2">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {data.projects.length > 0 && (
          <section>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">Projects</h3>
            <div className="space-y-6">
              {data.projects.map((proj) => (
                <div key={proj.id} className="relative border-l border-slate-200 pl-4 ml-1">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                  <div className="mb-1">
                    <h4 className="font-medium text-slate-900">{proj.name}</h4>
                    {proj.link && <div className="text-xs text-blue-600">{proj.link}</div>}
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed mt-2">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
);

/* --- PROFESSIONAL TEMPLATE --- */
const ProfessionalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="w-full h-full bg-white font-sans text-gray-800 flex flex-col">
    <header className="bg-slate-900 text-white p-10 pb-12 flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-bold uppercase tracking-widest mb-2">{data.personal.fullName}</h1>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300 mt-4">
          <div className="flex items-center gap-2"><Mail size={14} /> {data.personal.email}</div>
          <div className="flex items-center gap-2"><Phone size={14} /> {data.personal.phone}</div>
          {data.personal.location && <div className="flex items-center gap-2"><MapPin size={14} /> {data.personal.location}</div>}
          {data.personal.linkedin && <div className="flex items-center gap-2"><Linkedin size={14} /> LinkedIn</div>}
          {data.personal.github && <div className="flex items-center gap-2"><Github size={14} /> GitHub</div>}
        </div>
      </div>
      {data.personal.photo && (
        <div className="ml-6">
           <img src={data.personal.photo} alt={data.personal.fullName} className="w-28 h-28 rounded-full object-cover border-4 border-slate-700" />
        </div>
      )}
    </header>

    <div className="p-10 -mt-6 flex-1 grid grid-cols-12 gap-8">
      {/* Left Main Column */}
      <div className="col-span-8 space-y-8">
        <div className="bg-white rounded shadow-sm p-6 border border-gray-100">
          <h3 className="flex items-center gap-2 text-slate-900 font-bold text-lg uppercase tracking-wider mb-4 pb-2 border-b border-slate-200">
            <User size={18} /> Profile
          </h3>
          <p className="text-sm leading-relaxed text-gray-700">{data.personal.summary || "Experienced professional..."}</p>
        </div>

        <div className="bg-white rounded shadow-sm p-6 border border-gray-100">
          <h3 className="flex items-center gap-2 text-slate-900 font-bold text-lg uppercase tracking-wider mb-6 pb-2 border-b border-slate-200">
            <Briefcase size={18} /> Experience
          </h3>
          <div className="space-y-6">
            {data.experience.map((exp) => (
              <div key={exp.id} className="group">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-slate-800">{exp.role}</h4>
                  <span className="text-xs font-bold text-slate-500">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="text-sm font-medium text-blue-700 mb-2">{exp.company}</div>
                <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        {data.projects.length > 0 && (
          <div className="bg-white rounded shadow-sm p-6 border border-gray-100">
            <h3 className="flex items-center gap-2 text-slate-900 font-bold text-lg uppercase tracking-wider mb-6 pb-2 border-b border-slate-200">
              <FolderKanban size={18} /> Projects
            </h3>
            <div className="space-y-6">
              {data.projects.map((proj) => (
                <div key={proj.id} className="group">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-slate-800">{proj.name}</h4>
                    {proj.link && <span className="text-xs text-blue-600">{proj.link}</span>}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar Column */}
      <div className="col-span-4 space-y-8">
        <div className="bg-slate-50 rounded p-6">
          <h3 className="flex items-center gap-2 text-slate-900 font-bold text-sm uppercase tracking-wider mb-4">
            Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, idx) => (
              <span key={idx} className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-3 py-1.5 rounded-full">
                {skill}
              </span>
            ))}
            {data.skills.length === 0 && <span className="text-xs text-gray-400">Add skills...</span>}
          </div>
        </div>

        <div className="bg-slate-50 rounded p-6">
          <h3 className="flex items-center gap-2 text-slate-900 font-bold text-sm uppercase tracking-wider mb-4">
            <GraduationCap size={16} /> Education
          </h3>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="text-sm font-bold text-slate-800">{edu.school}</div>
                <div className="text-xs text-slate-600">{edu.degree}</div>
                <div className="text-xs text-slate-400 mt-1">{edu.year}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* --- CREATIVE TEMPLATE --- */
const CreativeTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="w-full h-full bg-white flex font-sans">
    {/* Left Colored Sidebar */}
    <aside className="w-1/3 bg-teal-700 text-teal-50 p-8 flex flex-col gap-10">
      <div className="flex flex-col items-center text-center mb-4">
         {data.personal.photo && (
           <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-teal-500 mb-6 shadow-lg">
             <img src={data.personal.photo} alt={data.personal.fullName} className="w-full h-full object-cover" />
           </div>
         )}
      </div>

      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-teal-300 border-b border-teal-600 pb-2">Contact</h2>
        <div className="text-sm space-y-3">
          <div className="flex items-center gap-3"><Mail size={14} /> <span className="break-all">{data.personal.email}</span></div>
          <div className="flex items-center gap-3"><Phone size={14} /> {data.personal.phone}</div>
          {data.personal.location && <div className="flex items-center gap-3"><MapPin size={14} /> {data.personal.location}</div>}
          {data.personal.website && <div className="flex items-center gap-3"><Globe size={14} /> <span className="break-all">{data.personal.website}</span></div>}
          {data.personal.github && <div className="flex items-center gap-3"><Github size={14} /> <span className="break-all">{data.personal.github}</span></div>}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-teal-300 border-b border-teal-600 pb-2">Education</h2>
        <div className="space-y-4">
          {data.education.map((edu) => (
            <div key={edu.id}>
              <div className="font-bold text-sm">{edu.school}</div>
              <div className="text-xs text-teal-200">{edu.degree}</div>
              <div className="text-xs text-teal-400 mt-1">{edu.year}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-widest text-teal-300 border-b border-teal-600 pb-2">Expertise</h2>
        <ul className="space-y-2">
          {data.skills.map((skill, idx) => (
            <li key={idx} className="text-sm flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-teal-300 rounded-full"></div>
              {skill}
            </li>
          ))}
        </ul>
      </div>
    </aside>

    {/* Main Content */}
    <main className="w-2/3 p-10 text-gray-800">
      <header className="mb-10">
        <h1 className="text-5xl font-serif font-bold text-teal-900 leading-tight mb-4">{data.personal.fullName}</h1>
        <p className="text-lg text-teal-600 italic">{data.personal.summary}</p>
      </header>

      <section>
        <h2 className="flex items-center gap-3 text-2xl font-serif font-bold text-gray-900 mb-6">
          <span className="w-8 h-1 bg-teal-500 block"></span>
          Work Experience
        </h2>
        <div className="space-y-8 border-l-2 border-teal-100 pl-6 ml-3">
          {data.experience.map((exp) => (
            <div key={exp.id} className="relative">
              <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-teal-500 shadow-sm"></div>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-lg text-gray-900">{exp.role}</h3>
                <span className="text-sm font-bold text-teal-600">{exp.startDate} — {exp.current ? 'Now' : exp.endDate}</span>
              </div>
              <div className="text-base font-medium text-gray-500 mb-3">{exp.company}</div>
              <p className="text-sm text-gray-700 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      {data.projects.length > 0 && (
        <section className="mt-10">
          <h2 className="flex items-center gap-3 text-2xl font-serif font-bold text-gray-900 mb-6">
            <span className="w-8 h-1 bg-teal-500 block"></span>
            Projects
          </h2>
          <div className="space-y-8 border-l-2 border-teal-100 pl-6 ml-3">
            {data.projects.map((proj) => (
              <div key={proj.id} className="relative">
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-4 border-white bg-teal-500 shadow-sm"></div>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-lg text-gray-900">{proj.name}</h3>
                  {proj.link && <span className="text-sm text-teal-600">{proj.link}</span>}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  </div>
);

/* --- POLISHED TEMPLATE (FREE) --- */
const PolishedTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="w-full h-full bg-white p-8 text-gray-800 font-sans">
    <header className="flex items-center gap-8 border-b-2 border-indigo-100 pb-8 mb-8">
      {data.personal.photo && (
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-50 flex-shrink-0 shadow-sm">
          <img src={data.personal.photo} alt={data.personal.fullName} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex-1">
        <h1 className="text-4xl font-bold text-indigo-900 mb-2">{data.personal.fullName}</h1>
        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
          <span className="flex items-center gap-1"><Mail size={12} /> {data.personal.email}</span>
          <span className="flex items-center gap-1"><Phone size={12} /> {data.personal.phone}</span>
          {data.personal.location && <span className="flex items-center gap-1"><MapPin size={12} /> {data.personal.location}</span>}
          {data.personal.github && <span className="flex items-center gap-1"><Github size={12} /> {data.personal.github}</span>}
        </div>
      </div>
    </header>

    <div className="grid grid-cols-3 gap-8">
      <div className="col-span-2 space-y-8">
        <section>
          <h3 className="text-indigo-900 font-bold text-lg uppercase tracking-wider mb-4 flex items-center gap-2">
            <User size={18} className="text-indigo-500" /> Profile
          </h3>
          <p className="text-sm leading-relaxed text-gray-700">{data.personal.summary}</p>
        </section>

        <section>
          <h3 className="text-indigo-900 font-bold text-lg uppercase tracking-wider mb-4 flex items-center gap-2">
            <Briefcase size={18} className="text-indigo-500" /> Experience
          </h3>
          <div className="space-y-6">
            {data.experience.map((exp) => (
              <div key={exp.id} className="relative pl-4 border-l-2 border-indigo-50">
                 <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-indigo-400"></div>
                 <div className="flex justify-between items-baseline mb-1">
                   <h4 className="font-bold text-gray-900">{exp.role}</h4>
                   <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                 </div>
                 <div className="text-sm font-medium text-gray-500 mb-2">{exp.company}</div>
                 <p className="text-sm text-gray-700 leading-relaxed">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>

        {data.projects.length > 0 && (
          <section>
            <h3 className="text-indigo-900 font-bold text-lg uppercase tracking-wider mb-4 flex items-center gap-2">
              <FolderKanban size={18} className="text-indigo-500" /> Projects
            </h3>
            <div className="space-y-6">
              {data.projects.map((proj) => (
                <div key={proj.id} className="relative pl-4 border-l-2 border-indigo-50">
                   <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-indigo-400"></div>
                   <div className="flex justify-between items-baseline mb-1">
                     <h4 className="font-bold text-gray-900">{proj.name}</h4>
                     {proj.link && <span className="text-xs text-indigo-600">{proj.link}</span>}
                   </div>
                   <p className="text-sm text-gray-700 leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="space-y-8">
        <section className="bg-indigo-50 p-5 rounded-xl">
          <h3 className="text-indigo-900 font-bold text-sm uppercase tracking-wider mb-4">Education</h3>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="font-bold text-sm text-gray-900">{edu.school}</div>
                <div className="text-xs text-indigo-700">{edu.degree}</div>
                <div className="text-xs text-gray-500 mt-1">{edu.year}</div>
              </div>
            ))}
          </div>
        </section>

        <section>
           <h3 className="text-indigo-900 font-bold text-sm uppercase tracking-wider mb-4">Key Skills</h3>
           <div className="flex flex-wrap gap-2">
             {data.skills.map((skill, i) => (
               <span key={i} className="text-xs font-medium text-gray-700 bg-white border border-gray-200 px-3 py-1 rounded-md shadow-sm">
                 {skill}
               </span>
             ))}
           </div>
        </section>
      </div>
    </div>
  </div>
);

/* --- ELEGANT TEMPLATE (FREE) --- */
const ElegantTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="w-full h-full bg-[#fdfdfc] p-12 text-gray-900 font-serif">
    <div className="text-center mb-10 relative">
      {data.personal.photo && (
         <div className="w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-4 border-white shadow-md">
           <img src={data.personal.photo} alt="Profile" className="w-full h-full object-cover" />
         </div>
      )}
      <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-wide">{data.personal.fullName}</h1>
      <div className="flex justify-center gap-6 text-xs uppercase tracking-widest text-gray-500">
        <span>{data.personal.email}</span>
        <span>{data.personal.phone}</span>
        {data.personal.location && <span>{data.personal.location}</span>}
      </div>
      <div className="w-16 h-0.5 bg-gray-300 mx-auto mt-6"></div>
    </div>

    <div className="space-y-10 max-w-3xl mx-auto">
      {data.personal.summary && (
        <section className="text-center">
          <p className="text-sm leading-loose italic text-gray-700">"{data.personal.summary}"</p>
        </section>
      )}

      <section>
        <h3 className="text-center text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Experience</h3>
        <div className="space-y-8">
          {data.experience.map((exp) => (
            <div key={exp.id} className="grid grid-cols-12 gap-4">
              <div className="col-span-3 text-right">
                <div className="text-sm font-bold text-gray-900">{exp.startDate} —</div>
                <div className="text-sm text-gray-500">{exp.current ? 'Present' : exp.endDate}</div>
              </div>
              <div className="col-span-9 border-l border-gray-200 pl-6">
                <h4 className="text-lg font-bold text-gray-900">{exp.role}</h4>
                <div className="text-sm italic text-gray-600 mb-2">{exp.company}</div>
                <p className="text-sm leading-relaxed text-gray-700 font-sans">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {data.projects.length > 0 && (
        <section>
          <h3 className="text-center text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Projects</h3>
          <div className="space-y-8">
            {data.projects.map((proj) => (
              <div key={proj.id} className="grid grid-cols-12 gap-4">
                <div className="col-span-3 text-right">
                   {proj.link && <a href={proj.link} className="text-xs text-gray-500 underline">Link</a>}
                </div>
                <div className="col-span-9 border-l border-gray-200 pl-6">
                  <h4 className="text-lg font-bold text-gray-900">{proj.name}</h4>
                  <p className="text-sm leading-relaxed text-gray-700 font-sans mt-1">{proj.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-10 pt-6 border-t border-gray-200">
        <section>
           <h3 className="text-center text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Education</h3>
           <div className="space-y-4 text-center">
             {data.education.map((edu) => (
               <div key={edu.id}>
                 <div className="font-bold text-sm">{edu.school}</div>
                 <div className="text-sm italic text-gray-600">{edu.degree}</div>
                 <div className="text-xs text-gray-400 mt-1">{edu.year}</div>
               </div>
             ))}
           </div>
        </section>

        <section>
           <h3 className="text-center text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Skills</h3>
           <div className="text-center text-sm leading-7 font-sans text-gray-700">
             {data.skills.join("  •  ")}
           </div>
        </section>
      </div>
    </div>
  </div>
);

/* --- EXECUTIVE TEMPLATE (PRO) --- */
const ExecutiveTemplate: React.FC<{ data: ResumeData }> = ({ data }) => (
  <div className="w-full h-full bg-white flex font-sans">
    {/* Dark Sidebar */}
    <aside className="w-1/3 bg-slate-900 text-slate-300 flex flex-col">
      <div className="p-8 pb-0 flex justify-center">
        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-slate-700 shadow-xl">
          {data.personal.photo ? (
            <img src={data.personal.photo} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600">
               <User size={48} />
            </div>
          )}
        </div>
      </div>
      
      <div className="p-8 space-y-8 flex-1">
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3"><Mail className="text-amber-500" size={16} /> <span className="break-all">{data.personal.email}</span></div>
          <div className="flex items-center gap-3"><Phone className="text-amber-500" size={16} /> {data.personal.phone}</div>
          {data.personal.location && <div className="flex items-center gap-3"><MapPin className="text-amber-500" size={16} /> {data.personal.location}</div>}
          {data.personal.github && <div className="flex items-center gap-3"><Github className="text-amber-500" size={16} /> <span className="break-all">{data.personal.github}</span></div>}
        </div>

        <div className="border-t border-slate-700 pt-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Education</h3>
          <div className="space-y-4">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <div className="text-white font-medium text-sm">{edu.school}</div>
                <div className="text-xs text-slate-400">{edu.degree}</div>
                <div className="text-xs text-amber-500 mt-1">{edu.year}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-700 pt-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((skill, idx) => (
              <span key={idx} className="text-xs bg-slate-800 text-slate-200 px-2 py-1 rounded border border-slate-700">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>

    {/* Main Content */}
    <main className="w-2/3 p-10 flex flex-col">
       <header className="mb-12 border-b border-gray-200 pb-6">
         <h1 className="text-5xl font-bold text-slate-900 uppercase tracking-tight mb-2">{data.personal.fullName}</h1>
         <p className="text-xl text-amber-600 font-light">Senior Professional</p>
       </header>

       <div className="space-y-10">
         <section>
           <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 mb-4 flex items-center gap-2">
             <span className="w-2 h-8 bg-amber-500 mr-2"></span> Profile
           </h2>
           <p className="text-gray-600 leading-relaxed">{data.personal.summary}</p>
         </section>

         <section>
           <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 mb-6 flex items-center gap-2">
             <span className="w-2 h-8 bg-amber-500 mr-2"></span> Work Experience
           </h2>
           <div className="space-y-8">
             {data.experience.map((exp) => (
               <div key={exp.id}>
                 <div className="flex justify-between items-end mb-1">
                   <h3 className="text-xl font-bold text-slate-900">{exp.role}</h3>
                   <span className="text-sm font-bold text-slate-400">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                 </div>
                 <div className="text-base font-medium text-amber-600 mb-3">{exp.company}</div>
                 <p className="text-sm text-gray-600 leading-relaxed">{exp.description}</p>
               </div>
             ))}
           </div>
         </section>

         {data.projects.length > 0 && (
           <section>
             <h2 className="text-lg font-bold uppercase tracking-wider text-slate-800 mb-6 flex items-center gap-2">
               <span className="w-2 h-8 bg-amber-500 mr-2"></span> Projects
             </h2>
             <div className="space-y-8">
               {data.projects.map((proj) => (
                 <div key={proj.id}>
                   <div className="flex justify-between items-end mb-1">
                     <h3 className="text-xl font-bold text-slate-900">{proj.name}</h3>
                     {proj.link && <span className="text-sm font-bold text-slate-400">{proj.link}</span>}
                   </div>
                   <p className="text-sm text-gray-600 leading-relaxed">{proj.description}</p>
                 </div>
               ))}
             </div>
           </section>
         )}
       </div>
    </main>
  </div>
);

export const ResumePreview: React.FC<Props> = ({ data, template, previewRef }) => {
  return (
    <div className="shadow-2xl rounded-sm overflow-hidden bg-white print:shadow-none print:overflow-visible origin-top w-[210mm] print:w-full" style={{ minHeight: '297mm', margin: '0 auto' }}>
      <div ref={previewRef} className="h-full min-h-[297mm]">
        {template === 'modern' && <ModernTemplate data={data} />}
        {template === 'classic' && <ClassicTemplate data={data} />}
        {template === 'minimal' && <MinimalTemplate data={data} />}
        {template === 'professional' && <ProfessionalTemplate data={data} />}
        {template === 'creative' && <CreativeTemplate data={data} />}
        {template === 'polished' && <PolishedTemplate data={data} />}
        {template === 'elegant' && <ElegantTemplate data={data} />}
        {template === 'executive' && <ExecutiveTemplate data={data} />}
      </div>
    </div>
  );
};