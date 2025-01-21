import React, { createContext, useState } from 'react';
import { Constituent, Issue, ConstituentIssue } from '../types';

type AppContextType = {
  constituents: Constituent[];
  issues: Issue[];
  constituentIssues: ConstituentIssue[];
  addConstituent: (constituent: Constituent) => void;
  addIssue: (issue: Issue) => void;
  addConstituentIssue: (constituentIssue: ConstituentIssue) => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [constituents, setConstituents] = useState<Constituent[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [constituentIssues, setConstituentIssues] = useState<ConstituentIssue[]>([]);

  const addConstituent = (constituent: Constituent) => {
    setConstituents([...constituents, constituent]);
  };

  const addIssue = (issue: Issue) => {
    setIssues([...issues, issue]);
  };

  const addConstituentIssue = (constituentIssue: ConstituentIssue) => {
    setConstituentIssues([...constituentIssues, constituentIssue]);
  };

  return (
    <AppContext.Provider value={{
      constituents,
      issues,
      constituentIssues,
      addConstituent,
      addIssue,
      addConstituentIssue
    }}>
      {children}
    </AppContext.Provider>
  );
};
