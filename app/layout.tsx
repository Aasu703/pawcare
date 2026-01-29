import "./globals.css";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/context/AuthContext";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>  
        <AuthProvider>
          {children}
          <ToastContainer position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}