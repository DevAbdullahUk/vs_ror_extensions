// Abdullah's Theme: UI tweaks.
//
// VS Code's extension API can't restyle the workbench (fonts in the file tree,
// centred command palette, blur behind it, ...). The only way is to inject CSS
// into VS Code's own workbench.html, which is what this file does.
//
// - "Enable UI Tweaks" inserts ui/ui.css as an inline <style> block.
// - "Disable UI Tweaks" removes it again.
// - VS Code updates overwrite workbench.html, so on startup we offer to re-apply.

const vscode = require('vscode');
const fs = require('fs');
const path = require('path');

const START = '<!-- abdullahs-theme:start -->';
const END = '<!-- abdullahs-theme:end -->';
const BLOCK_RE = new RegExp(`\\s*${START}[\\s\\S]*?${END}`, 'g');

function workbenchHtmlPath() {
	const root = path.join(vscode.env.appRoot, 'out', 'vs', 'code');
	const candidates = [
		path.join(root, 'electron-browser', 'workbench', 'workbench.html'),
		path.join(root, 'electron-sandbox', 'workbench', 'workbench.html')
	];
	const found = candidates.find((p) => fs.existsSync(p));
	if (!found) {
		throw new Error(`Could not find workbench.html under ${root}`);
	}
	return found;
}

function isInjected(html) {
	return html.includes(START);
}

function inject(context) {
	const file = workbenchHtmlPath();
	const backup = `${file}.abdullahs-theme.bak`;
	const css = fs.readFileSync(path.join(context.extensionPath, 'ui', 'ui.css'), 'utf8');
	const original = fs.readFileSync(file, 'utf8');
	let html = original.replace(BLOCK_RE, '');

	// Keep a pristine copy the first time (or after a VS Code update replaced the file).
	if (!fs.existsSync(backup) || !isInjected(original)) {
		fs.writeFileSync(backup, html);
	}

	if (!html.includes('</head>')) {
		throw new Error('workbench.html has no </head> tag; VS Code changed its layout');
	}
	const block = `\n\t\t${START}\n\t\t<style>\n${css}\n\t\t</style>\n\t\t${END}\n`;
	html = html.replace('</head>', `${block}\t</head>`);
	fs.writeFileSync(file, html);
}

function remove() {
	const file = workbenchHtmlPath();
	const html = fs.readFileSync(file, 'utf8');
	if (!isInjected(html)) {
		return false;
	}
	fs.writeFileSync(file, html.replace(BLOCK_RE, '\n'));
	return true;
}

async function promptRestart(message) {
	const choice = await vscode.window.showInformationMessage(message, 'Quit VS Code');
	if (choice === 'Quit VS Code') {
		// A window reload is not enough: workbench.html is cached until the app restarts.
		await vscode.commands.executeCommand('workbench.action.quit');
	}
}

function permissionHint(err) {
	return err && (err.code === 'EACCES' || err.code === 'EPERM')
		? ' VS Code needs write access to its own install folder.'
		: '';
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	context.subscriptions.push(
		vscode.commands.registerCommand('abdullahs-theme.enableUiTweaks', async () => {
			try {
				inject(context);
				await context.globalState.update('uiTweaksEnabled', true);
				await promptRestart("Abdullah's Theme UI tweaks applied. Quit and reopen VS Code to see them.");
			} catch (err) {
				vscode.window.showErrorMessage(`Could not apply UI tweaks: ${err.message}.${permissionHint(err)}`);
			}
		}),

		vscode.commands.registerCommand('abdullahs-theme.disableUiTweaks', async () => {
			try {
				const removed = remove();
				await context.globalState.update('uiTweaksEnabled', false);
				if (removed) {
					await promptRestart("Abdullah's Theme UI tweaks removed. Quit and reopen VS Code.");
				} else {
					vscode.window.showInformationMessage("Abdullah's Theme UI tweaks were not applied.");
				}
			} catch (err) {
				vscode.window.showErrorMessage(`Could not remove UI tweaks: ${err.message}.${permissionHint(err)}`);
			}
		})
	);

	// After a VS Code update, workbench.html is replaced and the tweaks are gone.
	if (context.globalState.get('uiTweaksEnabled')) {
		try {
			if (!isInjected(fs.readFileSync(workbenchHtmlPath(), 'utf8'))) {
				vscode.window
					.showInformationMessage("VS Code was updated and Abdullah's Theme UI tweaks were removed. Re-apply them?", 'Re-apply')
					.then((choice) => {
						if (choice === 'Re-apply') {
							vscode.commands.executeCommand('abdullahs-theme.enableUiTweaks');
						}
					});
			}
		} catch {
			// workbench.html not found; nothing to check.
		}
	}
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
};
