import database from "../database/access.js";

import newEvent from "../models/event.js";

export default {
  async findActiveEvent() {
    const events = await database.find("events", { end: null }, ["_id"]);
    return events[0];
  },
  async getAllEvents() {
    return await database.find("events", { end: { $ne: null } }, [], { start: -1 });
  },
  async createNewEvent() {
    return await database.create("events", newEvent());
  },
  async computeEventStats(orders) {
    const productTags = {};
    for (let order of orders) {
      for (let item of order.items) {
        if (!productTags[item.id]) {
          const { tag } = await database.findById("products", item.id, ["tag"]);
          productTags[item.id] = tag;
        }
      }
    }
    const revenue = orders.reduce((result, order) => {
      return result + order.total;
    }, 0);
    const unitsSold = orders.reduce((result, order) => {
      const orderUnits = order.items.reduce((count, item) => {
        return count + item.quantity;
      }, 0);
      return result + orderUnits;
    }, 0);
    const products = orders.reduce((result, order) => {
      const { items } = order;
      for (let item of items) {
        const tag = productTags[item.id];
        const tagValue = result[tag] || 0;
        result[tag] = tagValue + item.quantity;
      }
      return result;
    }, {});
    return {
      revenue,
      unitsSold,
      products,
    };
  },
  async completeEvent(eventId, title, stats) {
    const end = new Date();
    return await database.updateById("events", eventId, { end, title, stats });
  },
  async deleteEvent(eventId) {
    return await database.deleteById("events", eventId);
  },
};
