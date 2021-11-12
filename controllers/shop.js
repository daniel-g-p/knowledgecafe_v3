import productsService from "../services/products.js";
import ordersService from "../services/orders.js";
import eventsService from "../services/events.js";

export default {
  async getShopItems(req, res, next) {
    const products = await productsService.getAllShopItems();
    return res.json({ ok: true, products });
  },
  async placeOrder(req, res, next) {
    const { valid, message, data } = ordersService.validateOrder(req.body);
    if (!valid) {
      return res.status(400).json({ message });
    }
    const activeEvent = await eventsService.findActiveEvent();
    if (!activeEvent) {
      const message = "Tut uns Leid, wir nehmen zurzeit keine Bestellungen an.";
      return res.status(400).json({ message });
    }
    await ordersService.submitOrder(
      activeEvent._id.toString(),
      data.name,
      data.comments,
      data.items,
      data.paymentMethod
    );
    const responseMessage = `Wir haben deine Bestellung erhalten, ${data.name}. Wir rufen dich, sobald dein Kaffee bereit ist, vielen Dank!`;
    return res.json({ ok: true, message: responseMessage });
  },
};
