"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { WATCHLIST_TABLE_HEADER } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { removeFromWatchlist } from "@/lib/actions/watchlist.actions";
import { toast } from "sonner";

interface WatchlistRow {
  company: string;
  symbol: string;
  price: number | string;
  change: number | string;
  marketCap?: string;
  pe?: string;
}

export default function WatchlistTable({ data }: { data: WatchlistRow[] }) {
  const router = useRouter();
  const [pendingSymbol, setPendingSymbol] = useState<string | null>(null);

  const onRemove = async (symbol: string) => {
    try {
      setPendingSymbol(symbol);
      const res = await removeFromWatchlist(symbol);
      if (res?.ok) {
        toast.success(`${symbol} removed from watchlist`);
        router.refresh();
      } else {
        toast.error(res?.error || "Failed to remove from watchlist");
      }
    } catch (e) {
      toast.error("Something went wrong while removing");
    } finally {
      setPendingSymbol(null);
    }
  };

  return (
      <div className="w-full overflow-x-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b border-neutral-800">
          <tr>
            {WATCHLIST_TABLE_HEADER.map((h) => (
                <th
                    key={h}
                    className="h-10 px-4 text-left align-middle font-medium text-gray-300"
                >
                  {h}
                </th>
            ))}
          </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
          {data.map((row, i) => (
              <tr key={i} className="border-b border-neutral-800">
                <td className="px-4 py-3 text-gray-100">
                  <Link
                    href={`/stocks/${row.symbol}`}
                    title={`View ${row.company} (${row.symbol})`}
                    aria-label={`View ${row.company} (${row.symbol}) details`}
                    className="text-primary hover:underline"
                  >
                    {row.company}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-100">
                  <Link
                    href={`/stocks/${row.symbol}`}
                    title={`View ${row.symbol} details`}
                    aria-label={`View ${row.symbol} details`}
                    className="text-primary hover:underline"
                  >
                    {row.symbol}
                  </Link>
                </td>
                <td className="px-4 py-3 text-gray-100">${row.price}</td>
                <td
                    className={`px-4 py-3 ${
                        Number(row.change) >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                >
                  {Number(row.change) > 0 ? "+" : ""}
                  {row.change}%
                </td>
                <td className="px-4 py-3 text-gray-100">{row.marketCap}</td>
                <td className="px-4 py-3 text-gray-100">{row.pe}</td>
                <td className="px-4 py-3 text-gray-100">—</td>
                <td className="px-4 py-3 text-gray-100">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pendingSymbol === row.symbol}
                    onClick={() => onRemove(row.symbol)}
                  >
                    {pendingSymbol === row.symbol ? "Removing..." : "Remove"}
                  </Button>
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
}
