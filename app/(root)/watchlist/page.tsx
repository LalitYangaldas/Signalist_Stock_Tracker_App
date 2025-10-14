import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WatchlistTable from "@/components/WatchlistTable";
import { getUserWatchlist } from "@/lib/actions/watchlist.actions";


export default async function WatchlistPage() {
    // Server-side fetch of user’s watchlist (replace with your logic)
    const watchlist = await getUserWatchlist();

    return (
        <main className="min-h-screen p-4 md:p-6 lg:p-8">
            <section className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        My Watchlist
                    </h1>

                    <Link href="/" className="flex items-center gap-2">
                        <Button variant="outline">Browse Stocks</Button>
                    </Link>
                </div>

                {watchlist.length === 0 ? (
                    <Card className="p-6 text-center">
                        <CardHeader>
                            <CardTitle>No stocks yet</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                You haven’t added any stocks to your watchlist.
                            </p>
                            <Link href="/" className="flex items-center gap-2">
                                <Button>Add your first stock</Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Tracked Symbols</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <WatchlistTable data={watchlist} />
                        </CardContent>
                    </Card>
                )}
            </section>
        </main>
    );
}
