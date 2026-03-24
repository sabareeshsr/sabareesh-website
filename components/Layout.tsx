import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#020617]">
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
