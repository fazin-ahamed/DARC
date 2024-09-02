import React, { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';

// Define the Monaco environment to get the worker URL
window.MonacoEnvironment = {
    getWorker(_, label) {
        if (label === 'json') {
            return new Worker(new URL('monaco-editor/esm/vs/language/json/json.worker', import.meta.url));
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
            return new Worker(new URL('monaco-editor/esm/vs/language/css/css.worker', import.meta.url));
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return new Worker(new URL('monaco-editor/esm/vs/language/html/html.worker', import.meta.url));
        }
        if (label === 'typescript' || label === 'javascript') {
            return new Worker(new URL('monaco-editor/esm/vs/language/typescript/ts.worker', import.meta.url));
        }
        return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url));
    }
};

const MonacoEditor = ({ sessionId, language, initialValue, onChange }) => {
    const editorRef = useRef(null);
    const [editor, setEditor] = useState(null);
    const websocketRef = useRef(null);  // Store WebSocket instance in ref to persist across renders

    useEffect(() => {
        if (editorRef.current) {
            const newEditor = monaco.editor.create(editorRef.current, {
                value: initialValue || '',
                language: language,
                theme: 'vs-dark',
                automaticLayout: true,
            });

            setEditor(newEditor);

            // Initialize WebSocket connection using sessionId
            websocketRef.current = new WebSocket(`wss://darc-backendonly.onrender.com/ws/${sessionId}`);

            websocketRef.current.onopen = () => console.log('WebSocket connection opened');
            websocketRef.current.onmessage = (event) => {
                const message = JSON.parse(event.data);
                if (message.sessionId !== sessionId) {
                    newEditor.setValue(message.content);
                }
            };
            websocketRef.current.onerror = (error) => console.error('WebSocket error:', error);
            websocketRef.current.onclose = () => console.log('WebSocket connection closed');

            newEditor.onDidChangeModelContent(() => {
                const content = newEditor.getValue();
                onChange(content);
                if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
                    websocketRef.current.send(JSON.stringify({ sessionId, content }));
                }
            });

            return () => {
                if (websocketRef.current) {
                    websocketRef.current.close();
                }
                newEditor.dispose();
            };
        }
    }, [sessionId, language, initialValue, onChange]);

    useEffect(() => {
        if (editor) {
            editor.updateOptions({ language });
        }
    }, [language, editor]);

    useEffect(() => {
        if (editor) {
            editor.setValue(initialValue);
        }
    }, [initialValue, editor]);

    return <div ref={editorRef} style={{ height: '500px', width: '100%' }} />;
};

export default MonacoEditor;
