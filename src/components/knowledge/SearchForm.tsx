"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SearchForm({ initialQuery }: { initialQuery: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState(initialQuery);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (query) {
            params.set("query", query);
        } else {
            params.delete("query");
        }
        params.set("page", "1");

        router.push(`?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSearch} className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-muted-foreground" />
            <Input
                placeholder="Tìm kiếm bài viết..."
                className="pl-9 pr-12 rounded-full bg-background"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
        </form>
    );
}
