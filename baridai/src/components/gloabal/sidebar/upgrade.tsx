import React from "react";
import PaymentButton from "../payment-button";
import { SparklesIcon } from "@heroicons/react/24/solid";

type Props = {};

const UpgradeCard = (props: Props) => {
  return (
    <div className="p-4 bg-gradient-to-br from-[#1c1c1c] to-[#252525] rounded-2xl flex flex-col gap-y-3 shadow-inner border border-gray-800/50 my-2">
      <div className="flex items-center gap-2">
        <SparklesIcon className="w-4 h-4 text-amber-300" />
        <span className="text-sm font-medium text-white">
          Upgrade to
          <span className="bg-gradient-to-r from-[#CC3804] to-[#D064AC] font-bold bg-clip-text text-transparent ml-1">
            Smart AI
          </span>
        </span>
      </div>

      <div className="relative">
        <p className="text-[#989CA0] font-light text-sm leading-tight">
          Unlock all premium features including advanced AI capabilities,
          unlimited projects and priority support
        </p>
        <div className="absolute -right-1 -top-1 w-6 h-6 bg-gradient-to-r from-amber-400 to-amber-300 rounded-full flex items-center justify-center text-[9px] font-bold text-black transform rotate-12 border border-amber-500/50">
          PRO
        </div>
      </div>

      <PaymentButton />
    </div>
  );
};

export default UpgradeCard;
