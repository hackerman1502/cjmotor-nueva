import Image from 'next/image';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setShowForm(false); // Oculta el formulario si ya está logueado
        router.push("/user-panel"); // 🚀 Esto faltaba para redirigir
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    checkSession();

    // Detecta cambios en sesión por si vuelve atrás
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      checkSession();
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleAccessClick = () => {
    setShowForm(true);
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  let data, error;

  // Si estamos registrando un nuevo usuario
  if (isRegistering) {
    console.log('Registrando usuario...', email, password);

    // Intentamos registrar al usuario
    ({ data, error } = await supabase.auth.signUp({
      email,
      password,
    }));

    if (error) {
      console.error('Error al registrar cuenta:', error.message);
      alert('Error al registrar cuenta: ' + error.message);
      return;
    }

    console.log('Usuario registrado correctamente:', data);
    alert('Se ha enviado un correo de confirmación, por favor verifica tu bandeja de entrada.');
    return;
  } else {
    // Si estamos intentando iniciar sesión
    console.log('Iniciando sesión con el correo:', email);

    ({ data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    }));

    if (error) {
      console.error('Error al iniciar sesión:', error.message);
      alert('Credenciales incorrectas o cuenta no confirmada');
      return;
    }

    console.log('Usuario autenticado correctamente:', data);
  }

  // Si no hay errores, verificamos si el usuario tiene un rol
  const { data: userProfile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('user_id', data.user.id)
    .single();

  if (profileError) {
    console.error('Error al obtener el perfil de usuario:', profileError);
    alert('No se pudo obtener el perfil del usuario.');
    return;
  }

  console.log('Perfil del usuario:', userProfile);

  // Si el rol es 'admin', redirigir al panel de administración
  if (userProfile?.role === 'admin') {
    router.push('/administrador');
  } else {
    router.push('/user-panel');
  }
};

  // Si no hay errores, verificamos si el usuario tiene un rol
  const { data: userProfile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('user_id', data.user.id)
    .single();

  if (profileError) {
    console.error('Error al obtener el perfil de usuario:', profileError);
    alert('No se pudo obtener el perfil del usuario.');
    return;
  }

  // Si el rol es 'admin', redirigir al panel de administración
  if (userProfile?.role === 'admin') {
    router.push('/administrador');
  } else {
    router.push('/user-panel');
  }
};


  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>
        Cargando...
      </div>
    );
  }

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
          <p style={styles.subtitle}>
            {isRegistering ? 'Regístrate para gestionar tus citas' : 'Inicia sesión para gestionar tus citas'}
          </p>

          {!showForm && !user && (
            <button style={styles.button} onClick={handleAccessClick}>
              Acceder
            </button>
          )}

          {user && (
            <button
              style={{ ...styles.button, backgroundColor: '#d9534f', color: '#fff' }}
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          )}

          {showForm && !user && (
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
                style={{ ...styles.button, backgroundColor: '#444', color: '#fff' }}
                onClick={() => setIsRegistering(!isRegistering)}
              >
                {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
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
};
