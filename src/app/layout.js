export const metadata = {
  title: "N.K Jewellers Ledger",
  description: "Gold & Cash Ledger",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          backgroundColor: "#ffffff",
          color: "#000000",
          minHeight: "100vh",
        }}
      >
        {children}
      </body>
    </html>
  );
}