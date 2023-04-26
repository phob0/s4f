import NavBar from './navbar';

import AuthenticatedRoutesWrapper from "./AuthenticatedRoutesWrapper";

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