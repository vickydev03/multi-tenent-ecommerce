import { Button } from "@/components/ui/button";
import React from "react";

function Home() {
  return (
    <div>
      <Button variant={"destructive"}> hello world</Button>
      <p className="text-red-300">this is home page</p>
    </div>
  );
}

export default Home;
