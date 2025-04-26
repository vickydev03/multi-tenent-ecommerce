import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import React from "react";

function Home() {
  return (
    <div className="p-10 flex flex-col  gap-5">
      <Button variant={"elevated"}> hello world</Button>
      <Input placeholder="enter the chat" />
      <Checkbox />
      <Progress value={50} />
      <p className="text-red-300">this is home page </p>
    </div>
  );
}

export default Home;
