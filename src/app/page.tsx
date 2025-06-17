"use client";
import BottomNavigation from "./bottomNavigation";
import { bottomNavigationTabs } from "./constants/constants";
import { useState } from "react";

export default function Home() {
  const [tabs, setTabs] = useState(bottomNavigationTabs);
  const [activeId, setActiveId] = useState(tabs?.[0]?.id);
  const activeTab = tabs.find(t => t.id === activeId);

  return (
    <div className="w-screen h-screen">
      <div id="modal-container"></div>
      <div className="flex flex-col  w-full h-full">
        <div className="flex-1 bg-[#0a66c2] flex justify-center items-center text-white text-lg">
          {activeTab?.name}
        </div>
        <BottomNavigation setTabs={setTabs} setActiveId={setActiveId} tabs={tabs} activeId={activeId}></BottomNavigation>
      </div>
    </div>

  );
}
