
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
        className="bg-gradient-to-r from-blue-400/80 via-blue-500/70 to-blue-600/70 rounded-lg px-2 py-1 flex items-center gap-1 border border-white/20"
        style={{ backdropFilter: "blur(3px)" }}
      >
        <Waves className="h-5 w-5 text-blue-100/90" />
        <div className="flex-1 min-w-0">
          <div className="text-blue-100/90 text-xs">
            Scopri Respiro del Mare
          </div>
        </div>
        <Button
          asChild
          size="sm"
          variant="outline"
          className="ml-2 bg-white/70 border-blue-400 text-blue-900 font-semibold rounded-full px-3 py-1 hover:bg-blue-50 hover:border-blue-500 transition-all flex items-center gap-1 shadow"
        >
          <Link to="/respiro-del-mare" className="flex items-center gap-1">
            <span className="text-[13px] font-medium">Vai</span>
            <ArrowRight size={16} className="inline-block ml-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default RespiroBannerFixed;
