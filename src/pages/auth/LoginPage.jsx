import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/portal';

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Email dan password wajib diisi!");
    }

    setIsLoading(true);
    try {
      const { data, error } = await login(email, password);
      
      if (error) {
        toast.error(error.message || "Gagal masuk, periksa kembali email & sandi.");
      } else {
        toast.success("Berhasil masuk!");
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-800">Masuk ke Akun Anda</h3>
      </div>
      <form className="space-y-4" onSubmit={handleLogin}>
        <Input 
          label="Alamat Email"
          type="email" 
          placeholder="admin@rt.com" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />
        <Input 
          label="Password"
          type="password" 
          placeholder="••••••••" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input id="remember-me" type="checkbox" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-900">Ingat saya</label>
          </div>
          <div className="text-sm">
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">Lupa password?</a>
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
    </div>
  );
}
