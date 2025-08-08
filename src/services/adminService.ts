import { supabase } from '../config/supabase'
import { hashPassword } from '../utils/crypto'
import type { Admin } from '../config/supabase'

export interface AdminInput {
  username: string
  nombre: string
  email?: string
  password: string
  role: string
  is_active: boolean
}

export interface AdminUpdate {
  username?: string
  nombre?: string
  email?: string
  password?: string
  role?: string
  is_active?: boolean
}

export class AdminService {
  static async getAllAdmins(): Promise<Admin[]> {
    const { data, error } = await supabase
      .from('admins')
      .select('id, username, password_hash, password_salt, role, nombre, email, created_at, created_by, last_login, is_active')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }

  static async getAdminById(id: string): Promise<Admin | null> {
    const { data, error } = await supabase
      .from('admins')
      .select('id, username, password_hash, password_salt, role, nombre, email, created_at, created_by, last_login, is_active')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }

  static async createAdmin(adminData: AdminInput): Promise<Admin> {
    const { hashedPassword, salt } = hashPassword(adminData.password)
    
    const { data, error } = await supabase
      .from('admins')
      .insert({
        username: adminData.username,
        nombre: adminData.nombre,
        email: adminData.email,
        password_hash: hashedPassword,
        password_salt: salt,
        role: adminData.role,
        is_active: adminData.is_active,
        created_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async updateAdmin(id: string, adminData: AdminUpdate): Promise<Admin> {
    const updateData: any = { ...adminData }
    
    // Si se está actualizando la contraseña, hasharla
    if (adminData.password) {
      const { hashedPassword, salt } = hashPassword(adminData.password)
      updateData.password_hash = hashedPassword
      updateData.password_salt = salt
      delete updateData.password
    }
    
    const { data, error } = await supabase
      .from('admins')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  static async deleteAdmin(id: string): Promise<void> {
    const { error } = await supabase
      .from('admins')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }

  static async searchAdmins(query: string): Promise<Admin[]> {
    const { data, error } = await supabase
      .from('admins')
      .select('id, username, password_hash, password_salt, role, nombre, email, created_at, created_by, last_login, is_active')
      .or(`nombre.ilike.%${query}%,username.ilike.%${query}%,email.ilike.%${query}%,role.ilike.%${query}%`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  }
}