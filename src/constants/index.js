export const TIC_TAC_TOE_CONTRACT_ADDRESS =
  "0x0B2b31a569fDaf86445a6323c2423BEbF1eBf321";

export const EMPTY_ADDRESS = "0x0000000000000000000000000000000000000000";

export const TYPE_LIST = {
  CURRENT: 1,
  AVAILABLE: 2,
  HISTORY: 3,
};

export const KLAYTN_CONFIG = {
  KLAYTN: {},
  BAOBAB: {
    rpcUrl: "https://public-en-baobab.klaytn.net",
    token: {
      name: "KLAY",
      symbol: "KLAY",
    },
  },
};

export const DEFAULT_LOGGER = "debug";
export const DEFAULT_RELAY_URL = import.meta.env.VITE_WC_RELAY_URL;
export const DEFAULT_PROJECT_ID = import.meta.env.VITE_WC_PROJECT_ID;
export const DEFAULT_APP_METADATA = {
  name: "React App",
  description: "React App for WalletConnect",
  url: "https://walletconnect.com/",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
  verifyUrl: "https://verify.walletconnect.com",
};
