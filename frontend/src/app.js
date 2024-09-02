import React from 'react';
import MonacoEditor from './components/MonacoEditor';

// Define supported languages and their default settings
const languageOptions = {
    python: {
        name: 'python',
        value: '',
    },
    javascript: {
        name: 'javascript',
        value: '',
    },
    java: {
        name: 'java',
        value: '',
    },
    go: {
        name: 'go',
        value: '',
    },
    ruby: {
        name: 'ruby',
        value: '',
    },
    php: {
        name: 'java',
        value: '',
    },
};

// Function to get language settings
const getLanguageSettings = (language) => {
    return languageOptions[language] || languageOptions.javascript;
};

const App = () => {
    // Set default language
    const defaultLanguage = 'javascript';

    // Get language settings
    const { name: language, value } = getLanguageSettings(defaultLanguage);

    return (
        <div className="App">
            <h1>Code Analysis Dashboard</h1>
            <MonacoEditor sessionId="example-session" language={language} initialValue={value} />
        </div>
    );
};

export default App;
