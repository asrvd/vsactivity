/* eslint-disable no-unused-vars */

const vscode = require('vscode');
const { setData, updateActivity } = require('./dat.js');
const path = require('path');

/**
 * @param {vscode.ExtensionContext} ctx
 */

function setActivity(username) {
    const dirname = vscode.workspace.workspaceFolders[0].name;
    const filename = vscode.window.activeTextEditor.document.fileName;
    const filetype = filename.substring(filename.lastIndexOf('.') + 1);
    console.log(filetype)
    //console.log(vscode.workspace.workspaceFolders)
    const status = true;
    //console.log(username, path.basename(filename), dirname, status);
    setData(username, path.basename(filename), dirname, status, filetype);
    
}

function setOffline(username) {
    updateActivity(username, false)
}

function setOnline(username) {
    updateActivity(username, true)
}

module.exports = {
    setActivity,
    setOffline,
    setOnline
}