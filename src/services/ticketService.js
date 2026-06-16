import {
  collection,
  doc,
  getDoc,
  increment,
  runTransaction,
  serverTimestamp
} from 'firebase/firestore';
import { getFirebaseServices } from './firebaseClient.js';

const COLLECTIONS = Object.freeze({
  events: 'eventos',
  tickets: 'tickets'
});

export async function emitTicketsForEvent({ eventId, items }) {
  validateTicketRequest({ eventId, items });

  const { db } = await getFirebaseServices();
  const eventRef = doc(db, COLLECTIONS.events, eventId);
  const ticketsCollection = collection(db, COLLECTIONS.tickets);

  return runTransaction(db, async (transaction) => {
    const eventSnapshot = await transaction.get(eventRef);
    const currentNextTicketNumber = eventSnapshot.exists()
      ? eventSnapshot.data().nextTicketNumber || 0
      : 0;

    const tickets = items.map((item, index) => {
      const ticketRef = doc(ticketsCollection);
      const ticketNumber = currentNextTicketNumber + index;
      const ticket = buildTicket({ eventId, item, ticketNumber, ticketRef });

      transaction.set(ticketRef, ticket);
      return { id: ticketRef.id, ...ticket };
    });

    if (eventSnapshot.exists()) {
      transaction.update(eventRef, {
        nextTicketNumber: increment(tickets.length),
        updatedAt: serverTimestamp()
      });
    } else {
      transaction.set(eventRef, {
        name: eventId,
        nextTicketNumber: tickets.length,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }

    return {
      eventId,
      tickets,
      nextTicketNumber: currentNextTicketNumber + tickets.length
    };
  });
}

export async function getEvent(eventId) {
  const { db } = await getFirebaseServices();
  const eventRef = doc(db, COLLECTIONS.events, eventId);
  const eventSnapshot = await getDoc(eventRef);

  if (!eventSnapshot.exists()) {
    return null;
  }

  return { id: eventSnapshot.id, ...eventSnapshot.data() };
}

function buildTicket({ eventId, item, ticketNumber, ticketRef }) {
  const quantity = Number(item.quantity);
  const unitPrice = Number(item.unitPrice || 0);
  const totalPaid = Number(item.totalPaid ?? unitPrice * quantity);

  return {
    eventId,
    ticketNumber,
    productId: item.productId,
    productName: item.name || item.description,
    categoryId: item.categoryId || null,
    description: item.description,
    quantity,
    unitPrice,
    totalPaid,
    withdrawn: false,
    status: 'pendiente',
    qrPayload: `firestore://${COLLECTIONS.tickets}/${ticketRef.id}`,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
}

function validateTicketRequest({ eventId, items }) {
  if (!eventId || typeof eventId !== 'string') {
    throw new Error('El evento es obligatorio.');
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Debe emitir al menos un ticket.');
  }

  for (const item of items) {
    if (!item.productId || !item.description || Number(item.quantity) <= 0) {
      throw new Error('Cada ticket necesita producto, descripción y cantidad mayor a cero.');
    }
  }
}
