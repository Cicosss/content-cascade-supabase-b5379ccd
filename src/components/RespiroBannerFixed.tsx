
import React from "react";
import { Waves, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const RespiroBannerFixed = () => {
  return (
    <div
      className="fixed z-50 bottom-4 right-4 shadow-md animate-fade-in"
      style={{ maxWidth: 320 }}
    >
      <div
        className="bg-gradient-to-r from-blue-400/70 via-blue-100/30 to-white/50 rounded-md px-3 py-2 flex items-center gap-2 border border-blue-100/30"
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
          variant="outline"
          size="sm"
          className="border border-blue-500/30 text-blue-700 bg-white/50 backdrop-blur-sm font-semibold rounded-full px-3 py-1 flex items-center gap-1 shadow-sm hover:bg-blue-50/90 hover:text-blue-900 hover:border-blue-600 transition-all"
        >
          <Link to="/respiro-del-mare" className="flex items-center gap-1">
            <span className="font-medium text-xs">Vai</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default RespiroBannerFixed;

