import eventsService from "../services/events.js";
import ordersService from "../services/orders.js";
import productsService from "../services/products.js";

export default {
  async getEvents(req, res, next) {
    const events = await eventsService.getAllEvents();
    return res.status(200).json({ ok: true, events });
  },
  async startEvent(req, res, next) {
    const activeEvent = await eventsService.findActiveEvent();
    if (activeEvent) {
      const message = "Ein aktives Event existiert bereits.";
      return res.status(400).json({ message });
    }
    await eventsService.createNewEvent();
    return res.status(200).json({ ok: true });
  },
  async closeEvent(req, res, next) {
    const activeEvent = await eventsService.findActiveEvent();
    if (!activeEvent) {
      const message = "Es konnte kein aktives Event gefunden werden.";
      return res.status(400).json({ message });
    }
    const { eventName } = req.body;
    const eventId = activeEvent._id.toString();
    const orders = await ordersService.getEventOrders(eventId);
    if (!orders.length) {
      await eventsService.deleteEvent(eventId);
      return res.status(200).json({ ok: true });
    }
    const hasPendingOrders = ordersService.checkForPendingOrders(orders);
    if (hasPendingOrders) {
      const message = "Es gibt noch offene Bestellungen.";
      return res.status(400).json({ message });
    }
    const stats = await eventsService.computeEventStats(orders);
    await productsService.updateProductStats(orders);
    await eventsService.completeEvent(eventId, eventName, stats);
    return res.status(200).json({ ok: true });
  },
};
