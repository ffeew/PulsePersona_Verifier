import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "PulsePersona Verifier",
	description: "A demo verifier for PulsePersona",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className={quicksand.className}>{children}</body>
		</html>
	);
}
