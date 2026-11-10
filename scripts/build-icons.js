#!/usr/bin/env node
// Builds Abdullah's file icon theme.
//
//   npm run build:icons
//
// - Brand logos come from simple-icons (node_modules/simple-icons/icons/*.svg).
// - Concepts that have no brand (initializers, migrations, models, secrets, ...)
//   use the hand-drawn glyphs in GLYPHS below, in a matching line style.
// - Every folder icon is a solid folder shape with the glyph cut into it in black,
//   so it always reads as a folder first.
//
// Output: icons/*.svg and icons/abdullahs-icon-theme.json (both generated; edit this file instead).

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'icons');
const SIMPLE_ICONS = path.join(ROOT, 'node_modules', 'simple-icons', 'icons');

// ---------------------------------------------------------------------------
// Palette (same as the colour theme)
// ---------------------------------------------------------------------------
const C = {
	red: '#ff4050',
	coral: '#ff6b7f',
	orange: '#ff8b39',
	peach: '#ffb454',
	gold: '#ffd75e',
	green: '#a5e075',
	teal: '#4fd6be',
	cyan: '#89ddff',
	blue: '#6cb6ff',
	purple: '#c58cff',
	pink: '#ff79c6',
	white: '#d4d4d4',
	grey: '#9aa4ae',
	dim: '#7d8590'
};

// ---------------------------------------------------------------------------
// Hand-drawn glyphs: 24x24 line icons. `c` = colour, `w` = stroke width.
// ---------------------------------------------------------------------------
const line = (body) => (c, w) =>
	`<g fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round">${body}</g>`;

