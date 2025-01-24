import React, { createContext, useState, useEffect } from 'react';
import { Constituent, Issue, ConstituentIssue, Communication } from '../types';

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
  removeConstituentIssue: (voterId: string, issueId: string) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  CONSTITUENTS: 'constituents',
  ISSUES: 'issues',
  CONSTITUENT_ISSUES: 'constituentIssues',
  COMMUNICATIONS: 'communications'
};

// Helper function to safely parse stored data
const getStoredData = <T,>(key: string, defaultValue: T): T => {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return defaultValue;

    // Parse the stored JSON
    const parsed = JSON.parse(stored);

    // Helper to convert date strings back to Date objects
    const convertDates = (obj: any): any => {
      if (!obj) return obj;
      
      // If array, convert dates in each item
      if (Array.isArray(obj)) {
        return obj.map(item => convertDates(item));
      }
      
      // If object, look for date fields and convert them
      if (typeof obj === 'object') {
        const converted = { ...obj };
        const dateFields = [
          'date_of_birth',
          'registration_date',
          'created_date',
          'last_updated',
          'engagement_date'
        ];
        
        dateFields.forEach(field => {
          if (obj[field]) {
            converted[field] = new Date(obj[field]);
          }
        });
        
        return converted;
      }
      
      return obj;
    };

    return convertDates(parsed);
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

// Add these constants at the top of the file, after imports
const INITIAL_ISSUES: Issue[] = [
  {
    issue_id: 'I1',
    title: 'Road Infrastructure',
    description: 'Improving local road conditions and infrastructure',
    official_stance: 'Support increased funding for road maintenance',
    status: 'implementation planning',
    created_date: new Date('2024-01-15'),
    last_updated: new Date('2024-02-01')
  },
  {
    issue_id: 'I2',
    title: 'Education Funding',
    description: 'Increasing budget allocation for public schools',
    official_stance: 'Support additional funding for STEM programs',
    status: 'in committee',
    created_date: new Date('2024-01-10'),
    last_updated: new Date('2024-01-28')
  },
  {
    issue_id: 'I3',
    title: 'Park Development',
    description: 'Creating new public parks and recreational areas',
    official_stance: 'Support expansion of green spaces',
    status: 'needs constituent input',
    created_date: new Date('2024-01-20'),
    last_updated: new Date('2024-02-05')
  },
  {
    issue_id: 'I4',
    title: 'Public Transportation',
    description: 'Expanding public transit options',
    official_stance: 'Under review',
    status: 'legislation drafted',
    created_date: new Date('2024-01-25'),
    last_updated: new Date('2024-02-10')
  },
  {
    issue_id: 'I5',
    title: 'Crime Prevention',
    description: 'Addressing public safety and crime prevention measures',
    official_stance: 'Under review',
    status: 'proposed',
    created_date: new Date('2024-01-20'),
    last_updated: new Date('2024-01-20')
  },
  {
    issue_id: 'I6', 
    title: 'Food Security',
    description: 'Ensuring adequate food access and nutrition in schools and community',
    official_stance: 'Under review',
    status: 'proposed',
    created_date: new Date('2024-01-22'),
    last_updated: new Date('2024-01-22')
  },
  {
    issue_id: 'I7',
    title: 'Community Development',
    description: 'Development and renovation of community facilities and spaces',
    official_stance: 'Under review', 
    status: 'proposed',
    created_date: new Date('2024-01-25'),
    last_updated: new Date('2024-01-25')
  }
];

const INITIAL_CONSTITUENTS: Constituent[] = [
  {
    voter_id: 'V1',
    first_name: 'John',
    last_name: 'Smith',
    date_of_birth: new Date('1980-05-15'),
    address_line1: '123 Main St',
    city: 'Springfield',
    state: 'IL',
    zip: '62701',
    party_affiliation: 'Independent',
    phone: '217-555-0101',
    email: 'john.smith@email.com',
    preferred_contact_method: 'email',
    registration_date: new Date('2023-01-15'),
    voting_precinct: 'PRE-001'
  },
  {
    voter_id: 'V2',
    first_name: 'Maria',
    last_name: 'Garcia',
    date_of_birth: new Date('1992-08-23'),
    address_line1: '456 Oak Ave',
    city: 'Springfield',
    state: 'IL',
    zip: '62702',
    party_affiliation: 'Democrat',
    phone: '217-555-0102',
    email: 'maria.g@email.com',
    preferred_contact_method: 'phone',
    registration_date: new Date('2023-02-20'),
    voting_precinct: 'PRE-002'
  },
  {
    voter_id: 'V3',
    first_name: 'Robert',
    last_name: 'Johnson',
    date_of_birth: new Date('1975-11-30'),
    address_line1: '789 Pine St',
    city: 'Springfield',
    state: 'IL',
    zip: '62703',
    party_affiliation: 'Republican',
    phone: '217-555-0103',
    email: 'robert.j@email.com',
    preferred_contact_method: 'email',
    registration_date: new Date('2023-03-10'),
    voting_precinct: 'PRE-001'
  },
  {
    voter_id: 'V4',
    first_name: 'Sarah',
    last_name: 'Williams',
    date_of_birth: new Date('1988-04-12'),
    address_line1: '321 Elm St',
    city: 'Springfield',
    state: 'IL',
    zip: '62704',
    party_affiliation: 'Independent',
    phone: '217-555-0104',
    email: 'sarah.w@email.com',
    preferred_contact_method: 'phone',
    registration_date: new Date('2023-04-05'),
    voting_precinct: 'PRE-003'
  },
  {
    voter_id: 'V5',
    first_name: 'Michael',
    last_name: 'Brown',
    date_of_birth: new Date('1995-07-08'),
    address_line1: '654 Maple Dr',
    city: 'Springfield',
    state: 'IL',
    zip: '62701',
    party_affiliation: 'Democrat',
    phone: '217-555-0105',
    email: 'michael.b@email.com',
    preferred_contact_method: 'email',
    registration_date: new Date('2023-05-15'),
    voting_precinct: 'PRE-002'
  },
  {
    voter_id: 'V6',
    first_name: 'Jennifer',
    last_name: 'Davis',
    date_of_birth: new Date('1983-09-25'),
    address_line1: '987 Cedar Ln',
    city: 'Springfield',
    state: 'IL',
    zip: '62702',
    party_affiliation: 'Republican',
    phone: '217-555-0106',
    email: 'jennifer.d@email.com',
    preferred_contact_method: 'phone',
    registration_date: new Date('2023-06-20'),
    voting_precinct: 'PRE-001'
  },
  {
    voter_id: 'V7',
    first_name: 'David',
    last_name: 'Miller',
    date_of_birth: new Date('1990-12-03'),
    address_line1: '741 Birch Rd',
    city: 'Springfield',
    state: 'IL',
    zip: '62703',
    party_affiliation: 'Independent',
    phone: '217-555-0107',
    email: 'david.m@email.com',
    preferred_contact_method: 'email',
    registration_date: new Date('2023-07-10'),
    voting_precinct: 'PRE-003'
  },
  {
    voter_id: 'V8',
    first_name: 'Lisa',
    last_name: 'Wilson',
    date_of_birth: new Date('1987-02-18'),
    address_line1: '852 Spruce Ave',
    city: 'Springfield',
    state: 'IL',
    zip: '62704',
    party_affiliation: 'Democrat',
    phone: '217-555-0108',
    email: 'lisa.w@email.com',
    preferred_contact_method: 'phone',
    registration_date: new Date('2023-08-15'),
    voting_precinct: 'PRE-002'
  },
  {
    voter_id: 'V9',
    first_name: 'James',
    last_name: 'Anderson',
    date_of_birth: new Date('1978-06-28'),
    address_line1: '963 Walnut St',
    city: 'Springfield',
    state: 'IL',
    zip: '62701',
    party_affiliation: 'Republican',
    phone: '217-555-0109',
    email: 'james.a@email.com',
    preferred_contact_method: 'email',
    registration_date: new Date('2023-09-20'),
    voting_precinct: 'PRE-001'
  },
  {
    voter_id: 'V10',
    first_name: 'Emily',
    last_name: 'Taylor',
    date_of_birth: new Date('1993-10-15'),
    address_line1: '159 Hickory Ln',
    city: 'Springfield',
    state: 'IL',
    zip: '62702',
    party_affiliation: 'Independent',
    phone: '217-555-0110',
    email: 'emily.t@email.com',
    preferred_contact_method: 'phone',
    registration_date: new Date('2023-10-05'),
    voting_precinct: 'PRE-003'
  }
];

const INITIAL_CONSTITUENT_ISSUES: ConstituentIssue[] = [
  {
    constituentId: 'V1',
    issueId: 'I1',
    dateAdded: '2024-01-20'
  },
  {
    constituentId: 'V1',
    issueId: 'I2',
    dateAdded: '2024-01-25'
  },
  {
    constituentId: 'V2',
    issueId: 'I3',
    dateAdded: '2024-01-22'
  },
  {
    constituentId: 'V3',
    issueId: 'I4',
    dateAdded: '2024-01-28'
  },
  {
    constituentId: 'V4',
    issueId: 'I1',
    dateAdded: '2024-01-30'
  }
];

// Add initial communications data
const INITIAL_COMMUNICATIONS: Communication[] = [
  {
    communication_id: 'C1',
    constituent_id: 'V1',
    message: "Dear Councilor Smith, The potholes on Main Street have become dangerous. Last week, three cars had flat tires in the same spot. We need immediate repairs and a long-term plan for road maintenance.",
    linked_issues: [{issue_id: 'I1'}],
    draft_reply: "Thank you for bringing the Main Street conditions to my attention. I share your concerns about road safety and maintenance. I'm working to secure additional funding for immediate repairs and implementing a comprehensive 5-year infrastructure plan to prevent similar issues. I've asked our Public Works department to inspect the location you mentioned and prioritize repairs there.",
    date_received: new Date('2024-01-15'),
    status: 'pending'
  },
  {
    communication_id: 'C2', 
    constituent_id: 'V2',
    message: "The new park proposal for the East Side would be a waste of taxpayer money. We need to focus on improving our schools instead. Test scores are falling, and teachers are leaving for better-paying districts.",
    linked_issues: [
      {issue_id: 'I2'},
      {issue_id: 'I3'}
    ],
    draft_reply: "I appreciate your perspective on our community's priorities. Education is indeed our top focus - I'm currently working to increase our education budget by 15% to improve teacher retention and student outcomes. While I believe parks contribute to our community's quality of life, I agree that we must first ensure our schools have the resources they need.",
    date_received: new Date('2024-01-18'),
    status: 'pending'
  },
  {
    communication_id: 'C3',
    constituent_id: 'V3', 
    message: "Our city desperately needs better bus service. The current schedule makes it impossible for night shift workers to rely on public transit. Additionally, the rising crime rate at bus stops needs to be addressed.",
    linked_issues: [
      {issue_id: 'I4'},
      {issue_id: 'I5'}
    ],
    draft_reply: "Thank you for highlighting these transportation challenges. I'm working to expand bus service hours to accommodate all work schedules. Additionally, I've proposed increased security measures at bus stops, including better lighting and security cameras. My office is coordinating with the transit authority and police department to implement these improvements.",
    date_received: new Date('2024-01-20'),
    status: 'pending'
  },
  {
    communication_id: 'C4',
    constituent_id: 'V4',
    message: "The condition of Roosevelt High's science labs is unacceptable. Many devices don't work, and there's no budget for basic supplies. My daughter's class can't even do standard experiments. Plus, the cafeteria often runs out of food by last lunch period.",
    linked_issues: [
      {issue_id: 'I2'},
      {issue_id: 'I6'}
    ],
    draft_reply: "I share your concerns about Roosevelt High's resources. I'm pushing for a significant increase in our education budget, with specific allocations for STEM laboratory upgrades. I'm also working with the school board to audit and improve our meal program capacity. I've scheduled a meeting with the principal next week to assess immediate needs we can address.",
    date_received: new Date('2024-01-22'),
    status: 'pending'
  },
  {
    communication_id: 'C5',
    constituent_id: 'V1',
    message: "The bike lanes on Cedar Avenue are constantly blocked by delivery trucks, forcing cyclists into traffic. And when will the community center renovation finally be completed? It's been under construction for two years now.",
    linked_issues: [
      {issue_id: 'I1'},
      {issue_id: 'I7'}
    ],
    draft_reply: "Thank you for bringing these safety concerns to my attention. I'm working with transportation officials to implement protected bike lanes and increase enforcement of parking violations. Regarding the community center, I share your frustration with the delays. I've recently established additional project oversight and secured resources to expedite completion.",
    date_received: new Date('2024-01-25'),
    status: 'pending'
  },
  {
    communication_id: 'C6',
    constituent_id: 'V10',
    message: "I strongly oppose your plan to increase education spending by 15%. Our property taxes are already too high, and many seniors are struggling to keep their homes. We need tax cuts, not more spending on a broken system.",
    linked_issues: [{issue_id: 'I2'}],
    draft_reply: "Thank you for sharing your concerns about tax burden. While I understand the challenges facing our residents, especially seniors, our data shows that investing in education now will help control long-term costs. I'm working to ensure this budget increase comes with strict oversight and measurable outcomes. My office can connect you with information about senior tax relief programs that might help your situation.",
    date_received: new Date('2024-01-28'),
    status: 'pending'
  },
  {
    communication_id: 'C7',
    constituent_id: 'V3',
    message: "The city must fast-track the East Side park development. Every week of delay means our children are missing out on safe outdoor spaces. It's unconscionable that you're prioritizing hypothetical education improvements over immediate community needs.",
    linked_issues: [{issue_id: 'I3'}],
    draft_reply: "Thank you for your passionate advocacy for community spaces. While I agree that parks are vital to our community, our limited resources require careful prioritization. Our education system's immediate needs affect thousands of students daily. I'm committed to moving forward with park development once we've addressed critical education funding gaps and seen concrete improvements in our metrics.",
    date_received: new Date('2024-01-30'),
    status: 'pending'
  }
];

// Add this function after the INITIAL_CONSTITUENT_ISSUES constant
const initializeLocalStorage = () => {
  // Check if we've already initialized
  const initialized = localStorage.getItem('initialized');
  if (!initialized) {
    // Set all initial data
    localStorage.setItem(STORAGE_KEYS.CONSTITUENTS, JSON.stringify(INITIAL_CONSTITUENTS));
    localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(INITIAL_ISSUES));
    localStorage.setItem(STORAGE_KEYS.CONSTITUENT_ISSUES, JSON.stringify(INITIAL_CONSTITUENT_ISSUES));
    localStorage.setItem(STORAGE_KEYS.COMMUNICATIONS, JSON.stringify(INITIAL_COMMUNICATIONS));
    localStorage.setItem('initialized', 'true');
    return true; // Return true if we initialized
  }
  return false; // Return false if already initialized
};

