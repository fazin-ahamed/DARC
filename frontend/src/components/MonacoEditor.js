import React, { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';

// Setup Monaco Environment
window.MonacoEnvironment = {
    getWorker(_, label) {
        switch (label) {
            case 'json': return new Worker(new URL('monaco-editor/esm/vs/language/json/json.worker', import.meta.url));
            case 'css': 
            case 'scss': 
            case 'less': return new Worker(new URL('monaco-editor/esm/vs/language/css/css.worker', import.meta.url));
            case 'html': 
            case 'handlebars': 
            case 'razor': return new Worker(new URL('monaco-editor/esm/vs/language/html/html.worker', import.meta.url));
            case 'typescript': 
            case 'javascript': return new Worker(new URL('monaco-editor/esm/vs/language/typescript/ts.worker', import.meta.url));
            default: return new Worker(new URL('monaco-editor/esm/vs/editor/editor.worker', import.meta.url));
        }
    }
};

const MonacoEditor = ({ sessionId, language, initialValue, onChange }) => {
    const editorRef = useRef(null);
    const [editor, setEditor] = useState(null);
    const websocketRef = useRef(null);

    useEffect(() => {
        // Create the Monaco editor
        if (editorRef.current) {
            const newEditor = monaco.editor.create(editorRef.current, {
                value: initialValue || '',
                language: language,
                theme: 'vs-dark',
                automaticLayout: true,
            });

            setEditor(newEditor);

            // Format code on load
            newEditor.getAction('editor.action.formatDocument').run();

            return () => {
                newEditor.dispose();
            };
        }
    }, [initialValue, language]);

    useEffect(() => {
        // Setup WebSocket connection
        websocketRef.current = new WebSocket(`wss://darc-backendonly.onrender.com/ws/${sessionId}`);

        websocketRef.current.onopen = () => console.log('WebSocket connection opened');
        websocketRef.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.sessionId !== sessionId) {
                editor?.setValue(message.content);
            }
        };
        websocketRef.current.onerror = (error) => console.error('WebSocket error:', error);
        websocketRef.current.onclose = () => console.log('WebSocket connection closed');

        return () => {
            if (websocketRef.current) {
                websocketRef.current.close();
            }
        };
    }, [sessionId, editor]);

    useEffect(() => {
        // Handle editor content changes
        if (editor) {
            const handleEditorChange = () => {
                const content = editor.getValue();
                onChange(content);
                if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
                    websocketRef.current.send(JSON.stringify({ sessionId, content }));
                }
            };

            editor.onDidChangeModelContent(handleEditorChange);

            return () => {
                editor.offDidChangeModelContent(handleEditorChange);
            };
        }
    }, [editor, onChange, sessionId]);

    useEffect(() => {
        // Update editor language and format document
        if (editor) {
            editor.updateOptions({ language });
            editor.getAction('editor.action.formatDocument').run();
        }
    }, [language, editor]);

    useEffect(() => {
        // Set initial value
        if (editor && initialValue !== editor.getValue()) {
            editor.setValue(initialValue);
            editor.getAction('editor.action.formatDocument').run();
        }
    }, [initialValue, editor]);

    return <div ref={editorRef} style={{ height: '500px', width: '100%' }} />;
};

export default MonacoEditor;
