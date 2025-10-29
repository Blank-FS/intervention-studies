export interface Module {
  id: number;
  title: string;
  paragraph: string;
  videoUrl: string;
}

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
