import { normalizeNamespaces } from "@walletconnect/utils";
import { uniq } from "lodash";
import {
  SwitchChainError,
  UserRejectedRequestError,
  createWalletClient,
  custom,
  formatTransaction,
  formatTransactionRequest,
  getAddress,
  numberToHex,
  publicActions,
} from "viem";
import { Connector } from "wagmi";
import * as Account from "viem/accounts";
import { MAX_SPEND_AMOUNT } from "../constants";

const NAMESPACE = "eip155";
const ADD_ETH_CHAIN_METHOD = "wallet_addEthereumChain";
const REQ_SESSION_KEY_METHOD = "eth_requestSessionKey";
const REQUESTED_CHAINS_KEY = "requestedChains";
const STORE_KEY = "store";

export class CustomW3mConnector extends Connector {
  id = "walletConnect";
  name = "WalletConnect";
  ready = true;

  #provider;
  #initProviderPromise;

  constructor({ chains, options }) {
    super({
      chains: chains,
      options: { isNewChainsStale: true, ...options },
    });
    this.#createProvider();
  }

  async connect(config) {
    let chainId, pairingTopic;
    if (config) {
      chainId = config.chainId;
      pairingTopic = config.pairingTopic;
    }
    try {
      console.log({ chainId, pairingTopic });
      let targetChainId = chainId;
      if (!targetChainId) {
        const store = this.storage?.getItem(STORE_KEY);
        const lastUsedChainId = store?.state?.data?.chain?.id;
        if (lastUsedChainId && !this.isChainUnsupported(lastUsedChainId)) {
          targetChainId = lastUsedChainId;
        } else {
          targetChainId = this.chains[0]?.id;
        }
      }
      if (!targetChainId) throw new Error("No chains found on connector");
      const provider = await this.getProvider();
      this.#setupListeners();
      const isChainsStale = this.#isChainsStale();
      if (provider.session && isChainsStale) await provider.disconnect();
      if (!provider.session || isChainsStale) {
        const optionalChains = this.chains
          .filter((chain) => chain.id !== targetChainId)
          .map((optionalChain) => optionalChain.id);
        this.emit("message", { type: "connecting" });
        await provider.connect({
          pairingTopic,
          chains: [targetChainId],
          optionalChains: optionalChains.length ? optionalChains : undefined,
        });
        this.#setRequestedChainsIds(this.chains.map(({ id }) => id));
      }
      const accounts = await provider.enable();
      const account = getAddress(accounts[0] || null);
      const id = await this.getChainId();
      const unsupported = this.isChainUnsupported(id);
      return {
        account,
        chain: { id, unsupported },
      };
    } catch (error) {
      if (/user rejected/i.test(error?.message)) {
        throw new UserRejectedRequestError(error);
      }
      throw error;
    }
  }

  async disconnect() {
    const provider = await this.getProvider();
    try {
      await provider.disconnect();
    } catch (error) {
      if (!/No matching key/i.test(error.message)) throw error;
    } finally {
      this.#removeListeners();
      this.#setRequestedChainsIds([]);
    }
  }

  async getAccount() {
    const { accounts } = await this.getProvider();
    return getAddress(accounts[0] || null);
  }

  async getChainId() {
    const { chainId } = await this.getProvider();
    return chainId;
  }

