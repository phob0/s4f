import NavBar from './navbar';
import dynamic from "next/dynamic";

const AuthenticatedRoutesWrapper = dynamic(
  async () => {
   return (await import("@multiversx/sdk-dapp/wrappers/AuthenticatedRoutesWrapper")).AuthenticatedRoutesWrapper;
  },
  { ssr: false }
);

export default function Layout({ children }: {
  children: React.ReactNode;
}) {
  return (
      <div className="content">
        <NavBar />
        { children }
      </div>  
    );
}