const GLYPHS = {
	file: line('<path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z"/><path d="M14 3v5h5"/>'),
	doc: line('<path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z"/><path d="M14 3v5h5M8.5 13h7M8.5 17h5"/>'),
	database: line('<ellipse cx="12" cy="5.5" rx="7.5" ry="3"/><path d="M4.5 5.5v13c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-13M4.5 12c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3"/>'),
	sliders: line('<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>'),
	power: line('<path d="M12 3v8"/><path d="M6.3 7.2a8 8 0 1 0 11.4 0"/>'),
	key: line('<circle cx="8" cy="15" r="4.5"/><path d="M11.2 11.8 20 3M16.5 6.5l3 3M14 9l2 2"/>'),
	lock: line('<rect x="4.5" y="10.5" width="15" height="10.5" rx="2"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>'),
	globe: line('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>'),
	translate: line('<path d="M3 5h9M7.5 3v2M5 5c1 3.5 3.5 6 6.5 7.5M10 5c-1 3.5-3.5 6-7 7.5"/><path d="m12 21 4.5-10 4.5 10M13.6 17.5h5.8"/>'),
	route: line('<path d="M12 3v18M12 5h6.5l2 2.5-2 2.5H12M12 12H5.5l-2 2.5 2 2.5H12"/>'),
	migrate: line('<path d="M4 17l8 4 8-4M4 12.5l8 4 8-4"/><path d="M12 3v9M8.5 6.5 12 3l3.5 3.5"/>'),
	table: line('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9.5h18M3 14.75h18M9.5 9.5V20"/>'),
	sprout: line('<path d="M12 21v-9"/><path d="M12 12C12 7.5 8.5 5 4 5c0 4.5 3.5 7 8 7zM12 14c0-4 3-6.5 8-6.5 0 4-3 6.5-8 6.5z"/>'),
	flask: line('<path d="M9 3h6M10 3v6.2L4.6 18.4A1.7 1.7 0 0 0 6.1 21h11.8a1.7 1.7 0 0 0 1.5-2.6L14 9.2V3"/><path d="M7 15h10"/>'),
	factory: line('<path d="M3 21h18M4 21V11l5 3v-3l5 3V4h5v17"/>'),
	clipboard: line('<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/>'),
	wrench: line('<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94z"/>'),
	mail: line('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>'),
	clock: line('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>'),
	cube: line('<path d="M12 2.8 20 7.2v9.6L12 21.2 4 16.8V7.2z"/><path d="M4 7.2l8 4.4 8-4.4M12 11.6v9.6"/>'),
	gamepad: line('<path d="M6 11h4M8 9v4M15 12h.01M18 10h.01"/><path d="M17.3 5H6.7a4 4 0 0 0-3.98 3.6l-.7 6.9A2.6 2.6 0 0 0 4.6 18.3c1 0 1.9-.6 2.3-1.5L8 15h8l1.1 1.8c.4.9 1.3 1.5 2.3 1.5a2.6 2.6 0 0 0 2.6-2.8l-.7-6.9A4 4 0 0 0 17.3 5z"/>'),
	eye: line('<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>'),
	briefcase: line('<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8.5 7V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2M3 12.5h18"/>'),
	shield: line('<path d="M12 3 4.5 6v5.5c0 4.7 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.8 7.5-9.5V6z"/>'),
	shieldCheck: line('<path d="M12 3 4.5 6v5.5c0 4.7 3.2 8.2 7.5 9.5 4.3-1.3 7.5-4.8 7.5-9.5V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>'),
	sheet: line('<rect x="3.5" y="3.5" width="17" height="17" rx="2"/><path d="M3.5 9h17M3.5 14.5h17M9.5 3.5v17"/>'),
	upload: line('<path d="M12 15V3M7 8l5-5 5 5"/><path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4"/>'),
	form: line('<rect x="3.5" y="4" width="17" height="6" rx="1.5"/><rect x="3.5" y="14" width="17" height="6" rx="1.5"/><path d="M6.5 7h5M6.5 17h3"/>'),
	terminal: line('<rect x="2.5" y="4" width="19" height="16" rx="2"/><path d="m6.5 9 3 3-3 3M12 15h5"/>'),
	book: line('<path d="M4 19.5V5a2 2 0 0 1 2-2h14v15H6a2 2 0 0 0-2 2 2 2 0 0 0 2 2h14"/>'),
	box: line('<path d="M3.5 7.5 12 3l8.5 4.5v9L12 21l-8.5-4.5z"/><path d="M3.5 7.5 12 12l8.5-4.5M12 12v9M7.8 5.2l8.5 4.6"/>'),
	list: line('<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>'),
	hourglass: line('<path d="M6 3h12M6 21h12M7.5 3v2.5c0 2.3 4.5 4.2 4.5 6.5 0-2.3 4.5-4.2 4.5-6.5V3M7.5 21v-2.5c0-2.3 4.5-4.2 4.5-6.5 0 2.3 4.5 4.2 4.5 6.5V21"/>'),
	image: line('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>'),
	font: line('<path d="m4 21 7-18h2l7 18M7 14h10"/>'),
	plug: line('<path d="M9 2v5M15 2v5M6 7h12v4a6 6 0 0 1-12 0zM12 17v5"/>'),
	presentation: line('<path d="M3 4h18M4.5 4v10.5a1.5 1.5 0 0 0 1.5 1.5h12a1.5 1.5 0 0 0 1.5-1.5V4M12 16v4M8.5 21l3.5-1 3.5 1M8 11.5l3-3 2.5 2L16.5 7"/>'),
	drop: line('<path d="M12 3s6.5 7 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 10 12 3 12 3z"/>'),
	checklist: line('<path d="M10 6h11M10 12h11M10 18h11"/><path d="m3 6 1.5 1.5L7 5M3 12l1.5 1.5L7 11M3 18l1.5 1.5L7 17"/>'),
	flag: line('<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>'),
	certificate: line('<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M7 8.5h10M7 12h5"/><circle cx="16" cy="15.5" r="2.5"/><path d="m14.8 17.6-.8 3.9 2-1 2 1-.8-3.9"/>'),
	braces: line('<path d="M8 4c-2.5 0-3 1-3 3v2c0 1.5-.8 3-2.5 3 1.7 0 2.5 1.5 2.5 3v2c0 2 .5 3 3 3M16 4c2.5 0 3 1 3 3v2c0 1.5.8 3 2.5 3-1.7 0-2.5 1.5-2.5 3v2c0 2-.5 3-3 3"/>'),
	code: line('<path d="m8 6-6 6 6 6M16 6l6 6-6 6M13.5 4l-3 16"/>'),
	layers: line('<path d="M12 3 2.5 8 12 13l9.5-5z"/><path d="M2.5 12.5 12 17.5l9.5-5M2.5 16.5 12 21.5l9.5-5"/>'),
	chart: line('<path d="M3 21h18M5.5 17v-5M10 17V6M14.5 17v-7M19 17V9"/>'),
	share: line('<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6"/>'),
	sparkle: line('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>'),
	link: line('<path d="M10 13.5a4.5 4.5 0 0 0 6.4.4l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.5 1.5M14 10.5a4.5 4.5 0 0 0-6.4-.4l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.5-1.5"/>'),
	lifebuoy: line('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="m5.6 5.6 3.6 3.6M14.8 14.8l3.6 3.6M14.8 9.2l3.6-3.6M5.6 18.4l3.6-3.6"/>'),
	rocket: line('<path d="M12 15c5-3.5 8-7.5 8-12-4.5 0-8.5 3-12 8z"/><path d="M8 11H4l2.5-4H11M13 16v4l4-2.5V13M9 15c-2 0-4 1.5-4.5 5 3.5-.5 5-2.5 5-4.5"/>'),
	bolt: line('<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>'),
	tag: line('<path d="M3 12V4.5A1.5 1.5 0 0 1 4.5 3H12l9 9-9 9z"/><circle cx="7.5" cy="7.5" r="1.5"/>'),
	pdf: line('<path d="M14 3H6.5A1.5 1.5 0 0 0 5 4.5v15A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5V8z"/><path d="M14 3v5h5M8 17v-4h1.5a1.25 1.25 0 0 1 0 2.5H8M12.5 17v-4h1a2 2 0 0 1 0 4zM16.5 13h-1v4M15.5 15h1"/>'),
	gem: line('<path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M12 21 8 9l4-6 4 6z"/>'),
	gear: line('<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/><circle cx="12" cy="12" r="6.5"/>')
};

