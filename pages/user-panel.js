import { Button } from "@mui/material";
import { useRouter } from "next/router";
import Image from "next/image";
import { useUser } from "../context/UserContext"; // Asegúrate de importar el hook
import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "black",
    color: "white",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "'Poppins', sans-serif",
  },
  header: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginBottom: "30px",
  },
  logo: {
    width: "130px",
    height: "auto",
  },
  title: {
    fontSize: "18px",
    fontWeight: "300",
    marginTop: "10px",
    letterSpacing: "1px",
    textAlign: "center",
  },
  button: {
    backgroundColor: "white",
    color: "black",
    margin: "10px 0",
    width: "200px",
    borderRadius: "8px",
    fontWeight: "500",
  },
};

export default function UserPanel() {
  const { user } = useUser(); // Obtener el usuario logueado
  const router = useRouter();

  // Función para redirigir a la página principal y cerrar sesión
  const handleGoHome = async () => {
    await supabase.auth.signOut(); // Cierra sesión
    router.push('/login');         // Vuelve al login
  };

  // Verificar si el usuario está logueado y redirigir si no lo está
  useEffect(() => {
    if (!user) {
      router.push('/login'); // Si no hay usuario, redirigir al login
    }
  }, [user, router]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Image
          src="/logo-cjmotor.png"
          alt="Logo CJ MOTOR"
          width={130}
          height={130}
          style={styles.logo}
        />
        <p style={styles.title}>Bienvenido al panel de usuario</p>
      </div>

      {/* Mostrar botones solo si el usuario está logueado */}
      {user && (
        <>
          <Button
            variant="contained"
            style={styles.button}
            onClick={() => router.push("/historial-reparaciones")}
          >
            Historial reparaciones
          </Button>

          <Button
            variant="contained"
            style={styles.button}
            onClick={() => router.push("/perfil")}
          >
            Perfil
          </Button>

          <Button
            variant="contained"
            style={styles.button}
            onClick={() => router.push("/")}
          >
            Solicitar cita
          </Button>

          <Button
            variant="contained"
            style={styles.button}
            onClick={() => router.push("/mis-citas")}
          >
            Mis Citas
          </Button>

          <div style={{ display: "flex", justifyContent: "flex-start", marginTop: "20px" }}>
            <Button
              variant="contained"
              style={{
                backgroundColor: "white",
                color: "black",
              }}
              onClick={handleGoHome}
            >
              Volver a login
            </Button>
          </div>
        </>
      )}
    </div>
  );
}


