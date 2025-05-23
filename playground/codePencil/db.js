// Schemas
// Example Template
// {
//     "id": 1,
//     "title": "Sample Template",
//     "path": "/path/to/template.json",
//     "tags": ["example", "sample"]
// }

// User Progress
// {
//     "id": 1,
//     "templateId": 1,
//     "lastReviewed": "2023-10-01T00:00:00Z",
//     "nextReview": "2023-10-05T00:00:00Z",
//     "interval": 4,
//     "easeFactor": 2.5,
//     "reviewCount": 3
// }

/**
 * @typedef {Object} Template
 * @property {number} [id] - Unique identifier for the template.
 * @property {string} title - Title of the template.
 * @property {string} path - Path to the template JSON file.
 * @property {string[]} tags - Tags for categorization.
 */

/**
 * @typedef {Object} UserProgress
 * @property {number} [id] - Unique identifier for the user progress entry.
 * @property {number} templateId - Foreign key referencing the template.
 * @property {string} lastReviewed - ISO string of the last review date.
 * @property {string} nextReview - ISO string of the next review date.
 * @property {number} interval - Current interval for the next review in days.
 * @property {number} easeFactor - Factor used to adjust the interval.
 * @property {number} reviewCount - Number of times the template has been reviewed.
 */

/**
 * Opens the IndexedDB database.
 * @returns {Promise<IDBDatabase>} A promise that resolves to the database instance.
 */
function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("SpacedRepetitionDB", 1);

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("Templates")) {
        const templatesStore = db.createObjectStore("Templates", {
          keyPath: "id",
          autoIncrement: true,
        });
        templatesStore.createIndex("title", "title", { unique: false });
      }
      if (!db.objectStoreNames.contains("UserProgress")) {
        const progressStore = db.createObjectStore("UserProgress", {
          keyPath: "id",
          autoIncrement: true,
        });
        progressStore.createIndex("templateId", "templateId", {
          unique: false,
        });
      }
    };

    request.onsuccess = function (event) {
      resolve(event.target.result);
    };

    request.onerror = function (event) {
      reject("Database error: " + event.target.errorCode);
    };
  });
}

/**
 * Adds a new template to the database.
 * @param {IDBDatabase} db - The database instance.
 * @param {Template} template - The template to add.
 * @returns {Promise<number>} A promise that resolves to the ID of the added template.
 */
function addTemplate(db, template) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["Templates"], "readwrite");
    const store = transaction.objectStore("Templates");
    const request = store.add(template);

    request.onsuccess = function (event) {
      const id = event.target.result;
      resolve(id);
    };

    transaction.oncomplete = function () {
      resolve("Template added successfully");
    };

    transaction.onerror = function (event) {
      reject("Transaction error: " + event.target.errorCode);
    };

    request.onerror = function (event) {
      reject("Error adding template: " + event.target.errorCode);
    };
  });
}

/**
 * Retrieves a template by its ID.
 * @param {IDBDatabase} db - The database instance.
 * @param {number} id - The ID of the template to retrieve.
 * @returns {Promise<Template>} A promise that resolves to the retrieved template.
 */
function getTemplate(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["Templates"], "readonly");
    const store = transaction.objectStore("Templates");
    const request = store.get(id);

    request.onsuccess = function (event) {
      resolve(event.target.result);
    };

    request.onerror = function (event) {
      reject("Error retrieving template: " + event.target.errorCode);
    };
  });
}

/**
 * Updates an existing template.
 * @param {IDBDatabase} db - The database instance.
 * @param {Template} updatedTemplate - The template with updated data.
 * @returns {Promise<string>} A promise that resolves when the template is updated.
 */
function updateTemplate(db, updatedTemplate) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["Templates"], "readwrite");
    const store = transaction.objectStore("Templates");
    const request = store.put(updatedTemplate);

    transaction.oncomplete = function () {
      resolve("Template updated successfully");
    };

    transaction.onerror = function (event) {
      reject("Transaction error: " + event.target.errorCode);
    };

    request.onerror = function (event) {
      reject("Error updating template: " + event.target.errorCode);
    };
  });
}

/**
 * Deletes a template by its ID.
 * @param {IDBDatabase} db - The database instance.
 * @param {number} id - The ID of the template to delete.
 * @returns {Promise<string>} A promise that resolves when the template is deleted.
 */
function deleteTemplate(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["Templates"], "readwrite");
    const store = transaction.objectStore("Templates");
    const request = store.delete(id);

    transaction.oncomplete = function () {
      resolve("Template deleted successfully");
    };

    transaction.onerror = function (event) {
      reject("Transaction error: " + event.target.errorCode);
    };

    request.onerror = function (event) {
      reject("Error deleting template: " + event.target.errorCode);
    };
  });
}