// ---------------------------------------------------------------------------
// Icons: name -> [glyph, colour]. A glyph is a GLYPHS key or 'si:<slug>' (simple-icons).
// ---------------------------------------------------------------------------
const ICONS = {
	// brands
	ruby: ['si:ruby', C.red],
	rails: ['si:rubyonrails', C.coral],
	rubygems: ['si:rubygems', C.red],
	rubocop: ['si:rubocop', C.white],
	javascript: ['si:javascript', C.gold],
	typescript: ['si:typescript', C.blue],
	json: ['si:json', C.peach],
	yaml: ['si:yaml', C.coral],
	sass: ['si:sass', C.pink],
	css: ['si:css', C.blue],
	html: ['si:html5', C.orange],
	markdown: ['si:markdown', C.white],
	mysql: ['si:mysql', C.blue],
	sqlite: ['si:sqlite', C.blue],
	redis: ['si:redis', C.red],
	docker: ['si:docker', C.blue],
	git: ['si:git', C.orange],
	github: ['si:github', C.white],
	githubactions: ['si:githubactions', C.blue],
	dependabot: ['si:dependabot', C.blue],
	npm: ['si:npm', C.red],
	yarn: ['si:yarn', C.blue],
	node: ['si:nodedotjs', C.green],
	esbuild: ['si:esbuild', C.gold],
	eslint: ['si:eslint', C.purple],
	prettier: ['si:prettier', C.pink],
	babel: ['si:babel', C.gold],
	postcss: ['si:postcss', C.coral],
	stylelint: ['si:stylelint', C.white],
	stimulus: ['si:stimulus', C.gold],
	hotwire: ['si:hotwire', C.peach],
	puma: ['si:puma', C.coral],
	opensearch: ['si:opensearch', C.blue],
	honeybadger: ['si:honeybadger', C.orange],
	datadog: ['si:datadog', C.purple],
	claude: ['si:claude', C.orange],
	dotenv: ['si:dotenv', C.gold],
	bash: ['si:gnubash', C.green],
	svg: ['si:svg', C.peach],
	xml: ['si:xml', C.orange],
	toml: ['si:toml', C.grey],
	editorconfig: ['si:editorconfig', C.white],
	vscode: ['si:vscodium', C.blue],
	jetbrains: ['si:jetbrains', C.pink],
	graphql: ['si:graphql', C.pink],
	googlechat: ['si:googlechat', C.green],
	xero: ['si:xero', C.cyan],

	// concepts (hand-drawn)
	file: ['file', C.grey],
	doc: ['doc', C.grey],
	readme: ['book', C.blue],
	database: ['database', C.blue],
	config: ['sliders', C.grey],
	settings: ['gear', C.grey],
	initializer: ['power', C.teal],
	environment: ['layers', C.green],
	secret: ['key', C.gold],
	lock: ['lock', C.peach],
	certificate: ['certificate', C.green],
	locale: ['translate', C.teal],
	routes: ['route', C.purple],
	migration: ['migrate', C.orange],
	schema: ['table', C.blue],
	seeds: ['sprout', C.green],
	test: ['flask', C.green],
	factory: ['factory', C.green],
	fixture: ['clipboard', C.green],
	helper: ['wrench', C.cyan],
	mailer: ['mail', C.pink],
	job: ['clock', C.purple],
	model: ['cube', C.orange],
	controller: ['gamepad', C.blue],
	view: ['eye', C.teal],
	service: ['briefcase', C.gold],
	policy: ['shield', C.coral],
	validator: ['shieldCheck', C.green],
	pdf: ['pdf', C.red],
	spreadsheet: ['sheet', C.green],
	uploader: ['upload', C.cyan],
	formobj: ['form', C.purple],
	terminal: ['terminal', C.green],
	vendor: ['box', C.grey],
	log: ['list', C.dim],
	tmp: ['hourglass', C.dim],
	image: ['image', C.purple],
	font: ['font', C.pink],
	channel: ['plug', C.peach],
	presenter: ['presentation', C.teal],
	liquid: ['drop', C.blue],
	rake: ['checklist', C.red],
	flags: ['flag', C.peach],
	api: ['braces', C.peach],
	markup: ['code', C.orange],
	haml: ['code', C.gold],
	erb: ['code', C.coral],
	sql: ['database', C.gold],
	chart: ['chart', C.purple],
	shared: ['share', C.cyan],
	generator: ['sparkle', C.gold],
	integration: ['link', C.cyan],
	support: ['lifebuoy', C.coral],
	deploy: ['rocket', C.orange],
	procfile: ['bolt', C.purple],
	version: ['tag', C.peach],
	gem: ['gem', C.red],
	public: ['globe', C.cyan],
	example: ['doc', C.dim],
	text: ['doc', C.white],
	audit: ['clipboard', C.peach]
};

