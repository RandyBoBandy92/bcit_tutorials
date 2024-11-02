const templates = [
  "codePencil.json",
  "flex.json",
  "workshopCards.json",
  "workshopIntervals.json",
  "workshopPromises.json",
  "resume.json",
];

// Initialize CodeMirror editors
const htmlEditor = CodeMirror.fromTextArea(
  document.getElementById("htmlEditor"),
  {
    mode: "htmlmixed",
    lineNumbers: true,
    tabSize: 2,
    theme: "dracula",
    lineWrapping: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    autoCloseTags: true,
    showTrailingSpace: true,
    extraKeys: {
      "Ctrl-Space": "autocomplete",
      "Ctrl-/": "toggleComment",
      "Cmd-/": "toggleComment",
    },
    gutters: ["CodeMirror-lint-markers"],
    lint: true, // Enable linting
  }
);
emmetCodeMirror(htmlEditor);
const cssEditor = CodeMirror.fromTextArea(
  document.getElementById("cssEditor"),
  {
    mode: "css",
    lineNumbers: true,
    tabSize: 2,
    theme: "dracula",
    lineWrapping: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    showTrailingSpace: true,
    extraKeys: {
      "Ctrl-Space": "autocomplete",
      "Ctrl-/": "toggleComment",
      "Cmd-/": "toggleComment",
    },
    gutters: ["CodeMirror-lint-markers"],
    lint: true, // Enable linting
  }
);
const jsEditor = CodeMirror.fromTextArea(document.getElementById("jsEditor"), {
  mode: "javascript",
  lineNumbers: true,
  tabSize: 2,
  theme: "dracula",
  lineWrapping: true,
  matchBrackets: true,
  autoCloseBrackets: true,
  showTrailingSpace: true,
  extraKeys: {
    "Ctrl-Space": "autocomplete",
    "Ctrl-/": "toggleComment",
    "Cmd-/": "toggleComment",
  },
  gutters: ["CodeMirror-lint-markers"],
  lint: {
    esversion: 6, // Set ES6 as the JavaScript version
  },
});

// Flag to ensure content is fully loaded before updating preview
let isLoaded = false;

// Make the panels resizable
Split(["#htmlWrapper", "#cssWrapper", "#jsWrapper"], {
  sizes: [33, 33, 33],
  minSize: 200,
  gutterSize: 10,
  snapOffset: 0,
  direction: "horizontal",
  gutter: function (index, direction) {
    const gutter = document.createElement("div");
    gutter.className = `gutter gutter-${direction}`;
    return gutter;
  },
});

// Function to trigger autocomplete hints as you type
function triggerAutocomplete(editor) {
  const cursor = editor.getCursor();
  const line = editor.getLine(cursor.line);
  const lastChar = line[cursor.ch - 1];
  if (
    ![";", ",", "{", "}", ":", "(", ")", ".", "]", ">", " ", "="].includes(
      lastChar
    )
  ) {
    editor.showHint({ completeSingle: false });
  }
}

// Set up listeners to trigger autocomplete as you type
htmlEditor.on("inputRead", function (cm) {
  if (!cm.state.completionActive) {
    triggerAutocomplete(cm);
  }
});

cssEditor.on("inputRead", function (cm) {
  if (!cm.state.completionActive) {
    triggerAutocomplete(cm);
  }
});

jsEditor.on("inputRead", function (cm) {
  if (!cm.state.completionActive) {
    triggerAutocomplete(cm);
  }
});

let debounceTimeout;
function debounce(func, delay) {
  return function () {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(func, delay);
  };
}

const debouncedUpdatePreview = debounce(updatePreview, 500);

function updatePreview() {
  if (!isLoaded) return; // Do not update preview until content is fully loaded

  const htmlContent = htmlEditor.getValue();
  const cssContent = `<style>${cssEditor.getValue()}</style>`;
  const jsContent = jsEditor.getValue();

  const previewFrame = document.getElementById("preview");
  const previewDocument =
    previewFrame.contentDocument || previewFrame.contentWindow.document;
  previewDocument.open();
  previewDocument.write(htmlContent + cssContent);
  previewDocument.close();

  try {
    previewFrame.contentWindow.eval(jsContent);
  } catch (error) {
    console.error("Error executing JavaScript:", error);
  }

  // Save editor state to localStorage on every preview update
  localStorage.setItem("htmlContent", htmlEditor.getValue());
  localStorage.setItem("cssContent", cssEditor.getValue());
  localStorage.setItem("jsContent", jsEditor.getValue());
}

