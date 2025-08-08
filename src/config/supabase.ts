import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://omouzqcsylvmswyipcef.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tb3V6cWNzeWx2bXN3eWlwY2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNjIyMzcsImV4cCI6MjA2OTgzODIzN30.TF3A1iMJpsP0pNa7uCZThtJl_IKjyurdVd7rpNT_lZ0'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Admin = {
  id: string
  username: string
  password_hash: string
  password_salt: string
  role: string
  nombre: string
  email: string | null
  created_at: string
  created_by: string | null
  last_login: string | null
  is_active: boolean
}