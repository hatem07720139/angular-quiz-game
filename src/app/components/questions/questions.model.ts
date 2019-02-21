export interface Question {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  answers?: Answer[];
}

interface Answer {
  answer: string;
  isCorrect: boolean;
  selected?: boolean;
}

export interface Questions extends Array<Question> {}
