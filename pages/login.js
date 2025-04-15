import Image from 'next/image';
import Head from 'next/head';
import { useState } from 'react';

export default function Login() {
  const [showForm, setShowForm] = useState(false);

  const handleAccessClick = () => {
    setShowForm(true);
  };

  return (
    <>
      <Head>
        <title>Login - CJMOTOR</title>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
      </Head>

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

          {!showForm && (
            <button style={styles.button} onClick={handleAccessClick}>
              Acceder
            </button>
          )}

          {showForm && (
            <div style={styles.formWrapper}>
              <input
                type="email"
                placeholder="Correo electrónico"
                style={styles.input}
                onFocus={e => e.target.style = { ...styles.input, ...styles.inputFocus }}
                onBlur={e => e.target.style = { ...styles.input }}
              />
              <input
                type="password"
                placeholder="Contraseña"
                style={styles.input}
                onFocus={e => e.target.style = { ...styles.input, ...styles.inputFocus }}
                onBlur={e => e.target.style = { ...styles.input }}
              />
              <button style={styles.button}>Entrar</button>
            </div>
          )}
        </div>
      </div>
    </>
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
    maxWidth: '320px', // Más ancho para los inputs
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
  formWrapper: {
    marginTop: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
    maxWidth: '320px',
    marginInline: 'auto',
  },
  input: {
    padding: '12px 15px',
    borderRadius: '8px',
    border: '1px solid #444',
    backgroundColor: '#111',
    color: '#fff',
    fontSize: '1rem',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxShadow: '0 0 0px transparent',
  },
  inputFocus: {
    border: '1px solid #fff',
    boxShadow: '0 0 8px rgba(255, 255, 255, 0.3)',
  },
};

