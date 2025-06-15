
import React from "react";
import { Waves } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const RespiroBannerFixed = () => {
  return (
    <div
      className="fixed z-50 bottom-4 right-4 shadow-md animate-fade-in"
      style={{ maxWidth: 320 }}
    >
      <div
        className="bg-gradient-to-r from-blue-400/80 via-blue-500/70 to-blue-600/70 rounded-lg px-2 py-1 flex items-center gap-1 border border-white/20"
        style={{ backdropFilter: "blur(3px)" }}
      >
        <Waves className="h-5 w-5 text-blue-100/90" />
        <div className="flex-1 min-w-0">
          <div className="text-blue-100/90 text-xs drop-shadow-sm">
            Scopri Respiro del Mare
          </div>
        </div>
        <Button
          asChild
          size="sm"
          className="bg-gradient-to-r from-yellow-300 to-orange-400 shadow-sm font-semibold text-white px-3 py-1 rounded-md hover:from-yellow-400 hover:to-orange-500 transition-all"
        >
          <Link to="/respiro-del-mare" className="flex items-center">
            Vai
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default RespiroBannerFixed;
