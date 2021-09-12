import { app, BrowserWindow, globalShortcut } from "electron";
import { EPingPayload, ProcessManagerMessage } from "jank-shared/src/communication/process-manager-ipc";
import * as path from "path";
import { onEventFrame } from "./ipc/frame";
import ProcessManager from "./process-manager";
import { createNormalWindow } from "./windows";



// Start seperate process for running backends and CLI stuff.
const pm = ProcessManager.start();

app.on("ready", async () => {

    const {input: pmInput, output: pmOutput} = await pm;

    pmOutput.subscribe((msg: ProcessManagerMessage) => {
        console.log("PM MESSAGE:", msg);
    });

    createNormalWindow();

    app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createNormalWindow();
    });

    globalShortcut.register('CommandOrControl+Shift+N', () => {
        createNormalWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});