export const AppContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with either stored data or initial data
  const [constituents, setConstituents] = useState<Constituent[]>(() => {
    const wasInitialized = initializeLocalStorage();
    return wasInitialized ? INITIAL_CONSTITUENTS : getStoredData(STORAGE_KEYS.CONSTITUENTS, INITIAL_CONSTITUENTS);
  });

  const [issues, setIssues] = useState<Issue[]>(() => {
    return getStoredData(STORAGE_KEYS.ISSUES, INITIAL_ISSUES);
  });

  const [constituentIssues, setConstituentIssues] = useState<ConstituentIssue[]>(() => {
    return getStoredData(STORAGE_KEYS.CONSTITUENT_ISSUES, INITIAL_CONSTITUENT_ISSUES);
  });

  const [editingConstituent, setEditingConstituent] = useState<Constituent | null>(null);

  const [communications, setCommunications] = useState<Communication[]>(() => {
    return getStoredData(STORAGE_KEYS.COMMUNICATIONS, INITIAL_COMMUNICATIONS);
  });

  // Update localStorage when state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONSTITUENTS, JSON.stringify(constituents));
  }, [constituents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
  }, [issues]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONSTITUENT_ISSUES, JSON.stringify(constituentIssues));
  }, [constituentIssues]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMMUNICATIONS, JSON.stringify(communications));
  }, [communications]);

  const addConstituent = (constituent: Constituent) => {
    const constituentWithDates = {
      ...constituent,
      date_of_birth: new Date(constituent.date_of_birth),
      registration_date: new Date(constituent.registration_date),
    };
    setConstituents([...constituents, constituentWithDates]);
  };

  const addIssue = (issue: Issue) => {
    const issueWithDates = {
      ...issue,
      created_date: new Date(issue.created_date),
      last_updated: new Date(issue.last_updated),
    };
    setIssues([...issues, issueWithDates]);
  };

  const addConstituentIssue = (constituentIssue: ConstituentIssue) => {
    setConstituentIssues([...constituentIssues, constituentIssue]);
  };

  const deleteConstituent = (voterId: string) => {
    setConstituents(prev => prev.filter(c => c.voter_id !== voterId));
  };

  const deleteConstituentIssue = (constituentId: string, issueId: string) => {
    setConstituentIssues(prev => 
      prev.filter(ci => !(ci.constituentId === constituentId && ci.issueId === issueId))
    );
  };

  const updateConstituent = (updatedConstituent: Constituent) => {
    setConstituents(prevConstituents => 
      prevConstituents.map(constituent => 
        constituent.voter_id === updatedConstituent.voter_id 
          ? updatedConstituent 
          : constituent
      )
    );
  };

  const resetToInitialData = () => {
    localStorage.removeItem('initialized');
    initializeLocalStorage();
    setConstituents(getStoredData(STORAGE_KEYS.CONSTITUENTS, []));
    setIssues(getStoredData(STORAGE_KEYS.ISSUES, []));
    setConstituentIssues(getStoredData(STORAGE_KEYS.CONSTITUENT_ISSUES, []));
    setCommunications(getStoredData(STORAGE_KEYS.COMMUNICATIONS, []));
  };

  const addCommunication = (communication: Communication) => {
    setCommunications(prev => [...prev, communication]);
  };

  const deleteCommunication = (communicationId: string) => {
    setCommunications(prev => prev.filter(c => c.communication_id !== communicationId));
  };

  const updateCommunication = (updatedCommunication: Communication) => {
    setCommunications(prev => 
      prev.map(comm => 
        comm.communication_id === updatedCommunication.communication_id 
          ? updatedCommunication 
          : comm
      )
    );
  };

  const removeConstituentIssue = (voterId: string, issueId: string) => {
    setConstituentIssues(prev => 
      prev.filter(ci => !(ci.constituentId === voterId && ci.issueId === issueId))
    );
  };

  const value = {
    constituents,
    issues,
    constituentIssues,
    editingConstituent,
    communications,
    addConstituent,
    addIssue,
    addConstituentIssue,
    deleteConstituent,
    deleteConstituentIssue,
    setEditingConstituent,
    updateConstituent,
    resetToInitialData,
    addCommunication,
    deleteCommunication,
    updateCommunication,
    removeConstituentIssue,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
