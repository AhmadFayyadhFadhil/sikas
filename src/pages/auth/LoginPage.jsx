import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { formRules, hasErrors, getFirstError } from '../../utils/validation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/portal';

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validate form
    const formData = { email, password };
    const formErrors = formRules.login(formData);
    
    if (hasErrors(formErrors)) {
      setErrors(formErrors);
      toast.error(getFirstError(formErrors));
      return;
    }

    setIsLoading(true);
    setErrors({});
    try {
      const { data, error } = await login(email, password);
      
      if (error) {
        setErrors({ global: error.message });
        toast.error(error.message || "Gagal masuk. Periksa email & password.");
      } else if (data && data.user) {
        toast.success("✓ Berhasil masuk! Selamat datang.");
        navigate(from, { replace: true });
      } else {
        toast.error("Gagal masuk. Silakan coba lagi.");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Terjadi kesalahan jaringan. Cek koneksi Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-800">Masuk ke Akun Anda</h3>
        <p className="text-sm text-slate-500 mt-1">Sebagai Pengurus RT untuk akses penuh</p>
      </div>

      {errors.global && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {errors.global}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleLogin}>
        <Input 
          label="Alamat Email"
          type="email" 
          placeholder="admin@rt.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          error={errors.email}
        />
        <Input 
          label="Password"
          type="password" 
          placeholder="••••••••" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
          error={errors.password}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input 
              id="remember-me" 
              type="checkbox" 
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" 
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">
              Ingat saya
            </label>
          </div>
          <div className="text-sm">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Lupa password?
            </a>
          </div>
        </div>
        <Button 
          type="submit" 
          className="w-full"
          isLoading={isLoading}
        >
          Masuk Sekarang
        </Button>
      </form>

      {/* Demo Info */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-slate-700">
        <p className="font-medium mb-1">Demo Account:</p>
        <p>Email: admin@rt.com</p>
        <p>Password: (setup di Supabase)</p>
      </div>
    </div>
  );
}
