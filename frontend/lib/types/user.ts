export interface User {
  id: number;
  createdAt: number[];
  email: string;
  prolificId: string;
  role: "USER" | "ADMIN" | "SUPERADMIN";
  enabled: boolean;
}

export interface Participant {
  prolificId: string;
  studyId: string;
  sessionId: string;
}
