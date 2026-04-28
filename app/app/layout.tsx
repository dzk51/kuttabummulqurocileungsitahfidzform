app/layout.tsx

import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Kuttab Form - Dozku Digital',
  description: 'Aplikasi Setoran Tahfidz Cileungsi',
  // Bagian ini yang bikin logo kamu muncul di browser dan saat di-save di HP
  icons: {
    icon: [
      { url: 'https://i.ibb.co.com/62S7MvL/images.jpg', href: 'https://i.ibb.co.com/62S7MvL/images.jpg' }
    ],
    apple: [
      { url: 'https://i.ibb.co.com/62S7MvL/images.jpg', href: 'https://i.ibb.co.com/62S7MvL/images.jpg' }
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Ini cadangan agar logo benar-benar muncul di tab browser */}
        <link rel="icon" href="https://i.ibb.co.com/62S7MvL/images.jpg" />
        <link rel="apple-touch-icon" href="https://i.ibb.co.com/62S7MvL/images.jpg" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-slate-50">
          {children}
        </div>
      </body>
    </html>
  )
}
