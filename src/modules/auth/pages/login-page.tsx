import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderCircle } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useAuthStore } from '../store/auth.store';

export const LoginPage = () => {
  const { login } = useAuthStore();

  const [isError, setIsError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const userName = formData.get('userName') as string;
    const password = formData.get('password') as string;
    await login({ userName, password });

    setIsLoading(true);
    setIsError('Error iniciando sesión, revisar las credenciales.');
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center px-6 py-8">
      <div className="flex flex-col justify-center items-center mb-6 w-full">
        <a href="#" className="text-2xl font-semibold">
          Mandril Importaciones
        </a>
        <h2 className="text-lg">Panel administrativo</h2>
      </div>
      <div className="w-full rounded-lg shadow-lg md:mt-0 sm:max-w-md xl:p-0">
        <div className="p-6 space-y-6 md:space-y-8 sm:p-8">
          <h1 className="text-xl font-medium leading-tight tracking-tightmd:text-2xl">Ingresa a tu cuenta</h1>
          <form className="space-y-6 md:space-y-8" onSubmit={handleLogin}>
            <div className="space-y-1">
              <Label htmlFor="userName">Usuario</Label>
              <Input id="userName" type="text" placeholder="Ingresa tu usuario" name="userName" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" type="password" placeholder="Ingresa tu contraseña" name="password" required />
              <a
                href="#"
                className="w-full text-right text-muted-foreground inline-block text-sm underline-offset-4 hover:text-black/70"
              >
                Olvidé mi contraseña
              </a>
              {isError && <span className="inline-block pt-4 text-destructive text-sm">{isError}</span>}
            </div>
            <div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                Ingresar
                {isLoading && <LoaderCircle className="animate-spin" />}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
