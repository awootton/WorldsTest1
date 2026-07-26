import { StrictMode } from "react";
import * as ReactDOMClient from "react-dom/client";

import AppSpliter from "./AppSplitter";

const rootElement = document.getElementById("root");


if (rootElement) {
  const root = ReactDOMClient.createRoot(rootElement);

  root.render(
    <StrictMode>
      <AppSpliter />
    </StrictMode>
  );

}
if (!rootElement) {
  throw new Error("Root element not found");
}

