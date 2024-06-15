const daysOfWeek1 = ['DOMINGO','LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'];

const parseDate = (dateString) => {
    const [year, month, day] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
  }

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }
  
  const isHoliday = (date, holidays) => {
    const dateString = formatDate(date); 
    return holidays.includes(dateString);
  }
  
  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0; // Sunday (0) or Saturday (6)
  }
  
  const getNextBusinessDay = (date, holidays, targetDayOfWeek) => {
    while (isWeekend(date) || isHoliday(date, holidays) || date.getDay() != targetDayOfWeek) {
      date.setDate(date.getDate() + 1);
    }
    return date;
  }
  
  export const getInitialDate = (initialDate, holidays) => {
    let date = parseDate(initialDate.toISOString().split('T')[0].replace(/-/g, '/'));
    
    while (isWeekend(date) || isHoliday(date, holidays)) {
        date.setDate(date.getDate() + 1);
    }
    return date;
  }

  export const getStartWeekDate = (initialDate, holidays) => {
    let date = parseDate(initialDate.toISOString().split('T')[0].replace(/-/g, '/'));
    
    while (!isWeekend(date)) {
        date.setDate(date.getDate() - 1);
    }
    date.setDate(date.getDate() + 1)
    return date;
  }

  

  export const convertDay = (day, initialDate, holidays) => {
    let fecha = parseDate(initialDate.toISOString().split('T')[0].replace(/-/g, '/'));
  
    const currentDayOfWeek = fecha.getDay(); // 0 (Sunday) to 6 (Saturday) 
    const targetDayOfWeek = daysOfWeek1.indexOf(day); // 0 (Lunes) to 6 (Domingo)
    fecha = getNextBusinessDay(fecha, holidays, targetDayOfWeek);
    
    
    return fecha
  }

  export const getIndexedDate =(date, idx) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + idx)
    return newDate.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "short" });
  }

  export const legibleDate =(date) => {
    return date.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "short" });
  }

  export const isInCurrentWeek = (initialDate, day, holidays) => {
    let fecha = parseDate(initialDate.toISOString().split('T')[0].replace(/-/g, '/'));
  
    // Calculate the target date based on the initial date and the day of the week
    const currentDayOfWeek = fecha.getDay(); // 0 (Sunday) to 6 (Saturday)
    const targetDayOfWeek = daysOfWeek1.indexOf(day); // 0 (Lunes) to 6 (Domingo)
    while (isWeekend(fecha) || isHoliday(fecha, holidays) || fecha.getDay() != targetDayOfWeek) {
        if (isWeekend(fecha)) return false;
        fecha.setDate(fecha.getDate() + 1);
    }
    
    // Determine the number of days to add to reach the target day of the week
    return targetDayOfWeek >= currentDayOfWeek && currentDayOfWeek <= 6; 
  }

export const isAvailable = (day, initialDate, holidays) => {
    let fecha = new Date(initialDate);
  
    console.log(day, initialDate)
  
    fecha.setDate(fecha.getDate() + (daysOfWeek1.indexOf(day) + 1) % 7);
    
  
    return fecha.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "short" });
}