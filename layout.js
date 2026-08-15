export const metadata = {
  title: 'Generator Surat Jalan',
  description: 'Aplikasi Cetak Surat Jalan',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
