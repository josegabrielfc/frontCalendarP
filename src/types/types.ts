// Types.ts
export interface Schedule {
  id: number;
  materia_id: number;
  grupo_id: string;
  dia: string;
  hora_inicio: Date;
  hora_fin: Date;
  salon: string;
}

export interface Subject {
  id: number;
  name: string;
}

export interface SubjectSchedule {
  id: number;
  name: string;
  schedules: Schedule[];
}

export interface SubjectSelectedSchedule {
  id: number;
  name: string;
  schedules: Map<string, Schedule>;
}

export interface ParentSubject {
  id: number;
  name: string;
  childSubjects: SubjectSchedule[];
}

export interface daysOfWeek {
  fecha: string;
  dia: string;
}
/*
declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}
*/