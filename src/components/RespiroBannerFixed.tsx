
import React from "react";
import { Waves } from "lucide-react";

const RespiroBannerFixed = () => {
  return (
    <div
      className="fixed z-50 bottom-5 right-5 shadow-xl animate-fade-in"
      style={{ maxWidth: 320 }}
    >
      <Waves className="h-10 w-10 text-blue-100 bg-white/30 rounded-full p-2" />
    </div>
  );
};

export default RespiroBannerFixed;
