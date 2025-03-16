import { Search } from "lucide-react";
import React, { useState } from "react";
import { useClickAway } from "@uidotdev/usehooks";

export const ExpandableSearch = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if ("value" in e?.target) {
      return;
    }
    setIsExpanded(!isExpanded);
  };

  const ref = useClickAway<HTMLDivElement>(() => {
    setIsExpanded(false);
  });

  return (
    <div className="relative z-[100]">
      <div
        className={`flex cursor-pointer items-center justify-center transition-all duration-300 ${isExpanded ? "w-48" : "w-10"}`}
        onClick={(e) => handleClick(e)}
      >
        {isExpanded ? (
          <div
            className="flex items-center rounded-full border-2 border-gray-400 p-2 transition-all"
            ref={ref}
          >
            <Search className="mr-2" />
            <input
              autoFocus={true}
              type="text"
              className="h-full w-full outline-none"
              placeholder="Поиск по сайту"
            />
          </div>
        ) : (
          <Search />
        )}
      </div>
    </div>
  );
};
