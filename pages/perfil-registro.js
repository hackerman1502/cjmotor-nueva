import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Card,
  CardContent,
  Typography,
  InputLabel,
  Input,
  Button,
} from "@mui/material";
import { createClient } from "@supabase/supabase-js";

// Configuración de Supabase
const supabaseUrl = "https://ynnclpisbiyaknnoijbd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlubmNscGlzYml5YWtubm9pamJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4MjQyNDQsImV4cCI6MjA2MDQwMDI0NH0.hcPF3V32hWOT7XM0OpE0XX6cbuMDEXxvf8Ha79dT7YE";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function Perfil() {
  const [perfil, setPerfil] = useState({
    nombre: "",
    apellidos: "",
    telefono: "",
    correo: "",
    matricula: "",
    coche: "",
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getPerfil = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from("perfiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) setPerfil(data);
      setLoading(false);
    };

    getPerfil();
  }, []);

  const handleChange = (campo, valor) => {
    setPerfil({ ...perfil, [campo]: valor });
  };

  const guardarPerfil = async () => {
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();
    
    if (!user || userError) {
      router.push("/login"); // o muestra un mensaje
      return;
    }


    const { error } = await supabase.from("perfiles").upsert({
      id: user.id,
      ...perfil,
    });

    if (error) {
      alert("Error al guardar el perfil: " + error.message);
      console.error(error);
    }
    else {
      alert("Perfil guardado correctamente");
    }
  };

  if (loading) return <p style={{ color: "white" }}>Cargando...</p>;

  return (
    <div
      style={{
        backgroundColor: "black",
        color: "white",
        padding: "20px",
        minHeight: "100vh",
      }}
    >
      {/* Encabezado con botón atrás y logo */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "10px",
        }}
      >
        <Button
          variant="contained"
          onClick={() => router.push("user-panel")}
          style={{
            backgroundColor: "white",
            color: "black",
            border: "1px solid #ccc",
            marginRight: "10px",
          }}
        >
          Atrás
        </Button>
        <img
          src="/logo-cjmotor.png"
          alt="Logo"
          style={{ width: "130px", height: "auto" }}
        />
      </div>

      {/* Caja blanca con formulario */}
      <Card style={{ backgroundColor: "white", color: "black", padding: "20px" }}>
        <CardContent>
          <Typography variant="h5" style={{ textAlign: "center", marginBottom: "20px" }}>
            Mi Perfil
          </Typography>

          {[
            { label: "Nombre", campo: "nombre" },
            { label: "Apellidos", campo: "apellidos" },
            { label: "Teléfono", campo: "telefono" },
            { label: "Correo", campo: "correo" },
            { label: "Matrícula", campo: "matricula" },
            { label: "Coche", campo: "coche" },
          ].map(({ label, campo }) => (
            <div key={campo} style={{ marginBottom: "15px" }}>
              <InputLabel>{label}</InputLabel>
              <Input
                value={perfil[campo]}
                onChange={(e) => handleChange(campo, e.target.value)}
                fullWidth
              />
            </div>
          ))}

          <Button variant="contained" onClick={guardarPerfil}>
            Guardar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
