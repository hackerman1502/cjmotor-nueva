// /pages/administrador.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

export default function Administrador() {
  const router = useRouter();

  // Redirigir a la página de login si no es admin (opcional)
  useEffect(() => {
    // Si no estás logueado o la sesión no es válida, puedes redirigir aquí
    // router.push('/login');
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.logoWrapper}>
          <Image
            src="/logo-cjmotor.png"
            alt="Logo CJMOTOR"
            layout="responsive"
            width={130}
            height={130}
          />
        </div>
        <h1 style={styles.title}>Panel de Administrador</h1>
        <p style={styles.subtitle}>Bienvenido al panel de administración de CJMOTOR</p>

        {/* Aquí agregarías todo lo relacionado con el panel de administración */}
        <div style={styles.buttonsContainer}>
          <button style={styles.button} onClick={() => router.push("/citas-panel")}>
            Gestionar Citas
          </button>
          <button style={styles.button} onClick={() => router.push("/otro-panel")}>
            Otro Panel
          </button>
          {/* Puedes añadir más botones según las secciones que quieras */}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#000',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    fontFamily: "'Poppins', sans-serif",
  },
  content: {
    textAlign: 'center',
    color: '#fff',
    maxWidth: '320px',
    width: '100%',
  },
  logoWrapper: {
    width: '60%',
    margin: '0 auto 2rem',
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '1rem',
    fontWeight: 600,
  },
  subtitle: {
    color: '#ccc',
    fontSize: '1rem',
    marginBottom: '2rem',
    fontWeight: 300,
  },
  buttonsContainer: {
    marginTop: '2rem',
  },
  button: {
    backgroundColor: '#fff',
    color: '#000',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    width: '100%',
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    marginTop: '1rem',
  },
};
