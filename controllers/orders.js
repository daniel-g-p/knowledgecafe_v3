import eventsService from "../services/events.js";
import ordersService from "../services/orders.js";

export default {
  async getPendingOrders(req, res, next) {
    const event = await eventsService.findActiveEvent();
    if (!event) {
      return res.status(200).json({ ok: true });
    }
    const orders = await ordersService.getPendingOrders(event._id.toString());
    return res.status(200).json({ ok: true, orders, event: true });
  },
  async completeOrder(req, res, next) {
    const { orderId } = req.params;
    await ordersService.completeOrder(orderId);
    return res.status(200).json({ ok: true });
  },
  async cancelOrder(req, res, next) {
    const { orderId } = req.params;
    await ordersService.cancelOrder(orderId);
    return res.status(200).json({ ok: true });
  },
};
