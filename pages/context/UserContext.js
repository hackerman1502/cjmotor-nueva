// context/UserContext.js

import { createContext, useState, useContext, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase
const supabaseUrl = "https://ynnclpisbiyaknnoijbd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlubmNscGlzYml5YWtubm9pamJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MjQyNDQsImV4cCI6MjA2MDQwMDI0NH0.hcPF3V32hWOT7XM0OpE0XX6cbuMDEXxvf8Ha79dT7YE";
const supabase = createClient(supabaseUrl, supabaseKey);

// Crear el contexto de usuario
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const session = supabase.auth.session(); // Obtiene la sesión actual del usuario

    if (session) {
      setUser(session.user);
    }

    // Escuchar cambios en la sesión
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      listener?.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};

// Crear un hook para acceder al usuario
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe ser usado dentro de un UserProvider");
  }
  return context;
};
