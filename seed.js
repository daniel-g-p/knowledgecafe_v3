import Chance from "chance";

import { connectToDatabase } from "./database/connect.js";
import database from "./database/access.js";

import { hash } from "./utilities/passwords.js";

import newProduct from "./models/product.js";
import newEvent from "./models/event.js";
import newOrder from "./models/order.js";
import newUser from "./models/user.js";

const chance = new Chance();

const productData = [
  {
    name: "Espresso",
    tag: "esp",
    price: 2,
    description: "Lorem ipsum dolor sit amet",
  },
  {
    name: "Double Espresso",
    tag: "desp",
    price: 2,
    description: "Lorem ipsum dolor sit amet",
  },
  {
    name: "Americano",
    tag: "ame",
    price: 2,
    description: "Lorem ipsum dolor sit amet",
  },
  {
    name: "Cappuccino",
    tag: "cap",
    price: 2,
    description: "Lorem ipsum dolor sit amet",
    variations: ["Vollmilch", "Hafermilch"],
  },
  {
    name: "Latte Macchiato",
    tag: "lam",
    price: 2,
    description: "Lorem ipsum dolor sit amet",
    variations: ["Vollmilch", "Hafermilch"],
  },
];

const teamData = [
  "Emilie",
  "Florin",
  "Rico",
  "Daniel",
  "Clara",
  "Anna Maria",
  "Leonie",
  "Alexis",
  "Allie",
  "Vivianne",
  "Feli",
  "Xiannan",
  "Caro",
  "Olivia",
];

const adminData = {
  name: "admin",
  username: "admin",
  email: "admin@knowledgecafe.de",
  password: "admin",
};

const seedProducts = async (productData) => {
  await database.delete("products", {});
  const products = [];
  for (let item of productData) {
    const product = newProduct(
      item.name,
      item.tag,
      item.price,
      item.description,
      item.variations
    );
    await database.create("products", product);
    products.push(product);
  }
  console.log("Products seeded");
  return products;
};

const seedEvents = async (numberOfEvents) => {
  await database.delete("events", {});
  const events = [];
  for (let i = 0; i < numberOfEvents; i++) {
    const event = newEvent();
    await database.create("events", event);
    events.push(event);
  }
  return events;
};

const seedOrders = async (products, events, ordersPerEvent) => {
  await database.delete("orders", {});
  const orders = [];
  for (let event of events) {
    for (let i = 0; i < ordersPerEvent; i++) {
      const numberOfItems = chance.integer({ min: 1, max: 3 });
      const items = [];
      for (let j = 0; j < numberOfItems; j++) {
        const prodIndex = chance.integer({ min: 0, max: products.length - 1 });
        const { _id, name, price, variations } = products[prodIndex];
        const hasVars = variations.length;
        const varIndex = hasVars
          ? chance.integer({ min: 0, max: variations.length - 1 })
          : 0;
        const variation = varIndex ? variations[varIndex] : "";
        const item = {
          id: _id,
          name,
          quantity: 1,
          price,
          variation,
        };
        items.push(item);
      }
      const order = newOrder(
        event._id.toString(),
        chance.first(),
        chance.bool() ? "Lorem ipsum dolor sit amet" : "",
        items,
        "cash",
        items.reduce((result, item) => {
          return result + item.price * item.quantity;
        }, 0)
      );
      const { insertedId } = await database.create("orders", order);
      await database.updateById("orders", insertedId, { completed: true });
    }
  }
  console.log("Orders seeded.");
  return;
};

const seedAdmin = async () => {
  await database.delete("users", {});
  const { name, username, email, password } = adminData;
  let token = "";
  for (let i = 0; i < 6; i++) {
    token = `${token}${chance.integer({ min: 0, max: 9 })}`;
  }
  const admin = newUser(email, "admin", token);
  const { insertedId } = await database.create("users", admin);
  const passwordHash = await hash(password);
  await database.updateById("users", insertedId, {
    name,
    username,
    password: passwordHash,
    verified: true,
  });
  console.log("Admin seeded.");
  return admin;
};

const seedUsers = async (userNames) => {
  for (let name of userNames) {
    const email = `${name.toLowerCase()}@knowledgecafe.de`;
    let token = "";
    for (let i = 0; i < 6; i++) {
      token = `${token}${chance.integer({ min: 0, max: 9 })}`;
    }
    const user = newUser(email, "user", token);
    const { insertedId } = await database.create("users", user);
    const username = name.toLowerCase();
    const password = `${name}.2021`;
    const passwordHash = await hash(password);
    await database.updateById("users", insertedId, {
      name,
      username,
      password: passwordHash,
      verified: true,
    });
  }
  console.log("Users seeded.");
};

const seedDatabase = async () => {
  try {
    await connectToDatabase();
    const products = await seedProducts(productData);
    const events = await seedEvents(1);
    await seedOrders(products, events, 50);
    await seedAdmin();
    await seedUsers(teamData);
    console.log("Database seeded.");
  } catch (error) {
    console.log(error);
  } finally {
    process.exit();
  }
};

seedDatabase();
