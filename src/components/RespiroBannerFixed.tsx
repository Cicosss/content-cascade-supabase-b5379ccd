
import React from "react";
import { Heart, Waves } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const RespiroBannerFixed = () => {
  return (
    <div
      className="fixed z-50 bottom-5 right-5 shadow-xl animate-fade-in"
      style={{ maxWidth: 320 }}
    >
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 rounded-2xl px-6 py-5 flex items-center gap-4 border-0">
        <div className="flex items-center justify-center bg-white/30 rounded-full h-10 w-10">
          <Waves className="h-6 w-6 text-blue-100" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-white text-base leading-tight truncate">
            Aiutaci a proteggere il nostro mare
          </div>
          <div className="text-blue-100 text-xs">Scopri Respiro del Mare</div>
        </div>
        <Button
          asChild
          size="sm"
          className="bg-gradient-to-r from-yellow-400 to-orange-500 shadow font-bold text-white px-4 py-2 rounded-lg hover:from-yellow-500 hover:to-orange-600 transition-all"
        >
          <Link to="/respiro-del-mare" className="flex items-center">
            <Heart className="h-4 w-4 mr-1" />
            Vai
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default RespiroBannerFixed;