// Set up listeners to update the preview when content changes with debounce
htmlEditor.on("change", debouncedUpdatePreview);
cssEditor.on("change", debouncedUpdatePreview);
jsEditor.on("change", debouncedUpdatePreview);

// Save content as separate files
document.getElementById("saveButton").addEventListener("click", function () {
  const escapedTemplate = `
            &lt;!DOCTYPE html&gt;
            &lt;html lang="en"&gt;
            &lt;head&gt;
              &lt;meta charset="UTF-8"&gt;
              &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
              &lt;title&gt;Your Page Title&lt;/title&gt;
              &lt;link rel="stylesheet" href="style.css"&gt;
            &lt;/head&gt;
            &lt;body&gt;
              ${htmlEditor.getValue()}
              &lt;script src="script.js"&gt;&lt;/script&gt;
            &lt;/body&gt;
            &lt;/html&gt;
          `;
  const htmlContent = escapedTemplate
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

  saveFile("index.html", htmlContent, "text/html");
  saveFile("style.css", cssEditor.getValue(), "text/css");
  saveFile("script.js", jsEditor.getValue(), "application/javascript");
});

function saveFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

// Load saved state from localStorage
window.addEventListener("load", () => {
  if (
    !localStorage.getItem("htmlContent") &&
    !localStorage.getItem("cssContent") &&
    !localStorage.getItem("jsContent")
  ) {
    // Load the "Help" codePencil template if local storage is empty
    fetch(`./templates/codePencil.json`)
      .then((response) => response.json())
      .then((data) => {
        htmlEditor.setValue(data.html);
        cssEditor.setValue(data.css);
        jsEditor.setValue(data.js);
        updatePreview();
        updateFullscreenPreview(); // Update full-screen preview
      })
      .catch((error) => console.error("Error loading Help template:", error));
  } else {
    if (localStorage.getItem("htmlContent")) {
      htmlEditor.setValue(localStorage.getItem("htmlContent"));
    }
    if (localStorage.getItem("cssContent")) {
      cssEditor.setValue(localStorage.getItem("cssContent"));
    }
    if (localStorage.getItem("jsContent")) {
      jsEditor.setValue(localStorage.getItem("jsContent"));
    }
  }
  isLoaded = true;
  updatePreview();

  // Load VIM mode preference from localStorage
  const vimMode = localStorage.getItem("vimMode") === "true";
  if (vimMode) {
    toggleVimMode(htmlEditor);
    toggleVimMode(cssEditor);
    toggleVimMode(jsEditor);
    document.getElementById("toggleVimButton").textContent = "Disable VIM Mode";
  }

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has("html")) {
    htmlEditor.setValue(decodeContent(urlParams.get("html")));
  }
  if (urlParams.has("css")) {
    cssEditor.setValue(decodeContent(urlParams.get("css")));
  }
  if (urlParams.has("js")) {
    jsEditor.setValue(decodeContent(urlParams.get("js")));
  }

  // Remove URL parameters without refreshing
  if (window.history.replaceState) {
    window.history.replaceState({}, document.title, window.location.pathname);
  }
});

// Responsive preview testing
document
  .getElementById("responsiveSlider")
  .addEventListener("input", function () {
    document.getElementById("preview").style.width = `${this.value}%`;
  });

// Full-screen preview functionality
let isFullscreen = false;
document
  .getElementById("fullscreenButton")
  .addEventListener("click", function () {
    const fullscreenFrame = document.getElementById("fullscreenPreview");
    const htmlContent = htmlEditor.getValue();
    const cssContent = `<style>${cssEditor.getValue()}</style>`;
    const jsContent = jsEditor.getValue();

    // Close full-screen editor if open
    if (isEditorFullscreen) {
      toggleFullscreenEditor();
    }

    if (!isFullscreen) {
      const previewDocument =
        fullscreenFrame.contentDocument ||
        fullscreenFrame.contentWindow.document;
      previewDocument.open();
      previewDocument.write(htmlContent + cssContent);
      previewDocument.close();

      try {
        fullscreenFrame.contentWindow.eval(jsContent);
      } catch (error) {
        console.error("Error executing JavaScript in fullscreen:", error);
      }

      fullscreenFrame.style.display = "block";
      isFullscreen = true;
    } else {
      fullscreenFrame.style.display = "none";
      isFullscreen = false;
    }
  });

