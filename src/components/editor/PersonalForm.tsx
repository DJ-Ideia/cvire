import React from 'react';
import { User, Briefcase, Mail, Phone, MapPin, Link, Globe, Code } from 'lucide-react';
import { useCVStore } from '../../store/useCVStore';
import { useTranslation } from 'react-i18next';

export const PersonalForm: React.FC = () => {
  const { t } = useTranslation();
  const { activeProfile, updatePersonal } = useCVStore();

  if (!activeProfile) return null;
  const p = activeProfile.personal;

  return (
    <div className="bg-[#131b2e] border border-[#222f47] rounded-2xl p-5 mb-6 space-y-4">
      <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-[#222f47] pb-3">
        <User className="w-4 h-4 text-blue-400" />
        <span>{t('editor.personalInfo')}</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Full Name */}
        <div>
          <label className="block text-slate-400 font-medium mb-1">{t('editor.fullName')}</label>
          <div className="relative">
            <User className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={p.fullName || ''}
              onChange={(e) => updatePersonal({ fullName: e.target.value })}
              className="w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-xl pl-9 pr-3 py-2 text-slate-200 outline-none transition-all"
              placeholder="Johnny Costa"
            />
          </div>
        </div>

        {/* Job Title */}
        <div>
          <label className="block text-slate-400 font-medium mb-1">{t('editor.jobTitle')}</label>
          <div className="relative">
            <Briefcase className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={p.jobTitle || ''}
              onChange={(e) => updatePersonal({ jobTitle: e.target.value })}
              className="w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-xl pl-9 pr-3 py-2 text-slate-200 outline-none transition-all"
              placeholder="Engenheiro de Dados / Analista de Dados"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-slate-400 font-medium mb-1">{t('editor.email')}</label>
          <div className="relative">
            <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="email"
              value={p.email || ''}
              onChange={(e) => updatePersonal({ email: e.target.value })}
              className="w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-xl pl-9 pr-3 py-2 text-slate-200 outline-none transition-all"
              placeholder="johnnywscosta@gmail.com"
            />
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-slate-400 font-medium mb-1">{t('editor.phone')}</label>
          <div className="relative">
            <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={p.phone || ''}
              onChange={(e) => updatePersonal({ phone: e.target.value })}
              className="w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-xl pl-9 pr-3 py-2 text-slate-200 outline-none transition-all"
              placeholder="+55 79 98142-3483"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-slate-400 font-medium mb-1">{t('editor.location')}</label>
          <div className="relative">
            <MapPin className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={p.location || ''}
              onChange={(e) => updatePersonal({ location: e.target.value })}
              className="w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-xl pl-9 pr-3 py-2 text-slate-200 outline-none transition-all"
              placeholder="Aracaju, Sergipe - Brasil"
            />
          </div>
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-slate-400 font-medium mb-1">{t('editor.linkedinUrl')}</label>
          <div className="relative">
            <Link className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={p.linkedinUrl || ''}
              onChange={(e) => updatePersonal({ linkedinUrl: e.target.value })}
              className="w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-xl pl-9 pr-3 py-2 text-slate-200 outline-none transition-all"
              placeholder="linkedin.com/in/johnnycosta"
            />
          </div>
        </div>

        {/* GitHub */}
        <div>
          <label className="block text-slate-400 font-medium mb-1">GitHub Profile URL</label>
          <div className="relative">
            <Code className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={p.githubUrl || ''}
              onChange={(e) => updatePersonal({ githubUrl: e.target.value })}
              className="w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-xl pl-9 pr-3 py-2 text-slate-200 outline-none transition-all"
              placeholder="github.com/jownao"
            />
          </div>
        </div>

        {/* Portfolio / Website */}
        <div>
          <label className="block text-slate-400 font-medium mb-1">{t('editor.portfolioUrl')}</label>
          <div className="relative">
            <Globe className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={p.portfolioUrl || ''}
              onChange={(e) => updatePersonal({ portfolioUrl: e.target.value })}
              className="w-full bg-[#0d1322] border border-[#222f47] focus:border-blue-500 rounded-xl pl-9 pr-3 py-2 text-slate-200 outline-none transition-all"
              placeholder="portfolio.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
