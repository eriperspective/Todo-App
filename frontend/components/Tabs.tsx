import React from "react";

export default function Tabs({ activeTab, setActiveTab }: any) {
  return (
    <div className="flex justify-around mb-6">
      {["Tasks", "Calendar", "Notes", "Checklist"].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 rounded-full font-semibold transition ${
            activeTab === tab
              ? "bg-pink-400 text-white"
              : "bg-pink-100 text-pink-700 hover:bg-pink-200"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
