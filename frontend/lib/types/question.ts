export interface Question {
  id: number;
  questionText: string;
  options: Option[];
  correctOptionId: number;
  selectedOptionId: number | null;
}

export interface Option {
  id: number;
  text: string;
}
