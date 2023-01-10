declare const versions: typeof import("./versions").default;

interface Window {
  showNotification:
    | typeof import("./notification").showNotification
    | undefined;
  mac: string;
  addr: string;
}
