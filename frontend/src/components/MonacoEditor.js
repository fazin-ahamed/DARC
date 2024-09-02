import React, { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';

const MonacoEditor = ({ sessionId, language, initialValue, onChange }) => {
    const editorRef = useRef(null);
    const editorInstance = useRef(null);
    const [editor, setEditor] = useState(null);

    useEffect(() => {
        if (editorRef.current) {
            const newEditor = monaco.editor.create(editorRef.current, {
                value: initialValue || '',
                language: language,
                theme: 'vs-dark',
            });
            setEditor(newEditor);
            
            // Connect to WebSocket server
            const websocket = new WebSocket(`ws://darc-backendonly.onrender.com/ws/${sessionId}`);

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

            return () => {
                websocket.close();
                newEditor.dispose();
            };
        }
    }, [sessionId, language, initialValue, onChange]);

    return <div ref={editorRef} style={{ height: '500px', width: '100%' }} />;
};

export default MonacoEditor;
