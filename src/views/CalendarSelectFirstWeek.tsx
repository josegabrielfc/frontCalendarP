import React from 'react';
import { useParams } from 'react-router-dom';
import SelectScheduleFirstWeek from './SelectScheduleFirstWeek';
import SelectScheduleFirstWeekAuto from './SelectScheduleFirstWeekAuto';

const CalendarSelect = () => {
  const { condicion } = useParams<{ condicion: string }>();

  return (
    <div>
      {condicion === 'auto' ? (
        <SelectScheduleFirstWeekAuto />
      ) : (
        <SelectScheduleFirstWeek />
      )}
    </div>
  );
};

export default CalendarSelect;
