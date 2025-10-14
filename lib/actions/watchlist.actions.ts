'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.models';
import { getStockQuote } from '@/lib/stocks-api';
import { revalidatePath } from 'next/cache';

// Temporary: use a demo email until auth is wired
const DEMO_EMAIL = 'demo@example.com';

async function getOrCreateDemoUserId(): Promise<string> {
    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;
    if (!db) throw new Error('MongoDB connection not found');

    const col = db.collection('user');
    const existing = await col.findOne<{ _id?: unknown; id?: string; email?: string }>({ email: DEMO_EMAIL });
    if (existing) return (existing.id as string) || String(existing._id || '');

    const insert = await col.insertOne({ email: DEMO_EMAIL, name: 'Demo User', createdAt: new Date() });
    return String(insert.insertedId);
}

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
    if (!email) return [];

    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) throw new Error('MongoDB connection not found');

        const user = await db.collection('user').findOne<{ _id?: unknown; id?: string; email?: string }>({ email });

        if (!user) return [];

        const userId = (user.id as string) || String(user._id || '');
        if (!userId) return [];

        const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
        return items.map((i) => String(i.symbol).toUpperCase());
    } catch (err) {
        console.error('getWatchlistSymbolsByEmail error:', err);
        return [];
    }
}

export async function getUserWatchlist() {
    // TODO: Replace with logged-in user's email from session
    const userEmail = DEMO_EMAIL;
    const symbols = await getWatchlistSymbolsByEmail(userEmail);

    if (symbols.length === 0) return [];

    // Get price info for each symbol
    const data = await Promise.all(
        symbols.map(async (symbol) => {
            const info = await getStockQuote(symbol);
            return {
                company: info.companyName,
                symbol,
                price: info.price,
                change: info.change,
                marketCap: info.marketCap,
                pe: info.peRatio,
            };
        })
    );

    return data;
}

export async function addToWatchlist(symbol: string, company: string) {
    if (!symbol || !company) return { ok: false, error: 'Missing symbol or company' };

    try {
        const userId = await getOrCreateDemoUserId();

        await Watchlist.updateOne(
            { userId, symbol: symbol.toUpperCase() },
            { $setOnInsert: { company: company.trim(), addedAt: new Date() } },
            { upsert: true }
        );

        // Revalidate the watchlist page by URL path
        revalidatePath('/watchlist');
        return { ok: true };
    } catch (err) {
        console.error('addToWatchlist error:', err);
        return { ok: false, error: 'Failed to add to watchlist' };
    }
}

export async function removeFromWatchlist(symbol: string) {
    if (!symbol) return { ok: false, error: 'Missing symbol' };
    try {
        const userId = await getOrCreateDemoUserId();
        await Watchlist.deleteOne({ userId, symbol: symbol.toUpperCase() });
        revalidatePath('/watchlist');
        return { ok: true };
    } catch (err) {
        console.error('removeFromWatchlist error:', err);
        return { ok: false, error: 'Failed to remove from watchlist' };
    }
}

export async function getWatchlistSymbols() {
    try {
        return await getWatchlistSymbolsByEmail(DEMO_EMAIL);
    } catch (err) {
        console.error('getWatchlistSymbols error:', err);
        return [] as string[];
    }
}
