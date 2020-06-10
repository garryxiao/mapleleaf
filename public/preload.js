const {
    contextBridge,
    ipcRenderer
} = require("electron")

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    "appRuntime", {
        send: (channel, data = null) => {
            ipcRenderer.send(channel, data);
        },
        subscribe: (channel, listener) => {
            const subscription = (event, ...args) => listener(...args);
            ipcRenderer.on(channel, subscription);

            return () => {
                ipcRenderer.removeListener(channel, subscription);
            }
        }
    }
)