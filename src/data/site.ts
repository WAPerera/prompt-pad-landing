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

export interface Feature {
  /** Emoji shown in the icon tile (decorative). */
  icon: string;
  title: string;
  text: string;
}

export interface ChecklistItem {
  /** Short bold lead-in. */
  lead: string;
  /** Optional supporting sentence. */
  text?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
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
      { label: 'Features', href: '#features' },
      { label: 'Privacy', href: '#privacy' },
      { label: 'FAQ', href: '#faq' },
      { label: 'GitHub', href: links.github },
    ] as SiteLink[],
    cta: { label: 'Download for Windows', href: links.download },
  },

  hero: {
    headline: 'Your prompts. Organized. One click away.',
    subheadline:
      'Prompt Pad is a small, fast desktop app for Windows. Keep your prompts in folders, find them instantly, and copy them to your clipboard with a single click.',
    primaryCta: { label: 'Download for Windows', href: links.download },
    secondaryCta: { label: 'View on GitHub', href: links.github },
    note: 'Free · No account needed · Works offline',
    screenshot: {
      /** Text shown in the mock app title bar. */
      windowTitle: 'Prompt Pad',
      /** TODO: Update this description to match your real screenshot. */
      alt: 'The Prompt Pad main window, showing folders on the left and a list of prompts on the right.',
      /** Label inside the placeholder box until a real screenshot is added. */
      placeholderLabel: 'Main window screenshot',
    },
  },

  features: {
    title: "Everything you need, nothing you don't",
    items: [
      {
        icon: '🔍',
        title: 'Instant search',
        text: 'Type and see results right away across all your prompts and folders.',
      },
      {
        icon: '📋',
        title: 'One-click copy',
        text: 'Click once and your prompt is on the clipboard, ready to paste anywhere.',
      },
      {
        icon: '📁',
        title: 'Folders',
        text: 'Group prompts by project or topic. Drag folders by their header to reorder them.',
      },
      {
        icon: '⚡',
        title: 'Quick prompts',
        text: "Not sure where it belongs? Save it as a quick prompt and sort it later.",
      },
      {
        icon: '✏️',
        title: 'Auto-save editing',
        text: 'Edit titles and text freely. Your changes are saved as you type.',
      },
      {
        icon: '🖱️',
        title: 'Row menu',
        text: 'Rename or delete with the ⋯ button or a right-click.',
      },
      {
        icon: '🛟',
        title: 'Safe deleting',
        text: 'Delete a folder and its prompts move to Quick prompts, so nothing gets lost.',
      },
      {
        icon: '💾',
        title: 'Backup and restore',
        text: 'Export everything to a plain JSON file and import it whenever you need.',
      },
      {
        icon: '🔄',
        title: 'Easy updates',
        text: 'Prompt Pad tells you when a new version is ready and updates from GitHub Releases.',
      },
      {
        icon: '🪟',
        title: 'Clean, light window',
        text: 'A frameless design with a custom title bar. Small, fast, and out of your way.',
      },
    ] as Feature[],
  },

  howItWorks: {
    title: 'Simple from the first minute',
    steps: [
      'Write or paste a prompt. Create a quick prompt or put it directly into a folder.',
      'Organize it. Make folders, rename them, and drag them into the order you like.',
      'Find it fast. Start typing in the search bar. Results appear instantly.',
      "Copy and use it. One click, and it's on your clipboard.",
    ],
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

  faq: {
    title: 'FAQ',
    items: [
      {
        question: 'Where are my prompts saved?',
        answer:
          'On your computer, inside the app\'s local storage. They are never sent anywhere.',
      },
      {
        question: 'Do I need an account?',
        answer: 'No. There is no sign-up and no login.',
      },
      {
        question: 'Does Prompt Pad work offline?',
        answer: 'Yes. The only internet use is the update check.',
      },
      {
        question: 'How do I back up my prompts?',
        answer:
          'Open Settings and choose Export. You get a plain JSON file you can store anywhere. To restore, choose Import.',
      },
      {
        question: 'What happens if I import a backup?',
        answer:
          'The file is checked first. Before your current data is replaced, the app creates an automatic local backup.',
      },
      {
        question: 'What happens when I delete a folder?',
        answer: "Its prompts move to Quick prompts, so you don't lose anything.",
      },
      {
        question: 'How do updates work?',
        answer:
          "At startup, Prompt Pad checks GitHub Releases. If there's a new version, you'll see a small notification bubble. You can also check manually in Settings.",
      },
      {
        question: 'Is it free?',
        answer: 'Yes. If you like it, you can support the project with a coffee.',
      },
    ] as FaqItem[],
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
