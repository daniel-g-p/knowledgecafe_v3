import productsService from "../services/products.js";

export default {
  async newProduct(req, res, next) {
    const { data, valid, message } = productsService.validateProduct(req.body);
    if (!valid) {
      return res.status(400).json({ message });
    }
    const product = await productsService.createProduct(
      data.name,
      data.tag,
      data.price,
      data.description,
      data.variations
    );
    const { insertedId } = product;
    return res.status(200).json({ ok: true, _id: insertedId.toString() });
  },
  async getProducts(req, res, next) {
    const products = await productsService.getAllProducts();
    return res.status(200).json({ ok: true, products });
  },
  async editProduct(req, res, next) {
    const { data, valid, message } = productsService.validateProduct(req.body);
    if (!valid) {
      return res.status(400).json({ message });
    }
    const { productId } = req.params;
    await productsService.updateProductDetails(productId, data);
    return res.status(200).json({ ok: true });
  },
  async deleteProduct(req, res, next) {
    const { productId } = req.params;
    await productsService.deleteProduct(productId);
    return res.status(200).json({ ok: true });
  },
};
