import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import { supabase } from '../lib/supabaseClient';

export default function ResetPassword() {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (newPassword !== confirmPassword) {
      setMessage('❌ Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setMessage('❌ Error al actualizar la contraseña.');
      console.error(error);
    } else {
      setMessage('✅ Contraseña actualizada con éxito. Redirigiendo...');
      setTimeout(() => {
        router.push('/login');
      }, 2500);
    }

    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Restablecer Contraseña - CJMOTOR</title>
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
          <h2 style={styles.title}>Restablecer contraseña</h2>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={styles.input}
          />
          <button onClick={handleReset} style={styles.button} disabled={loading}>
            {loading ? 'Guardando...' : 'Actualizar contraseña'}
          </button>
          {message && <p style={styles.message}>{message}</p>}
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
    fontSize: '1.5rem',
    marginBottom: '1rem',
    fontWeight: 600,
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
    width: '100%',
    marginTop: '1rem',
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
    marginTop: '1.5rem',
  },
  message: {
    marginTop: '1rem',
    fontSize: '0.95rem',
  },
};
