const daysOfWeek1 = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];

export const convertDay = (day, initialDate, holidays) => {
    let fecha = new Date(initialDate);
  
    console.log(day, initialDate)
  
    fecha.setDate(fecha.getDate() + (daysOfWeek1.indexOf(day) + 1) % 7);
    
  
    return fecha.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "short" });
}

export const isAvailable = (day, initialDate, holidays) => {
    let fecha = new Date(initialDate);
  
    console.log(day, initialDate)
  
    fecha.setDate(fecha.getDate() + (daysOfWeek1.indexOf(day) + 1) % 7);
    
  
    return fecha.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "short" });
}