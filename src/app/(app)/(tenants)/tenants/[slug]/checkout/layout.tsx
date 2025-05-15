import Footer from "@/modules/tenants/ui/Footer";
import Navbar from "@/modules/checkout/ui/component/Navbar";

async function layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar slug={slug} />

      <div className="flex-1 bg-[#F4F4F0]">{children}</div>
      <Footer />
    </div>
  );
}

export default layout;
