import database from "../database/access.js";

import newOrder from "../models/order.js";

import { condition, validate } from "../utilities/validation.js";

export default {
  validateOrder(order) {
    const { name, paymentMethod } = order;
    const nameValid = name ? true : false;
    const methods = ["cash", "card", "paypal"];
    const methodValid = paymentMethod && methods.includes(paymentMethod);
    return validate(
      order,
      condition(nameValid, "Bitte gebe deinen Namen an."),
      condition(methodValid, "Bitte wähle eine Zahlungsmethode.")
    );
  },
  async submitOrder(eventId, customerName, comments, items, paymentMethod) {
    const total = items.reduce((result, item) => {
      return result + item.price * item.quantity;
    }, 0);
    const order = newOrder(
      eventId,
      customerName,
      comments,
      items,
      paymentMethod,
      total
    );
    return await database.create("orders", order);
  },
  async getPendingOrders(eventId) {
    return await database.find("orders", { eventId, completed: false });
  },
  async completeOrder(orderId) {
    return await database.updateById("orders", orderId, { completed: true });
  },
  async cancelOrder(orderId) {
    return await database.deleteById("orders", orderId);
  },
  async getEventOrders(eventId) {
    return await database.find("orders", { eventId });
  },
  checkForPendingOrders(orders) {
    return orders.some((order) => !order.completed)
  }
};
