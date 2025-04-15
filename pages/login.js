// pages/login.js
import Image from 'next/image';

export default function Login() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <Image
          src="/logo-cjmotor.png"
          alt="Logo CJMOTOR"
          width={200}
          height={200}
          style={styles.logo}
        />
        <h1 style={styles.title}>Bienvenido a CJMOTOR</h1>
        <p style={styles.subtitle}>Inicia sesión para gestionar tus citas</p>
        <button style={styles.button}>Acceder</button>
        <h1 style={styles.title}>Proximamente...</h1>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#000',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    textAlign: 'center',
    color: '#fff',
  },
  logo: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
  },
  subtitle: {
    color: '#ccc',
    marginBottom: '2rem',
  },
  button: {
    backgroundColor: '#e60000',
    color: '#fff',
    padding: '10px 30px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};
