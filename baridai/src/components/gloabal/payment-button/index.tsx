"use client"; // Add this to mark the component as a client component

import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import React from "react";

type Props = {
  size?: "sm" | "md" | "lg";
};

const PaymentButton = ({ size = "md" }: Props) => {
  const handleUpgradeClick = () => {
    // This would open your payment flow in a real application
    console.log("Upgrade clicked - would open payment flow");
    // Example: router.push("/pricing") or open a modal
  };

  const sizeClasses = {
    sm: "text-xs py-1.5 px-3",
    md: "text-sm py-2 px-4",
    lg: "text-base py-2.5 px-5",
  };

  return (
    <Button
      onClick={handleUpgradeClick}
      className={`
        w-full bg-gradient-to-br text-white rounded-full 
        from-[#9685db] via-[#b66edc] to-[#d064ac] 
        hover:from-[#9685db]/90 hover:via-[#b66edc]/90 hover:to-[#d064ac]/90 
        shadow-lg hover:shadow-purple-600/20 
        transition-all duration-300 
        flex items-center justify-center gap-1.5
        ${sizeClasses[size]}
      `}
    >
      <span>Upgrade Now</span>
      <ArrowRightIcon className="w-3.5 h-3.5 stroke-[2]" />
    </Button>
  );
};

export default PaymentButton;
