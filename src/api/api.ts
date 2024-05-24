import { Schedule, Subject, SubjectSchedule } from '../types/types';
import materiasResponse from './../mocks/materias.json';
import horarioMateriaResponse from './../mocks/horario_materia.json';

interface MateriaResponse {
  materias: Subject[];
}

interface HorarioMateriaResponse {
  horarios: Schedule[];
}

interface SubjectSemester {
  id: string;
}

interface SemesterResponse {
  semestres: Map<string, SubjectSemester[]>
}

interface RandomResponse {
  semestres: Map<string, SubjectSemester[]>
}

// Definir las interfaces necesarias
interface UserData {
  name: string;
  email: string;
  password: string;
}

interface RegisterLoginResponse {
  status: string;
  message: string;
  redirect?: string;
}

const backendUrl = " http://localhost:3001";

export const registerUser: (userData: UserData) => Promise<RegisterLoginResponse> = async (userData) => {
  try {
    const response = await fetch(`${backendUrl}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error en la solicitud: ${errorMessage}`);
    }

    return await response.json() as RegisterLoginResponse;
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    throw error;
  }
};

export const loginUser: (userData: UserData) => Promise<RegisterLoginResponse> = async (userData) => {
  try {
    const response = await fetch(`${backendUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });
    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error en la solicitud: ${errorMessage}`);
    }

    return await response.json() as RegisterLoginResponse;
  } catch (error) {
    console.error('Error al ingresar:', error);
    throw error;
  }
}

const getRandomSchedule: () => Promise<HorarioMateriaResponse> = async () => {
  try {
    // Configurar la solicitud
    const response = await fetch(`${backendUrl}/seleccionar-aleatorio`, {
      method: 'GET'
    });
    return Promise.resolve(await response.json() as HorarioMateriaResponse);
  } catch (error) {
    console.error('Error al enviar excel:', error);
  }
  return Promise.resolve(null);
};

export const getAutoSubjectsFromAPI: () => Promise<SubjectSchedule[]> =
  async () => {
    //const { materias } = materiasResponse as MateriaResponse; //Comentar luego
    const horariosValidos = await fetch (`${backendUrl}/horarios_validos`, {
      method: "GET"
    });
    const materiasResponse = await fetch(`${backendUrl}/materias`, {
      method: "GET"
    });
    const horarioMateriaResponse = await getRandomSchedule()
    const { materias } = await materiasResponse.json() as MateriaResponse;
    return mergeSubjectsWithAutoSchedule(materias, horarioMateriaResponse);
  };
const mergeSubjectsWithAutoSchedule: (
  subjects: Subject[],
  horarioMateriaResponse: HorarioMateriaResponse
) => Promise<SubjectSchedule[]> = async (subjects, horarioMateriaResponse) => {
  const schedulePromises = subjects.map((subject) =>
    getAvailableSchedulesForAutoSubject(subject.id, horarioMateriaResponse).then((schedules) => {
      return {
        ...subject,
        schedules,
      };
    })
  )
  const subjectSchedules = await Promise.all(schedulePromises);
  // Filter subjects where schedules.length > 0
  const filteredSubjects = subjectSchedules.filter((subject) => subject.schedules.length > 0);
  return Promise.all(filteredSubjects);
};
export const getAvailableSchedulesForAutoSubject: (
  subject_id: number,
  horarioMateriaResponse: HorarioMateriaResponse
) => Promise<Schedule[]> = async (subject_id, horarioMateriaResponse) => {
  //const { horarios } = horarioMateriaResponse as HorarioMateriaResponse;
  let { horarios } = horarioMateriaResponse;
  return Promise.resolve(horarios.filter(schedule => schedule.materia_id === subject_id));
};

export const getSubjectsFromAPI: () => Promise<SubjectSchedule[]> =
  async () => {
    //const { materias } = materiasResponse as MateriaResponse; //Comentar luego

    const materiasResponse = await fetch(`${backendUrl}/materias`, {
      method: "GET"
    });

    // Espera el resultado de json()
    const materiasData = await materiasResponse.json();
    console.log("materias response JSON = ", materiasData);

    // Extrae materias del resultado JSON
    const { materias } = materiasData as MateriaResponse;
    console.log("MATERIAS = ", JSON.stringify(materias));

    return mergeSubjectsWithSchedule(materias);
  };

const mergeSubjectsWithSchedule: (
  subjects: Subject[]
) => Promise<SubjectSchedule[]> = async (subjects) => {
  const schedulePromises = subjects.map((subject) =>
    getAvailableSchedulesForSubject(subject.id).then((schedules) => {
      return {
        ...subject,
        schedules,
      };
    })
  )

  const subjectSchedules = await Promise.all(schedulePromises);

  // Filter subjects where schedules.length > 0
  const filteredSubjects = subjectSchedules.filter((subject) => subject.schedules.length > 0);


  return Promise.all(filteredSubjects);
};

export const getAvailableSchedulesForSubject: (
  subject_id: number
) => Promise<Schedule[]> = async (subject_id) => {
  //const { horarios } = horarioMateriaResponse as HorarioMateriaResponse;

  const horarioMateriaResponse = await fetch(`${backendUrl}/horario/${subject_id}`, {
    method: "GET"
  });
  let { horarios } = await horarioMateriaResponse.json() as HorarioMateriaResponse;

  return Promise.resolve(horarios);
};

export const getSemesters: () => Promise<SemesterResponse> = async () => {
  try {
    // Configurar la solicitud
    const response = await fetch(`${backendUrl}/semestres`, {
      method: 'GET'
    });

    return Promise.resolve(await response.json() as SemesterResponse);

  } catch (error) {
    console.error('Error al enviar excel:', error);
  }

  return Promise.resolve(null);
};

export const sendExcel = async (data) => {
  console.log("SENDING EXCEL");
  try {
    // Configurar la solicitud
    const response = await fetch(`${backendUrl}/get_xlsx_data`, {
      method: 'POST',
      body: data,
    });
    console.log(response.body);
    return response;

  } catch (error) {
    console.error('Error al enviar excel:', error);
  }

  return Promise.resolve(null);
};