// Reset button functionality
document.getElementById("resetButton").addEventListener("click", function () {
  const confirmReset = confirm("Are you sure you want to reset all content?");
  if (confirmReset) {
    htmlEditor.setValue("");
    cssEditor.setValue("");
    jsEditor.setValue("");
    localStorage.removeItem("htmlContent");
    localStorage.removeItem("cssContent");
    localStorage.removeItem("jsContent");
    updatePreview();
  }
});

// Function to toggle VIM mode and update button text
function toggleVimMode(editor) {
  const currentKeyMap = editor.getOption("keyMap");
  const newKeyMap = currentKeyMap === "vim" ? "default" : "vim";
  editor.setOption("keyMap", newKeyMap);

  // Save VIM mode preference to localStorage
  localStorage.setItem("vimMode", newKeyMap === "vim");

  return newKeyMap;
}

// Add event listener to the toggle button
document
  .getElementById("toggleVimButton")
  .addEventListener("click", function () {
    const newKeyMap = toggleVimMode(htmlEditor);
    toggleVimMode(cssEditor);
    toggleVimMode(jsEditor);

    // Update button text based on the new keymap
    this.innerHTML =
      newKeyMap === "vim"
        ? '<i class="fas fa-keyboard"></i> Disable VIM Mode'
        : '<i class="fas fa-keyboard"></i> Enable VIM Mode';
  });

const editors = [htmlEditor, cssEditor, jsEditor];
let currentEditorIndex = 0;

// Function to switch focus to the next editor
function switchEditor() {
  currentEditorIndex = (currentEditorIndex + 1) % editors.length;
  editors[currentEditorIndex].focus();
}

// Add event listener for keydown to switch editors
document.addEventListener("keydown", function (event) {
  if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "e") {
    event.preventDefault(); // Prevent default behavior
    switchEditor();
  }
});

// Function to encode content using LZ-String
function encodeContent(content) {
  return encodeURIComponent(LZString.compressToEncodedURIComponent(content));
}

// Function to decode content using LZ-String
function decodeContent(encodedContent) {
  return LZString.decompressFromEncodedURIComponent(
    decodeURIComponent(encodedContent)
  );
}

