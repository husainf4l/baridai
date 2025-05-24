import React from "react";
import LogoutButton from "@/components/auth/logout-button";

type Props = {};

const Page = async (props: Props) => {
  //server Action
  // if account 
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <LogoutButton />
      </div>
      <div>Page content here</div>
    </div>
  );
};

export default Page;
