import React, { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';

const MonacoEditor = ({ sessionId, language, initialValue, onChange }) => {
    const editorRef = useRef(null);
    const [editor, setEditor] = useState(null);
    const [websocket, setWebSocket] = useState(null);

    useEffect(() => {
        if (editorRef.current && !editor) {
            const newEditor = monaco.editor.create(editorRef.current, {
                value: initialValue || '',
                language: language,
                theme: 'vs-dark',
                automaticLayout: true
            });
            setEditor(newEditor);

            // WebSocket connection setup
            const ws = new WebSocket(`wss://darc-backendonly.onrender.com/ws/${sessionId}`);

            ws.onopen = () => console.log("WebSocket connection opened");

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                if (message.sessionId !== sessionId) {
                    newEditor.setValue(message.content);
                }
            };

            ws.onclose = () => console.log("WebSocket connection closed");
            ws.onerror = (error) => console.error("WebSocket error:", error);

            setWebSocket(ws);

            newEditor.onDidChangeModelContent(() => {
                const content = newEditor.getValue();
                onChange(content); // Trigger onChange callback
                ws.send(JSON.stringify({ sessionId, content }));
            });

            // Cleanup function for editor and WebSocket
            return () => {
                ws.close();
                newEditor.dispose();
            };
        }
    }, [sessionId, language, initialValue, onChange, editor]);

    useEffect(() => {
        if (editor) {
            monaco.editor.setModelLanguage(editor.getModel(), language);
        }
    }, [language, editor]);

    useEffect(() => {
        if (editor && initialValue !== editor.getValue()) {
            editor.setValue(initialValue);
        }
    }, [initialValue, editor]);

    return <div ref={editorRef} style={{ height: '500px', width: '100%' }} />;
};

export default MonacoEditor;
