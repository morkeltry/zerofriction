import { Safe4337Pack } from '@safe-global/relay-kit';
import { Wallet } from 'ethers';
import { useEffect, useState } from 'react';

const SEPOLIA_RPC_URL = 'https://ethereum-sepolia-rpc.publicnode.com';
// const Gnosis_RPC_URL = 'https://gnosis.drpc.org';
const SEED_PHRASE =
  '0x4bbbf85ce3377467afe5d46f804f221813b2bb87f24d81f60f1fcdbf7cbf4356';
const WALLET = new Wallet(SEED_PHRASE);

export default function useSafeWallet() {
  const [safeWallet, setSafeWallet] = useState<Safe4337Pack | null>(null);

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
      console.log(txHash);
    } else {
      throw new Error('Safe wallet not initialized');
    }
  };

  const safeAddress = async () => {
    if (safeWallet) {
      const address = await safeWallet.console.log(address);
    }
  };

  return { safeWallet, sendTx, safeAddress };
}
