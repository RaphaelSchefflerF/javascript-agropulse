// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lvazfosttoyjpxitqbsw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2YXpmb3N0dG95anB4aXRxYnN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY5ODM3MDk5NSwiZXhwIjoyMDEzOTQ2OTk1fQ.FQw2RBBAZ-mKgungAnN0pS_F-VXe8J6_5eAaRFKMMSY';

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
