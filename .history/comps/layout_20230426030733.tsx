import NavBar from './navbar';
import dynamic from "next/dynamic";
import Home from "@/pages/index";
import Tasks from "@/pages/tasks";

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
      component: Home,
      authenticatedRoute: false,
    },
    {
      path: "/tasks",
      title: "Tasks",
      component: Tasks,
      authenticatedRoute: true,
    }
  ]

  return (
      <div className="content">
        <NavBar />
        <AuthenticatedRoutesWrapper routes={routes} unlockRoute="/unlock">
        { children }
        </AuthenticatedRoutesWrapper>
      </div>  
    );
}