"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { List } from "lucide-react";

interface TocItem {
    id: string;
    text: string;
    level: number;
}

export function TableOfContents() {
    const [headings, setHeadings] = useState<TocItem[]>([]);
    const [activeId, setActiveId] = useState<string>("");

    useEffect(() => {
        const content = document.getElementById("post-content");
        if (!content) return;

        const elements = content.querySelectorAll("h2, h3");
        const items: TocItem[] = [];

        elements.forEach((elem, index) => {
            if (!elem.id) {
                elem.id = `heading-${index}`;
            }
            items.push({
                id: elem.id,
                text: elem.textContent || "",
                level: Number(elem.tagName.substring(1)),
            });
        });

        setHeadings(items);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: "0px 0px -80% 0px" }
        );

        elements.forEach((elem) => observer.observe(elem));

        return () => observer.disconnect();
    }, []);

    if (headings.length === 0) return null;

    return (
        <div className="space-y-3 p-4 bg-muted/30 rounded-lg border mb-6">
            <div className="flex items-center gap-2 font-bold text-sm">
                <List size={16} /> Mục lục
            </div>
            <nav className="flex flex-col space-y-1">
                {headings.map((item) => (
                    <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => {
                            e.preventDefault();
                            document.getElementById(item.id)?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                            });
                            setActiveId(item.id);
                        }}
                        className={cn(
                            "text-sm hover:text-primary transition-colors line-clamp-1 py-1",
                            item.level === 3 &&
                                "pl-4 border-l-2 border-transparent",
                            item.level === 2 && "font-medium",
                            activeId === item.id
                                ? "text-primary border-primary"
                                : "text-muted-foreground"
                        )}
                    >
                        {item.text}
                    </a>
                ))}
            </nav>
        </div>
    );
}
