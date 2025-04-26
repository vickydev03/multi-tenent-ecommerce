import React from "react";
import Navbar from "./_component/Navbar";
import Footer from "./_component/Footer";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-1 bg-[#F4F4F0]">{children}</div>
      <Footer />
    </div>
  );
}

export default layout;
