/**
 * Interactive Prompt Pad prototype.
 *
 * This is deliberately small and dependency-free. State lives in memory only:
 * reloading the page restores the sample prompts.
 */

interface PrototypeFolder {
  id: string;
  name: string;
}

interface PrototypePrompt {
  id: string;
  folder: string;
  title: string;
  text: string;
}

interface PrototypeConfig {
  labels: {
    copied: string;
    copyFailed: string;
    untitled: string;
    noText: string;
    noResults: string;
  };
  folders: PrototypeFolder[];
  prompts: PrototypePrompt[];
  defaultPromptId: string;
}

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

/** Escape user-edited text before inserting it into the list markup. */
function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => HTML_ESCAPES[character] ?? character);
}

function clonePrompts(prompts: PrototypePrompt[]): PrototypePrompt[] {
  return prompts.map((prompt) => ({ ...prompt }));
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

export function initPrototype(): void {
  const root = document.querySelector<HTMLElement>('[data-prototype]');
  if (!root) return;

  const dataElement = root.querySelector<HTMLScriptElement>('[data-prototype-data]');
  const listElement = root.querySelector<HTMLUListElement>('[data-prompt-list]');
  const searchInput = root.querySelector<HTMLInputElement>('[data-search]');
  const titleInput = root.querySelector<HTMLInputElement>('[data-title]');
  const textInput = root.querySelector<HTMLTextAreaElement>('[data-text]');
  const copyButton = root.querySelector<HTMLButtonElement>('[data-copy]');
  const deleteButton = root.querySelector<HTMLButtonElement>('[data-delete]');
  const newButton = root.querySelector<HTMLButtonElement>('[data-new-prompt]');
  const resetButton = root.querySelector<HTMLButtonElement>('[data-reset]');
  const statusElement = root.querySelector<HTMLElement>('[data-status]');
  const fieldsElement = root.querySelector<HTMLElement>('[data-editor-fields]');
  const emptyElement = root.querySelector<HTMLElement>('[data-empty-editor]');
  const folderButtons = root.querySelectorAll<HTMLButtonElement>('[data-folder]');
  const countElements = root.querySelectorAll<HTMLElement>('[data-count-for]');

  if (
    !dataElement?.textContent ||
    !listElement ||
    !searchInput ||
    !titleInput ||
    !textInput ||
    !copyButton ||
    !deleteButton ||
    !newButton ||
    !resetButton ||
    !statusElement ||
    !fieldsElement ||
    !emptyElement
  ) {
    return;
  }

  const config = JSON.parse(dataElement.textContent) as PrototypeConfig;
  const initialPrompts = clonePrompts(config.prompts);

  let prompts = clonePrompts(initialPrompts);
  let activeFolder = 'all';
  let query = '';
  let selectedId: string | null = config.defaultPromptId;
  let statusTimer: number | undefined;

  if (!prompts.some((prompt) => prompt.id === selectedId)) {
    selectedId = prompts[0]?.id ?? null;
  }

  const getSelected = (): PrototypePrompt | null =>
    prompts.find((prompt) => prompt.id === selectedId) ?? null;

  const getFolderName = (folderId: string): string =>
    config.folders.find((folder) => folder.id === folderId)?.name ?? folderId;

  const getVisiblePrompts = (): PrototypePrompt[] => {
    const normalizedQuery = query.trim().toLowerCase();

    return prompts.filter((prompt) => {
      const inFolder = activeFolder === 'all' || prompt.folder === activeFolder;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${prompt.title} ${prompt.text}`.toLowerCase().includes(normalizedQuery);
      return inFolder && matchesQuery;
    });
  };

  const getSnippet = (text: string): string => {
    const clean = text.replace(/\s+/g, ' ').trim();
    if (!clean) return config.labels.noText;
    return clean.length > 72 ? `${clean.slice(0, 72).trimEnd()}…` : clean;
  };

  const renderFolders = (): void => {
    for (const button of folderButtons) {
      const folderId = button.dataset.folder ?? 'all';
      const isActive = folderId === activeFolder;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', String(isActive));
    }

    for (const count of countElements) {
      const folderId = count.dataset.countFor ?? 'all';
      const total =
        folderId === 'all'
          ? prompts.length
          : prompts.filter((prompt) => prompt.folder === folderId).length;
      count.textContent = String(total);
    }
  };

  const renderList = (): void => {
    const visible = getVisiblePrompts();

    if (visible.length === 0) {
      listElement.innerHTML = `<li class="prompt-empty">${escapeHtml(
        config.labels.noResults,
      )}</li>`;
      return;
    }

    listElement.innerHTML = visible
      .map((prompt) => {
        const isSelected = prompt.id === selectedId;
        return `<li>
          <button type="button" class="prompt-row${isSelected ? ' is-selected' : ''}" data-prompt-id="${escapeHtml(
            prompt.id,
          )}"${isSelected ? ' aria-current="true"' : ''}>
            <span class="prompt-row__title">${escapeHtml(
              prompt.title || config.labels.untitled,
            )}</span>
            <span class="prompt-row__snippet">${escapeHtml(getSnippet(prompt.text))}</span>
            <span class="prompt-row__folder">${escapeHtml(
              getFolderName(prompt.folder),
            )}</span>
          </button>
        </li>`;
      })
      .join('');
  };

  const renderEditor = (): void => {
    const selected = getSelected();
    const hasPrompt = selected !== null;

    fieldsElement.hidden = !hasPrompt;
    emptyElement.hidden = hasPrompt;

    if (!selected) {
      copyButton.disabled = true;
      deleteButton.disabled = true;
      return;
    }

    titleInput.value = selected.title;
    textInput.value = selected.text;
    copyButton.disabled = selected.text.trim().length === 0;
    deleteButton.disabled = false;
  };

  const renderAll = (): void => {
    renderFolders();
    renderList();
    renderEditor();
  };

  const showStatus = (message: string): void => {
    statusElement.textContent = message;

    if (statusTimer !== undefined) window.clearTimeout(statusTimer);
    statusTimer = window.setTimeout(() => {
      statusElement.textContent = '';
    }, 2200);
  };

  const keepSelectionVisible = (): void => {
    if (prompts.length === 0) {
      selectedId = null;
      return;
    }

    const visible = getVisiblePrompts();
    if (visible.length === 0) return;

    if (!selectedId || !visible.some((prompt) => prompt.id === selectedId)) {
      selectedId = visible[0]?.id ?? null;
    }
  };

  for (const button of folderButtons) {
    button.addEventListener('click', () => {
      activeFolder = button.dataset.folder ?? 'all';

      if (query) {
        query = '';
        searchInput.value = '';
      }

      keepSelectionVisible();
      renderAll();
    });
  }

  searchInput.addEventListener('input', () => {
    query = searchInput.value;

    // Search across the whole library, like the app does.
    if (query.trim()) activeFolder = 'all';

    keepSelectionVisible();
    renderAll();
  });

  listElement.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const row = target.closest('[data-prompt-id]');
    if (!(row instanceof HTMLButtonElement) || !listElement.contains(row)) return;

    const id = row.dataset.promptId;
    if (!id) return;

    selectedId = id;
    statusElement.textContent = '';
    renderList();
    renderEditor();
  });

  titleInput.addEventListener('input', () => {
    const selected = getSelected();
    if (!selected) return;

    selected.title = titleInput.value;
    renderList();
  });

  textInput.addEventListener('input', () => {
    const selected = getSelected();
    if (!selected) return;

    selected.text = textInput.value;
    copyButton.disabled = selected.text.trim().length === 0;
    renderList();
  });

  newButton.addEventListener('click', () => {
    const folder =
      activeFolder === 'all' ? config.folders[0]?.id ?? 'quick' : activeFolder;
    const prompt: PrototypePrompt = {
      id: `demo-${Date.now()}`,
      folder,
      title: '',
      text: '',
    };

    prompts = [prompt, ...prompts];
    activeFolder = 'all';
    query = '';
    searchInput.value = '';
    selectedId = prompt.id;
    statusElement.textContent = '';

    renderAll();
    titleInput.focus();
    titleInput.select();
  });

  deleteButton.addEventListener('click', () => {
    const selected = getSelected();
    if (!selected) return;

    prompts = prompts.filter((prompt) => prompt.id !== selected.id);

    if (prompts.length === 0) {
      selectedId = null;
      renderAll();
      newButton.focus();
      return;
    }

    const visible = getVisiblePrompts();

    if (visible.length === 0) {
      activeFolder = 'all';
      query = '';
      searchInput.value = '';
      selectedId = prompts[0]?.id ?? null;
    } else {
      selectedId = visible[0]?.id ?? null;
    }

    renderAll();
  });

  copyButton.addEventListener('click', async () => {
    const selected = getSelected();
    if (!selected || !selected.text.trim()) return;

    const copied = await copyText(selected.text);

    if (!copied) {
      // Make the manual fallback easy: focus and select the prompt text.
      textInput.focus();
      textInput.select();
    }

    showStatus(copied ? config.labels.copied : config.labels.copyFailed);
  });

  resetButton.addEventListener('click', () => {
    prompts = clonePrompts(initialPrompts);
    activeFolder = 'all';
    query = '';
    searchInput.value = '';
    selectedId = prompts.some((prompt) => prompt.id === config.defaultPromptId)
      ? config.defaultPromptId
      : prompts[0]?.id ?? null;
    statusElement.textContent = '';

    renderAll();
  });

  renderAll();
}
