const mocks = globalThis.MOCK_STATE ? await import('../mock-uploads.mjs') : {}

export const parsedData = {
  'larkan-holdings': mocks.larkanHoldingsMock ?? null,
  'klarna-holdings': mocks.klarnaHoldingsMock ?? null,
  'larkan-sales': mocks.larkanSalesMock ?? null,
  'klarna-sales': mocks.klarnaSalesMock ?? null,
}