// ---------------------------------------------------------------------------
// Folders: icon name -> folder names (matched on the folder's own name).
// The folder colour comes from the icon.
// ---------------------------------------------------------------------------
const FOLDERS = {
	rails: ['app'],
	model: ['models', 'concerns'],
	controller: ['controllers'],
	view: ['views', 'layouts', 'partials', 'shared_views'],
	helper: ['helpers'],
	mailer: ['mailers', 'mail', 'mailer'],
	job: ['jobs', 'workers', 'cron', 'schedule'],
	service: ['services', 'interactors', 'operations', 'queries'],
	policy: ['policies'],
	validator: ['validators'],
	formobj: ['forms'],
	presenter: ['presenters', 'decorators', 'serializers'],
	uploader: ['uploaders', 'uploads', 'storage', 'shrine'],
	pdf: ['pdfs', 'prawn'],
	spreadsheet: ['xlsxs', 'csvs', 'spreadsheets'],
	liquid: ['drops'],
	channel: ['channels'],
	config: ['config', 'configs', 'support_user_config'],
	initializer: ['initializers'],
	environment: ['environments', 'envs'],
	locale: ['locales', 'locale', 'i18n', 'translations'],
	routes: ['routes'],
	flags: ['settings', 'capabilities', 'features'],
	database: ['db', 'database', 'data', 'dynamic_data'],
	migration: ['migrate', 'migrations'],
	seeds: ['seeds'],
	rake: ['tasks', 'rake', 'data_fix', 'migrations_tasks'],
	test: ['test', 'tests', 'spec', 'specs'],
	factory: ['factories'],
	fixture: ['fixtures'],
	integration: ['integration', 'integrations', 'system', 'ezy_vet', 'nfsdx', 'ms_teams', 'slack'],
	support: ['support'],
	terminal: ['bin', 'script', 'scripts'],
	readme: ['docs', 'doc', 'documentation', 'onboarding'],
	vendor: ['vendor', 'lib', 'assets'],
	log: ['log', 'logs', 'data_import_log'],
	tmp: ['tmp', 'temp', 'cache'],
	public: ['public'],
	image: ['images', 'img', 'icons'],
	font: ['fonts'],
	javascript: ['javascript', 'javascripts', 'js'],
	sass: ['stylesheets', 'styles', 'scss', 'css'],
	esbuild: ['builds'],
	api: ['api', 'v1', 'v2', 'entities'],
	chart: ['reports'],
	shared: ['shared'],
	generator: ['generators'],
	deploy: ['deployment', 'deploy', 'lambda_functions'],
	secret: ['team_ssh', 'keys', 'credentials'],
	npm: ['node_modules'],
	rubygems: ['.bundle', 'gems', '.gem_rbs_collection'],
	ruby: ['.ruby-lsp', 'core_extensions'],
	git: ['.git'],
	github: ['.github'],
	githubactions: ['workflows'],
	audit: ['ISSUE_TEMPLATE', 'PULL_REQUEST_TEMPLATE', 'instructions'],
	claude: ['.claude'],
	vscode: ['.vscode'],
	jetbrains: ['.idea']
};

