import { Signer } from "ethers";

// Define the minimal AdaptedWallet interface expected by the SDK.
// Extend this as needed for your SDK version.
export interface AdaptedWallet {
  address: string;
  signMessage: (message: string | Uint8Array) => Promise<string>;
  signTransaction: (tx: any) => Promise<string>;
  sendTransaction: (tx: any) => Promise<any>;
}

export default function adaptEthersSigner(signer: Signer): AdaptedWallet {
  if (!signer) throw new Error("No signer provided");

  // ethers v6 exposes address as a property (not a method)
  if (!("address" in signer)) {
    throw new Error("Signer does not have an address property (ethers v6 required)");
  }

  return {
    address: (signer as any).address,
    signMessage: async (message) => signer.signMessage(message),
    signTransaction: async (tx) => signer.signTransaction(tx),
    sendTransaction: async (tx) => signer.sendTransaction(tx),
  };
}
