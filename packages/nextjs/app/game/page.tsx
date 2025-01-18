import GameUI from "./_components/GameUI";
import type { NextPage } from "next";
import { getMetadata } from "~~/utils/scaffold-stark/getMetadata";

export const metadata = getMetadata({
  title: "Configure Contracts",
  description: "Configure your deployed 🏗 Scaffold-Stark 2 contracts",
});

const Configure: NextPage = () => {
  return <GameUI />;
};

export default Configure;