// ---------------------------------------------------------------------------
// Files by exact name (wins over extension). Includes Rails conventions and
// this project's well-known initializers / config files.
// ---------------------------------------------------------------------------
const FILE_NAMES = {
	// Rails app files
	routes: ['routes.rb'],
	schema: ['schema.rb', 'structure.sql', 'schema.yml'],
	seeds: ['seeds.rb'],
	database: ['database.yml', 'storage.yml'],
	rails: ['application.rb', 'environment.rb', 'config.ru', 'application_record.rb', 'application_controller.rb', 'application_job.rb', 'application_mailer.rb', 'application_helper.rb'],
	initializer: ['boot.rb', 'inflections.rb', 'constants.rb', 'config.rb', 'version.rb', 'wrap_parameters.rb', 'mime_types.rb', 'backtrace_silencers.rb', 'application_controller_renderer.rb', 'new_framework_defaults_5_2.rb', '00_require_secret_key_base.rb', 'cookies_serializer.rb'],
	secret: ['secrets.yml', 'secrets.yml.example', 'master.key', 'credentials.yml.example', 'credentials.yml.enc', 'ldap.yml', 'omniauth.rb', 'devise.rb', 'custom_authentication.rb', 'team_ssh', 'team_ssh.pub', 'id_rsa', 'id_rsa.pub', 'id_ed25519', 'id_ed25519.pub'],
	lock: ['Gemfile.lock', 'session_store.rb', 'filter_parameter_logging.rb'],
	policy: ['content_security_policy.rb', 'permissions_policy.rb', 'CODEOWNERS', 'brakeman.ignore', '.bundler-audit.yml', 'unsafe_redirect_notifications.rb'],
	flags: ['capabilities.yml', 'settings.yml', 'feature_flags.yml'],
	version: ['version.yml', '.ruby-version', '.node-version', '.nvmrc', '.tool-versions', '.ruby-gemset'],
	puma: ['puma.rb'],
	job: ['delayed_job_config.rb', 'delayed_job_overrides.rb', 'cron_delayed_job_overrides.rb', 'analyze_job.rb', 'schedule.rb', 'schedule.rb.example', 'performable_method_overrides.rb'],
	mailer: ['mail.rb'],
	api: ['grape.rb', 'api_docs_config_js.rb'],
	uploader: ['shrine.rb', 'shrine_storage.rb'],
	pdf: ['prawn.rb', 'prawn_patches.rb', 'submission_pdf.rb'],
	log: ['semantic_logger.rb', 'active_record_query_trace.rb'],
	chart: ['chartkick.rb', 'ahoy.rb', 'impression.rb'],
	channel: ['cable.yml', 'private_pub.yml'],
	image: ['assets.rb'],
	locale: ['liquid_translation.rb', 'american_date_patches.rb', 'phonelib.rb'],
	audit: ['audited.rb', 'audited_archival_methods.rb', 'anonymiser_coverage.yml'],
	opensearch: ['open_search.rb', 'opensearch.yml'],
	redis: ['redis.rb', 'redis_mutex.rb', 'redis.yml', 'dump.rdb'],
	datadog: ['datadog.rb', 'datadog.yml'],
	honeybadger: ['honeybadger.yml', 'honeybadger.rb'],
	test: ['test_helper.rb', 'application_system_test_case.rb', 'spec_helper.rb', 'rails_helper.rb', '.rspec', '.vscode-test.mjs'],

	// Ruby tooling
	rubygems: ['Gemfile', 'gems.rb', '.gemrc'],
	rake: ['Rakefile', 'rakefile'],
	rubocop: ['.rubocop.yml', '.rubocop_todo.yml', '.rubocop_strict.yml', '.hound.yml'],
	ruby: ['.irbrc', '.pryrc', '.active_record_doctor.rb', '.annotaterb.yml', 'Guardfile'],
	procfile: ['Procfile', 'Procfile.dev'],
	git: ['.gitignore', '.gitattributes', '.gitmodules', '.git-blame-ignore-revs', '.gitkeep', '.keep', '.overcommit.yml'],
	github: ['pull_request_template.md', 'copilot-instructions.md', 'copilot-review-instructions.md', 'labeler.yml'],
	dependabot: ['dependabot.yml'],

	// JS tooling
	npm: ['package.json', 'package-lock.json', '.npmrc'],
	yarn: ['yarn.lock', '.yarnrc', '.yarnrc.yml'],
	esbuild: ['esbuild.config.js', 'esbuild.config.mjs'],
	eslint: ['eslint.config.mjs', 'eslint.config.js', '.eslintrc', '.eslintrc.json', '.eslintrc.js', '.eslintignore'],
	prettier: ['.prettierrc', '.prettierrc.json', 'prettier.config.js', '.prettierignore'],
	babel: ['babel.config.js', '.babelrc'],
	postcss: ['postcss.config.js'],
	stylelint: ['.stylelintrc', '.stylelintrc.json'],
	node: ['.browserslistrc', 'jsconfig.json', 'tsconfig.json'],

	// Misc
	docker: ['Dockerfile', 'docker-compose.yml', 'docker-compose.yaml', 'compose.yml', '.dockerignore'],
	dotenv: ['.env', '.env.local', '.env.development', '.env.test', '.env.production', '.env.example'],
	readme: ['README.md', 'README', 'CHANGELOG.md', 'CONTRIBUTING.md', 'LICENSE', 'LICENSE.md', 'vsc-extension-quickstart.md'],
	claude: ['CLAUDE.md', 'AGENTS.md', '.claudeignore'],
	editorconfig: ['.editorconfig'],
	vscode: ['.vscodeignore', 'extensions.json', 'launch.json', 'tasks.json', 'settings.json'],
	tmp: ['.DS_Store']
};

