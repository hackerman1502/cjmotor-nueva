const handleMarkCompleted = async (id) => {
  try {
    // 1. Obtener la cita que se marcará como completada
    const { data: cita, error: fetchError } = await supabase
      .from("citas")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error al obtener la cita:", fetchError);
      alert("Hubo un problema al obtener la cita.");
      return;
    }

    // Obtener el usuario logueado
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData) {
      console.error("Error al obtener el usuario:", userError);
      alert("No se pudo obtener el usuario.");
      return;
    }

    // 2. Insertar la cita en la tabla citas_completadas, incluyendo el usuario_id
    const { error: insertError } = await supabase
      .from("citas_completadas")
      .insert([
        {
          nombre: cita.nombre,
          telefono: cita.telefono,
          servicio: cita.servicio,
          fecha: cita.fecha,
          hora: cita.hora,
          estado: "Completada", // El estado se establece a "Completada"
          usuario_id: userData.id, // Asignamos el ID del usuario que marcó la cita como completada
        },
      ]);

    if (insertError) {
      console.error("Error al insertar en citas_completadas:", insertError);
      alert("Hubo un problema al mover la cita.");
      return;
    }

    // 3. Eliminar la cita de la tabla citas
    const { error: deleteError } = await supabase
      .from("citas")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Error al eliminar la cita:", deleteError);
      alert("Hubo un problema al eliminar la cita.");
      return;
    }

    // 4. Actualizar la lista de citas
    fetchCitas(); // Refrescar las citas
    alert("Cita marcada como completada y movida correctamente.");
  } catch (error) {
    console.error("Error inesperado:", error);
    alert("Hubo un problema al procesar la cita.");
  }
};

