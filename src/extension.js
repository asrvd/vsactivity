/* eslint-disable no-unused-vars */
const vscode = require('vscode');
const { Octokit } = require("@octokit/rest");
const { setData } = require('./dat.js');
const { setActivity, setOffline, setOnline } = require('./activity.js');


/**
 * @param {vscode.ExtensionContext} ctx
 */

const client = new Octokit()

function check_user(username) {
	return client.rest.users.getByUsername({
		username: username
	}).
	then(res => {
		console.log(res.message)
		if (res.status === 200) {
			//console.log(res.status)
			return true;
		} else {
			//console.log(res.status)
			return false;
		}
	}).catch(err => {
		//console.log(err);
		return false;
	})
}

function showIcon(ctx) {
	console.log('running')
	ctx.subscriptions.push(
		vscode.commands.registerCommand(
			'vsactivity.icon', function() {
				vscode.env.openExternal(vscode.Uri.parse('https://youtube.com'))
			}
		)
	)
	const bar_item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 1000);
	if (ctx.globalState.get('name') != undefined) {
		bar_item.text = '$(octoface)'
	} else {
		bar_item.text = `$(error)`
	}
	bar_item.command = 'vsactivity.icon'
	bar_item.tooltip = 'Click Me'
	bar_item.show();
}

function activate(ctx) {
	let promptOptions = {
		prompt: 'Your Name',
		placeHolder: 'Enter your name',
		value: (ctx.globalState.get('name') != undefined) ? ctx.globalState.get('name'):'none',
		ignoreFocusOut: true,
	};
	showIcon(ctx);
	ctx.subscriptions.push(
		vscode.commands.registerCommand('vsactivity.name', function() {
			vscode.window.showInputBox(promptOptions).then(val => {
				if (val!=undefined) {
					check_user(val).then(res => {
						console.log(res)
						if (res==true) {
							ctx.globalState.update('name', val);
							vscode.window.showInformationMessage('Your name is ' + val);
							setActivity(val);
						} else {
							vscode.window.showInformationMessage('User ' + val + ' not found');
						}
					}).then(undefined, err => {
						console.log(err)
					})
				}
			}).then(undefined, err => {
				console.log(err);
			})
		})
	)
	

	ctx.subscriptions.push(
		vscode.commands.registerCommand('vsactivity.setOff', function() {
			const name = ctx.globalState.get('name');
			if (name!=undefined) {
				setOffline(name);
			} else {
				vscode.window.showInformationMessage('Please set your name first');
			}
		})
	)

	vscode.workspace.onDidOpenTextDocument(e => {
		const name = ctx.globalState.get('name');
		if (name!=undefined) {
			setActivity(name);
		} else {
			return;
		}
	})

	vscode.workspace.onDidRenameFiles(e => {
		const name = ctx.globalState.get('name');
		if (name!=undefined) {
			setActivity(name);
		} else {
			return;
		}
	})

	vscode.workspace.onDidCloseTextDocument(e => {
		const name = ctx.globalState.get('name');
		if (name!=undefined) {
			setActivity(name);
		} else {
			return;
		}
	})

	vscode.window.onDidChangeActiveTextEditor(e => {
		const name = ctx.globalState.get('name');
		if (name!=undefined) {
			setActivity(name);
		} else {
			return;
		}
	})

	vscode.window.onDidChangeVisibleTextEditors(e => {
		const name = ctx.globalState.get('name');
		if (name!=undefined) {
			setActivity(name);
		} else {
			return;
		}
	})

	vscode.workspace.onDidDeleteFiles(e => {
		const name = ctx.globalState.get('name');
		if (name!=undefined) {
			setActivity(name);
		} else {
			return;
		}
	})
}

function deactivate(ctx) {
	const name = ctx.globalState.get('name');
	setOffline(name);
}

module.exports = {
	activate,
	deactivate
}
