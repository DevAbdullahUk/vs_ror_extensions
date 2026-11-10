#!/usr/bin/env node
// Writes the RubyMine (macOS keymap) shortcuts into package.json -> contributes.keybindings.
//
//   npm run build:keymap
//
// Every binding is gated on the `abdullahsTheme.rubymineKeymap` setting, so the whole
// keymap can be switched off in Settings without uninstalling the extension.
// Edit the KEYMAP table below, then re-run the script.

const fs = require('fs');
const path = require('path');

const PKG = path.join(__dirname, '..', 'package.json');
// RubyMine's macOS keymap: only active on macOS, and only while the setting is on.
const ON = 'isMac && config.abdullahsTheme.rubymineKeymap';

const EDITOR = 'editorTextFocus';
const EDITOR_RW = 'editorTextFocus && !editorReadonly';
const DEBUGGING = 'inDebugMode';

// [mac key, command, when (optional), RubyMine action name]
const KEYMAP = [
	// ---- Navigation ----
	['cmd+o', 'workbench.action.showAllSymbols', null, 'Go to Class'],
	['shift+cmd+o', 'workbench.action.quickOpen', null, 'Go to File'],
	['alt+cmd+o', 'workbench.action.showAllSymbols', null, 'Go to Symbol'],
	['shift+cmd+a', 'workbench.action.showCommands', null, 'Find Action'],
	['cmd+e', 'workbench.action.showAllEditorsByMostRecentlyUsed', null, 'Recent Files'],
	['shift+cmd+e', 'workbench.action.openRecent', null, 'Recent Locations (closest: recent projects/files)'],
	['cmd+f12', 'workbench.action.gotoSymbol', null, 'File Structure'],
	['cmd+l', 'workbench.action.gotoLine', null, 'Go to Line'],
	['cmd+b', 'editor.action.revealDefinition', EDITOR, 'Go to Declaration'],
	['alt+cmd+b', 'editor.action.goToImplementation', EDITOR, 'Go to Implementation'],
	['shift+cmd+b', 'editor.action.goToTypeDefinition', EDITOR, 'Go to Type Declaration'],
	['alt+f7', 'references-view.findReferences', EDITOR, 'Find Usages'],
	['alt+cmd+f7', 'editor.action.referenceSearch.trigger', EDITOR, 'Show Usages'],
	['shift+cmd+t', 'rubyLsp.goToRelevantFile', EDITOR, 'Navigate to Test / Subject'],
	['ctrl+cmd+up', 'rubyLsp.goToRelevantFile', EDITOR, 'Go to Related Symbol'],
	['cmd+[', 'workbench.action.navigateBack', null, 'Back'],
	['cmd+]', 'workbench.action.navigateForward', null, 'Forward'],
	['shift+cmd+backspace', 'workbench.action.navigateToLastEditLocation', null, 'Last Edit Location'],
	['f2', 'editor.action.marker.nextInFiles', EDITOR, 'Next Highlighted Error'],
	['shift+f2', 'editor.action.marker.prevInFiles', EDITOR, 'Previous Highlighted Error'],
	['cmd+f1', 'editor.action.showHover', EDITOR, 'Show Error Description'],
	['f1', 'editor.action.showHover', EDITOR, 'Quick Documentation'],
	['cmd+p', 'editor.action.triggerParameterHints', EDITOR, 'Parameter Info'],
	['alt+space', 'editor.action.peekDefinition', EDITOR, 'Quick Definition'],

	// ---- Tool windows ----
	['cmd+1', 'workbench.view.explorer', null, 'Project tool window'],
	['cmd+7', 'outline.focus', null, 'Structure tool window'],
	['cmd+9', 'workbench.view.scm', null, 'Git tool window'],
	['alt+f12', 'workbench.action.terminal.toggleTerminal', null, 'Terminal'],
	['shift+cmd+f12', 'workbench.action.maximizeEditorHideSidebar', null, 'Hide All Tool Windows'],
	['cmd+0', 'workbench.action.focusActiveEditorGroup', null, 'Back to editor (closest)'],

	// ---- Editing ----
	['cmd+d', 'editor.action.copyLinesDownAction', EDITOR_RW, 'Duplicate Line or Selection'],
	['cmd+backspace', 'editor.action.deleteLines', EDITOR_RW, 'Delete Line'],
	['ctrl+g', 'editor.action.addSelectionToNextFindMatch', EDITOR, 'Add Selection for Next Occurrence'],
	['ctrl+shift+g', 'cursorUndo', EDITOR, 'Unselect Occurrence'],
	['ctrl+cmd+g', 'editor.action.selectHighlights', EDITOR, 'Select All Occurrences'],
	['alt+shift+up', 'editor.action.moveLinesUpAction', EDITOR_RW, 'Move Line Up'],
	['alt+shift+down', 'editor.action.moveLinesDownAction', EDITOR_RW, 'Move Line Down'],
	['shift+cmd+up', 'editor.action.moveLinesUpAction', EDITOR_RW, 'Move Statement Up'],
	['shift+cmd+down', 'editor.action.moveLinesDownAction', EDITOR_RW, 'Move Statement Down'],
	['alt+up', 'editor.action.smartSelect.expand', EDITOR, 'Extend Selection'],
	['alt+down', 'editor.action.smartSelect.shrink', EDITOR, 'Shrink Selection'],
	['shift+enter', 'editor.action.insertLineAfter', EDITOR_RW, 'Start New Line'],
	['alt+cmd+enter', 'editor.action.insertLineBefore', EDITOR_RW, 'Start New Line Before Current'],
	['ctrl+shift+j', 'editor.action.joinLines', EDITOR_RW, 'Join Lines'],
	['alt+cmd+/', 'editor.action.blockComment', EDITOR_RW, 'Comment with Block Comment'],
	['alt+enter', 'editor.action.quickFix', EDITOR, 'Show Context Actions'],
	['alt+cmd+t', 'editor.action.surroundWithSnippet', EDITOR_RW, 'Surround With'],
	['cmd+j', 'editor.action.showSnippets', EDITOR_RW, 'Insert Live Template'],
	['ctrl+space', 'editor.action.triggerSuggest', EDITOR_RW, 'Basic Completion'],
	['shift+cmd+8', 'editor.action.toggleColumnSelection', EDITOR, 'Column Selection Mode'],
	['cmd+=', 'editor.unfold', EDITOR, 'Expand'],
	['cmd+-', 'editor.fold', EDITOR, 'Collapse'],
	['shift+cmd+=', 'editor.unfoldAll', EDITOR, 'Expand All'],
	['shift+cmd+-', 'editor.foldAll', EDITOR, 'Collapse All'],
	['shift+cmd+u', 'editor.action.transformToUppercase', EDITOR_RW, 'Toggle Case (upper)'],

	// ---- Refactoring & code ----
	['shift+f6', 'editor.action.rename', EDITOR_RW, 'Rename'],
	['alt+cmd+l', 'editor.action.formatDocument', `${EDITOR_RW} && !editorHasSelection`, 'Reformat Code'],
	['alt+cmd+l', 'editor.action.formatSelection', `${EDITOR_RW} && editorHasSelection`, 'Reformat Code (selection)'],
	['ctrl+alt+o', 'editor.action.organizeImports', EDITOR_RW, 'Optimize Imports'],
	['ctrl+t', 'editor.action.refactor', EDITOR_RW, 'Refactor This'],
	['alt+cmd+m', 'editor.action.codeAction', EDITOR_RW, 'Extract Method (code actions)'],

	// ---- Search ----
	['cmd+r', 'editor.action.startFindReplaceAction', EDITOR, 'Replace'],
	['shift+cmd+r', 'workbench.action.replaceInFiles', null, 'Replace in Files'],

	// ---- Run & debug ----
	['ctrl+r', 'workbench.action.debug.run', '!inDebugMode', 'Run'],
	['ctrl+d', 'workbench.action.debug.start', '!inDebugMode', 'Debug'],
	['ctrl+shift+r', 'rubyLsp.runTest', 'editorLangId == ruby', 'Run Context Configuration (current test)'],
	['ctrl+shift+d', 'rubyLsp.debugTest', 'editorLangId == ruby', 'Debug Context Configuration (current test)'],
	['cmd+f8', 'editor.debug.action.toggleBreakpoint', EDITOR, 'Toggle Line Breakpoint'],
	['shift+cmd+f8', 'workbench.debug.action.focusBreakpointsView', null, 'View Breakpoints'],
	['f8', 'workbench.action.debug.stepOver', DEBUGGING, 'Step Over'],
	['f7', 'workbench.action.debug.stepInto', DEBUGGING, 'Step Into'],
	['shift+f8', 'workbench.action.debug.stepOut', DEBUGGING, 'Step Out'],
	['alt+cmd+r', 'workbench.action.debug.continue', DEBUGGING, 'Resume Program'],
	['cmd+f2', 'workbench.action.debug.stop', DEBUGGING, 'Stop'],
	['alt+f8', 'editor.debug.action.selectionToRepl', `${DEBUGGING} && ${EDITOR}`, 'Evaluate Expression'],
	['alt+f9', 'editor.debug.action.runToCursor', DEBUGGING, 'Run to Cursor'],

	// ---- Tabs & windows ----
	['ctrl+tab', 'workbench.action.quickOpenPreviousRecentlyUsedEditorInGroup', null, 'Switcher'],
	['shift+cmd+f4', 'workbench.action.closeOtherEditors', null, 'Close Others (closest)'],
	['shift+cmd+[', 'workbench.action.previousEditor', null, 'Select Previous Tab'],
	['shift+cmd+]', 'workbench.action.nextEditor', null, 'Select Next Tab']
];

function build() {
	const pkg = JSON.parse(fs.readFileSync(PKG, 'utf8'));
	pkg.contributes.keybindings = KEYMAP.map(([key, command, when]) => ({
		key,
		command,
		when: when ? `${ON} && ${when}` : ON
	}));
	pkg.contributes.configuration = {
		title: "Abdullah's Theme",
		properties: {
			'abdullahsTheme.rubymineKeymap': {
				type: 'boolean',
				default: true,
				description: 'Use RubyMine (macOS) keyboard shortcuts. Turn off to get VS Code\'s default shortcuts back.'
			}
		}
	};
	fs.writeFileSync(PKG, JSON.stringify(pkg, null, 2) + '\n');
	console.log(`Wrote ${KEYMAP.length} RubyMine shortcuts to package.json`);
}

if (require.main === module) {
	build();
}

module.exports = { KEYMAP };
