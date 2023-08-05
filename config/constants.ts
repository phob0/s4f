// This configuration file keeps all UI constants and settings

// Your Dapp hostname example: https://www.mydapp.com it should come from env vars
export const dappHostname = process.env.NEXT_PUBLIC_DAPP_HOST;

// HTML metata and og tags, default values for MetaHead.tsx component
export const defaultMetaTags = {
  title: 'MultiversX NextJS dapp demo - MultiversX blockchain',
  description: 'Open source Dapp template for the MultiversX blockchain.',
  image: `${dappHostname}/og-image.png`,
};

export const adminAddresses = [
  "erd1lnmfa5p9j6qy40kjtrf0wfq6cl056car6hyvrq5uxdcalc2gu7zsrwalel",
  "erd1a9kt4x3pc8lv9twz9sf3k7q699pmzlpscqjuenmt32xjt9nrpzaqppam3r"
]