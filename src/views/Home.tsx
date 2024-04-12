import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/home.css";
import { sendExcel } from "../api/api";

const Home: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const navigate = useNavigate(); // Utiliza useNavigate para la navegación
  const goToAnotherPage = () => {
    navigate("/select/week1");
  };

  console.log(selectedDate);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    setFile(selectedFile || null);
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('fecha', selectedDate);

      if (file) {
        formData.append('calendario', file);
      }

      const response = await sendExcel(formData);

      if (response) {
        const fechasArray = await response;
        console.log('Fechas recibidas:', fechasArray);

        // Después de recibir la respuesta del backend, navega a otra página
        goToAnotherPage();
      } else {
        console.error('Error al enviar la fecha y el archivo al backend');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  return (
    <div>
      <h1>UFPS CALENDAR</h1>
      <div className="my-form-container">
        <h2>Ingrese los siguientes datos</h2>
        <form className="my-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              Subir Documento:
              <input type="file" onChange={handleFileChange} accept=".xlsx" />
            </label>
          </div>
          <div className="form-group">
            <label>
              Seleccionar Fecha:
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </label>
          </div>
          <div className="form-group">
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home;
