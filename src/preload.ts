// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge } from "electron";
import versions from "./versions";

window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector: string, text: string) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }

  window.addEventListener("keydown", (e) => {
    const { key, altKey } = e;
    if (key === "F4" && altKey) {
      console.log("Alt+F4 is pressed: Shortcut Disabled");
      e.preventDefault();
    }
  });
});

contextBridge.exposeInMainWorld("versions", versions);

const func = async () => {
  const response = await versions.ping("hello");
  const { mac, addr } = response;
  window.mac = mac;
  window.addr = addr;
  alert(`${mac}, ${addr}`);
};

func();