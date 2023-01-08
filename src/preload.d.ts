declare const versions: typeof import("./versions").default;

interface Window {
  showNotification:
    | typeof import("./notification").showNotification
    | undefined;
}
