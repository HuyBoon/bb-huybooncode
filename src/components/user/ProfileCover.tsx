"use client";

import { useState, useRef, useTransition } from "react";
import { Palette, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateCoverColor } from "@/actions/user-actions";
import { Button } from "@/components/ui/button";

interface ProfileCoverProps {
    initialCover: string | undefined;
    editable?: boolean;
}

export function ProfileCover({
    initialCover,
    editable = false,
}: ProfileCoverProps) {
    const defaultColor = initialCover?.startsWith("#")
        ? initialCover
        : "#3b82f6";

    const [color, setColor] = useState(defaultColor);
    const [isPending, startTransition] = useTransition();
    const colorInputRef = useRef<HTMLInputElement>(null);

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newColor = e.target.value;
        setColor(newColor);
        startTransition(async () => {
            const result = await updateCoverColor(newColor);
            if (!result.success) {
                toast.error(result.error);
                setColor(defaultColor);
            }
        });
    };

    return (
        <div
            className="relative h-32 w-full transition-colors duration-500 group"
            style={{ backgroundColor: color }}
        >
            <div className="absolute inset-0 bg-linear-to-b from-black/10 to-transparent" />

            {editable && (
                <>
                    {/* Input Color ẩn */}
                    <input
                        type="file" // Trick: Input color mặc định UI hơi xấu, ta dùng button trigger
                        className="hidden"
                    />
                    <input
                        ref={colorInputRef}
                        type="color"
                        value={color}
                        onChange={handleColorChange}
                        className="invisible absolute top-0 left-0" // Ẩn nhưng vẫn phải render để trigger
                    />

                    <Button
                        size="icon"
                        variant="secondary"
                        disabled={isPending}
                        onClick={() => colorInputRef.current?.click()}
                        className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 bg-background/50 hover:bg-background"
                        title="Đổi màu nền"
                    >
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Palette className="h-4 w-4" />
                        )}
                    </Button>
                </>
            )}
        </div>
    );
}
