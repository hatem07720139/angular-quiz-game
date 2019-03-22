export interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  answers?: Answer[];
  id?: number;
  points?: number;
}

export interface Questions extends Array<Question> {}

export interface ApiResponse {
  response_code?: number;
  results: Array<Question>;
}

export interface Answer {
  answer: string;
  isCorrect: boolean;
  clicked?: boolean;
  answered?: boolean;
}
