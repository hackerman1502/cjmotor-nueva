// ...los mismos imports de antes
import { TextField } from "@mui/material";

// ...supabase config igual

export default function CitasPanel() {
  const [citas, setCitas] = useState([]);
  const [filter, setFilter] = useState("fecha");
  const [estadoFilter, setEstadoFilter] = useState("");
  const router = useRouter();

  const fetchCitas = async () => {
    let query = supabase.from("citas").select("*");

    if (estadoFilter) {
      query = query.eq("estado", estadoFilter);
    }

    if (filter === "fecha") {
      query = query.order("fecha", { ascending: true });
    } else if (filter === "estado") {
      query = query.order("estado", { ascending: true });
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error al obtener citas:", error);
    } else {
      setCitas(data);
    }
  };

  useEffect(() => {
    fetchCitas();
  }, [filter, estadoFilter]);

  const handleChange = (id, campo, valor) => {
    setCitas((prevCitas) =>
      prevCitas.map((cita) =>
        cita.id === id ? { ...cita, [campo]: valor } : cita
      )
    );
  };

  const handleUpdate = async (id) => {
    const cita = citas.find((c) => c.id === id);

    const { error } = await supabase
      .from("citas")
      .update({
        nombre: cita.nombre,
        telefono: cita.telefono,
        servicio: cita.servicio,
        fecha: cita.fecha,
        hora: cita.hora,
        estado: cita.estado,
      })
      .eq("id", id);

    if (error) {
      console.error("Error al actualizar cita:", error);
      alert("No se pudo actualizar la cita");
    } else {
      alert("Cita actualizada correctamente");
      fetchCitas();
    }
  };

  const handleMarkCompleted = async (id) => {
    try {
      const { data: cita, error: fetchError } = await supabase
        .from("citas")
        .select("*")
        .eq("id", id)
        .single();

      if (fetchError) {
        console.error("Error al obtener la cita:", fetchError);
        return;
      }

      const { error: insertError } = await supabase
        .from("citas_completadas")
        .insert([{ ...cita, estado: "Completada" }]);

      if (insertError) {
        console.error("Error al insertar en citas_completadas:", insertError);
        return;
      }

      const { error: deleteError } = await supabase
        .from("citas")
        .delete()
        .eq("id", id);

      if (deleteError) {
        console.error("Error al eliminar la cita:", deleteError);
        return;
      }

      fetchCitas();
      alert("Cita marcada como completada y movida correctamente.");
    } catch (error) {
      console.error("Error inesperado:", error);
      alert("Hubo un problema al procesar la cita.");
    }
  };

  return (
    <div style={{ backgroundColor: "black", color: "white", padding: "20px", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <Button
          variant="contained"
          onClick={() => router.push("/administrador")}
          style={{ backgroundColor: "white", color: "black", border: "1px solid #ccc", marginRight: "10px" }}
        >
          Atrás
        </Button>
        <img src="/logo-cjmotor.png" alt="Logo" style={{ width: "130px", height: "auto" }} />
      </div>

      <Card style={{ backgroundColor: "white", color: "black", padding: "20px" }}>
        <CardContent>
          <Typography variant="h5" style={{ textAlign: "center", marginBottom: "20px" }}>
            Lista de Citas
          </Typography>

          <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
            <FormControl variant="outlined" style={{ width: "200px", backgroundColor: "white" }}>
              <InputLabel>Filtrar por Estado</InputLabel>
              <Select value={estadoFilter} onChange={(e) => setEstadoFilter(e.target.value)} label="Filtrar por Estado">
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="Pendiente">Pendiente</MenuItem>
                <MenuItem value="Completada">Completada</MenuItem>
              </Select>
            </FormControl>

            <FormControl variant="outlined" style={{ width: "200px", backgroundColor: "white" }}>
              <InputLabel>Ordenar por</InputLabel>
              <Select value={filter} onChange={(e) => setFilter(e.target.value)} label="Ordenar por">
                <MenuItem value="fecha">Fecha</MenuItem>
                <MenuItem value="estado">Estado</MenuItem>
              </Select>
            </FormControl>
          </div>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Nombre</strong></TableCell>
                  <TableCell><strong>Teléfono</strong></TableCell>
                  <TableCell><strong>Servicio</strong></TableCell>
                  <TableCell><strong>Fecha</strong></TableCell>
                  <TableCell><strong>Hora</strong></TableCell>
                  <TableCell><strong>Estado</strong></TableCell>
                  <TableCell><strong>Acción</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {citas.map((cita) => (
                  <TableRow key={cita.id}>
                    <TableCell>
                      <TextField value={cita.nombre} onChange={(e) => handleChange(cita.id, "nombre", e.target.value)} />
                    </TableCell>
                    <TableCell>
                      <TextField value={cita.telefono} onChange={(e) => handleChange(cita.id, "telefono", e.target.value)} />
                    </TableCell>
                    <TableCell>
                      <TextField value={cita.servicio} onChange={(e) => handleChange(cita.id, "servicio", e.target.value)} />
                    </TableCell>
                    <TableCell>
                      <TextField type="date" value={cita.fecha} onChange={(e) => handleChange(cita.id, "fecha", e.target.value)} />
                    </TableCell>
                    <TableCell>
                      <TextField type="time" value={cita.hora} onChange={(e) => handleChange(cita.id, "hora", e.target.value)} />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={cita.estado}
                        onChange={(e) => handleChange(cita.id, "estado", e.target.value)}
                      >
                        <MenuItem value="Pendiente">Pendiente</MenuItem>
                        <MenuItem value="Completada">Completada</MenuItem>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => handleUpdate(cita.id)}
                        style={{ marginBottom: "8px", backgroundColor: "#007BFF", color: "white" }}
                      >
                        Guardar
                      </Button>
                      {cita.estado === "Pendiente" && (
                        <Button
                          variant="contained"
                          style={{ backgroundColor: "black", color: "white" }}
                          onClick={() => handleMarkCompleted(cita.id)}
                        >
                          Marcar como Completada
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </div>
  );
}
