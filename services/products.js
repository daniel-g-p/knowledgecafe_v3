import database from "../database/access.js";

import { validate, condition } from "../utilities/validation.js";

import newProduct from "../models/product.js";

export default {
  async getAllShopItems() {
    const fields = ["name", "price", "variations"];
    const sort = { name: 1 };
    return database.find("products", {}, fields, sort);
  },
  async getAllProducts() {
    const sort = { name: 1 };
    return database.find("products", {}, [], sort);
  },
  validateProduct(product) {
    const data = {
      name: product.name,
      tag: product.tag.toLowerCase(),
      description: product.description,
      price: Math.round((product.price || 0) * 100) / 100,
      variations: product.variations,
    };
    return validate(
      data,
      condition(data.name, "Bitte gebe einen Produktnamen ein."),
      condition(data.tag, "Bitte gebe ein Produktkürzel ein."),
      condition(
        data.tag.length <= 4,
        "Das Produktkürzel muss zwischen 1 und 4 Zeichen lang sein."
      ),
      condition(data.price, "Bitte gebe einen verkaufspreis ein."),
      condition(
        Math.round(data.price * 100) % 1 === 0,
        "Der eingegebene Verkauspreis ist ungültig."
      ),
      condition(
        !data.variations.length || data.variations.length > 1,
        "Bitte gebe mindestens zwei Sorten an bzw. lasse das Feld leer."
      )
    );
  },
  async createProduct(name, tag, price, description, variations) {
    const product = newProduct(name, tag, price, description, variations);
    return await database.create("products", product);
  },
  async updateProductDetails(productId, data) {
    return await database.updateById("products", productId, data);
  },
  async deleteProduct(productId) {
    return await database.deleteById("products", productId);
  },
  async updateProductStats(orders) {
    const products = [];
    for (let order of orders) {
      for (let item of order.items) {
        const itemId = item.id.toString();
        const index = products.findIndex((p) => p.id === itemId);
        if (index !== -1) {
          products[index].revenue =
            products[index].revenue + item.quantity * products[index].price;
          products[index].unitsSold += item.quantity;
          if (item.variation) {
            products[index].variations[item.variation]++;
          }
        } else {
          const fields = ["price", "stats"];
          const data = await database.findById("products", itemId, fields);
          const { price, stats } = data;
          const { revenue, unitsSold, variations } = stats;
          const product = {
            id: itemId,
            price,
            revenue: revenue + item.quantity * price,
            unitsSold: unitsSold + item.quantity,
            variations,
          };
          if (item.variation) {
            if (product.variations[item.variation]) {
              product.variations[item.variation] += item.quantity;
            } else {
              product.variations[item.variation] = 0 + item.quantity;
            }
          }
          products.push(product);
        }
      }
    }
    for (let product of products) {
      const { revenue, unitsSold, variations } = product;
      const stats = { revenue, unitsSold, variations };
      await database.updateById("products", product.id, { stats });
    }
  },
};
