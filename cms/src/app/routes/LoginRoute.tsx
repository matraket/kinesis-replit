import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { AuthLayout } from '../layout/AuthLayout';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Card } from '../../ui/Card';

export function LoginRoute() {
  const [secret, setSecret] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!secret) {
      setError('Por favor ingrese el secret');
      setIsLoading(false);
      return;
    }

    try {
      login(secret);
      navigate('/admin');
    } catch {
      setError('Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <Card>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-admin-white mb-2">Kinesis CMS</h1>
          <p className="text-admin-muted">Ingrese sus credenciales de administrador</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            id="secret"
            type="password"
            label="Admin Secret"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Ingrese el admin secret"
            disabled={isLoading}
          />

          {error && (
            <div className="bg-admin-error/10 border border-admin-error text-admin-error px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            variant="primary"
            className="w-full"
          >
            {isLoading ? 'Ingresando...' : 'Entrar al CMS'}
          </Button>
        </form>
      </Card>
    </AuthLayout>
  );
}