  async getProvider(props) {
    let chainId;
    if (props) {
      chainId = props.chainId;
    }
    if (!this.#provider) await this.#createProvider();
    if (chainId) await this.switchChain(chainId);
    return this.#provider || null;
  }

  async getWalletClient({ chainId }) {
    const [provider, account] = await Promise.all([
      this.getProvider({ chainId }),
      this.getAccount(),
    ]);
    const chain = this.chains.find((x) => x.id === chainId);
    if (!provider) throw new Error("provider is required.");
    return createWalletClient({
      account,
      chain,
      transport: custom(provider),
    });
  }

  async isAuthorized() {
    try {
      const [account, provider] = await Promise.all([
        this.getAccount(),
        this.getProvider(),
      ]);
      const isChainsStale = this.#isChainsStale();
      if (!account) return false;
      if (isChainsStale && provider.session) {
        try {
          await provider.disconnect();
        } catch (error) {}
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }

  async switchChain(chainId) {
    const chain = this.chains.find((chain) => chain.id === chainId);
    if (!chain) {
      throw new SwitchChainError(new Error("chain not found on connector"));
    }
    try {
      const provider = await this.getProvider();
      const namespaceChains = this.#getNamespaceChainsIds();
      const namespaceMethods = this.#getNamespaceMethods();
      const isChainApproved = namespaceChains.includes(chainId);

      if (!isChainApproved && namespaceMethods.includes(ADD_ETH_CHAIN_METHOD)) {
        await provider.request({
          method: ADD_ETH_CHAIN_METHOD,
          params: [
            {
              chainId: numberToHex(chain.id),
              blockExplorerUrls: [chain.blockExplorers?.default?.url],
              chainName: chain.name,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: [...chain.rpcUrls.default.http],
            },
          ],
        });
        const requestedChains = this.#getRequestedChainsIds();
        requestedChains.push(chainId);
        this.#setRequestedChainsIds(requestedChains);
      }
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: numberToHex(chainId) }],
      });
      return chain;
    } catch (error) {
      const message = typeof error === "string" ? error : error?.message;
      if (/user rejected request/i.test(message)) {
        throw new UserRejectedRequestError(error);
      }
      throw new SwitchChainError(error);
    }
  }

  async #createProvider() {
    if (!this.#initProviderPromise && typeof window !== "undefined") {
      this.#initProviderPromise = this.#initProvider();
    }
    return this.#initProviderPromise;
  }

  async #initProvider() {
    const {
      EthereumProvider,
      OPTIONAL_EVENTS,
      OPTIONAL_METHODS,
      REQUIRED_METHODS,
      REQUIRED_EVENTS,
    } = await import("@walletconnect/ethereum-provider");
    const [defaultChain, ...optionalChains] = this.chains.map(({ id }) => id);
    if (defaultChain) {
      const {
        projectId,
        showQrModal = true,
        qrModalOptions,
        metadata,
        relayUrl,
        methods = [],
        events = [],
        optionalMethods = [],
        optionalEvents = [],
      } = this.options;
      const requiredChains = this?.chains ?? [];
      const requiredMethods = requiredChains.length
        ? uniq([...methods, ...REQUIRED_METHODS])
        : [];
      const requiredEvents = requiredChains.length
        ? uniq([...events, ...REQUIRED_EVENTS])
        : [];
      const optionalMethodsArr = uniq([...optionalMethods, OPTIONAL_METHODS]);
      const optionalEventsArr = uniq([...optionalEvents, OPTIONAL_EVENTS]);
      this.#provider = await EthereumProvider.init({
        showQrModal,
        qrModalOptions,
        projectId,
        methods: requiredMethods,
        events: requiredEvents,
        optionalMethods: optionalMethodsArr,
        optionalEvents: optionalEventsArr,
        chains: [defaultChain],
        optionalChains: optionalChains.length ? optionalChains : undefined,
        rpcMap: Object.fromEntries(
          this.chains.map((chain) => [
            chain.id,
            chain.rpcUrls.default.http[0] || null,
          ])
        ),
        metadata,
        relayUrl,
      });
    }
  }

  #isChainsStale() {
    const namespaceMethods = this.#getNamespaceMethods();
    if (namespaceMethods.includes(ADD_ETH_CHAIN_METHOD)) return false;
    const requestedChains = this.#getRequestedChainsIds();
    const connectorChains = this.chains.map(({ id }) => id);
    const namespaceChains = this.#getNamespaceChainsIds();

    if (
      namespaceChains.length &&
      !namespaceChains.some((id) => connectorChains.includes(id))
    ) {
      return false;
    }
    return !connectorChains.every((id) => requestedChains.includes(id));
  }

  #setupListeners() {
    if (!this.#provider) return;
    this.#removeListeners();
    this.#provider.on("accountsChanged", this.onAccountsChanged);
    this.#provider.on("chainChanged", this.onChainChanged);
    this.#provider.on("disconnect", this.onDisconnect);
    this.#provider.on("session_delete", this.onDisconnect);
    this.#provider.on("display_uri", this.onDisplayUri);
    this.#provider.on("connect", this.onConnect);
  }

  #removeListeners() {
    if (!this.#provider) return;
    this.#provider.removeListener("accountsChanged", this.onAccountsChanged);
    this.#provider.removeListener("chainChanged", this.onChainChanged);
    this.#provider.removeListener("disconnect", this.onDisconnect);
    this.#provider.removeListener("session_delete", this.onDisconnect);
    this.#provider.removeListener("display_uri", this.onDisplayUri);
    this.#provider.removeListener("connect", this.onConnect);
  }

  #setRequestedChainsIds(chains) {
    this.storage?.setItem(REQUESTED_CHAINS_KEY, chains);
  }

  #getRequestedChainsIds() {
    return this.storage?.getItem(REQUESTED_CHAINS_KEY) ?? [];
  }

  #getNamespaceChainsIds() {
    if (!this.#provider) return [];
    const namespaces = this.#provider.session?.namespaces;
    if (!namespaces) return [];

    const normalizedNamespaces = normalizeNamespaces(namespaces);
    const chainIds = normalizedNamespaces[NAMESPACE]?.chains?.map((chain) =>
      parseInt(chain.split(":")[1] || "")
    );

    return chainIds ?? [];
  }

  #getNamespaceMethods() {
    if (!this.#provider) return [];
    const namespaces = this.#provider.session?.namespaces;
    if (!namespaces) return [];

    const normalizedNamespaces = normalizeNamespaces(namespaces);
    const methods = normalizedNamespaces[NAMESPACE]?.methods;

    return methods ?? [];
  }

  onAccountsChanged = (accounts) => {
    if (accounts.length === 0) this.emit("disconnect");
    else this.emit("change", { account: getAddress(accounts[0] || null) });
  };

  onChainChanged = (chainId) => {
    const id = Number(chainId);
    const unsupported = this.isChainUnsupported(id);
    this.emit("change", { chain: { id, unsupported } });
  };

  onDisconnect = () => {
    this.#setRequestedChainsIds([]);
    localStorage.clear("account");
    this.emit("disconnect");
  };

  onDisplayUri = (uri) => {
    this.emit("message", { type: "display_uri", data: uri });
  };

  onConnect = () => {
    this.emit("connect", {});
  };

  // async #requestSessionKey(chainId) {
  //   const client = await this.getWalletClient({ chainId });
  //   try {
  //     const thisClient = client.extend((client) => ({
  //       ...publicActions(client),
  //       async requestSessionKey() {
  //         let address,
  //           isSet = true;
  //         const sessionAccount = localStorage.getItem("account");
  //         if (!sessionAccount) {
  //           const privateKey = Account.generatePrivateKey();
  //           address = Account.privateKeyToAccount(privateKey).address;
  //           isSet = false;
  //         } else {
  //           address = JSON.parse(sessionAccount).address;
  //         }
  //         const validAfter = Date.now() * 1e3;
  //         const validUntil = validAfter + 36 * 1e5;
  //         console.log({
  //           address,
  //           maxAmount: MAX_SPEND_AMOUNT,
  //           validAfter,
  //           validUntil,
  //         });
  //         const res = await client.request({
  //           method: "eth_requestSessionKey",
  //           params: [
  //             formatTransactionRequest({
  //               address,
  //               maxAmount: MAX_SPEND_AMOUNT,
  //               validAfter,
  //               validUntil,
  //             }),
  //             "latest",
  //             {},
  //           ],
  //         });
  //         console.log(res);
  //         if (res.success) {
  //           if (!isSet) {
  //             localStorage.setItem(
  //               "account",
  //               JSON.stringify({ address, privateKey })
  //             );
  //           }
  //         } else {
  //           console.log("error");
  //         }
  //       },
  //     }));
  //     await thisClient.requestSessionKey();
  //     console.log("asdds");
  //   } catch (error) {
  //     console.log({ error });
  //   }
  // }
}
