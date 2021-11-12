export default (name, tag, price, description, variations = []) => {
  return {
    name,
    tag,
    price,
    description,
    variations,
    stats: {
      revenue: 0,
      unitsSold: 0,
      variations: {},
    },
  };
};
