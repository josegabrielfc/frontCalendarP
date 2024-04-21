import React from 'react';
import { useParams } from 'react-router-dom';
import SelectScheduleSecondWeekAuto from './SelectScheduleSecondWeekAuto';
import SelectScheduleSecondWeek from './SelectScheduleSecondWeek';


const CalendarSelect = () => {
  const { condicion } = useParams<{ condicion: string }>();

  return (
    <div>
      {condicion === 'auto' ? (
        <SelectScheduleSecondWeekAuto />
      ) : (
        <SelectScheduleSecondWeek />
      )}
    </div>
  );
};

export default CalendarSelect;
