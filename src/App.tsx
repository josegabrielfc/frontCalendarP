import React from 'react';
import { createBrowserRouter, RouterProvider, Route } from 'react-router-dom';
import ViewSchedule from './views/ViewSchedule';
import SelectScheduleFirstWeek from './views/SelectScheduleFirstWeek';
import SelectScheduleSecondWeek from './views/SelectScheduleSecondWeek';
import Home from './views/Home';
import NotFound from './boundaries/NotFound';
import './style.css';
import { SubjectProvider } from './context/ScheduleContext';
import PdfWrapper from './components/PdfWrapper';

// Create a router instance
const router = createBrowserRouter([
  {
    path: '/home/report',
    element: <PdfWrapper />,
  },
  {
    path: '/home/schedule',
    element: <ViewSchedule name={''} />,
  },
  {
    path: '/select/week1',
    element: <SelectScheduleFirstWeek />,
  },
  {
    path: '/select/week2',
    element: <SelectScheduleSecondWeek />,
  },
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '*', // Catch-all route
    element: <NotFound />,
  },
]);

export const App = (name) => {
  return (
    <SubjectProvider>
      <RouterProvider router={router} />
    </SubjectProvider>
  );
};
