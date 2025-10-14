// lib/stocks-api.ts

export async function getStockQuote(symbol: string) {
    // Mock API response for now
    const mockData: Record<string, any> = {
        AAPL: { companyName: 'Apple Inc.', price: 176.23, change: 1.23, marketCap: '$2.7T', peRatio: 28.4 },
        MSFT: { companyName: 'Microsoft Corp.', price: 329.10, change: -0.45, marketCap: '$2.5T', peRatio: 35.1 },
        NVDA: { companyName: 'NVIDIA Corp.', price: 452.11, change: 0.87, marketCap: '$1.1T', peRatio: 97.2 },
    };

    // simulate async fetch
    await new Promise((res) => setTimeout(res, 100));

    return mockData[symbol] || {
        companyName: symbol,
        price: 0,
        change: 0,
        marketCap: '—',
        peRatio: '—',
    };
}
