"use client";
import React, { useMemo, useState } from "react";
import { addToWatchlist, removeFromWatchlist } from "@/lib/actions/watchlist.actions";
import { toast } from "sonner";

// WatchlistButton that actually persists Add/Remove to the watchlist via server actions
// Keeps the same UI contract and calls onWatchlistChange on successful change.

const WatchlistButton = ({
                            symbol,
                            company,
                            isInWatchlist,
                            showTrashIcon = false,
                            type = "button",
                            onWatchlistChange,
                        }: WatchlistButtonProps) => {
    const [added, setAdded] = useState<boolean>(!!isInWatchlist);
    const [pending, setPending] = useState<boolean>(false);

    const label = useMemo(() => {
        if (type === "icon") return ""; // icon-only, tooltip/aria convey meaning
        return added ? "Remove from Watchlist" : "Add to Watchlist";
    }, [added, type]);

    const handleClick = async () => {
        if (pending) return;
        setPending(true);
        try {
            if (!added) {
                const res = await addToWatchlist(symbol, company);
                if (res?.ok) {
                    setAdded(true);
                    onWatchlistChange?.(symbol, true);
                    toast.success(`${symbol} added to watchlist`);
                } else {
                    toast.error(res?.error || "Failed to add to watchlist");
                }
            } else {
                const res = await removeFromWatchlist(symbol);
                if (res?.ok) {
                    setAdded(false);
                    onWatchlistChange?.(symbol, false);
                    toast.success(`${symbol} removed from watchlist`);
                } else {
                    toast.error(res?.error || "Failed to remove from watchlist");
                }
            }
        } catch (e) {
            toast.error("Something went wrong while updating watchlist");
        } finally {
            setPending(false);
        }
    };

    if (type === "icon") {
        return (
            <button
                title={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
                aria-label={added ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
                className={`watchlist-icon-btn ${added ? "watchlist-icon-added" : ""}`}
                onClick={handleClick}
                disabled={pending}
                aria-busy={pending}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={added ? "#FACC15" : "none"}
                    stroke="#FACC15"
                    strokeWidth="1.5"
                    className="watchlist-star"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z"
                    />
                </svg>
            </button>
        );
    }

    return (
        <button
            className={`watchlist-btn ${added ? "watchlist-remove" : ""}`}
            onClick={handleClick}
            disabled={pending}
            aria-busy={pending}
        >
            {showTrashIcon && added ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 4v6m4-6v6m4-6v6" />
                </svg>
            ) : null}
            <span>{pending ? (added ? "Removing..." : "Adding...") : label}</span>
        </button>
    );
};

export default WatchlistButton;