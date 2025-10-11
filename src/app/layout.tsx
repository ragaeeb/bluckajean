import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Footer } from '@/components/Footer';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });

const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

export const metadata: Metadata = { description: 'Live JSON Editor', title: 'Bluckajean' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <div className="flex min-h-screen flex-col">
                    <main className="flex-1">{children}</main>
                    <Footer />
                </div>
            </body>
        </html>
    );
}