// ---------------------------------------------------------------------------
// Files by extension (fallback when the name has no match).
// ---------------------------------------------------------------------------
const FILE_EXTENSIONS = {
	ruby: ['rb', 'rbs', 'ru', 'gemspec', 'jbuilder', 'builder'],
	rake: ['rake'],
	haml: ['haml', 'html.haml'],
	erb: ['erb', 'html.erb', 'js.erb', 'text.erb'],
	liquid: ['liquid'],
	javascript: ['js', 'mjs', 'cjs'],
	typescript: ['ts', 'mts', 'cts', 'd.ts'],
	markup: ['jsx', 'tsx', 'vue'],
	json: ['json', 'jsonc', 'json5', 'map'],
	yaml: ['yml', 'yaml'],
	sass: ['scss', 'sass'],
	css: ['css'],
	html: ['html', 'htm'],
	markdown: ['md', 'markdown', 'mdx'],
	sql: ['sql', 'psql', 'mysql'],
	database: ['sqlite', 'sqlite3', 'db', 'rdb'],
	bash: ['sh', 'bash', 'zsh', 'fish'],
	svg: ['svg'],
	image: ['png', 'jpg', 'jpeg', 'gif', 'ico', 'webp', 'bmp', 'tif', 'tiff', 'avif'],
	pdf: ['pdf'],
	spreadsheet: ['xlsx', 'xls', 'csv', 'tsv', 'ods'],
	log: ['log'],
	lock: ['lock', 'enc'],
	certificate: ['pem', 'cer', 'crt', 'p12', 'pfx', 'der'],
	secret: ['key', 'pub', 'gpg', 'asc'],
	font: ['ttf', 'otf', 'woff', 'woff2', 'eot'],
	text: ['txt', 'rtf'],
	xml: ['xml', 'xsd', 'xsl', 'plist'],
	toml: ['toml'],
	graphql: ['graphql', 'gql'],
	example: ['example', 'sample', 'dist', 'bak', 'orig'],
	config: ['ini', 'cfg', 'conf', 'properties'],
	vscode: ['code-workspace', 'vsix'],
	docker: ['dockerfile'],
	test: ['test.js', 'spec.js', 'test.ts', 'spec.ts']
};

