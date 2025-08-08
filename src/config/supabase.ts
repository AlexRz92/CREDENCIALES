import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qcyoriwwzysgxjcwtyxa.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjeW9yaXd3enlzZ3hqY3d0eXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NDMyOTEsImV4cCI6MjA2ODUxOTI5MX0.e6FNvKtPJUpkVFjDw4U0UhHtCG5Ko_ud0U7zzzTmk8A'

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
