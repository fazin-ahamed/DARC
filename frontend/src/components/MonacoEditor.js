import React, { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';

const MonacoEditor = ({ sessionId, language }) => {
    const editorRef = useRef(null);
    const [editor, setEditor] = useState(null);

    useEffect(() => {
        if (editorRef.current) {
            const newEditor = monaco.editor.create(editorRef.current, {
                value: '',
                language: language,
                theme: 'vs-dark',
            });
            setEditor(newEditor);
        }

        const websocket = new WebSocket(`ws://darc-backendonly.vercel.app/ws/${sessionId}`);

        websocket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            editor?.setValue(message.content);
        };

        editor?.onDidChangeModelContent(() => {
            websocket.send(JSON.stringify({ content: editor.getValue() }));
        });

        return () => {
            websocket.close();
            editor?.dispose();
        };
    }, [sessionId, language]);

    return <div ref={editorRef} style={{ height: '500px', width: '100%' }} />;
};

export default MonacoEditor;
