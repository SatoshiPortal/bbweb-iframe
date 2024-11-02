import React, { Suspense, useState, useEffect } from 'react';
import Loading from '../pages/Loading.js';
import Error from '../pages/Error.js';

const SuspenseWrapper = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleChunkError = (event) => {
      if (event.reason instanceof Error && event.reason.name === 'ChunkLoadError') {
        setHasError(true);
      }
    };

    window.addEventListener('unhandledrejection', handleChunkError);
    return () => {
      window.removeEventListener('unhandledrejection', handleChunkError);
    };
  }, []);

  if (hasError) {
    return <Error />;
  }

  return (
    <Suspense fallback={<Loading />}>
      {children}
    </Suspense>
  );
};

export default SuspenseWrapper;