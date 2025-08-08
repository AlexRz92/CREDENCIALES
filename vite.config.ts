import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  define: {
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://omouzqcsylvmswyipcef.supabase.co'),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tb3V6cWNzeWx2bXN3eWlwY2VmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQyNjIyMzcsImV4cCI6MjA2OTgzODIzN30.TF3A1iMJpsP0pNa7uCZThtJl_IKjyurdVd7rpNT_lZ0')
  }
});