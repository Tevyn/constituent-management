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
  constituent_id: string;
  issue_id: string;
  engagement_date: Date;
  engagement_type: string;
  stance: string;
} 