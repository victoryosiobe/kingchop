"use strict";
const fs = require("fs");
const path = require("path");

// Object to store the required modules
const modules = {};

// Read all files in the directory
const files = fs.readdirSync(__dirname);
// Require each file and store in the modules object
files.forEach((file) => {
  const filePath = path.join(__dirname, file);

  // Only require JavaScript files that is not index.js
  if (file.endsWith(".js") && !file.startsWith("index")) {
    const moduleName = path.basename(file, ".js"); // 'file1', 'file2', 'file3'
    modules[moduleName] = require(filePath); // modules.file1 = require('./modules/file1.js')
  }
});

// Now you can use the modules Object

module.exports = modules; // Optional: export the modules object if needed
