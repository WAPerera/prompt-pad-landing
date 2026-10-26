/**
 * Interactive Prompt Pad prototype.
 *
 * A dependency-free port of the real Prompt Pad app (Tauri + React), so the
 * landing page shows the actual interface and behaviour. State lives in memory
 * only: reloading the page restores the sample prompts.
 */

interface PrototypeFolder {
  id: string;
  name: string;
}

interface PrototypePrompt {
  id: string;
  folderId: string | null;
  title: string;
  body: string;
}

interface PrototypeLabels {
  untitled: string;
  untitledFolder: string;
  addPromptToFolder: string;
  copy: string;
  copied: string;
}

interface PrototypeConfig {
  labels: PrototypeLabels;
  folders: PrototypeFolder[];
  prompts: PrototypePrompt[];
  defaultPromptId: string | null;
}

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escape user-edited text before inserting it into generated markup. */
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => HTML_ESCAPES[character] ?? character);
}

/** Clipboard API with a fallback for browsers or contexts that block it. */
async function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall through to the legacy approach.
    }
  }

  const helper = document.createElement('textarea');
  helper.value = text;
  helper.setAttribute('readonly', '');
  helper.style.position = 'fixed';
  helper.style.top = '-1000px';
  document.body.appendChild(helper);
  helper.select();

  let copied = false;
  try {
    // Legacy fallback for browsers that block the async Clipboard API.
    // Typed locally to avoid the deprecation hint on Document.execCommand.
    const legacyDocument = document as unknown as {
      execCommand?: (commandId: string) => boolean;
    };
    copied = legacyDocument.execCommand?.('copy') ?? false;
  } catch {
    copied = false;
  }

  helper.remove();
  return copied;
}

/** `hidden` works via attribute only on SVG elements, so set it uniformly. */
function setHidden(element: Element, hidden: boolean): void {
  if (hidden) element.setAttribute('hidden', '');
  else element.removeAttribute('hidden');
}

let idCounter = 0;

function createId(): string {
  idCounter += 1;
  return `demo-${Date.now().toString(36)}-${idCounter}`;
}

const ICON_CHEVRON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg>`;
const ICON_PLUS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>`;

