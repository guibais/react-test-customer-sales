import { useForm } from "@tanstack/react-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { X, Loader2 } from "lucide-react";
import {
  useCreateCustomer,
  useUpdateCustomer,
  useCustomer,
} from "../../hooks/useCustomers";
import { useState, useEffect } from "react";

type CustomerFormProps = {
  customerId?: string;
  onClose: () => void;
  onSuccess: () => void;
};

type CustomerFormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
};

export function CustomerForm({
  customerId,
  onClose,
  onSuccess,
}: CustomerFormProps) {
  const { mutate: createCustomer, isPending: isCreating } = useCreateCustomer();
  const { mutate: updateCustomer, isPending: isUpdating } = useUpdateCustomer();
  const { data: customerData, isLoading } = useCustomer(customerId);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(customerId);
  const isPending = isCreating || isUpdating;

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      birthDate: "",
    },
    onSubmit: async ({ value }) => {
      try {
        setError(null);
        if (isEditing && customerId) {
          updateCustomer(
            { id: customerId, data: value },
            {
              onSuccess: () => onSuccess(),
              onError: (err: any) => {
                const errorMessage =
                  err?.response?.data?.message || err?.message;
                setError(errorMessage || "Erro ao atualizar cliente");
              },
            }
          );
        } else {
          createCustomer(value, {
            onSuccess: () => onSuccess(),
            onError: (err: any) => {
              const errorMessage = err?.response?.data?.message || err?.message;
              setError(errorMessage || "Erro ao criar cliente");
            },
          });
        }
      } catch (error) {
        setError("Erro inesperado");
        console.error("Erro ao salvar cliente:", error);
      }
    },
  });

  useEffect(() => {
    if (customerData && isEditing) {
      form.setFieldValue("name", customerData.name || "");
      form.setFieldValue("email", customerData.email || "");
      form.setFieldValue("phone", customerData.phone || "");
      form.setFieldValue("address", customerData.address || "");
      form.setFieldValue(
        "birthDate",
        customerData.birthDate?.split("T")[0] || ""
      );
    }
  }, [customerData, isEditing, form]);

  if (isLoading && isEditing) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Carregando dados do cliente...</span>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{isEditing ? "Editar Cliente" : "Novo Cliente"}</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) =>
                  !value ? "Nome é obrigatório" : undefined,
              }}
            >
              {(field) => (
                <div>
                  <Label htmlFor="name">Nome *</Label>
                  <Input
                    id="name"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Nome completo"
                    disabled={isPending}
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
                  if (!value) return "Email é obrigatório";
                  if (!/\S+@\S+\.\S+/.test(value)) return "Email inválido";
                  return undefined;
                },
              }}
            >
              {(field) => (
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="email@exemplo.com"
                    disabled={isPending}
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

            <form.Field name="phone">
              {(field) => (
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="(11) 99999-9999"
                    disabled={isPending}
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="address">
              {(field) => (
                <div>
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Endereço completo"
                    disabled={isPending}
                  />
                </div>
              )}
            </form.Field>

            <form.Field name="birthDate">
              {(field) => (
                <div>
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    disabled={isPending}
                  />
                </div>
              )}
            </form.Field>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isPending}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Salvando..." : isEditing ? "Atualizar" : "Criar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
