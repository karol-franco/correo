const nodemailer = require('nodemailer');

// Configurar el transporte SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'francokarol696@gmail.com',
    pass: 'lprm yxbu kavr mjve'
  }
});

// Lista grande de destinatarios
const listaDestinatarios = [
  // Agrega aquí todos los correos
  'causil845@gmail.com',
  // ... hasta miles
];

// ✉️ Contenido base del correo
const mensajeBase = {
  from: 'francokarol696@gmail.com',
  subject: '¡Promociones',
  text: 'Hola esta es una prueba.',
};

function enviarCorreo(destinatario) {
  return transporter.sendMail({ ...mensajeBase, to: destinatario });
}

//  Función que espera una cantidad de milisegundos (para pausar entre lotes)
function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 🔁 Función para dividir la lista en grupos de N elementos
function dividirEnLotes(array, tamanoLote) {
  const lotes = [];
  for (let i = 0; i < array.length; i += tamanoLote) {
    lotes.push(array.slice(i, i + tamanoLote));
  }
  return lotes;
}

// 🚀 Enviar correos en lotes de N
async function enviarCorreosEnLotes(lista, tamanoLote = 100, pausaEntreLotes = 1000) {
  const lotes = dividirEnLotes(lista, tamanoLote);
  console.log(`🔄 Enviando ${lotes.length} lotes de correos (${tamanoLote} por lote)...`);

  for (let i = 0; i < lotes.length; i++) {
    const lote = lotes[i];
    console.log(`🚚 Enviando lote ${i + 1}/${lotes.length}...`);

    try {
      // Creamos y ejecutamos todas las promesas en paralelo
      const resultados = await Promise.all(lote.map(dest => enviarCorreo(dest)));

      resultados.forEach((info, index) => {
        console.log(` ${i * tamanoLote + index + 1}. Enviado a ${lote[index]}: ${info.response}`);
      });
    } catch (error) {
      console.error(` | Error al enviar lote ${i + 1}:`, error);
    }

    // Pausamos antes de seguir con el siguiente lote (excepto el último)
    if (i < lotes.length - 1) {
      console.log(`⏸️ Esperando ${pausaEntreLotes / 1000} segundos antes del siguiente lote...`);
      await esperar(pausaEntreLotes);
    }
  }

  console.log('Todos los correos fueron procesados.');
}

// Ejecutar
enviarCorreosEnLotes(listaDestinatarios);
