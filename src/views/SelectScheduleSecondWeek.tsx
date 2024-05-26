import React, { useEffect, useState } from 'react';
import { getSemesters, getSubjectsFromAPI } from '../api/api';
import { Schedule, Subject, SubjectSchedule, SubjectsBySemester } from '../types/types';
import { SubjectProvider, useSubject } from './../context/ScheduleContext';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import CalendarWeekView from './../components/CalendarWeekView';
import { getDatesWeek } from './../backend';
import moment from 'moment';
import './../styles/select_schedule.css';
import { legibleDate, convertDay, getInitialDate, isInCurrentWeek, getStartWeekDate } from "../utils/utils";
import { useNavigate } from 'react-router-dom';

const AvailableSubjectsTable: React.FC = () => {
  const {
    addSubjectSecondWeek: addSubject,
    secondWeek: subjects,
    firstWeek,
  } = useSubject();
  const [availableSubjects, setAvailableSubjects] = useState<SubjectSchedule[]>(
    []
  );
  const [selectedSemesterId, setSelectedSemesterId] = useState("");
  const [openSubjectId, setOpenSubjectId] = useState(null);
  const [availableSubjectsBySemester, setAvailableSubjectsBySemester] =
    useState<SubjectsBySemester[]>([]);
  const [openSemesterId, setOpenSemesterId] = useState(null);

  const toggleSubject = (subjectId) => {
    setOpenSubjectId(openSubjectId === subjectId ? null : subjectId);
  };

  const toggleSemester = (semesterId) => {
    setOpenSemesterId(openSemesterId === semesterId ? null : semesterId);
  };

  const handleSemesterChange = (event) => {
    setSelectedSemesterId(event.target.value);
  };

  useEffect(() => {
    const fetchAvailableSubjects = async () => {
      try {
        const semesters = await getSemesters();
        let subjectsWithSchedules = await getSubjectsFromAPI();
        subjectsWithSchedules.forEach((subject) => {
          const usedSubject = firstWeek.find((s) => subject.id === s.id);

          subject.schedules = subject.schedules.filter((schedule) => {
            return (
              !usedSubject || !usedSubject.schedules.has(schedule.grupo_id)
            );
          });

          subject.schedules = subject.schedules.sort((a, b) =>
            a.grupo_id < b.grupo_id ? -1 : 1
          );
        });

        subjectsWithSchedules = subjectsWithSchedules.filter(
          (subject) => subject.schedules && subject.schedules.length != 0
        );

        let subjectsBySemester: SubjectsBySemester[] = [];
        Object.entries(semesters.semestres).forEach(([semester, subjects]) => {
          const curr: SubjectsBySemester = {} as SubjectsBySemester;
          curr.id = semester;
          subjectsBySemester.push(curr);

          curr.subjects = subjectsWithSchedules.filter((subject) =>
            subjects.some((el) => el.id === subject.id)
          );
        });

        subjectsBySemester = subjectsBySemester.sort((a, b) =>
          parseInt(a.id) < parseInt(b.id) ? -1 : 1
        );

        setAvailableSubjectsBySemester(subjectsBySemester);

        setAvailableSubjects(subjectsWithSchedules);
      } catch (error) {
        console.error('Error fetching available subjects:', error);
        // Handle errors appropriately
      }
    };

    fetchAvailableSubjects();
  }, []);

  const selectSchedule: (subject: Subject, schedule: Schedule) => void = (
    subject,
    schedule
  ) => {
    addSubject(subject, schedule);
  };

  return (
    <div className="big-container">
      <div className="semester-dropdown">
        <select value={selectedSemesterId} onChange={handleSemesterChange}>
          <option value="" disabled>
            Selecciona un semestre
          </option>
          {availableSubjectsBySemester.map((semester) => (
            <option key={semester.id} value={semester.id}>
              SEMESTRE {semester.id}
            </option>
          ))}
        </select>
      </div>
      {selectedSemesterId && (
        <div className="subjects-container">
          {availableSubjectsBySemester
            .find((semester) => semester.id === selectedSemesterId)
            .subjects.map((subject) => (
              <div key={subject.id} className="subject-container">
                <button
                  className="subject-name"
                  onClick={() => toggleSubject(subject.id)}
                >
                  {subject.name}
                </button>

                {openSubjectId === subject.id && (
                  <div className="schedule-container">
                    {subject.schedules.map((schedule) => {
                      const isSelected = subjects.find(
                        (s) =>
                          s.id === subject.id &&
                          s.schedules.has(schedule.grupo_id) &&
                          s.schedules.get(schedule.grupo_id).id ===
                            schedule.id
                      );

                      return (
                        <div
                          key={schedule.id}
                          className={
                            "schedule" + (isSelected ? " selected" : "")
                          }
                          onClick={() => selectSchedule(subject, schedule)}
                        >
                          <div>Codigo: {subject.id}</div>
                          <div>Grupo: {schedule.grupo_id}</div>
                          <div>Dia: {schedule.dia}</div>
                          <div>
                            Hora Inicio: {schedule.hora_inicio as any}
                          </div>
                          <div>Hora Fin: {schedule.hora_fin as any}</div>
                          <div>Salon: {schedule.salon}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

const AvailableSubjectsWeekCalendar: React.FC = () => {
  const {
    addSecondWeek,
    insertNewFirstWeek,
    secondWeek,
    firstWeek,
    initialDate,
    secondInitialDate,
    holidays
  } = useSubject();
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const newEvents = [];
    const firstWeekRecords = [];
    const secondWeekRecords = [];
    secondWeek.forEach((subject) => {
      const schedulesFirstWeek = [];
      const schedulesSecondWeek = [];
      subject.schedules.forEach((schedule) => {
        if (!isInCurrentWeek(secondInitialDate, schedule.dia, holidays)) {
          schedulesFirstWeek.push(schedule);
          schedule.calendarDay =  legibleDate(convertDay(schedule.dia, initialDate, holidays));
          schedule.formatDay =  convertDay(schedule.dia, initialDate, holidays)
          return;
        }
        schedulesSecondWeek.push(schedule)
        const startHourString = typeof schedule.hora_inicio === "string" ? schedule.hora_inicio : "";
        const endHourString = typeof schedule.hora_fin === "string" ? schedule.hora_fin : "";
        newEvents.push({
          title: subject.name,
          day: schedule.dia,
          startHour: parseInt(startHourString.split(':')[0], 10),
          endHour: parseInt(endHourString.split(':')[0], 10),
          description: 'Grupo ' + schedule.grupo_id,
        });
        schedule.calendarDay =  legibleDate(convertDay(schedule.dia, secondInitialDate, holidays));
        schedule.formatDay =  convertDay(schedule.dia, secondInitialDate, holidays)
      });
      firstWeekRecords.push([subject, schedulesFirstWeek])
      secondWeekRecords.push([subject, schedulesSecondWeek])
    });
    insertNewFirstWeek(firstWeekRecords)
    addSecondWeek(secondWeekRecords)  
    setEvents(newEvents);
  }, [secondWeek]);

  return <CalendarWeekView events={events} initialDate={secondInitialDate} />;
};

const SelectScheduleSecondWeek: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("bodyC");
    return () => {
      document.body.classList.remove("bodyC");
    };
  }, []);

  const goToAnotherPage = () => {
    navigate('/home/schedule');
  };

  return (
    <>
      <h2> Estas son las materias disponibles: </h2>
      <AvailableSubjectsTable />
      <h2> El horario generado para la segunda semana es </h2>
      <div className="calendar">
      <AvailableSubjectsWeekCalendar />
      </div>
      <div className="button-wrapper">
        <button className="next-page" onClick={goToAnotherPage}>
          Ir a horario
        </button>
      </div>
      <br></br>
    </>
  );
};

export default SelectScheduleSecondWeek;
