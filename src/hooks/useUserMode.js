import { useLocation } from "react-router-dom";

export function useUserMode() {
  const location = useLocation();
  const pathParts = location.pathname.split("/");

  const mode =
    pathParts[1] === "me" || pathParts[1] === "demo"
      ? pathParts[1]
      : "demo";

  const userId = mode === "demo" ? 2 : 1;

  return { mode, userId };
}
