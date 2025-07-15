const htmlInput = document.getElementById("htmlInput");
const preview = document.getElementById("preview");
const sidebar = document.getElementById("sidebar");
const backButton = document.getElementById("backButton");
const forwardButton = document.getElementById("forwardButton");

const MAX_HISTORY = 50;
let history = [];
let currentIndex = -1;
let historyVersion = 0;

let currentCallback = null;
let currentTimeout = null;

function initEditor() {
  const savedContent = localStorage.getItem("htmlContent");
  const initialContent =
    savedContent ||
    `<h1>Hello, world!</h1>\n<p>Edit this HTML and see the preview!</p>`;

  htmlInput.value = initialContent;
  updatePreview(null, true);

  history = [initialContent];
  currentIndex = 0;
}

function saveHistory() {
  const content = htmlInput.value;
  const currentVersion = ++historyVersion;

  currentCallback = () => {
    if (historyVersion !== currentVersion) return;

    if (currentIndex < history.length - 1) {
      history.splice(currentIndex + 1);
    }

    history.push(content);
    currentIndex++;

    if (history.length > MAX_HISTORY) {
      history.shift();
      currentIndex--;
    }
    backButton.disabled = currentIndex === 0;
    forwardButton.disabled = currentIndex === history.length - 1;
    currentCallback = null;
    clearTimeout(currentTimeout);
  };
  currentTimeout = setTimeout(currentCallback, 500);
}

function updatePreview(_, immediate = false) {
  preview.innerHTML = htmlInput.value;
  localStorage.setItem("htmlContent", htmlInput.value);
  if (immediate) return;
  saveHistory();
}

function undo() {
  if (currentCallback) {
    currentCallback();
  }
  if (currentIndex > 0) {
    navigateHistory(currentIndex - 1);
  }
  backButton.disabled = currentIndex === 0;
}

function redo() {
  if (currentCallback) {
    currentCallback();
  }
  if (currentIndex < history.length - 1) {
    navigateHistory(currentIndex + 1);
  }
  forwardButton.disabled = currentIndex === history.length - 1;
}

function navigateHistory(index) {
  const start = htmlInput.selectionStart;
  const end = htmlInput.selectionEnd;
  setTimeout(() => {
    htmlInput.setSelectionRange(start, end);
  }, 1);
  currentIndex = index;
  htmlInput.value = history[currentIndex];
  preview.innerHTML = history[currentIndex];
  localStorage.setItem("htmlContent", history[currentIndex]);
}

function formatHTML(html) {
  try {
    const tokens = [];
    let i = 0;

    while (i < html.length) {
      if (html[i] === "<") {
        let tag = "";
        do {
          tag += html[i];
          i++;
        } while (i < html.length && html[i] !== ">");
        if (i < html.length) tag += html[i++];
        tokens.push({ type: "tag", value: tag });
      } else {
        let text = "";
        while (i < html.length && html[i] !== "<") {
          text += html[i];
          i++;
        }
        tokens.push({ type: "text", value: text });
      }
    }

    let output = "";
    let indent = 0;
    const voidElements = [
      "area",
      "base",
      "br",
      "col",
      "embed",
      "hr",
      "img",
      "input",
      "link",
      "meta",
      "param",
      "source",
      "track",
      "wbr",
    ];

    for (let j = 0; j < tokens.length; j++) {
      const token = tokens[j];
      if (token.type === "tag") {
        const tag = token.value;
        const isClosing = tag.startsWith("</");
        const isSelfClosing =
          tag.endsWith("/>") ||
          voidElements.some((ve) =>
            tag.match(new RegExp(`^<${ve}\\s|^<${ve}>`, "i"))
          );
        const isVoid = voidElements.some((ve) =>
          tag.match(new RegExp(`^<${ve}\\s|^<${ve}>`, "i"))
        );

        if (isClosing) {
          indent = Math.max(0, indent - 1);
          output += "  ".repeat(indent) + tag + "\n";
        } else if (isSelfClosing || isVoid) {
          output += "  ".repeat(indent) + tag + "\n";
        } else {
          output += "  ".repeat(indent) + tag + "\n";
          indent++;
        }
      } else {
        const lines = token.value.split("\n").filter((l) => l.trim() !== "");
        for (const line of lines) {
          output += "  ".repeat(indent) + line.trim() + "\n";
        }
      }
    }

    return output.trim();
  } catch (e) {
    console.error("Formatting error:", e);
    return html;
  }
}

function formatCurrentContent() {
  debugger;
  const content = htmlInput.value;
  const formatted = formatHTML(content);
  htmlInput.value = formatted;
  updatePreview();
}

document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && e.key === "z") {
    e.preventDefault();
    undo();
  } else if ((e.ctrlKey || e.metaKey) && e.key === "y") {
    e.preventDefault();
    redo();
  } else if ((e.ctrlKey || e.metaKey) && e.key === "l") {
    e.preventDefault();
    formatCurrentContent();
  } else if (e.key === "Tab" && document.activeElement === htmlInput) {
    e.preventDefault();
    const start = htmlInput.selectionStart;
    const end = htmlInput.selectionEnd;
    htmlInput.value =
      htmlInput.value.substring(0, start) +
      "  " +
      htmlInput.value.substring(end);
    updatePreview();
    setTimeout(() => {
      htmlInput.setSelectionRange(start + 2, start + 2);
    }, 1);
  }
});

initEditor();
htmlInput.addEventListener("input", updatePreview);
backButton.addEventListener("click", undo);
forwardButton.addEventListener("click", redo);
formatButton.addEventListener("click", formatCurrentContent);
