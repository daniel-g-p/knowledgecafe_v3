export default (
  eventId,
  customerName,
  comments,
  items,
  paymentMethod,
  total
) => {
  return {
    eventId,
    customerName,
    comments,
    items,
    paymentMethod,
    total,
    completed: false,
    timestamp: new Date(),
  };
};
