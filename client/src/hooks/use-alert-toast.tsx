// hooks/useAlertToast.ts
import { useAppToasts } from "./use-app-toast";

export function useAlertToast() {
  const { SuccessToast, ErrorToast, WarningToast } = useAppToasts();

  return function showAlertToast({
    level,
    message,
    details,
  }: {
    level: "info" | "warning"| "milestone";
    message: string;
    details?: Record<string, any>;
  }) {
    const description =
      details &&
      Object.entries(details)
        .map(([key, val]) => `${key}: ${val}`)
        .join(", ");

    switch (level) {
      case "info":
        WarningToast({
          title: message,
          description,
        });
        break;
      case "warning":
        ErrorToast({
          title: message,
          description,
        });
        break;
      case "milestone":
        SuccessToast({
          title: message,
          description,
        });
        break;
      default:
        WarningToast({ title: message });
    }
  };
}