// Language IDs (used when neither name nor extension matched).
const LANGUAGE_IDS = {
	ruby: ['ruby'],
	haml: ['haml'],
	erb: ['erb'],
	javascript: ['javascript'],
	typescript: ['typescript'],
	json: ['json', 'jsonc'],
	yaml: ['yaml'],
	sass: ['scss', 'sass'],
	css: ['css'],
	html: ['html'],
	markdown: ['markdown'],
	sql: ['sql'],
	bash: ['shellscript'],
	docker: ['dockerfile'],
	git: ['git-commit', 'git-rebase', 'ignore']
};

// ---------------------------------------------------------------------------
// SVG builders
// ---------------------------------------------------------------------------
function simpleIconPath(slug) {
	const file = path.join(SIMPLE_ICONS, `${slug}.svg`);
	if (!fs.existsSync(file)) {
		throw new Error(`simple-icons has no "${slug}" icon`);
	}
	const svg = fs.readFileSync(file, 'utf8');
	const d = svg.match(/<path d="([^"]+)"/);
	if (!d) {
		throw new Error(`Could not read path from ${file}`);
	}
	return d[1];
}

// Draws a glyph in a 24x24 box. `size` is the box the glyph should fill.
function glyph(name, colour, { x = 0, y = 0, size = 24, strokeWidth = 2 } = {}) {
	const scale = size / 24;
	if (name.startsWith('si:')) {
		// simple-icons are full-bleed; pull them in slightly so they match the line icons.
		const s = scale * 0.84;
		const off = (size - 24 * s) / 2;
		return `<g transform="translate(${r(x + off)} ${r(y + off)}) scale(${r(s)})"><path fill="${colour}" d="${simpleIconPath(name.slice(3))}"/></g>`;
	}
	const draw = GLYPHS[name];
	if (!draw) {
		throw new Error(`Unknown glyph "${name}"`);
	}
	return `<g transform="translate(${r(x)} ${r(y)}) scale(${r(scale)})">${draw(colour, strokeWidth)}</g>`;
}

const r = (n) => Math.round(n * 1000) / 1000;
const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">${body}</svg>\n`;

