export type RegisterPayload = {
  fullName: string;
  email: string;
  nim: string;
  studyProgram: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};
