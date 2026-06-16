export async function emitTickets({ eventId, items }) {
  const response = await fetch(`/api/events/${eventId}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items })
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || 'No se pudieron emitir los tickets.');
  }

  return payload;
}
