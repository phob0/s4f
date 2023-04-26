import dynamic from "next/dynamic";

const AuthenticatedRoutes = dynamic(
    async () => {
     return (await import("@multiversx/sdk-dapp/wrappers/AuthenticatedRoutesWrapper")).AuthenticatedRoutesWrapper;
    },
    { ssr: false }
  );
  
  export default function AuthenticatedRoutesWrapper({ children }: {
    children: React.ReactNode;
  }) {}  