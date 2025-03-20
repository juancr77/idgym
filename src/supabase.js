import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zgbiugkbwnddksmwqcws.supabase.co'; // Reemplaza con tu URL de Supabase
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnYml1Z2tid25kZGtzbXdxY3dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzMjk5MzMsImV4cCI6MjA1NzkwNTkzM30.DH_rk0b6hbQXdRTnlcsmnTBpIMeiBa58marJMkjFhkM'; // Reemplaza con tu clave pública
export const supabase = createClient(supabaseUrl, supabaseKey);