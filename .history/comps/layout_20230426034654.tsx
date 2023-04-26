import NavBar from './navbar';
import dynamic from "next/dynamic";

// import AuthenticatedRoutesWrapper from "@multiversx/sdk-dapp/wrappers/AuthenticatedRoutesWrapper";

// const AuthenticatedRoutesWrapper = dynamic(
//   async () => {
//    return (await import("@multiversx/sdk-dapp/wrappers/AuthenticatedRoutesWrapper")).AuthenticatedRoutesWrapper;
//   },
//   { ssr: false }
// );

export default function Layout({ children }: {
  children: React.ReactNode;
}) {
  return (
      <div className="content">
        <NavBar />
        <AuthenticatedRoutesWrapper 
          routes={routes} 
          unlockRoute="/unlock"
          children={ children }
        />
      </div>  
    );
}