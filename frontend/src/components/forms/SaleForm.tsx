import { useForm } from "@tanstack/react-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Alert, AlertDescription } from "../ui/alert";
import { Loader2 } from "lucide-react";
import { useCreateSale, useUpdateSale } from "../../hooks/useSales";
import { useCustomers } from "../../hooks/useCustomers";
import { useState, useEffect } from "react";
import { Modal } from "../ui/Modal";
import type { NormalizedSale } from "../../services/salesService";

type SaleFormProps = {
  saleId?: string;
  saleData?: NormalizedSale;
  onClose: () => void;
  onSuccess: () => void;
};

export function SaleForm({ saleId, saleData, onClose, onSuccess }: SaleFormProps) {
  const { mutate: createSale, isPending: isCreating } = useCreateSale();
  const { mutate: updateSale, isPending: isUpdating } = useUpdateSale();
  const { data: customersData } = useCustomers();
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(saleId);
  const isPending = isCreating || isUpdating;

  const form = useForm({
    defaultValues: {
      customerId: "",
      amount: "",
      saleDate: new Date().toISOString().split("T")[0],
    },
    onSubmit: async ({ value }) => {
      try {
        setError(null);
        const saleData = {
          customerId: value.customerId,
          amount: parseFloat(value.amount),
          saleDate: value.saleDate,
        };

        if (isEditing && saleId) {
          updateSale(
            { id: saleId, data: saleData },
            {
              onSuccess: () => onSuccess(),
              onError: (err: any) =>
                setError(err.message || "Erro ao atualizar venda"),
            }
          );
        } else {
          createSale(saleData, {
            onSuccess: () => onSuccess(),
            onError: (err: any) =>
              setError(err.message || "Erro ao criar venda"),
          });
        }
      } catch (error) {
        setError("Erro inesperado");
        console.error("Erro ao salvar venda:", error);
      }
    },
  });

  useEffect(() => {
    if (saleData && isEditing) {
      form.setFieldValue("customerId", saleData.customerId || "");
      form.setFieldValue("amount", saleData.amount?.toString() || "");
      form.setFieldValue("saleDate", saleData.saleDate?.split("T")[0] || "");
    }
  }, [saleData, isEditing, form]);

  return (
    <Modal 
      isOpen={true} 
      onClose={onClose} 
      title={isEditing ? "Editar Venda" : "Nova Venda"}
    >
      {error && (
        <Alert className="mb-4 border-red-200 bg-red-50">
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
              name="customerId"
              validators={{
                onChange: ({ value }) =>
                  !isEditing && !value ? "Cliente é obrigatório" : undefined,
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Cliente</Label>
                  {isEditing ? (
                    <Input
                      value={saleData ? `${saleData.customerName} - ${saleData.customerEmail}` : "Carregando..."}
                      disabled
                      className="bg-gray-50 text-gray-600"
                    />
                  ) : (
                    <Select
                      value={field.state.value}
                      onValueChange={field.handleChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                      <SelectContent>
                        {customersData?.customers?.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name} - {customer.email}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  {!isEditing && field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-600">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="amount"
              validators={{
                onChange: ({ value }) => {
                  if (!value) return "Valor é obrigatório";
                  const num = parseFloat(value);
                  if (isNaN(num) || num <= 0)
                    return "Valor deve ser maior que zero";
                  return undefined;
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Valor (R$)</Label>
                  <Input
                    id={field.name}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-600">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
                </div>
              )}
            </form.Field>

            <form.Field
              name="saleDate"
              validators={{
                onChange: ({ value }) =>
                  !value ? "Data da venda é obrigatória" : undefined,
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor={field.name}>Data da Venda</Label>
                  <Input
                    id={field.name}
                    type="date"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  {field.state.meta.errors.length > 0 && (
                    <p className="text-sm text-red-600">
                      {field.state.meta.errors[0]}
                    </p>
                  )}
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
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Atualizando..." : "Criando..."}
                  </>
                ) : (
                  <>{isEditing ? "Atualizar" : "Criar"} Venda</>
                )}
              </Button>
            </div>
          </form>
    </Modal>
  );
}
