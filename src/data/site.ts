/**
 * All of the site's text and links live in this file.
 *
 * Components import from here instead of hardcoding copy, so editing this
 * file is enough to update the landing page. Every placeholder link is marked
 * with a TODO comment.
 */

export interface SiteLink {
  label: string;
  href: string;
}

export interface ChecklistItem {
  /** Short bold lead-in. */
  lead: string;
  /** Optional supporting sentence. */
  text?: string;
}

/* -------------------------------------------------------------------------- */
/*  Links                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Every outbound link is defined here exactly once.
 */
export const links = {
  github: 'https://github.com/WAPerera/Prompt-pad',
  releases: 'https://github.com/WAPerera/Prompt-pad/releases',
  /** Always points at the newest published release. */
  download: 'https://github.com/WAPerera/Prompt-pad/releases/latest',
  coffee: 'https://ko-fi.com/arjxnp',
} as const;

/* -------------------------------------------------------------------------- */
/*  Site content                                                               */
/* -------------------------------------------------------------------------- */

export const site = {
  name: 'Prompt Pad',

  seo: {
    title: 'Prompt Pad — A simple prompt manager for Windows',
    description:
      'Prompt Pad is a small, fast desktop app for Windows. Keep your prompts in folders, find them instantly, and copy them to your clipboard with a single click.',
    locale: 'en_US',
  },

  nav: {
    home: { label: 'Prompt Pad', href: '#top' },
    /** Accessible name for the navigation landmark. */
    ariaLabel: 'Primary',
    links: [
      { label: 'Privacy', href: '#privacy' },
      { label: 'GitHub', href: links.github },
    ] as SiteLink[],
    cta: { label: 'Download for Windows', href: links.download },
  },

  hero: {
    headline: 'Your AI prompts, always at hand.',
    subheadline:
      'A fast, local prompt manager for Windows. Save them once, find them instantly, and reuse them in one click.',
    primaryCta: { label: 'Download for Windows', href: links.download },
    secondaryCta: { label: 'View on GitHub', href: links.github },
    note: 'Free · No account needed · Works offline',
    screenshot: {
      /** Text shown in the synthetic title bar (placeholder state only). */
      windowTitle: 'Prompt Pad',
      alt: 'The Prompt Pad window, with folders in the left sidebar and a prompt titled Scan Design System open in the editor.',
      /** Label inside the placeholder box if the screenshot is ever removed. */
      placeholderLabel: 'Main window screenshot',
    },
  },

  prototype: {
    eyebrow: 'Interactive prototype',
    title: 'Try the prototype',
    intro:
      'The real Prompt Pad window, rebuilt for the browser. Create prompts and folders, search, edit, copy, and delete — all in this page.',
    note: 'Prototype only — changes stay in this page and reset when you reload.',
    noscript:
      'The interactive prototype needs JavaScript. The rest of the page works without it.',
    labels: {
      appName: 'Prompt Pad',
      searchPlaceholder: 'search',
      searchLabel: 'Search prompts',
      quickPrompts: 'Quick prompts',
      folders: 'Folders',
      addPrompt: 'Add prompt',
      addFolder: 'Add folder',
      addPromptToFolder: 'Add prompt to {folder}',
      newFolderPlaceholder: 'New folder',
      untitledFolder: 'Untitled folder',
      buyMeCoffee: 'Buy me a coffee',
      untitled: 'Untitled prompt',
      titleLabel: 'Prompt title',
      bodyLabel: 'Prompt text',
      newPromptLabel: 'New prompt',
      deletePrompt: 'Delete prompt',
      copy: 'Copy',
      copied: 'Copied',
      addHeading: 'Add a heading',
      bodyPlaceholder: 'Type your prompt here...',
      save: 'Save',
      emptyTitle: 'Your Prompt Pad is empty',
      emptyText: 'Create your first prompt or folder to get started.',
      createPrompt: 'Create Prompt',
      createFolder: 'Create Folder',
    },
    folders: [{ id: 'design-workflow', name: 'Design Workflow' }],
    prompts: [
      {
        id: 'scan-design-system',
        folderId: null,
        title: 'Scan Design System',
        body: 'scan this design system file > [Design System]\n-Setup Figma CLI for this project\n-Update the club member app > Member signup flow\nONLY with this design system\n-Do not hard code components use the existing design components and variables using code connect\n-give me a report of the linked components to the prototype',
      },
      {
        id: 'seed-to-design',
        folderId: null,
        title: 'Seed to Design',
        body: 'Start the design from the seed file, using only the design system.\n-Keep tokens, components and variables in sync\n-Do not create new components unless the flow needs it',
      },
      {
        id: 'member-signup',
        folderId: 'design-workflow',
        title: 'Member signup flow',
        body: 'Map the member signup flow end to end.\n-List every screen and its states\n-Use the existing form components\n-Call out anything that needs a new component',
      },
      {
        id: 'audit-components',
        folderId: 'design-workflow',
        title: 'Audit components',
        body: 'Audit the club member app against the design system.\n-List components that drift from the library\n-Report hard-coded values\n-Suggest the right variables to link',
      },
    ],
    /** The prompt opened on load, so the demo starts on a filled editor. */
    defaultPromptId: 'scan-design-system',
  },

  privacy: {
    title: 'Your prompts stay yours',
    intro:
      'Prompt Pad keeps everything on your computer. No sign-up, no tracking, no surprises.',
    checklist: [
      {
        lead: 'Stored locally.',
        text: 'Your prompts and folders live on your device only.',
      },
      {
        lead: 'No accounts.',
        text: 'Just open the app and start.',
      },
      {
        lead: 'No telemetry, no analytics, no tracking.',
      },
      {
        lead: 'Minimal internet use.',
        text: 'The app only checks GitHub Releases for updates, at startup and when you press "Check for updates".',
      },
      {
        lead: 'You control your backups.',
        text: 'Export and import only touch the file you choose.',
      },
      {
        lead: 'Automatic safety snapshot.',
        text: 'Before an import replaces your data, the app saves a backup locally on your device. It is never uploaded.',
      },
    ] as ChecklistItem[],
  },

  download: {
    title: 'Ready to try Prompt Pad?',
    text: "Download the latest version for Windows. It's free, small, and quick to set up.",
    cta: { label: 'Download from GitHub Releases', href: links.releases },
    /** TODO: Verify the system requirements for your current release. */
    note: 'Requires Windows 10 or newer with WebView2.',
    support: {
      text: 'Enjoying Prompt Pad?',
      link: { label: '☕ Buy me a coffee', href: links.coffee },
    },
  },

  footer: {
    description: 'Prompt Pad, a simple prompt manager for Windows.',
    /** Accessible name for the footer navigation landmark. */
    ariaLabel: 'Footer',
    links: [
      { label: 'GitHub', href: links.github },
      { label: 'Releases', href: links.releases },
      { label: 'Privacy', href: '#privacy' },
      { label: 'Buy me a coffee', href: links.coffee },
    ] as SiteLink[],
    bottom: 'Made with care. No tracking, ever.',
  },

  /** Small strings used by assistive technology and UI controls. */
  a11y: {
    skipToContent: 'Skip to content',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
  },
};
