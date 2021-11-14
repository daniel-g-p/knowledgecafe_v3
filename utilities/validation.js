export const condition = (condition, message) => {
  return condition ? { valid: true } : { valid: false, message };
};

export const validate = (data, ...conditions) => {
  for (let condition of conditions) {
    if (!condition.valid) {
      return condition;
    }
  }
  return { valid: true, data };
};
