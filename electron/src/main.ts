import { app, BrowserWindow, globalShortcut } from "electron";
import * as path from "path";
import { onEventFrame } from "./channels/frame";
import { createNormalWindow } from "./windows";


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", () => {

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
