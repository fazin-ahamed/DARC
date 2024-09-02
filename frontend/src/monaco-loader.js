self.MonacoEnvironment = {
  getWorkerUrl: function (workerId, label) {
    return `/monacoeditor/vs/base/worker/workerMain.js`; // Use the correct path for your workers
  }
};

// Initialize Monaco Editor
const container = document.getElementById('container');
const language = window.selectedLanguage || 'javascript'; // Default to 'javascript' if no language is set

monaco.editor.create(container, {
  value: '',
  language: language
});