const FOLDER_CLOSED = 'M2 5.5A1.5 1.5 0 0 1 3.5 4H9l2 2h9.5A1.5 1.5 0 0 1 22 7.5v11a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 2 18.5z';
const FOLDER_OPEN_BACK = 'M2 5.5A1.5 1.5 0 0 1 3.5 4H9l2 2h8.5A1.5 1.5 0 0 1 21 7.5V9H6.2a2 2 0 0 0-1.9 1.4L2 17.5z';
const FOLDER_OPEN_FRONT = 'M4.3 10.4A2 2 0 0 1 6.2 9h16.3a1 1 0 0 1 .95 1.3l-2.9 8.3A2 2 0 0 1 18.65 20H2.4a1 1 0 0 1-.95-1.3z';

function fileIcon([g, colour]) {
	return svg(glyph(g, colour, { x: 1, y: 1, size: 22, strokeWidth: 2 }));
}

function folderIcon([g, colour], open) {
	const BLACK = '#000000';
	if (open) {
		const inner = g === 'folder' ? '' : glyph(g, BLACK, { x: 7.4, y: 9.9, size: 9.6, strokeWidth: 2.9 });
		return svg(`<path fill="${colour}" fill-opacity=".55" d="${FOLDER_OPEN_BACK}"/><path fill="${colour}" d="${FOLDER_OPEN_FRONT}"/>${inner}`);
	}
	const inner = g === 'folder' ? '' : glyph(g, BLACK, { x: 6.6, y: 7.9, size: 10.8, strokeWidth: 2.7 });
	return svg(`<path fill="${colour}" d="${FOLDER_CLOSED}"/>${inner}`);
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------
function build() {
	fs.rmSync(OUT, { recursive: true, force: true });
	fs.mkdirSync(OUT, { recursive: true });

	const defs = {};
	const define = (id, content) => {
		fs.writeFileSync(path.join(OUT, `${id}.svg`), content);
		defs[id] = { iconPath: `./${id}.svg` };
		return id;
	};

	const fileId = (name) => {
		if (!ICONS[name]) {
			throw new Error(`Unknown icon "${name}"`);
		}
		const id = `file_${name}`;
		return defs[id] ? id : define(id, fileIcon(ICONS[name]));
	};
	const folderId = (name, open) => {
		const spec = name === 'folder' ? ['folder', C.grey] : ICONS[name];
		if (!spec) {
			throw new Error(`Unknown icon "${name}"`);
		}
		const id = `folder_${name}${open ? '_open' : ''}`;
		return defs[id] ? id : define(id, folderIcon(spec, open));
	};

	const theme = {
		hidesExplorerArrows: false,
		iconDefinitions: defs,
		file: fileId('file'),
		folder: folderId('folder', false),
		folderExpanded: folderId('folder', true),
		rootFolder: folderId('folder', false),
		rootFolderExpanded: folderId('folder', true),
		folderNames: {},
		folderNamesExpanded: {},
		fileNames: {},
		fileExtensions: {},
		languageIds: {}
	};

	for (const [icon, names] of Object.entries(FOLDERS)) {
		for (const n of names) {
			theme.folderNames[n] = folderId(icon, false);
			theme.folderNamesExpanded[n] = folderId(icon, true);
		}
	}
	for (const [icon, names] of Object.entries(FILE_NAMES)) {
		for (const n of names) {
			theme.fileNames[n] = fileId(icon);
		}
	}
	for (const [icon, exts] of Object.entries(FILE_EXTENSIONS)) {
		for (const e of exts) {
			theme.fileExtensions[e] = fileId(icon);
		}
	}
	for (const [icon, ids] of Object.entries(LANGUAGE_IDS)) {
		for (const id of ids) {
			theme.languageIds[id] = fileId(icon);
		}
	}

	fs.writeFileSync(path.join(OUT, 'abdullahs-icon-theme.json'), JSON.stringify(theme, null, 2) + '\n');
	console.log(`Built ${Object.keys(defs).length} icons -> ${path.relative(ROOT, OUT)}/`);
	return { defs, theme };
}

if (require.main === module) {
	build();
}

module.exports = { build, ICONS, GLYPHS, C, fileIcon, folderIcon };
