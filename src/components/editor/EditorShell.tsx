import React from 'react';
import { PersonalForm } from './PersonalForm';
import { SummaryEditor } from './SummaryEditor';
import { SectionsList } from './SectionsList';

export const EditorShell: React.FC = () => {
  return (
    <div className="w-full max-w-2xl p-6 space-y-6">
      <PersonalForm />
      <SummaryEditor />
      <SectionsList />
    </div>
  );
};
