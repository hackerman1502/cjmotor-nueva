// /lib/supabaseClient.js

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lslvykkxyqtkcyrxxzey.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzbHZ5a2t4eXF0a2N5cnh4emV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ2NTAwODQsImV4cCI6MjA2MDIyNjA4NH0.JnVxWZWB4Lbod01G23PSNzq6bd6N-DCXXxZeLci8Oc8";

export const supabase = createClient(supabaseUrl, supabaseKey);