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
  