// Function to update the URL with encoded content and shorten it using TinyURL
function updateShareUrl() {
  const htmlContent = encodeContent(htmlEditor.getValue());
  const cssContent = encodeContent(cssEditor.getValue());
  const jsContent = encodeContent(jsEditor.getValue());

  const url = new URL(window.location.href);
  url.searchParams.set("html", htmlContent);
  url.searchParams.set("css", cssContent);
  url.searchParams.set("js", jsContent);

  const longUrl = url.toString();

  // Use TinyURL's API to shorten the URL
  fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`)
    .then((response) => {
      debugger;
      if (!response.ok) {
        throw new Error("Failed to shorten URL");
      }
      return response.text();
    })
    .then((shortUrl) => {
      const toast = document.createElement("div");
      toast.id = "toast";
      toast.textContent = `URL copied to clipboard! You can now share this link: ${shortUrl}`;
      toast.style.position = "fixed";
      toast.style.top = "10px";
      toast.style.left = "50%";
      toast.style.transform = "translateX(-50%)";
      toast.style.backgroundColor = "black";
      toast.style.color = "white";
      toast.style.padding = "10px";
      toast.style.borderRadius = "5px";
      document.body.appendChild(toast);
      setTimeout(() => {
        toast.style.display = "none";
      }, 3000);

      navigator.clipboard.writeText(shortUrl);
    })
    .catch((error) => console.error("Error updating share URL:", error));
}

// Add event listener to the "Share URL" button
document
  .getElementById("shareUrlButton")
  .addEventListener("click", updateShareUrl);

// Function to export content as JSON
function exportAsJson() {
  const content = {
    html: htmlEditor.getValue(),
    css: cssEditor.getValue(),
    js: jsEditor.getValue(),
  };

  const jsonContent = JSON.stringify(content, null, 2); // Pretty print JSON
  const blob = new Blob([jsonContent], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "codeExport.json";
  link.click();
}

// Add event listener to the "JSON EXPORT" button
document
  .getElementById("exportJsonButton")
  .addEventListener("click", exportAsJson);

// Function to open the template modal
document
  .getElementById("templatesButton")
  .addEventListener("click", function () {
    const modal = document.getElementById("templateModal");
    const templateSelect = document.getElementById("templateSelect");
    templateSelect.innerHTML =
      '<option value="" disabled selected>Select a template</option>'; // Clear existing options

    templates.forEach((template) => {
      const option = document.createElement("option");
      option.value = template;
      option.textContent = template;
      templateSelect.appendChild(option);
    });

    modal.style.display = "block";
  });

// Function to close the modal
document.querySelector(".close-button").addEventListener("click", function () {
  document.getElementById("templateModal").style.display = "none";
});

// Function to load the selected template
document
  .getElementById("loadTemplateButton")
  .addEventListener("click", function () {
    const templateSelect = document.getElementById("templateSelect");
    const selectedTemplate = templateSelect.value;
    if (selectedTemplate) {
      fetch(`./templates/${selectedTemplate}`)
        .then((response) => response.json())
        .then((data) => {
          htmlEditor.setValue(data.html);
          cssEditor.setValue(data.css);
          jsEditor.setValue(data.js);
          updatePreview();
          updateFullscreenPreview(); // Update full-screen preview
        })
        .catch((error) => console.error("Error loading template:", error));
    }
    document.getElementById("templateModal").style.display = "none";
  });

// Add event listener to the "Upload" button
const uploadButton = document.getElementById("uploadButton");
const fileInput = document.getElementById("fileInput");

uploadButton.addEventListener("click", function () {
  fileInput.click();
});

// Add event listener to the file input
document
  .getElementById("fileInput")
  .addEventListener("change", function (event) {
    const files = event.target.files;
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const fileContent = e.target.result;
        if (file.type === "text/html") {
          htmlEditor.setValue(fileContent);
        } else if (file.type === "text/css") {
          cssEditor.setValue(fileContent);
        } else if (file.type === "text/javascript") {
          jsEditor.setValue(fileContent);
        } else if (file.type === "application/json") {
          try {
            const jsonData = JSON.parse(fileContent);
            if (jsonData.html) htmlEditor.setValue(jsonData.html);
            if (jsonData.css) cssEditor.setValue(jsonData.css);
            if (jsonData.js) jsEditor.setValue(jsonData.js);
            updatePreview();
          } catch (error) {
            console.error("Error parsing JSON file:", error);
            alert("Invalid JSON file.");
          }
        }
        updatePreview();
      };
      reader.readAsText(file);
    });
  });

// Full-screen editor functionality
let isEditorFullscreen = false;
document
  .getElementById("fullscreenEditorButton")
  .addEventListener("click", function () {
    const editorContainer = document.getElementById("editorContainer");
    const previewFrame = document.getElementById("preview");

    // Close full-screen preview if open
    if (isFullscreen) {
      toggleFullscreenPreview();
    }

    if (!isEditorFullscreen) {
      editorContainer.style.flex = "1 1 100%";
      editorContainer.style.maxHeight = "90vh";
      previewFrame.style.display = "none";
      isEditorFullscreen = true;
      // make all the editors refresh
      htmlEditor.refresh();
      cssEditor.refresh();
      jsEditor.refresh();
      // this.textContent = "Exit Full-Screen Editor";
    } else {
      editorContainer.style.flex = "1";
      editorContainer.style.maxHeight = "300px";
      previewFrame.style.display = "block";
      isEditorFullscreen = false;
    }
  });

// Helper function to toggle full-screen preview
function toggleFullscreenPreview() {
  const fullscreenFrame = document.getElementById("fullscreenPreview");
  fullscreenFrame.style.display = isFullscreen ? "none" : "block";
  isFullscreen = !isFullscreen;
}

// Helper function to toggle full-screen editor
function toggleFullscreenEditor() {
  const editorContainer = document.getElementById("editorContainer");
  const previewFrame = document.getElementById("preview");
  if (isEditorFullscreen) {
    editorContainer.style.flex = "1";
    editorContainer.style.maxHeight = "300px";
    previewFrame.style.display = "block";
    isEditorFullscreen = false;
  } else {
    editorContainer.style.flex = "1 1 100%";
    editorContainer.style.maxHeight = "90vh";
    previewFrame.style.display = "none";
    isEditorFullscreen = true;
  }
}

// Function to save the current state as a new version
function saveVersion() {
  const versionName = prompt("Enter a name for this version:");
  if (versionName) {
    const version = {
      html: htmlEditor.getValue(),
      css: cssEditor.getValue(),
      js: jsEditor.getValue(),
    };
    localStorage.setItem(`version_${versionName}`, JSON.stringify(version));
    alert(`Version "${versionName}" saved!`);
    populateVersionSelect();
  }
}

// Function to populate the version select dropdown
function populateVersionSelect() {
  const versionSelect = document.getElementById("versionSelect");
  versionSelect.innerHTML =
    '<option value="" disabled selected>Select a version</option>'; // Clear existing options

  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("version_")) {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = key.replace("version_", "");
      versionSelect.appendChild(option);
    }
  });
}

// Function to specifically load the codePencil template
document
  .getElementById("loadCodePencilTemplateButton")
  .addEventListener("click", function () {
    fetch(`./templates/codePencil.json`)
      .then((response) => response.json())
      .then((data) => {
        htmlEditor.setValue(data.html);
        cssEditor.setValue(data.css);
        jsEditor.setValue(data.js);
        updatePreview();
        updateFullscreenPreview(); // Update full-screen preview
      });
  });

// Function to load a selected version
function loadVersion() {
  const versionSelect = document.getElementById("versionSelect");
  const selectedVersion = versionSelect.value;
  if (selectedVersion) {
    const versionData = localStorage.getItem(selectedVersion);
    if (versionData) {
      const version = JSON.parse(versionData);
      htmlEditor.setValue(version.html);
      cssEditor.setValue(version.css);
      jsEditor.setValue(version.js);
      updatePreview();
      alert(`Version "${selectedVersion.replace("version_", "")}" loaded!`);
    } else {
      alert(`Version "${selectedVersion.replace("version_", "")}" not found.`);
    }
  }
}

// Add event listeners for saving and loading versions
document
  .getElementById("saveVersionButton")
  .addEventListener("click", saveVersion);
document
  .getElementById("loadVersionButton")
  .addEventListener("click", loadVersion);

// Populate version select on page load
window.addEventListener("load", populateVersionSelect);

// Function to open the version control modal
document
  .getElementById("versionControlButton")
  .addEventListener("click", function () {
    document.getElementById("versionModal").style.display = "block";
  });

// Function to close the modal
document.querySelectorAll(".close-button").forEach((button) => {
  button.addEventListener("click", function () {
    document.getElementById("versionModal").style.display = "none";
  });
});

// Function to delete a selected version
function deleteVersion() {
  const versionSelect = document.getElementById("versionSelect");
  const selectedVersion = versionSelect.value;
  if (selectedVersion) {
    const confirmDelete = confirm(
      `Are you sure you want to delete version "${selectedVersion.replace(
        "version_",
        ""
      )}"?`
    );
    if (confirmDelete) {
      localStorage.removeItem(selectedVersion);
      populateVersionSelect();
      alert(`Version "${selectedVersion.replace("version_", "")}" deleted!`);
    }
  }
}

// Add event listener for deleting versions
document
  .getElementById("deleteVersionButton")
  .addEventListener("click", deleteVersion);

// Function to update the full-screen preview
function updateFullscreenPreview() {
  const fullscreenFrame = document.getElementById("fullscreenPreview");
  const htmlContent = htmlEditor.getValue();
  const cssContent = `<style>${cssEditor.getValue()}</style>`;
  const jsContent = jsEditor.getValue();

  const previewDocument =
    fullscreenFrame.contentDocument || fullscreenFrame.contentWindow.document;
  previewDocument.open();
  previewDocument.write(htmlContent + cssContent);
  previewDocument.close();

  try {
    fullscreenFrame.contentWindow.eval(jsContent);
  } catch (error) {
    console.error("Error executing JavaScript in fullscreen:", error);
  }
}
