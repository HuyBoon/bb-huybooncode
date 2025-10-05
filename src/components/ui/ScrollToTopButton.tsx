"use client";

import { ArrowUp } from "lucide-react";
import React, { useState, useEffect } from "react";

const ScrollToTopButton: React.FC = () => {
	const [isVisible, setIsVisible] = useState<boolean>(false);
	const [scrollPercent, setScrollPercent] = useState<number>(0);

	// Function to scroll to the top of the page
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	// Show or hide the button based on scroll position and calculate scroll percentage
	const handleScroll = () => {
		const scrollTop = window.pageYOffset;
		const docHeight =
			document.documentElement.scrollHeight -
			document.documentElement.clientHeight;
		const scrolled = (scrollTop / docHeight) * 100;

		setScrollPercent(scrolled);
		setIsVisible(scrollTop > 300);
	};

	// Add scroll event listener when component mounts
	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	// SVG circle dimensions
	const radius = 22; // radius of the circle
	const circumference = 2 * Math.PI * radius; // circumference of the circle
	const strokeOffset = circumference * (1 - scrollPercent / 100);
	return (
		<>
			<button
				className={`fixed bottom-5 right-5 z-[1000] p-2 rounded-full bg-[#5ec4e1] text-black shadow-md transition-opacity duration-300 flex items-center justify-center cursor-pointer ${
					isVisible ? "opacity-100" : "opacity-0"
				}`}
				onClick={scrollToTop}
				title="Go to top"
			>
				<svg
					width="44"
					height="44"
					viewBox="0 0 48 48"
					className="absolute top-0 left-0 w-full h-full"
				>
					<circle
						cx="24"
						cy="24"
						r={radius}
						fill="none"
						stroke="#ddd"
						strokeWidth="2"
					/>
					<circle
						cx="24"
						cy="24"
						r={radius}
						fill="none"
						stroke="#3c0046"
						strokeWidth="2"
						strokeDasharray={circumference}
						strokeDashoffset={strokeOffset}
						strokeLinecap="round"
					/>
				</svg>
				<ArrowUp />
			</button>
		</>
	);
};

export default ScrollToTopButton;
