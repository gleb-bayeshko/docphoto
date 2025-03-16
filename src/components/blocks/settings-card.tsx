import React, { FC } from "react";
import SettingsHeader from "./settings-header";

interface IProps extends React.PropsWithChildren {
    canViewEquipment?: boolean;
};

const SettingsCard:FC<IProps> = ({children, canViewEquipment}) => {
    return (
        <div className="w-full rounded-xl bg-white lg:shadow-[rgba(0,_0,_0,_0.2)_0px_60px_40px_-7px]">
          <div className="w-full py-4 lg:p-8">
            <SettingsHeader canViewEquipment={canViewEquipment} />
            <div className="mt-4"></div>
            {children}
          </div>
        </div>
    )
};

export default SettingsCard;