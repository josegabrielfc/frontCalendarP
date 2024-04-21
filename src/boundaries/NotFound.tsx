// NotFound.tsx
import { textAlign } from 'html2canvas/dist/types/css/property-descriptors/text-align';
import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div>
      <h1>404 Not Found</h1>
      <h4 style={{ textAlign: 'center' }}>La página que buscas no existe.</h4>
    </div>
  );
};

export default NotFound;
