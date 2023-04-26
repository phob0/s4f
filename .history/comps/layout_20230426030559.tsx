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
  const routes = [
    {
      path: "/",
      title: "Home",
      component: "@/pages/index",
      authenticatedRoute: false,
    },
    {
      path: "/tasks",
      title: "Tasks",
      component: "@/pages/tasks",
      authenticatedRoute: true,
    }
  ]

  return (
      <div className="content">
        <NavBar />
        { children }
        {/* <AuthenticatedRoutesWrapper routes={routes} unlockRoute="/unlock">
        { children }
        </AuthenticatedRoutesWrapper> */}
      </div>  
    );
}