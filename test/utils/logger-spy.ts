export const loggerSpy = jest.fn((message: any, context = 'Test') => {
  const time = new Date().toISOString();
  console.log(`[LOG][${time}][${context}] ${message}`);
});

export const errorSpy = jest.fn(
  (message: any, trace?: string, context = 'Test') => {
    const time = new Date().toISOString();
    console.error(`[ERROR][${time}][${context}] ${message}`);
    if (trace) console.error(`[TRACE] ${trace}`);
  },
);
