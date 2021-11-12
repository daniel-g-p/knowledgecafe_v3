export const condition = (condition, errorMessage) => {
  return condition ? { valid: true } : { valid: false, errorMessage };
};

export const validate = (data, ...conditions) => {
  for (let condition of conditions) {
    if (!condition.valid) {
      return condition;
    }
  }
  return { valid: true, data };
};
