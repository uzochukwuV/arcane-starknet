import {
  deployContract,
  executeDeployCalls,
  exportDeployments,
  deployer,
} from "./deploy-contract";
import { green } from "./helpers/colorize-log";

/**
 * Deploy a contract using the specified parameters.
 *
 * @example (deploy contract with contructorArgs)
 * const deployScript = async (): Promise<void> => {
 *   await deployContract(
 *     {
 *       contract: "YourContract",
 *       contractName: "YourContractExportName",
 *       constructorArgs: {
 *         owner: deployer.address,
 *       },
 *       options: {
 *         maxFee: BigInt(1000000000000)
 *       }
 *     }
 *   );
 * };
 *
 * @example (deploy contract without contructorArgs)
 * const deployScript = async (): Promise<void> => {
 *   await deployContract(
 *     {
 *       contract: "YourContract",
 *       contractName: "YourContractExportName",
 *       options: {
 *         maxFee: BigInt(1000000000000)
 *       }
 *     }
 *   );
 * };
 *
 *
 * @returns {Promise<void>}
 */

const deployScriptArcCoin = async (): Promise<void> => {
  await deployContract({
    contract: "ArcCoin",
    constructorArgs: {
      initial_supply: BigInt(10000000),
      owner: "0x038a0b7663567562c39b52358bbe2a68c66e0338d4fb3a8cbf00d84454d918f9",
    },
    options: {
      maxFee: BigInt(1000000000000),
    },
  });
};

const deployScriptArcNFT = async (): Promise<void> => {
  await deployContract({
    contract: "ArcNft",
    constructorArgs: {
      owner: "0x038a0b7663567562c39b52358bbe2a68c66e0338d4fb3a8cbf00d84454d918f9",
    },
    options: {
      maxFee: BigInt(1000000000000),
    },
  });
};




const deployScript = async (): Promise<void> => {
  await deployContract({
    contract: "Arcane",
    constructorArgs: {
      pragma_address:"0x36031daa264c24520b11d93af622c848b2499b66b41d611bac95e13cfca131a",
      owner: "0x038a0b7663567562c39b52358bbe2a68c66e0338d4fb3a8cbf00d84454d918f9",
      pragma_vrf_contract_address:"0x60c69136b39319547a4df303b6b3a26fab8b2d78de90b6bd215ce82e9cb515c",
    },
  });
};

deployScriptArcCoin()



  deployScriptArcNFT()
  .then(()=>deployScript())
  .then(()=>deployScriptArcCoin())
  .then(async () => {
    executeDeployCalls()
      .then(() => {
        exportDeployments();
        console.log(green("All Setup Done for arc nft"));
      })
      .catch((e) => {
        console.error(e);
        process.exit(1); // exit with error so that non subsequent scripts are run
      });
  })
  .catch(console.error);