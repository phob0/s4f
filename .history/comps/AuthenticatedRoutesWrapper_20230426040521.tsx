import dynamic from "next/dynamic";
import Home from "@/pages/index";
import Task from "@/pages/task";
import Tasks from "@/pages/tasks";

// import AuthenticatedRoutes from "@multiversx/sdk-dapp/wrappers/AuthenticatedRoutesWrapper";
const AuthenticatedRoutes = dynamic(
  async () => {
   return (await import("@multiversx/sdk-dapp/wrappers/AuthenticatedRoutesWrapper")).AuthenticatedRoutesWrapper;
  },
  { ssr: true }
);
  
  export default function AuthenticatedRoutesWrapper({ children }: {
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

    return (
        <AuthenticatedRoutes
            routes={routes}
        >
            {children}
        </AuthenticatedRoutes>
    )
  }  