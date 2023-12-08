// SubjectContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Subject, Schedule, SubjectSelectedSchedule } from './../types/types';

interface SubjectContextType {
  firstWeek: SubjectSelectedSchedule[];
  secondWeek: SubjectSelectedSchedule[];
  addSubjectFirstWeek: (subject: Subject, schedule: Schedule) => void;
  addSubjectSecondWeek: (subject: Subject, schedule: Schedule) => void;
}

const SubjectContext = createContext<SubjectContextType | undefined>(undefined);

interface SubjectProviderProps {
  children: ReactNode;
}

export const SubjectProvider: React.FC<SubjectProviderProps> = ({ children }) => {
  const [firstWeek, setFirstWeek] = useState<SubjectSelectedSchedule[]>([]);
  const [secondWeek, setSecondWeek] = useState<SubjectSelectedSchedule[]>([]);

  const addSubjectFirstWeek = (subject: Subject, schedule: Schedule) => {
    const updatedSubjects = firstWeek.map((s) => {
      if (s.id === subject.id) {
        const updatedSubject = { ...s, schedules: new Map(s.schedules) };
        updatedSubject.schedules.set(schedule.grupo_id, schedule);
        return updatedSubject;
      }
      return s;
    });

    const subjectExists = firstWeek.some((s) => s.id === subject.id);

    if (!subjectExists) {
      const newSubject: SubjectSelectedSchedule = {
        ...subject,
        schedules: new Map<string, Schedule>().set(schedule.grupo_id, schedule),
      };
      updatedSubjects.push(newSubject);
    }

    setFirstWeek(updatedSubjects);
  };

  const addSubjectSecondWeek = (subject: Subject, schedule: Schedule) => {
    const updatedSubjects = secondWeek.map((s) => {
      if (s.id === subject.id) {
        const updatedSubject = { ...s, schedules: new Map(s.schedules) };
        updatedSubject.schedules.set(schedule.grupo_id, schedule);
        return updatedSubject;
      }
      return s;
    });

    const subjectExists = secondWeek.some((s) => s.id === subject.id);

    if (!subjectExists) {
      const newSubject: SubjectSelectedSchedule = {
        ...subject,
        schedules: new Map<string, Schedule>().set(schedule.grupo_id, schedule),
      };
      updatedSubjects.push(newSubject);
    }

    setSecondWeek(updatedSubjects);
  };

  return (
    <SubjectContext.Provider
      value={{
        firstWeek,
        secondWeek,
        addSubjectFirstWeek,
        addSubjectSecondWeek,
      }}
    >
      {children}
    </SubjectContext.Provider>
  );
};

export const useSubject = () => {
  const context = useContext(SubjectContext);
  if (!context) {
    throw new Error('useSubject must be used within a SubjectProvider');
  }
  return context;
};