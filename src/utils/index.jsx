export const getShortenAddress = (address, digitNumbers) => {
    return `0x${address.substring(2, 2 + digitNumbers)}...${address.substring(address.length - digitNumbers)}`
}