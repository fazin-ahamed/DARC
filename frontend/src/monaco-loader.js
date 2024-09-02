// src/monaco-loader.js

// Ensure this script is loaded before Monaco Editor
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

// Configure Monaco Environment
self.MonacoEnvironment = {
  getWorkerUrl: function (workerId, label) {
    // Adjust the URL to point to your loader.js
    if (label === 'json' || label === 'jsonc') {
      return `https://your-site.netlify.app/monacoeditor/vs/base/worker/workerMain.js`;
    }
    return `https://your-site.netlify.app/monacoeditor/vs/${workerId}.js`;
  }
};

// Initialize Monaco Editor
monaco.editor.create(document.getElementById('container'), {
  value: '',
  language: 'javascript'
});
