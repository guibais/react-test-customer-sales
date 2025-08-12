import { createFileRoute, Navigate, Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { useAuth } from '../hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Alert, AlertDescription } from '../components/ui/alert'
import { Loader2, UserPlus } from 'lucide-react'

export const Route = createFileRoute('/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const { register, isRegistering, registerError, isAuthenticated } = useAuth()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />
  }

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value }) => {
      if (value.password !== value.confirmPassword) {
        return
      }
      register({
        name: value.name,
        email: value.email,
        password: value.password,
      })
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <UserPlus className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Criar Conta de Administrador
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Registre-se para acessar o sistema de gestão
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registro</CardTitle>
            <CardDescription>
              Preencha os dados para criar sua conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            {registerError && (
              <Alert className="mb-4">
                <AlertDescription>{registerError.message}</AlertDescription>
              </Alert>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
              }}
              className="space-y-4"
            >
              <form.Field
                name="name"
                validators={{
                  onChange: ({ value }) =>
                    !value ? 'Nome é obrigatório' : undefined,
                }}
              >
                {(field) => (
                  <div>
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Seu nome completo"
                      disabled={isRegistering}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <Alert className="mt-2">
                        <AlertDescription>
                          {field.state.meta.errors[0]}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return 'Email é obrigatório'
                    if (!/\S+@\S+\.\S+/.test(value)) return 'Email inválido'
                    return undefined
                  },
                }}
              >
                {(field) => (
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="seu@email.com"
                      disabled={isRegistering}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <Alert className="mt-2">
                        <AlertDescription>
                          {field.state.meta.errors[0]}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field
                name="password"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) return 'Senha é obrigatória'
                    if (value.length < 6) return 'Senha deve ter pelo menos 6 caracteres'
                    return undefined
                  },
                }}
              >
                {(field) => (
                  <div>
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Sua senha"
                      disabled={isRegistering}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <Alert className="mt-2">
                        <AlertDescription>
                          {field.state.meta.errors[0]}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </form.Field>

              <form.Field
                name="confirmPassword"
                validators={{
                  onChange: ({ value, fieldApi }) => {
                    if (!value) return 'Confirmação de senha é obrigatória'
                    const password = fieldApi.form.getFieldValue('password')
                    if (value !== password) return 'Senhas não coincidem'
                    return undefined
                  },
                }}
              >
                {(field) => (
                  <div>
                    <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="Confirme sua senha"
                      disabled={isRegistering}
                    />
                    {field.state.meta.errors.length > 0 && (
                      <Alert className="mt-2">
                        <AlertDescription>
                          {field.state.meta.errors[0]}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </form.Field>

              <Button
                type="submit"
                className="w-full"
                disabled={isRegistering}
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Criar Conta
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Já tem uma conta?{' '}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Fazer login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
