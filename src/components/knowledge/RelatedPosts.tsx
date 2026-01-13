"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { IPlainPost } from "@/types/backend";
import { PostCard } from "@/components/knowledge/PostCard"; // Tái sử dụng card cũ

export function RelatedPosts({ posts }: { posts: IPlainPost[] }) {
    if (posts.length === 0) return null;

    return (
        <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Bài viết liên quan</h2>

            <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
                className="pb-12" // Padding bottom cho pagination
            >
                {posts.map((post) => (
                    <SwiperSlide key={post._id} className="h-auto">
                        <PostCard post={post} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
