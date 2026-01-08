"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Home, ArrowLeft, Ghost, Search } from "lucide-react";
import Image from "next/image";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-6">
            <div className="max-w-5xl w-full flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-20">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />

                    <motion.div
                        animate={{ y: [0, -25, 0] }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="relative z-10"
                    >
                        <Image
                            src={"/huybooncode.svg"}
                            alt="huybooncode"
                            width={500}
                            height={500}
                            objectFit="cover"
                        />
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-center md:text-left flex flex-col items-center md:items-start"
                >
                    <h1 className="text-8xl md:text-9xl font-black text-primary/20 leading-none mb-4 font-mono">
                        404
                    </h1>
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        Oops! Page Not Found
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-md mb-10 leading-relaxed">
                        Trang bạn đang tìm kiếm dường như đã biến mất khỏi không
                        gian số. Hãy thử quay lại trang chủ hoặc kiểm tra lại
                        đường dẫn.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all"
                        >
                            <Home size={20} />
                            Go Home
                        </Link>

                        <button
                            onClick={() => window.history.back()}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-muted text-foreground rounded-2xl font-bold border border-border hover:bg-border transition-all"
                        >
                            <ArrowLeft size={20} />
                            Go Back
                        </button>
                    </div>
                </motion.div>
            </div>

            <div className="absolute top-0 right-0 p-20 opacity-10 -z-10 overflow-hidden">
                <span className="text-[20rem] font-bold select-none leading-none">
                    ?
                </span>
            </div>
        </div>
    );
}
