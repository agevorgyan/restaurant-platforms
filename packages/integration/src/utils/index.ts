export const generateTraceId = (): string => {
  return crypto.randomUUID();
};

export const generateCorrelationId = (): string => {
  return crypto.randomUUID();
};
