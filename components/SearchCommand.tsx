"use client"

import { useEffect, useState } from "react"
import { CommandDialog, CommandEmpty, CommandInput, CommandList } from "@/components/ui/command"
import {Button} from "@/components/ui/button";
import {Loader2, Star, TrendingUp} from "lucide-react";
import Link from "next/link";
import {searchStocks} from "@/lib/actions/finnhub.actions";
import {useDebounce} from "@/hooks/useDebounce";
import { addToWatchlist, removeFromWatchlist, getWatchlistSymbols } from "@/lib/actions/watchlist.actions";
import { toast } from "sonner";

export default function SearchCommand({ renderAs = 'button', label = 'Add stock', initialStocks }: SearchCommandProps) {
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(false)
    const [stocks, setStocks] = useState<StockWithWatchlistStatus[]>(initialStocks);
    const [pendingSymbol, setPendingSymbol] = useState<string | null>(null);
    const [watchlistSymbols, setWatchlistSymbols] = useState<Set<string>>(new Set());

    const isSearchMode = !!searchTerm.trim();
    const displayStocks = isSearchMode ? stocks : stocks?.slice(0, 10);

    const normalize = (s: string) => (s || '').toUpperCase();
    const annotateStocks = (list: readonly (Stock | StockWithWatchlistStatus)[] = []) => {
        const set = watchlistSymbols;
        return list.map((s) => ({
            ...(s as Stock),
            isInWatchlist: set.has(normalize((s as Stock).symbol)),
        })) as StockWithWatchlistStatus[];
    };

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault()
                setOpen(v => !v)
            }
        }
        window.addEventListener("keydown", onKeyDown)
        return () => window.removeEventListener("keydown", onKeyDown)
    }, [])

    // Load persisted watchlist symbols when the component mounts, then reconcile current stocks
    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                const symbols = await getWatchlistSymbols();
                if (cancelled) return;
                const set = new Set((symbols || []).map((s: string) => normalize(s)));
                setWatchlistSymbols(set);
                // Reconcile whatever is currently in state (initialStocks or search results)
                setStocks(prev => annotateStocks(prev || []));
            } catch (e) {
                // noop
            }
        })();
        return () => { cancelled = true; };
    }, [])

    const handleSearch = async () => {
        if(!isSearchMode) {
            const annotated = annotateStocks(initialStocks || []);
            return setStocks(annotated);
        }

        setLoading(true)
        try {
            const results = await searchStocks(searchTerm.trim());
            const annotated = annotateStocks(results as unknown as Stock[]);
            setStocks(annotated);
        } catch {
            setStocks([])
        } finally {
            setLoading(false)
        }
    }

    const debouncedSearch = useDebounce(handleSearch, 300);

    useEffect(() => {
        debouncedSearch();
    }, [searchTerm]);

    const handleSelectStock = () => {
        setOpen(false);
        setSearchTerm("");
        setStocks(annotateStocks(initialStocks || []));
    }

    const handleStarClick = async (e: React.MouseEvent, stock: StockWithWatchlistStatus) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            setPendingSymbol(stock.symbol);
            if (!stock.isInWatchlist) {
                const res = await addToWatchlist(stock.symbol, stock.name);
                if (res?.ok) {
                    setStocks((prev) => prev.map((s) => s.symbol === stock.symbol ? { ...s, isInWatchlist: true } : s));
                    setWatchlistSymbols((prev) => {
                        const next = new Set(prev);
                        next.add(normalize(stock.symbol));
                        return next;
                    });
                    toast.success(`${stock.symbol} added to watchlist`);
                } else {
                    toast.error(res?.error || 'Failed to add to watchlist');
                }
            } else {
                const res = await removeFromWatchlist(stock.symbol);
                if (res?.ok) {
                    setStocks((prev) => prev.map((s) => s.symbol === stock.symbol ? { ...s, isInWatchlist: false } : s));
                    setWatchlistSymbols((prev) => {
                        const next = new Set(prev);
                        next.delete(normalize(stock.symbol));
                        return next;
                    });
                    toast.success(`${stock.symbol} removed from watchlist`);
                } else {
                    toast.error(res?.error || 'Failed to remove from watchlist');
                }
            }
        } catch (err) {
            toast.error('Something went wrong while updating watchlist');
        } finally {
            setPendingSymbol(null);
        }
    }

    return (
        <>
            {renderAs === 'text' ? (
                <span onClick={() => setOpen(true)} className="search-text">
            {label}
          </span>
            ): (
                <Button onClick={() => setOpen(true)} className="search-btn">
                    {label}
                </Button>
            )}
            <CommandDialog open={open} onOpenChange={setOpen} className="search-dialog">
                <div className="search-field">
                    <CommandInput value={searchTerm} onValueChange={setSearchTerm} placeholder="Search stocks..." className="search-input" />
                    {loading && <Loader2 className="search-loader" />}
                </div>
                <CommandList className="search-list">
                    {loading ? (
                        <CommandEmpty className="search-list-empty">Loading stocks...</CommandEmpty>
                    ) : displayStocks?.length === 0 ? (
                        <div className="search-list-indicator">
                            {isSearchMode ? 'No results found' : 'No stocks available'}
                        </div>
                    ) : (
                        <ul>
                            <div className="search-count">
                                {isSearchMode ? 'Search results' : 'Popular stocks'}
                                {` `}({displayStocks?.length || 0})
                            </div>
                            {displayStocks?.map((stock, i) => (
                                <li key={stock.symbol} className="search-item">
                                    <Link
                                        href={`/stocks/${stock.symbol}`}
                                        onClick={handleSelectStock}
                                        className="search-item-link"
                                    >
                                        <TrendingUp className="h-4 w-4 text-gray-500" />
                                        <div  className="flex-1">
                                            <div className="search-item-name">
                                                {stock.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {stock.symbol} | {stock.exchange } | {stock.type}
                                            </div>
                                        </div>
                                        <button
                                            aria-label={stock.isInWatchlist ? 'In watchlist' : 'Add to watchlist'}
                                            className={`ml-2 p-1 rounded hover:bg-gray-800 ${stock.isInWatchlist ? 'text-yellow-400' : 'text-gray-400'}`}
                                            onClick={(e) => handleStarClick(e, stock)}
                                            disabled={pendingSymbol === stock.symbol}
                                        >
                                            {pendingSymbol === stock.symbol ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Star fill={stock.isInWatchlist ? 'currentColor' : 'none'} className="h-4 w-4" />
                                            )}
                                        </button>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )
                    }
                </CommandList>
            </CommandDialog>
        </>
    )
}