import { Suspense, lazy } from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";

const Index = lazy(() => import("../pages/App"));
const Controller = lazy(() => import("../pages/Controller/controller"));
const TaskGroup = lazy(() => import("../pages/TaskGroup/taskGroup"));
const ResourceGroup = lazy(() => import("../pages/ResourceGroup/resourceGroup"));


const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate replace to="/controller" />,
  },
  {
    path: "/",
    element: (
      <Suspense>
        <Index />
      </Suspense>
    ),
    children: [
      {
        path: "controller",
        element: (
          <Suspense>
            <Controller />
          </Suspense>
        ),
      },
      {
        path: "task-group",
        element: (
          <Suspense>
            <TaskGroup />
          </Suspense>
        ),
      },
      {
        path: "resource-group",
        element: (
          <Suspense>
            <ResourceGroup />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <h1>404</h1>,
  },
]);

export default router;
