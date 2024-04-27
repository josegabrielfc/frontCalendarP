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

const backendUrl = "https://calendarp.onrender.com";

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

export const getSubjectsFromAPI: () => Promise<SubjectSchedule[]> =
  async () => {
    //const { materias } = materiasResponse as MateriaResponse; //Comentar luego

    const materiasResponse = await fetch(`${backendUrl}/materias`, {
      method: "GET"
    });
    const { materias } = await materiasResponse.json() as MateriaResponse;

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

export const generatePdf = async (data) => {
  try {
    // Configurar la solicitud
    const response = await fetch(`${backendUrl}/generate_pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Agregar otros headers necesarios, como tokens de autenticación si es necesario
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    // Obtener los datos de la respuesta como Blob
    const blob = await response.blob();

    // Crear un URL para el Blob
    const blobUrl = window.URL.createObjectURL(blob);

    // Crear un enlace temporario y forzar la descarga
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = 'horario.pdf'; // Nombre del archivo a descargar
    document.body.appendChild(link);
    link.click();

    // Limpiar
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error('Error al generar el PDF:', error);
  }
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
  console.log("SENDING EXCEL")
  try {
    // Configurar la solicitud
    const response = await fetch(`${backendUrl}/upload_xlsx_new`, {
      method: 'POST',
      body: data,
    });

    return response;

  } catch (error) {
    console.error('Error al enviar excel:', error);
  }

  return Promise.resolve(null);
};