// SubjectContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Subject, Schedule, SubjectSelectedSchedule } from './../types/types';
import { getHolidays } from '../api/api';

interface SubjectContextType {
  initialDate: Date;
  secondInitialDate: Date;
  firstWeek: SubjectSelectedSchedule[];
  secondWeek: SubjectSelectedSchedule[];
  addFirstWeek: (records: any[]) => void;
  insertNewFirstWeek: (records: any[]) => void;
  addSecondWeek: (records: any[]) => void;
  setInitialDate: (date: Date) => void;
  addSubjectSecondWeek: (subject: Subject, schedule: Schedule) => void;
  addSubjectFirstWeek: (subject: Subject, schedule: Schedule) => void;
  setSecondInitialDate: (date: Date) => void;
  holidays: any;
  setHolidays: (holidays: any) => void;
}

const SubjectContext = createContext<SubjectContextType | undefined>(undefined);

interface SubjectProviderProps {
  children: ReactNode;
}

export const SubjectProvider: React.FC<SubjectProviderProps> = ({ children }) => {
  const [firstWeek, setFirstWeek] = useState<SubjectSelectedSchedule[]>([]);
  const [secondWeek, setSecondWeek] = useState<SubjectSelectedSchedule[]>([]);
  const [initialDate, setInitialDate] = useState<Date>(null);
  const [secondInitialDate, setSecondInitialDate] = useState<Date>(null);
  const [holidays, setHolidays] = useState<string[]>([])

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

  const addFirstWeek = (records: any[]) => {
    const updatedSubjects = []

    records.forEach(record => {
      const schedules = record[1] as Schedule[]
      const subject = record[0] as Subject

      const schedulesMapped = new Map<string, Schedule>();

      schedules.forEach(schedule => schedulesMapped.set(schedule.grupo_id, schedule))

      const newSubject: SubjectSelectedSchedule = {
        ...subject,
        schedules: schedulesMapped,
      };
      updatedSubjects.push(newSubject);
    })


    setFirstWeek(updatedSubjects);
  };

  const insertNewFirstWeek = (records: any[]) => {
    const updatedSubjects = firstWeek

    records.forEach(record => {
      const schedules = record[1] as Schedule[]
      const subject = record[0] as Subject

      const schedulesMapped = new Map<string, Schedule>();

      schedules.forEach(schedule => schedulesMapped.set(schedule.grupo_id, schedule))

      const newSubject: SubjectSelectedSchedule = {
        ...subject,
        schedules: schedulesMapped,
      };
      updatedSubjects.push(newSubject);
    })


    setFirstWeek(updatedSubjects);
  };

  const addSecondWeek = (records: any[]) => {
    const updatedSubjects = []

    records.forEach(record => {
      const schedules = record[1] as Schedule[]
      const subject = record[0] as Subject

      const schedulesMapped = new Map<string, Schedule>();

      schedules.forEach(schedule => schedulesMapped.set(schedule.grupo_id, schedule))

      const newSubject: SubjectSelectedSchedule = {
        ...subject,
        schedules: schedulesMapped,
      };
      updatedSubjects.push(newSubject);
    })


    setSecondWeek(updatedSubjects);
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
        addFirstWeek,
        addSecondWeek,
        addSubjectSecondWeek,
        addSubjectFirstWeek,
        insertNewFirstWeek,
        initialDate,
        setInitialDate,
        holidays,
        setHolidays,
        secondInitialDate,
        setSecondInitialDate
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