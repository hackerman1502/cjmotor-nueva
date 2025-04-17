import { createContext, useState, useEffect, useContext } from "react";
import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase
const supabaseUrl = "https://ynnclpisbiyaknnoijbd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlubmNscGlzYml5YWtubm9pamJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MjQyNDQsImV4cCI6MjA2MDQwMDI0NH0.hcPF3V32hWOT7XM0OpE0XX6cbuMDEXxvf8Ha79dT7YE";
const supabase = createClient(supabaseUrl, supabaseKey);

// Crear contexto de usuario
const UserContext = createContext();

// Proveedor de contexto
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Verificar si el usuario ya está logueado
    const session = supabase.auth.session();
    if (session) {
      setUser(session.user);
    }

    // Escuchar cambios de sesión
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session ? session.user : null);
    });

    // Limpiar el listener cuando el componente se desmonte
    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook para acceder al usuario logueado en cualquier parte de la app
export const useUser = () => {
  return useContext(UserContext);
};
