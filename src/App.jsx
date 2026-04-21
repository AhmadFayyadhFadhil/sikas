import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes';
import { AuthProvider } from './hooks/useAuth';
import LoadingScreen from './components/shared/LoadingScreen';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <AuthProvider>
      <BrowserRouter>
        {/* Global Loading Screen */}
        {isLoading && (
          <LoadingScreen onFinished={() => setIsLoading(false)} />
        )}

        {/* Konfigurasi Notifikasi Global (React Hot Toast) */}
        <Toaster position="top-right" />
        
        {/* Master Routes */}
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