/**
 * Adds a new user progress entry to the database.
 * @param {IDBDatabase} db - The database instance.
 * @param {UserProgress} progress - The user progress to add.
 * @returns {Promise<string>} A promise that resolves when the user progress is added.
 */
function addUserProgress(db, progress) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["UserProgress"], "readwrite");
    const store = transaction.objectStore("UserProgress");
    const request = store.add(progress);

    transaction.oncomplete = function () {
      resolve("User progress added successfully");
    };

    transaction.onerror = function (event) {
      reject("Transaction error: " + event.target.errorCode);
    };

    request.onerror = function (event) {
      reject("Error adding user progress: " + event.target.errorCode);
    };
  });
}

/**
 * Updates an existing user progress entry.
 * @param {IDBDatabase} db - The database instance.
 * @param {UserProgress} updatedProgress - The user progress with updated data.
 * @returns {Promise<string>} A promise that resolves when the user progress is updated.
 */
function updateUserProgress(db, updatedProgress) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["UserProgress"], "readwrite");
    const store = transaction.objectStore("UserProgress");
    const request = store.put(updatedProgress);

    transaction.oncomplete = function () {
      resolve("User progress updated successfully");
    };

    transaction.onerror = function (event) {
      reject("Transaction error: " + event.target.errorCode);
    };

    request.onerror = function (event) {
      reject("Error updating user progress: " + event.target.errorCode);
    };
  });
}

/**
 * Deletes a user progress entry by its ID.
 * @param {IDBDatabase} db - The database instance.
 * @param {number} id - The ID of the user progress to delete.
 * @returns {Promise<string>} A promise that resolves when the user progress is deleted.
 */
function deleteUserProgress(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["UserProgress"], "readwrite");
    const store = transaction.objectStore("UserProgress");
    const request = store.delete(id);

    transaction.oncomplete = function () {
      resolve("User progress deleted successfully");
    };

    transaction.onerror = function (event) {
      reject("Transaction error: " + event.target.errorCode);
    };

    request.onerror = function (event) {
      reject("Error deleting user progress: " + event.target.errorCode);
    };
  });
}

/**
 * Retrieves all templates from the database.
 * @param {IDBDatabase} db - The database instance.
 * @returns {Promise<Template[]>} A promise that resolves to an array of templates.
 */
function getAllTemplates(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["Templates"], "readonly");
    const store = transaction.objectStore("Templates");
    const request = store.getAll();

    request.onsuccess = function (event) {
      resolve(event.target.result);
    };

    request.onerror = function (event) {
      reject("Error retrieving templates: " + event.target.errorCode);
    };
  });
}

/**
 * Retrieves all user progress entries from the database.
 * @param {IDBDatabase} db - The database instance.
 * @returns {Promise<UserProgress[]>} A promise that resolves to an array of user progress entries.
 */
function getAllUserProgress(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["UserProgress"], "readonly");
    const store = transaction.objectStore("UserProgress");
    const request = store.getAll();

    request.onsuccess = function (event) {
      resolve(event.target.result);
    };

    request.onerror = function (event) {
      reject("Error retrieving user progress: " + event.target.errorCode);
    };
  });
}

/**
 * Retrieves user progress by template ID.
 * @param {IDBDatabase} db - The database instance.
 * @param {number} templateId - The template ID to search for.
 * @returns {Promise<UserProgress>} A promise that resolves to the user progress entry.
 */
function getUserProgressByTemplateId(db, templateId) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["UserProgress"], "readonly");
    const store = transaction.objectStore("UserProgress");
    const request = store.get(templateId);

    request.onsuccess = function (event) {
      resolve(event.target.result);
    };

    request.onerror = function (event) {
      reject("Error retrieving user progress: " + event.target.errorCode);
    };
  });
}

/**
 * Updates the spaced repetition parameters based on the user's performance.
 * @param {UserProgress} progress - The current progress object to update.
 * @param {number} quality - The quality of the user's recall (0-5).
 * @returns {UserProgress} The updated progress object.
 */
