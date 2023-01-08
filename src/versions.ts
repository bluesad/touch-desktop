import { ipcRenderer } from "electron";

export default {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: async (extraData: string) => ipcRenderer.invoke("ping", extraData),
  // we can also expose variables, not just functions
};
