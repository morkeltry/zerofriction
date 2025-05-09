import { Safe4337Pack } from '@safe-global/relay-kit';
import { Wallet } from 'ethers';
import { useEffect, useState } from 'react';
import { localstorageKey } from '../utils/localstorage';

const SEPOLIA_RPC_URL = 'https://ethereum-sepolia-rpc.publicnode.com';
// const Gnosis_RPC_URL = 'https://gnosis.drpc.org';
const SEED_PHRASE =
  '0xcb65bdcffdae011e201f655f164fac47b59401d34134c6cd845767574e8d36b9';
const WALLET = new Wallet(SEED_PHRASE);

export default function useSafeWallet() {
  const [safeWallet, setSafeWallet] = useState<Safe4337Pack | null>(null);
  const [safeAddress, setSafeAddress] = useState<string | null>(
    localStorage.getItem(localstorageKey) || null
  );

  useEffect(() => {
    const initSafeWallet = async () => {
      const safeWallet = await Safe4337Pack.init({
        provider: SEPOLIA_RPC_URL,
        signer: SEED_PHRASE,
        bundlerUrl: `https://api.pimlico.io/v2/11155111/rpc?add_balance_override&apikey=pim_k8rpLTHYkY3pEUHoa7Lc98`,
        options: {
          owners: [WALLET.address],
          threshold: 1,
        },
        paymasterOptions: {
          isSponsored: true,
          paymasterUrl: `https://api.pimlico.io/v2/11155111/rpc?add_balance_override&apikey=pim_k8rpLTHYkY3pEUHoa7Lc98`,
          //   paymasterAddress: '0x...',
          //   paymasterTokenAddress: '0x...',
          sponsorshipPolicyId: 'sp_fantastic_baron_zemo',
        },
      });
      setSafeWallet(safeWallet);
    };
    initSafeWallet();
  }, []);

  const sendTx = async () => {
    if (safeWallet) {
      const txs = await safeWallet.createTransaction({
        transactions: [
          {
            to: '0xd0B19109DD194fe366f2d2dA34B3C22Dabb1Cb0b',
            value: '0',
            data: '0x',
          },
        ],
      });
      const signed = await safeWallet.signSafeOperation(txs);
      const txHash = await safeWallet.executeTransaction({
        executable: signed,
      });
      let userOperationReceipt = null;

      while (!userOperationReceipt) {
        // Wait 2 seconds before checking the status again
        await new Promise((resolve) => setTimeout(resolve, 2000));
        userOperationReceipt = await safeWallet.getUserOperationReceipt(txHash);
      }
      localStorage.setItem(localstorageKey, userOperationReceipt.sender);
      setSafeAddress(userOperationReceipt.sender);
      console.log(txHash, userOperationReceipt);
    } else {
      throw new Error('Safe wallet not initialized');
    }
  };

  return { safeWallet, sendTx };
}