export function initPrototype(): void {
  const root = document.querySelector<HTMLElement>('[data-prototype]');
  if (!root) return;

  const dataElement = root.querySelector<HTMLScriptElement>('[data-prototype-data]');
  if (!dataElement?.textContent) return;

  const config = JSON.parse(dataElement.textContent) as PrototypeConfig;

  const quickRows = root.querySelector<HTMLElement>('[data-quick-rows]');
  const folderRows = root.querySelector<HTMLElement>('[data-folder-rows]');
  const searchInput = root.querySelector<HTMLInputElement>('[data-search]');
  const addPromptButton = root.querySelector<HTMLButtonElement>('[data-add-prompt]');
  const addFolderButton = root.querySelector<HTMLButtonElement>('[data-add-folder]');
  const createPromptButton = root.querySelector<HTMLButtonElement>('[data-create-prompt]');
  const createFolderButton = root.querySelector<HTMLButtonElement>('[data-create-folder]');
  const folderCreate = root.querySelector<HTMLElement>('[data-folder-create]');
  const newFolderInput = root.querySelector<HTMLInputElement>('[data-new-folder]');
  const emptyView = root.querySelector<HTMLElement>('[data-view-empty]');
  const detailView = root.querySelector<HTMLElement>('[data-view-detail]');
  const newView = root.querySelector<HTMLElement>('[data-view-new]');
  const titleInput = root.querySelector<HTMLInputElement>('[data-title]');
  const bodyInput = root.querySelector<HTMLTextAreaElement>('[data-body]');
  const deleteButton = root.querySelector<HTMLButtonElement>('[data-delete]');
  const copyButton = root.querySelector<HTMLButtonElement>('[data-copy]');
  const copyIcon = root.querySelector<HTMLElement>('[data-copy-icon]');
  const checkIcon = root.querySelector<HTMLElement>('[data-check-icon]');
  const copyLabel = root.querySelector<HTMLElement>('[data-copy-label]');
  const newTitleInput = root.querySelector<HTMLInputElement>('[data-new-title]');
  const newBodyInput = root.querySelector<HTMLTextAreaElement>('[data-new-body]');
  const saveButton = root.querySelector<HTMLButtonElement>('[data-save]');

  if (
    !quickRows ||
    !folderRows ||
    !searchInput ||
    !addPromptButton ||
    !addFolderButton ||
    !createPromptButton ||
    !createFolderButton ||
    !folderCreate ||
    !newFolderInput ||
    !emptyView ||
    !detailView ||
    !newView ||
    !titleInput ||
    !bodyInput ||
    !deleteButton ||
    !copyButton ||
    !copyIcon ||
    !checkIcon ||
    !copyLabel ||
    !newTitleInput ||
    !newBodyInput ||
    !saveButton
  ) {
    return;
  }

  let folders: PrototypeFolder[] = config.folders.map((folder) => ({ ...folder }));
  let prompts: PrototypePrompt[] = config.prompts.map((prompt) => ({ ...prompt }));

  let query = '';
  let expandedIds: string[] = [];
  let selectedId: string | null = prompts.some(
    (prompt) => prompt.id === config.defaultPromptId,
  )
    ? config.defaultPromptId
    : null;
  let draft: { folderId: string | null } | null = null;
  let isCreatingFolder = false;
  let newFolderName = '';
  let copiedTimer: number | undefined;
  /** Which prompt the detail view currently shows, so re-renders keep the caret. */
  let renderedPromptId: string | null = null;

  const getSelected = (): PrototypePrompt | null =>
    prompts.find((prompt) => prompt.id === selectedId) ?? null;

  const matchesQuery = (prompt: PrototypePrompt): boolean => {
    const normalized = query.trim().toLowerCase();
    return normalized.length === 0 || prompt.title.toLowerCase().includes(normalized);
  };

  const getQuickPrompts = (): PrototypePrompt[] =>
    prompts.filter((prompt) => prompt.folderId === null && matchesQuery(prompt));

  const getFolderEntries = () => {
    const normalized = query.trim().toLowerCase();

    return folders
      .map((folder) => {
        const folderPrompts = prompts.filter(
          (prompt) => prompt.folderId === folder.id && matchesQuery(prompt),
        );

        return {
          folder,
          prompts: folderPrompts,
          // While searching, open any folder that still has matching prompts.
          expanded:
            normalized.length > 0
              ? folderPrompts.length > 0
              : expandedIds.includes(folder.id),
        };
      })
      .filter(
        (entry) =>
          normalized.length === 0 ||
          entry.folder.name.toLowerCase().includes(normalized) ||
          entry.prompts.length > 0,
      );
  };

  const expandFolder = (folderId: string): void => {
    if (!expandedIds.includes(folderId)) expandedIds = [...expandedIds, folderId];
  };

  const rowMarkup = (prompt: PrototypePrompt, nested: boolean): string => {
    const isSelected = prompt.id === selectedId;
    const classes = ['app__row', nested ? 'app__row--nested' : '', isSelected ? 'is-selected' : '']
      .filter(Boolean)
      .join(' ');
    const title = prompt.title || config.labels.untitled;

    return `<button type="button" class="${classes}" data-select="${escapeHtml(
      prompt.id,
    )}"${isSelected ? ' aria-current="true"' : ''}><span>${escapeHtml(title)}</span></button>`;
  };

  const setCopied = (value: boolean): void => {
    setHidden(copyIcon, value);
    setHidden(checkIcon, !value);
    copyLabel.textContent = value ? config.labels.copied : config.labels.copy;
  };

  const renderSidebar = (): void => {
    quickRows.innerHTML = getQuickPrompts()
      .map((prompt) => rowMarkup(prompt, false))
      .join('');

    folderRows.innerHTML = getFolderEntries()
      .map((entry) => {
        const label = config.labels.addPromptToFolder.replace(
          '{folder}',
          entry.folder.name,
        );

        return `<div class="app__folder">
          <button type="button" class="app__folder-toggle" data-folder="${escapeHtml(
            entry.folder.id,
          )}" aria-expanded="${entry.expanded}">${ICON_CHEVRON}<span>${escapeHtml(
            entry.folder.name,
          )}</span></button>
          <button type="button" class="app__folder-add" data-add-to-folder="${escapeHtml(
            entry.folder.id,
          )}" aria-label="${escapeHtml(label)}">${ICON_PLUS}</button>
        </div>${
          entry.expanded
            ? `<div class="app__rows">${entry.prompts
                .map((prompt) => rowMarkup(prompt, true))
                .join('')}</div>`
            : ''
        }`;
      })
      .join('');
  };

  const renderView = (): void => {
    const selected = getSelected();
    const showNew = draft !== null;
    const showDetail = !showNew && selected !== null;

    setHidden(folderCreate, !isCreatingFolder);
    setHidden(newView, !showNew);
    setHidden(detailView, !showDetail);
    setHidden(emptyView, showNew || showDetail);

    if (showDetail && selected) {
      // Only refill when the open prompt changes, so typing keeps its caret.
      if (renderedPromptId !== selected.id) {
        titleInput.value = selected.title;
        bodyInput.value = selected.body;
        renderedPromptId = selected.id;
        setCopied(false);
      }
      return;
    }

    renderedPromptId = null;
  };

  const render = (): void => {
    renderSidebar();
    renderView();
  };

  const resetDraft = (): void => {
    draft = null;
    isCreatingFolder = false;
    newFolderName = '';
    newFolderInput.value = '';
  };

  const startPrompt = (folderId: string | null): void => {
    resetDraft();
    draft = { folderId };
    selectedId = null;
    newTitleInput.value = '';
    newBodyInput.value = '';
    saveButton.disabled = true;
    if (folderId) expandFolder(folderId);
    render();
    newTitleInput.focus();
  };

  const startFolder = (): void => {
    resetDraft();
    draft = { folderId: null };
    selectedId = null;
    isCreatingFolder = true;
    render();
    newFolderInput.focus();
  };

  const commitFolder = (): void => {
    const name = newFolderName.trim();
    if (!name) return;

    const folder: PrototypeFolder = { id: createId(), name };
    folders = [...folders, folder];
    expandFolder(folder.id);
    isCreatingFolder = false;
    draft = { folderId: folder.id };
    newFolderName = '';
    render();
    newTitleInput.focus();
  };

  const cancelFolder = (): void => {
    resetDraft();
    selectedId = null;
    render();
  };

  const selectPrompt = (promptId: string): void => {
    resetDraft();
    selectedId = promptId;

    const prompt = prompts.find((item) => item.id === promptId);
    if (prompt?.folderId) expandFolder(prompt.folderId);

    render();
  };

  const selectFolder = (folderId: string): void => {
    if (expandedIds.includes(folderId)) {
      expandedIds = expandedIds.filter((id) => id !== folderId);
      render();
      return;
    }

    expandFolder(folderId);

    // Don't yank the user out of an unsaved draft.
    if (draft) {
      render();
      return;
    }

    const openPromptIsInFolder = prompts.some(
      (prompt) => prompt.id === selectedId && prompt.folderId === folderId,
    );
    if (openPromptIsInFolder) {
      render();
      return;
    }

    const firstPrompt = prompts.find((prompt) => prompt.folderId === folderId);
    selectedId = firstPrompt ? firstPrompt.id : null;
    render();
  };

  const savePrompt = (): void => {
    if (!draft) return;

    let nextFolders = folders;
    let folderId = draft.folderId;

    // Saving the prompt while naming a folder creates that folder first.
    if (isCreatingFolder) {
      const folder: PrototypeFolder = {
        id: createId(),
        name: newFolderName.trim() || config.labels.untitledFolder,
      };
      nextFolders = [...folders, folder];
      folderId = folder.id;
    }

    const prompt: PrototypePrompt = {
      id: createId(),
      folderId,
      title: newTitleInput.value.trim(),
      body: newBodyInput.value,
    };

    folders = nextFolders;
    prompts = [...prompts, prompt];
    isCreatingFolder = false;
    newFolderName = '';
    draft = null;
    selectedId = prompt.id;
    if (folderId) expandFolder(folderId);

    render();
  };

  const deletePrompt = (): void => {
    const selected = getSelected();
    if (!selected) return;

    prompts = prompts.filter((prompt) => prompt.id !== selected.id);
    selectedId = null;
    render();
    addPromptButton.focus();
  };

  const handleCopy = async (): Promise<void> => {
    const selected = getSelected();
    if (!selected || !selected.body.trim()) return;

    const success = await copyText(selected.body);
    if (!success) {
      // Make the manual fallback easy: focus and select the prompt text.
      bodyInput.focus();
      bodyInput.select();
      return;
    }

    setCopied(true);
    if (copiedTimer !== undefined) window.clearTimeout(copiedTimer);
    copiedTimer = window.setTimeout(() => setCopied(false), 1600);
  };

  // --- Wiring -------------------------------------------------------------

  searchInput.addEventListener('input', () => {
    query = searchInput.value;
    render();
  });

  root.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const row = target.closest('[data-select]');
    if (row instanceof HTMLElement && row.dataset.select) {
      selectPrompt(row.dataset.select);
      return;
    }

    const addToFolder = target.closest('[data-add-to-folder]');
    if (
      addToFolder instanceof HTMLElement &&
      addToFolder.dataset.addToFolder
    ) {
      startPrompt(addToFolder.dataset.addToFolder);
      return;
    }

    const folder = target.closest('[data-folder]');
    if (folder instanceof HTMLElement && folder.dataset.folder) {
      selectFolder(folder.dataset.folder);
    }
  });

  newFolderInput.addEventListener('input', () => {
    newFolderName = newFolderInput.value;
  });

  newFolderInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitFolder();
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      cancelFolder();
    }
  });

  addPromptButton.addEventListener('click', () => startPrompt(null));
  addFolderButton.addEventListener('click', startFolder);
  createPromptButton.addEventListener('click', () => startPrompt(null));
  createFolderButton.addEventListener('click', startFolder);

  titleInput.addEventListener('input', () => {
    const selected = getSelected();
    if (!selected) return;

    selected.title = titleInput.value;
    renderSidebar();
  });

  bodyInput.addEventListener('input', () => {
    const selected = getSelected();
    if (!selected) return;

    selected.body = bodyInput.value;
  });

  newTitleInput.addEventListener('input', () => {
    saveButton.disabled = newTitleInput.value.trim().length === 0;
  });

  newView.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    resetDraft();
    render();
  });

  saveButton.addEventListener('click', savePrompt);
  deleteButton.addEventListener('click', deletePrompt);
  copyButton.addEventListener('click', () => void handleCopy());

  setCopied(false);
  render();
}
