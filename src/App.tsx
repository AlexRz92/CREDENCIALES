import React, { useState, useEffect } from 'react'
import { Search, Plus, Users, RefreshCw } from 'lucide-react'
import { AdminService } from './services/adminService'
import { AdminTable } from './components/AdminTable'
import { AdminModal } from './components/AdminModal'
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal'
import type { Admin } from './config/supabase'
import type { AdminInput, AdminUpdate } from './services/adminService'

function App() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [filteredAdmins, setFilteredAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create')
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  
  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  useEffect(() => {
    loadAdmins()
  }, [])

  useEffect(() => {
    if (searchQuery.trim()) {
      searchAdmins(searchQuery)
    } else {
      setFilteredAdmins(admins)
    }
  }, [searchQuery, admins])

  const loadAdmins = async () => {
    try {
      setLoading(true)
      const data = await AdminService.getAllAdmins()
      setAdmins(data)
      setFilteredAdmins(data)
    } catch (error) {
      console.error('Error loading admins:', error)
      alert('Error al cargar los administradores')
    } finally {
      setLoading(false)
    }
  }

  const searchAdmins = async (query: string) => {
    try {
      const data = await AdminService.searchAdmins(query)
      setFilteredAdmins(data)
    } catch (error) {
      console.error('Error searching admins:', error)
    }
  }

  const handleCreateAdmin = () => {
    setModalMode('create')
    setSelectedAdmin(null)
    setIsModalOpen(true)
  }

  const handleEditAdmin = (admin: Admin) => {
    setModalMode('edit')
    setSelectedAdmin(admin)
    setIsModalOpen(true)
  }

  const handleDeleteAdmin = (admin: Admin) => {
    setAdminToDelete(admin)
    setIsDeleteModalOpen(true)
  }

  const handleModalSubmit = async (data: AdminInput | AdminUpdate) => {
    try {
      if (modalMode === 'create') {
        await AdminService.createAdmin(data as AdminInput)
      } else if (selectedAdmin) {
        await AdminService.updateAdmin(selectedAdmin.id, data as AdminUpdate)
      }
      await loadAdmins()
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Error al guardar el administrador')
    }
  }

  const handleConfirmDelete = async () => {
    if (!adminToDelete) return
    
    try {
      setDeleteLoading(true)
      await AdminService.deleteAdmin(adminToDelete.id)
      await loadAdmins()
      setIsDeleteModalOpen(false)
      setAdminToDelete(null)
    } catch (error) {
      console.error('Error deleting admin:', error)
      alert('Error al eliminar el administrador')
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg mr-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Gestión de Administradores
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 bg-white/60 px-3 py-1 rounded-full">
                {filteredAdmins.length} administrador{filteredAdmins.length !== 1 ? 'es' : ''}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, usuario, email o rol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors shadow-sm"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={loadAdmins}
              className="inline-flex items-center px-4 py-2 text-gray-700 bg-white/80 backdrop-blur-sm border border-gray-300 rounded-lg hover:bg-white transition-colors shadow-sm"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
            
            <button
              onClick={handleCreateAdmin}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Administrador
            </button>
          </div>
        </div>

        {/* Table */}
        <AdminTable
          admins={filteredAdmins}
          onEdit={handleEditAdmin}
          onDelete={handleDeleteAdmin}
          loading={loading}
        />

        {/* Modals */}
        <AdminModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
          admin={selectedAdmin}
          mode={modalMode}
        />

        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          admin={adminToDelete}
          loading={deleteLoading}
        />
      </main>
    </div>
  )
}

export default App