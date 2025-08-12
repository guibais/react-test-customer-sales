import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useAuth } from '../hooks/useAuth'
import { DashboardLayout } from '../components/layout/DashboardLayout'
import { CustomersTable } from '../components/dashboard/CustomersTable'
import { CustomerForm } from '../components/forms/CustomerForm'
import { Button } from '../components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/customers')({
  component: CustomersPage,
})

function CustomersPage() {
  const { isAuthenticated } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null)

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  const handleEdit = (customerId: string) => {
    setEditingCustomerId(customerId)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingCustomerId(null)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingCustomerId(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-800 bg-clip-text text-transparent">
              Clientes
            </h1>
            <p className="text-slate-600 mt-1">
              Gerencie os clientes da loja de brinquedos
            </p>
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
        
        <CustomersTable 
          onEdit={handleEdit}
          showActions={true}
        />
        
        {showForm && (
          <CustomerForm
            customerId={editingCustomerId || undefined}
            onClose={handleCloseForm}
            onSuccess={handleFormSuccess}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
