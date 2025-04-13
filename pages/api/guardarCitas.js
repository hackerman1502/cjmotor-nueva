import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { cita } = req.body;

    const filePath = path.join(process.cwd(), 'public', 'horarios.json');

    let citas = [];

    try {
      const fileData = fs.readFileSync(filePath, 'utf8');
      citas = JSON.parse(fileData).citas || [];
    } catch (error) {
      console.log("No hay citas previas o error leyendo el archivo:", error);
    }

    // Validar si ya hay una cita en la misma fecha y hora
    const existe = citas.some((c) => {
      return (
        c.fecha.split("T")[0] === cita.fecha.split("T")[0] &&
        c.hora === cita.hora
      );
    });

    if (existe) {
      return res.status(400).json({ message: 'Ya existe una cita en esa hora.' });
    }

    citas.push(cita);

    fs.writeFileSync(filePath, JSON.stringify({ citas }, null, 2));

    return res.status(200).json({ message: 'Cita guardada correctamente' });
  }

  return res.status(405).json({ message: 'Método no permitido' });
}

