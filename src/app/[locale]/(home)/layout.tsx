import DefaltFooter from "@/components/layout/DefaltFooter";
import DefaultHeader from "@/components/layout/DefaultHeader";
import { ReactNode } from "react";

export default function ServiceLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<DefaultHeader />
			<main className="min-h-screen py-24 dark:bg-gray-900 bg-gray-100">
				{children}
			</main>
			<DefaltFooter />
		</>
	);
}
