import { Button } from "@mui/material";
import { useRouter } from "next/router";

export default function AdminPanel() {
  const router = useRouter();

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <img src="/logo-cjmotor.png" alt="Logo" style={styles.logo} />
      </div>

      <div style={styles.buttonWrapper}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/admin-panel")}
          style={styles.button}
        >
          Calendario citas
        </Button>

        <Button
          variant="contained"
          color="primary"
          onClick={() => router.push("/citas-panel")}
          style={styles.button}
        >
          Listado citas
        </Button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#000',  // Fondo negro igual que en otras páginas
    color: '#fff',            // Texto blanco para contraste
    padding: '20px',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '40px',
  },
  logo: {
    width: '130px',
    height: 'auto',
  },
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    alignItems: 'center',
  },
  button: {
    width: '250px',  // Ancho fijo para los botones
    fontSize: '16px',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#fff', // Botones en blanco
    color: '#000',           // Texto negro en los botones
  },
};
