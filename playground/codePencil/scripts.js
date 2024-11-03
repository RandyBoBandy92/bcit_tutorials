const templateGroups = {
  "Workshop Templates": [
    { name: "Workshop Cards", file: "workshopCards.json" },
    { name: "Workshop Intervals", file: "workshopIntervals.json" },
    { name: "Workshop Promises", file: "workshopPromises.json" },
  ],
  "General Templates": [
    { name: "Code Pencil", file: "codePencil.json" },
    { name: "Flex", file: "flex.json" },
    { name: "Resume", file: "resume.json" },
    { name: "Bouncing Emojis", file: "bouncingEmojis.json" },
  ],
  "Practice Templates": [
    { name: "Simple Function Practice", file: "simpleFunctionPractice.json" },
    {
      name: "Intermediate Function Practice Strings",
      file: "intermediateFunctionPracticeStrings.json",
    },
    {
      name: "Intermediate Function Practice Arrays",
      file: "intermediateFunctionPracticeArrays.json",
    },
    {
      name: "Intermediate Function Quiz",
      file: "intermediateFunctionQuiz.json",
    },
  ],
};

// Initialize CodeMirror editors
const htmlEditor = CodeMirror.fromTextArea(
  document.getElementById("htmlEditor"),
  {
    mode: "htmlmixed",
    autoRefresh: true,
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
      F11: function (cm) {
        cm.setOption("fullScreen", !cm.getOption("fullScreen"));
      },
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
    autoRefresh: true,
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
      F11: function (cm) {
        cm.setOption("fullScreen", !cm.getOption("fullScreen"));
      },
    },
    gutters: ["CodeMirror-lint-markers"],
    lint: true, // Enable linting
  }
);
const jsEditor = CodeMirror.fromTextArea(document.getElementById("jsEditor"), {
  mode: "javascript",
  lineNumbers: true,
  autoRefresh: true,
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
    F11: function (cm) {
      cm.setOption("fullScreen", !cm.getOption("fullScreen"));
    },
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
  const urlParams = new URLSearchParams(window.location.search);
  const hasUrlParams =
    urlParams.has("html") || urlParams.has("css") || urlParams.has("js");

  if (hasUrlParams) {
    // Load content from URL parameters if present
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
  } else {
    // Check localStorage if no URL params
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

  // if we are under 768px, make preview the active tab
  if (window.innerWidth < 768) {
    handlePreviewTabClick();
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
  const saveWarning = confirm(
    "Have you saved your in-progress code? Click 'Cancel' to save it first."
  );
  if (!saveWarning) return; // Exit if the user chooses to save their work

  htmlEditor.setValue("");
  cssEditor.setValue("");
  jsEditor.setValue("");
  localStorage.removeItem("htmlContent");
  localStorage.removeItem("cssContent");
  localStorage.removeItem("jsContent");
  updatePreview();
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

    for (const [groupName, templates] of Object.entries(templateGroups)) {
      const optgroup = document.createElement("optgroup");
      optgroup.label = groupName;

      templates.forEach((template) => {
        const option = document.createElement("option");
        option.value = template.file; // Use the file property for the value
        option.textContent = template.name; // Use the name property for display
        optgroup.appendChild(option);
      });

      templateSelect.appendChild(optgroup);
    }

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
    const selectedTemplateFile = templateSelect.value;
    if (selectedTemplateFile) {
      fetch(`./templates/${selectedTemplateFile}`)
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
    const editorContainer = document.querySelector(".editor-container");
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
  const editorContainer = document.querySelector(".editor-container");
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
    const saveWarning = confirm(
      "Loading the Help template will overwrite your current code."
    );
    if (!saveWarning) return; // Exit if the user chooses to save their work

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

// Toggle button container visibility on hamburger menu click
document.getElementById("hamburgerMenu").addEventListener("click", function () {
  const buttonContainer = document.querySelector(".button-container");
  buttonContainer.classList.toggle("open");
});

document.getElementById("htmlTab").addEventListener("click", function () {
  // remove the active class from all the tabs
  const tabs = ["htmlTab", "cssTab", "jsTab", "previewTab"];
  tabs.forEach((id) => {
    document.getElementById(id).classList.remove("active");
  });
  document.getElementById("htmlTab").classList.add("active");
  switchTab("htmlWrapper");
});

document.getElementById("cssTab").addEventListener("click", function () {
  // remove the active class from all the tabs
  const tabs = ["htmlTab", "cssTab", "jsTab", "previewTab"];
  tabs.forEach((id) => {
    document.getElementById(id).classList.remove("active");
  });
  document.getElementById("cssTab").classList.add("active");
  switchTab("cssWrapper");
});

document.getElementById("jsTab").addEventListener("click", function () {
  // remove the active class from all the tabs
  const tabs = ["htmlTab", "cssTab", "jsTab", "previewTab"];
  tabs.forEach((id) => {
    document.getElementById(id).classList.remove("active");
  });
  document.getElementById("jsTab").classList.add("active");
  switchTab("jsWrapper");
});

function handlePreviewTabClick() {
  // remove the active class from all the tabs
  const tabs = ["htmlTab", "cssTab", "jsTab", "previewTab"];
  tabs.forEach((id) => {
    document.getElementById(id).classList.remove("active");
  });
  document.getElementById("previewTab").classList.add("active");
  switchTab("preview");
}

document
  .getElementById("previewTab")
  .addEventListener("click", handlePreviewTabClick);

function switchTab(activeId) {
  const tabs = ["htmlWrapper", "cssWrapper", "jsWrapper", "preview"];
  tabs.forEach((id) => {
    document.getElementById(id).classList.remove("active");
  });

  document.getElementById(activeId).classList.add("active");

  document.getElementById(activeId).style.width = "100%";
  // if we are switching to preview, we need to display none the editor-container
  if (activeId === "preview") {
    document.querySelector(".editor-container").style.display = "none";
    // the preview width should be 91vw
    document.getElementById("preview").style.width = "91vw";
  } else {
    document.querySelector(".editor-container").style.display = "block";
    // remove the inline style from the preview
    document.getElementById("preview").style.width = "";
  }

  // refresh all editors
  htmlEditor.refresh();
  cssEditor.refresh();
  jsEditor.refresh();
}

// watch the viewport, if it is above 768px. we need to set .editor-container to flex
window.addEventListener("resize", function () {
  if (window.innerWidth > 768) {
    document.querySelector(".editor-container").style.display = "flex";
    // remove the inline style from the preview
    document.getElementById("preview").style.width = "";
  } else {
    // if we go below, lets make preview the active tab
    handlePreviewTabClick();
  }
});

// Add these individual fullscreen toggle functions
function toggleHtmlFullscreen() {
  const isFullscreen = htmlEditor.getOption("fullScreen");
  htmlEditor.setOption("fullScreen", !isFullscreen);
  toggleFullscreenButton(htmlEditor, isFullscreen);
}

function toggleCssFullscreen() {
  const isFullscreen = cssEditor.getOption("fullScreen");
  cssEditor.setOption("fullScreen", !isFullscreen);
  toggleFullscreenButton(cssEditor, isFullscreen);
}

function toggleJsFullscreen() {
  const isFullscreen = jsEditor.getOption("fullScreen");
  jsEditor.setOption("fullScreen", !isFullscreen);
  toggleFullscreenButton(jsEditor, isFullscreen);
}

// Function to add or remove the fullscreen exit button
function toggleFullscreenButton(editor, isFullscreen) {
  let button = document.getElementById("exitFullscreenButton");
  if (!isFullscreen) {
    if (!button) {
      button = document.createElement("button");
      button.id = "exitFullscreenButton";
      button.innerHTML = '<i class="fas fa-times"></i>';
      button.style.fontSize = "1rem";
      button.style.minWidth = "unset";
      button.style.position = "fixed";
      button.style.top = "10px";
      button.style.right = "10px";
      button.style.zIndex = "1000";
      button.style.backgroundColor = "#f00";
      button.style.color = "#fff";
      button.style.border = "none";
      button.style.padding = "10px";
      button.style.cursor = "pointer";

      button.addEventListener("mouseenter", () => {
        button.style.backgroundColor = "#c00";
      });
      button.addEventListener("mouseleave", () => {
        button.style.backgroundColor = "#f00";
      });

      document.body.appendChild(button);
    }
    button.onclick = () => {
      editor.setOption("fullScreen", false);
      button.remove();
    };
  } else if (button) {
    button.remove();
  }
}

// Update the event listeners
document
  .querySelector('[data-editor="htmlEditor"]')
  .addEventListener("click", toggleHtmlFullscreen);
document
  .querySelector('[data-editor="cssEditor"]')
  .addEventListener("click", toggleCssFullscreen);
document
  .querySelector('[data-editor="jsEditor"]')
  .addEventListener("click", toggleJsFullscreen);

async function updateTemplatesInDb() {
  try {
    const db = await openDatabase();
    const allTemplates = await getAllTemplates(db);
    const practiceTemplates = templateGroups["Practice Templates"];

    const existingTemplatePaths = allTemplates.map((template) => template.path);

    for (const practiceTemplate of practiceTemplates) {
      const templatePath = `./templates/${practiceTemplate.file}`;
      if (!existingTemplatePaths.includes(templatePath)) {
        const newTemplate = {
          title: practiceTemplate.name,
          path: templatePath,
          tags: ["practice"],
        };
        await addTemplate(db, newTemplate);
        console.log(
          `Template "${practiceTemplate.name}" added to the database.`
        );
      }
    }
  } catch (error) {
    console.error("Error processing practice templates:", error);
  }
}

function findNextTemplateToReview(templates, progress) {
  // Find templates that need review
  const templatesNeedingReview = templates.filter((template) => {
    // Check if there's any progress for this template
    const templateProgress = progress.find((p) => p.templateId === template.id);

    if (!templateProgress) {
      // No progress means this template needs review
      return true;
    }

    // Check if next review date has passed
    const nextReviewDate = new Date(templateProgress.nextReview);
    const now = new Date();
    return nextReviewDate <= now;
  });

  // Return first template needing review, or null if none found
  return templatesNeedingReview[0] || null;
}

document
  .getElementById("practiceButton")
  .addEventListener("click", async () => {
    debugger;
    const db = await openDatabase();
    await updateTemplatesInDb();
    const allTemplates = await getAllTemplates(db);
    const userProgress = await getAllUserProgress(db);
    console.log(allTemplates);
    console.log(userProgress);

    // now we need to start the practice session

    // ok, that's all the planning for now, let's start coding

    // 1. find the first template that the user has not completed
    // we start by finding the first template that the user has not completed if any
    // if there are no templates that the user has not completed, we show a message to the user
    // that they have completed all the templates and they can go back to the home page
    // this could be either a template the user has no progress for, or one where the review date has passed
    // we need to find the first one of those and load it

    const templateToReview = findNextTemplateToReview(
      allTemplates,
      userProgress
    );
    if (!templateToReview) {
      alert(
        "You have completed all available templates! Check back later for more reviews."
      );
      return;
    }
    console.log("Template to review:", templateToReview);

    // we need to fetch and load the template
    fetch(templateToReview.path)
      .then((response) => response.json())
      .then((data) => {
        htmlEditor.setValue(data.html);
        cssEditor.setValue(data.css);
        jsEditor.setValue(data.js);
        updatePreview();
        updateFullscreenPreview();
      });

    // Create and show practice modal
    const practiceModal = document.createElement("div");
    practiceModal.className = "practice-modal";
    practiceModal.innerHTML = `
    <div class="practice-modal-header">
      <h2>${templateToReview.title}</h2>
      <button class="minimize-btn">_</button>
      <button class="close-btn">×</button>
    </div>
      <div class="practice-modal-content">
        <div class="practice-modal-body">
          <div class="rating-buttons">
          <button class="rating-btn hard">Hard</button>
          <button class="rating-btn ok">OK</button>
            <button class="rating-btn good">Good</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(practiceModal);

    // Make the modal draggable
    let isDragging = false;
    let offsetX, offsetY;

    const header = practiceModal.querySelector(".practice-modal-header");
    header.style.cursor = "move";

    practiceModal.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - practiceModal.offsetLeft;
      offsetY = e.clientY - practiceModal.offsetTop;
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });

    function onMouseMove(e) {
      if (isDragging) {
        practiceModal.style.left = `${e.clientX - offsetX}px`;
        practiceModal.style.top = `${e.clientY - offsetY}px`;
      }
    }

    function onMouseUp() {
      isDragging = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }

    // Add event listeners for modal controls
    const minimizeBtn = practiceModal.querySelector(".minimize-btn");
    const closeBtn = practiceModal.querySelector(".close-btn");
    const ratingBtns = practiceModal.querySelectorAll(".rating-btn");

    minimizeBtn.addEventListener("click", () => {
      practiceModal.classList.toggle("minimized");
    });

    closeBtn.addEventListener("click", () => {
      practiceModal.remove();
    });

    // Handle rating button clicks
    ratingBtns.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const quality = btn.classList.contains("good")
          ? 5
          : btn.classList.contains("ok")
          ? 3
          : 1; // Assuming "hard" corresponds to a quality of 1

        // Retrieve current progress or create a new one if it doesn't exist
        let progress = userProgress.find(
          (p) => p.templateId === templateToReview.id
        );

        if (!progress) {
          progress = {
            templateId: templateToReview.id,
            interval: 1,
            easeFactor: 2.5,
            reviewCount: 0,
            lastReviewed: new Date().toISOString(),
            nextReview: new Date().toISOString(),
          };
        }

        // Update progress using the updateSpacedRepetition function
        const updatedProgress = updateSpacedRepetition(progress, quality);

        // Update progress in the database
        await updateUserProgress(db, updatedProgress);

        // Show next button
        const nextBtn = document.createElement("button");
        nextBtn.textContent = "Next";
        nextBtn.className = "next-btn";
        nextBtn.addEventListener("click", () => {
          practiceModal.remove();
          // Trigger practice button click to load next template
          document.getElementById("practiceButton").click();
        });

        const modalBody = practiceModal.querySelector(".practice-modal-body");
        modalBody.innerHTML = "";
        modalBody.appendChild(nextBtn);
      });
    });
  });
