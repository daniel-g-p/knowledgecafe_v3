export default () => {
  return {
    title: "",
    start: new Date(),
    end: null,
    stats: {
      revenue: 0,
      unitsSold: 0,
      products: {},
    },
  };
};
