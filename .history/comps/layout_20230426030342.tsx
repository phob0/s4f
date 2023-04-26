import NavBar from './navbar';
import Home from './pages/Home';
import Tasks from '../pages/Tasks';
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
        { children }
        {/* <AuthenticatedRoutesWrapper routes={routes} unlockRoute="/unlock">
        { children }
        </AuthenticatedRoutesWrapper> */}
      </div>  
    );
}