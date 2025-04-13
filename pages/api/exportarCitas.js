import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const horariosPath = path.join(process.cwd(), 'public', 'horarios.json');
  const exportDir = path.join(process.cwd(), 'exports');

  try {
    // Asegura que existe la carpeta exports
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir);
    }

    const rawData = fs.readFileSync(horariosPath, 'utf-8');
    const { citas } = JSON.parse(rawData);

    if (!citas || citas.length === 0) {
      return res.status(200).json({ message: 'No hay citas para exportar.' });
    }

    // Crear cabecera CSV
    const header = 'Nombre,Teléfono,Fecha,Hora,Servicio,Comentario\n';

    // Convertir citas a líneas CSV
    const lines = citas.map(cita => {
      return [
        cita.nombre,
        cita.telefono,
        cita.fecha,
        cita.hora,
        cita.servicio,
        `"${cita.comentario?.replace(/"/g, '""') || ''}"`
      ].join(',');
    });

    const csvContent = header + lines.join('\n');

    // Crear nombre de archivo con fecha y hora
    const now = new Date();
    const fecha = now.toISOString().split("T")[0]; // yyyy-mm-dd
    const hora = now.toTimeString().slice(0, 5).replace(":", "-"); // hh-mm
    const filename = `citas-${fecha}-${hora}.csv`;

    const exportPath = path.join(exportDir, filename);

    fs.writeFileSync(exportPath, csvContent);

    res.status(200).json({
      message: 'Citas exportadas correctamente',
      file: `/exports/${filename}`
    });
  } catch (error) {
    console.error('Error exportando citas:', error);
    res.status(500).json({ message: 'Error exportando las citas', error });
  }
}