import dynamic from "next/dynamic";

const AuthenticatedRoutesWrapper = dynamic(
    async () => {
     return (await import("@multiversx/sdk-dapp/wrappers/AuthenticatedRoutesWrapper")).AuthenticatedRoutesWrapper;
    },
    { ssr: false }
  );