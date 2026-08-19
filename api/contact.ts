import type { VercelRequest, VercelResponse } from '@vercel/node';

const TO_EMAIL = 'hola@gaos.es';
const DEFAULT_FROM = 'onboarding@resend.dev';

function escapeHtml(value: string): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido.' });
    return;
  }

  const body = (req.body ?? {}) as Record<string, unknown>;
  const nombre = typeof body.nombre === 'string' ? body.nombre.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const descripcion = typeof body.descripcion === 'string' ? body.descripcion.trim() : '';
  const gotcha = typeof body._gotcha === 'string' ? body._gotcha.trim() : '';

  if (gotcha) {
    res.status(200).json({ ok: true });
    return;
  }

  if (!nombre || !email || !descripcion) {
    res.status(400).json({ error: 'Faltan campos obligatorios.' });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: 'El email no es válido.' });
    return;
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    console.error('Falta la variable de entorno RESEND_API_KEY en Vercel.');
    res.status(500).json({ error: 'Error de configuración del servidor. Contacta al administrador.' });
    return;
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL || DEFAULT_FROM;

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `Web GAO'S <${fromEmail}>`,
        to: [TO_EMAIL],
        reply_to: email,
        subject: `Nueva consulta de ${nombre} — gaos.es`,
        text: `Nombre: ${nombre}\nEmail: ${email}\n\nMensaje:\n${descripcion}`,
        html: `
          <h2>Nueva consulta desde gaos.es/contacto</h2>
          <p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Mensaje:</strong></p>
          <p>${escapeHtml(descripcion).replace(/\n/g, '<br/>')}</p>
        `,
      }),
    });

    if (!resendResponse.ok) {
      const errorBody = await resendResponse.text();
      console.error('Error de Resend:', resendResponse.status, errorBody);
      res.status(502).json({ error: 'No se pudo enviar el mensaje. Inténtalo de nuevo en unos minutos.' });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error al llamar a Resend:', err);
    res.status(500).json({ error: 'Error inesperado al enviar el mensaje.' });
  }
}
