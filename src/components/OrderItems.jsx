import React from "react";

export default function OrderItems() {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center justify-between border-b border-[#e8e4d8] pb-3">
        <div className="flex items-center space-x-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#a2d6f9] text-xs font-black text-[#19334b]">
            Fla
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#19334b]">
              Gabin Fla Original Susu
            </h4>
            <p className="text-xs text-slate-500">2 pcs</p>
          </div>
        </div>
        <span className="text-sm font-extrabold !font-inter text-[#19334b]">
          Rp 30.000
        </span>
      </div>
    </div>
  );
}
