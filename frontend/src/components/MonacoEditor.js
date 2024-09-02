import React, { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';

const MonacoEditor = ({ sessionId, language, initialValue, onChange }) => {
    const editorRef = useRef(null);
    const [editor, setEditor] = useState(null);

    useEffect(() => {
        if (editorRef.current) {
            const newEditor = monaco.editor.create(editorRef.current, {
                value: initialValue || '',
                language: language,
                theme: 'vs-dark',
                automaticLayout: true,  // Ensure proper layout
                worker: {
                    url: '../public/monaco-worker.js' // Path to the worker script
                }
            });
            setEditor(newEditor);
            
            // Connect to WebSocket server
            const websocket = new WebSocket(`wss://darc-backendonly.onrender.com/ws/${sessionId}`);

            websocket.onmessage = (event) => {
                const message = JSON.parse(event.data);
                if (message.sessionId !== sessionId) {
                    // Update editor content if the message is from another session
                    newEditor.setValue(message.content);
                }
            };

            newEditor.onDidChangeModelContent(() => {
                const content = newEditor.getValue();
                onChange(content); // Trigger onChange callback
                websocket.send(JSON.stringify({ sessionId, content }));
            });

            // Cleanup function
            return () => {
                websocket.close();
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
