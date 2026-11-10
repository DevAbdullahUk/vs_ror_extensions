# Abdullah's Theme

A pure-black VS Code setup for Ruby on Rails, built for long sessions. It includes:

- **Abdullah's Theme**: a colour theme with a true `#000000` background and bright, easy-to-read syntax colours for Ruby, HAML, ERB, JavaScript/TypeScript, JSON, YAML, SCSS/CSS, HTML, Markdown, shell and SQL.
- **Abdullah's Icons**: a file icon theme. Folders are solid, coloured folder shapes with their purpose cut into them, and Rails files get icons for what they are, not just their extension.
- **RubyMine shortcuts**: RubyMine's macOS keymap, which you can turn off in Settings.
- **UI tweaks (optional)**: a centred command palette with the window blurred behind it, Geist Mono labels and thin scrollbars.

## Getting started

1. Run **Preferences: Color Theme** and choose **Abdullah's Theme**.
2. Run **Preferences: File Icon Theme** and choose **Abdullah's Icons**.

## Colours

| Colour | Used for |
|---|---|
| Orange | keywords (`def`, `class`, `if`, `end`, `import`, `const`) |
| Gold | methods and functions |
| Green | strings |
| Blue | numbers |
| Teal | classes, modules and Ruby constants |
| Pink | Ruby `:symbols` and `key:` hash keys |
| Purple | `@instance` variables, properties, HTML attributes, JSON/YAML keys |
| Peach | `true`, `false`, `nil`, `self`, and the `#{}` / `${}` markers |
| Cyan | operators and CSS property names |
| Coral | HTML and HAML tags |

JSON keys change colour with nesting depth, and brackets cycle through six colours so pairs are easy to match.

## Icons

Rails folders such as `models`, `controllers`, `views`, `services`, `jobs`, `initializers`, `migrate`, `locales` and `test` each have their own folder icon. Files are matched by name first (`routes.rb`, `schema.rb`, `seeds.rb`, `database.yml`, `Gemfile`, `Procfile`, `.rubocop.yml` and common initializers), then by extension.

VS Code matches icons by a file or folder's own name, not its path. A file inside `config/initializers` that isn't listed by name shows the Ruby icon, and the folder shows that it's an initializer.

Brand logos come from [Simple Icons](https://simpleicons.org) (CC0). Logos are trademarks of their respective owners.

## RubyMine shortcuts

Some examples:

| Shortcut | Action |
|---|---|
| ⇧⌘O | Go to File |
| ⌘O | Go to Class / Symbol |
| ⇧⌘A | Find Action |
| ⌘B | Go to Declaration |
| ⌥F7 | Find Usages |
| ⇧⌘T | Jump between a file and its test (Ruby LSP) |
| ⌘D | Duplicate Line |
| ⌃G | Add Next Occurrence |
| ⇧F6 | Rename |
| ⌥⌘L | Reformat Code |
| ⌥↩ | Show Context Actions |
| ⌘F8 | Toggle Breakpoint |
| F8 / F7 / ⇧F8 | Step Over / Into / Out |

These replace some VS Code defaults (for example ⌘P becomes Parameter Info, so Quick Open is ⇧⌘O). To turn the whole keymap off, set `abdullahsTheme.rubymineKeymap` to `false`.

## UI tweaks (optional)

A colour theme can't change VS Code's layout, so the UI tweaks work by adding CSS to VS Code's own `workbench.html`:

- **Abdullah's Theme: Enable UI Tweaks** adds the CSS. Quit and reopen VS Code afterwards.
- **Abdullah's Theme: Disable UI Tweaks** removes it.

VS Code will then say the installation is "corrupt", because one of its files changed. That's expected; choose **Don't show again**. VS Code updates remove the tweaks, and the extension offers to re-apply them.

## Extension settings

| Setting | Default | Description |
|---|---|---|
| `abdullahsTheme.rubymineKeymap` | `true` | Use RubyMine (macOS) keyboard shortcuts. |

## Development

- `npm run build:icons` rebuilds `icons/` from `scripts/build-icons.js`.
- `npm run build:keymap` writes the shortcuts in `scripts/build-keymap.js` into `package.json`.
- The extension logo is `images/icon.png`, rendered from `scripts/extension-icon.svg`.
