export interface PublicFeedback {
    establishmentName: string;
    address: string;
    receiptDate: string;
    mood: 'Great' | 'Okay' | 'Bad';
    narrative: string;
    total: number;
  }
  
  export interface TopRatedResult {
    establishment: string;
    moodStats: Record<string, number>;
  }
  
  export interface BusinessDirectoryEntry {
    id: string;
    establishmentName: string;
    storeNumber?: string;
    email: string;
    source: 'WebSearchAgent' | 'UserSubmission';
    validated: boolean;
    submittedAt: string;
    address?: string;
    phone?: string;
    submittedBy?: string;
  }
  