import { Router } from 'express';
import { emitTicketsForEvent, getEvent } from '../../services/ticketService.js';

export const ticketsRouter = Router();

ticketsRouter.get('/events/:eventId', async (req, res) => {
  const event = await getEvent(req.params.eventId);

  if (!event) {
    res.status(404).json({ error: 'Evento no encontrado.' });
    return;
  }

  res.json({ event });
});

ticketsRouter.post('/events/:eventId/tickets', async (req, res) => {
  try {
    const result = await emitTicketsForEvent({
      eventId: req.params.eventId,
      items: req.body.items
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
