import NavBar from './navbar';
import dynamic from "next/dynamic";
import Home from "@/pages/index";
import Task from "@/pages/task";
import Tasks from "@/pages/tasks";
// import AuthenticatedRoutesWrapper from "@multiversx/sdk-dapp/wrappers/AuthenticatedRoutesWrapper";

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
      path: "/task",
      title: "Task",
      component: Task,
      authenticatedRoute: true,
    },
    {
      path: "/tasks",
      title: "Tasks",
      component: Tasks,
      authenticatedRoute: true,
    }
  ]

  const first = children[0];
  const second = children[1];

  return (
      <div className="content">
        <NavBar />
        {children}
        <AuthenticatedRoutesWrapper 
          routes={routes} 
          unlockRoute="/unlock"
          children={ second }
        />
      </div>  
    );
}