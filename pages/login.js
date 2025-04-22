import Image from 'next/image';
import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

// Componente de Loader
const Loader = () => (
  <div style={styles.loaderOverlay}>
    <div style={styles.loader}>
      <Image src="/loading.gif" alt="Cargando..." width={120} height={120} />
      <p style={{ color: '#fff', marginTop: '10px' }}>Cargando...</p>
    </div>
  </div>
);

export default function Login() {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAccessClick = () => {
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let data, error;

    if (isRegistering) {
      const result = await supabase.auth.signUp({
        email,
        password,
      });
      data = result.data;
      error = result.error;
    } else {
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      data = result.data;
      error = result.error;
    }

    if (error) {
      alert('Credenciales incorrectas o cuenta no confirmada');
      console.error(error);
      setLoading(false);
    } else {
      const { data: userData } = await supabase.auth.getUser();
      const userEmail = userData?.user?.email;

      if (userEmail === 'admin@cjmotor.com') {
        router.push('/administrador');
      } else {
        router.push('/user-panel');
      }
    }
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

      {loading && <Loader />}

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
          <p style={styles.subtitle}>
            {isRegistering
              ? 'Regístrate para gestionar tus citas'
              : 'Inicia sesión para gestionar tus citas'}
          </p>

          {!showForm && (
            <button style={styles.button} onClick={handleAccessClick}>
              Acceder
            </button>
          )}

          {showForm && (
            <form style={styles.formWrapper} onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Correo electrónico"
                style={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Contraseña"
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" style={styles.button}>
                {isRegistering ? 'Registrarse' : 'Entrar'}
              </button>
              <button
                type="button"
                style={{
                  ...styles.button,
                  backgroundColor: '#444',
                  color: '#fff',
                }}
                onClick={() => setIsRegistering(!isRegistering)}
              >
                {isRegistering
                  ? '¿Ya tienes cuenta? Inicia sesión'
                  : '¿No tienes cuenta? Regístrate'}
              </button>
            </form>
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
  },
  loaderOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  loader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
};

