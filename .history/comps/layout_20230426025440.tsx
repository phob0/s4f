import NavBar from './navbar';
import Task from '../pages/Task';
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
      path: "/tasks",
      title: "Tasks",
      component: Task,
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