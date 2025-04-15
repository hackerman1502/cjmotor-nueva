// pages/login.js
import Image from 'next/image';

export default function Login() {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.logoWrapper}>
          <Image
            src="/logo-cjmotor.png"
            alt="Logo CJMOTOR"
            layout="responsive"
            width={200}
            height={200}
          />
        </div>
        <h1 style={styles.title}>Bienvenido a CJMOTOR</h1>
        <p style={styles.subtitle}>Inicia sesión para gestionar tus citas</p>
        <button style={styles.button}>Acceder</button>
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
  },
  content: {
    textAlign: 'center',
    color: '#fff',
    maxWidth: '400px',
    width: '100%',
  },
  logoWrapper: {
    width: '60%',
    margin: '0 auto 2rem',
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '1rem',
  },
  subtitle: {
    color: '#ccc',
    fontSize: '1rem',
    marginBottom: '2rem',
  },
  button: {
    backgroundColor: '#e60000',
    color: '#fff',
    padding: '12px 20px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    width: '100%',
    maxWidth: '250px',
    cursor: 'pointer',
  },
};

