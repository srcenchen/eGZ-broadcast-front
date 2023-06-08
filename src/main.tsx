import ReactDOM from "react-dom/client";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import "uno.css";
import { RouterProvider } from "react-router-dom";
import router from "./routers/index.tsx";
import "@arco-design/web-react/dist/css/arco.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <FluentProvider theme={webLightTheme}>
    <RouterProvider router={router}></RouterProvider>
  </FluentProvider>
);
