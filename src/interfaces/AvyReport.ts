interface Rating {
  value: string;
  display: string;
}

interface Confidence {
  rating: Rating;
  statements: string[];
}

interface Summary {
  type: Rating;
  content: string;
}

interface DangerRating {
  date: Rating;
  ratings: {
    alp: {
      display: string;
      rating: Rating;
    };
    tln: {
      display: string;
      rating: Rating;
    };
    btl: {
      display: string;
      rating: Rating;
    };
  };
}

interface ProblemFactor {
  type: Rating;
  graphic: {
    id: string;
    url: string;
    alt: string;
  };
}

interface ProblemData {
  elevations: Rating[];
  aspects: Rating[];
  likelihood: Rating;
  expectedSize: {
    min: string;
    max: string;
  };
}

interface Problem {
  type: Rating;
  comment: string;
  factors: ProblemFactor[];
  data: ProblemData;
}

interface Report {
  id: string;
  forecaster: string;
  dateIssued: string;
  validUntil: string;
  title: string;
  highlights: string;
  confidence: Confidence;
  summaries: Summary[];
  dangerRatings: DangerRating[];
  problems: Problem[];
  terrainAndTravelAdvice: string[];
  message: string | null;
  season: string | null;
  comment: string | null;
  isFullTranslation: boolean;
}

interface AvyData {
  report: Report;
}

export type {
  AvyData,
  Report,
  Rating,
  Confidence,
  Summary,
  DangerRating,
  ProblemFactor,
  ProblemData,
  Problem,
};