function updateSpacedRepetition(progress, quality) {
  const MIN_EASE_FACTOR = 1.3;

  // Update ease factor
  progress.easeFactor =
    progress.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (progress.easeFactor < MIN_EASE_FACTOR) {
    progress.easeFactor = MIN_EASE_FACTOR;
  }

  // Update interval
  if (quality < 3) {
    progress.interval = 1;
  } else {
    if (progress.reviewCount === 0) {
      progress.interval = 1;
    } else {
      progress.interval = Math.round(progress.interval * progress.easeFactor);
    }
  }

  // Calculate next review date
  const currentDate = new Date();
  progress.nextReview = new Date(
    currentDate.setDate(currentDate.getDate() + progress.interval)
  ).toISOString();

  // Special case for quality of 1: reset interval and adjust ease factor
  // also nextReview is 5 minutes from now
  if (quality === 1) {
    const newCurrentDate = new Date();
    progress.interval = 1; // Reset interval to 1 day
    progress.easeFactor = Math.max(progress.easeFactor - 0.2, MIN_EASE_FACTOR); // Decrease ease factor
    progress.nextReview = new Date(
      newCurrentDate.setMinutes(newCurrentDate.getMinutes() + 5)
    ).toISOString();
  }

  // Update the lastReviewed date
  progress.lastReviewed = new Date().toISOString();

  // Update review count
  progress.reviewCount += 1;

  return progress;
}
/**
 * Exports the entire IndexedDB database to a JSON file.
 * @param {IDBDatabase} db - The database instance.
 */
async function exportDatabaseToJSON(db) {
  const exportData = {};

  // Get all object store names
  const objectStoreNames = Array.from(db.objectStoreNames);

  for (const storeName of objectStoreNames) {
    exportData[storeName] = await getAllDataFromStore(db, storeName);
  }

  // Convert the export data to a JSON string
  const jsonString = JSON.stringify(exportData, null, 2);

  // Create a Blob from the JSON string
  const blob = new Blob([jsonString], { type: "application/json" });

  // Create a link element
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "database_export.json";

  // Append the link to the body
  document.body.appendChild(link);

  // Trigger the download
  link.click();

  // Remove the link from the document
  document.body.removeChild(link);
}

/**
 * Retrieves all data from a specific object store.
 * @param {IDBDatabase} db - The database instance.
 * @param {string} storeName - The name of the object store.
 * @returns {Promise<Array>} A promise that resolves to an array of all records in the store.
 */
function getAllDataFromStore(db, storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readonly");
    const store = transaction.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = function (event) {
      resolve(event.target.result);
    };

    request.onerror = function (event) {
      reject("Error retrieving data from store: " + event.target.errorCode);
    };
  });
}

/**
 * Imports data from a JSON file into the IndexedDB database.
 * @param {IDBDatabase} db - The database instance.
 * @param {File} file - The JSON file to import.
 */
async function importDatabaseFromJSON(db, file) {
  try {
    const fileContent = await readFileAsText(file);
    const importData = JSON.parse(fileContent);

    for (const storeName in importData) {
      if (importData.hasOwnProperty(storeName)) {
        const dataArray = importData[storeName];
        await overwriteStoreData(db, storeName, dataArray);
      }
    }

    console.log("Database import completed successfully.");
  } catch (error) {
    console.error("Error importing database: ", error);
  }
}

/**
 * Reads a file as text.
 * @param {File} file - The file to read.
 * @returns {Promise<string>} A promise that resolves to the file content as a string.
 */
function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      resolve(event.target.result);
    };
    reader.onerror = function (event) {
      reject("Error reading file: " + event.target.errorCode);
    };
    reader.readAsText(file);
  });
}

/**
 * Overwrites data in a specific object store.
 * @param {IDBDatabase} db - The database instance.
 * @param {string} storeName - The name of the object store.
 * @param {Array} dataArray - The array of data to overwrite in the store.
 * @returns {Promise<void>} A promise that resolves when the data is overwritten.
 */
function overwriteStoreData(db, storeName, dataArray) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], "readwrite");
    const store = transaction.objectStore(storeName);

    transaction.oncomplete = function () {
      resolve();
    };

    transaction.onerror = function (event) {
      reject("Transaction error: " + event.target.errorCode);
    };

    // Clear existing data
    const clearRequest = store.clear();
    clearRequest.onsuccess = function () {
      // Add new data
      dataArray.forEach((item) => {
        store.put(item);
      });
    };

    clearRequest.onerror = function (event) {
      reject("Error clearing store: " + event.target.errorCode);
    };
  });
}

async function main() {
  return openDatabase()
    .then((db) => {
      return db;
    })
    .catch((error) => {
      console.error("Error opening database: ", error);
    });
}
let db;

main().then((database) => {
  db = database;
});

// Testing the functions

/**
 * Example function to test database operations.
 */
async function practicingUsingTheDB() {
  const templateId = await addTemplate(db, {
    title: "Sample Template",
    path: "/path/to/template.json",
    tags: ["example", "sample"],
  });
}

/**
 * Example function to view all templates.
 */
async function viewAllTemplates() {
  const templates = await getAllTemplates(db);
  console.log(templates);
}
// End of Testing the functions
