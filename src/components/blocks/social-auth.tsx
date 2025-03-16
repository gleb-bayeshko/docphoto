import Link from "next/link";
import React, { FC } from "react";
import { FaOdnoklassniki, FaVk } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { LoginButton } from "@telegram-auth/react";
import { env } from "~/env";

interface IProps {}

const SocialAuth: FC<IProps> = (props) => {
	return (
		<div className="flex gap-[24px]">
			<div
				className="bg-[#0077FF] cursor-pointer p-2 rounded-sm text-white"
				onClick={() => signIn("vk")}
			>
				<FaVk size={24}></FaVk>
			</div>
			<div
				className="bg-[#fe7701] cursor-pointer p-2 rounded-sm text-white"
				onClick={() => signIn("ok")}
			>
				<FaOdnoklassniki size={24}></FaOdnoklassniki>
			</div>
			<div className="">
				<LoginButton
					botUsername={"docphotobot"}
					onAuthCallback={(data) => {
						signIn(
							"telegram-login",
							{ callbackUrl: "/" },
							data as any,
						);
					}}
				/>
			</div>
		</div>
	);
};

export default SocialAuth;
