export interface Constituent {
  voter_id: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip: string;
  party_affiliation: string;
  phone: string;
  email: string;
  preferred_contact_method: string;
  registration_date: Date;
  voting_precinct: string;
}

export interface Issue {
  issue_id: string;
  title: string;
  description: string;
  official_stance: string;
  status: string;
  created_date: Date;
  last_updated: Date;
}

export interface ConstituentIssue {
  constituentId: string;
  issueId: string;
  dateAdded: string;
}

export interface LinkedIssue {
  issue_id: string;
}

export interface Communication {
  communication_id: string;
  constituent_id: string;
  message: string;
  linked_issues: LinkedIssue[];
  draft_reply: string;
  date_received: Date;
  status: 'pending' | 'replied' | 'archived';
}

export interface AppContextType {
  constituents: Constituent[];
  issues: Issue[];
  constituentIssues: ConstituentIssue[];
  editingConstituent: Constituent | null;
  communications: Communication[];
  addConstituent: (constituent: Constituent) => void;
  addIssue: (issue: Issue) => void;
  addConstituentIssue: (constituentIssue: ConstituentIssue) => void;
  deleteConstituent: (voterId: string) => void;
  deleteConstituentIssue: (constituentId: string, issueId: string) => void;
  setEditingConstituent: (constituent: Constituent | null) => void;
  updateConstituent: (constituent: Constituent) => void;
  resetToInitialData: () => void;
  addCommunication: (communication: Communication) => void;
  deleteCommunication: (communicationId: string) => void;
  updateCommunication: (communication: Communication) => void;
} 