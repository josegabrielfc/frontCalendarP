import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ViewSchedule from './views/ViewSchedule';
import Login from './views/Login';
import Home from './views/Home';
import NotFound from './boundaries/NotFound';
import { SubjectProvider } from './context/ScheduleContext';
import PdfWrapper from './components/PdfWrapper';
import CalendarSelectFirstWeek from './views/CalendarSelectFirstWeek';
import CalendarSelectSecondWeek from './views/CalendarSelectSecondWeek';
import imagenes from "./assets/imagenes.js";
import SingUp from './views/SignUp';

export const App = (name) => {
  const [action, setAction] = useState<string>("Registrarse");

  const handleActionChange = (newAction: string) => {
    setAction(newAction);
  };

  // Create a router instance
  const router = createBrowserRouter([
    {
      path: '/',
      element: (
        <Login
          action={action}
          emailIcon={imagenes.email}
          passwordIcon={imagenes.password}
          onActionChange={handleActionChange} // Pasar la función de actualización
        />
      ),
    },
    {
      path: '/register',
      element: (
        <SingUp
          action={action}
          userIcon={imagenes.user}
          emailIcon={imagenes.email}
          passwordIcon={imagenes.password}
          onActionChange={handleActionChange} // Pasar la función de actualización
        />
      ),
    },
    {
      path: '/home/report',
      element: <PdfWrapper/>,
    },
    {
      path: '/home/schedule',
      element: <ViewSchedule name={''} />,
    },
    {
      path: '/select/week1/:condicion',
      element: <CalendarSelectFirstWeek/>,
    },
    {
      path: '/select/week2/:condicion',
      element: <CalendarSelectSecondWeek/>,
    },
    {
      path: '/home',
      element: <Home />,
    },
  
    {
      path: '*', // Catch-all route
      element: <NotFound />,
    },
  ]);

  return (
    <SubjectProvider>
      <RouterProvider router={router} />
    </SubjectProvider>
  );
};
