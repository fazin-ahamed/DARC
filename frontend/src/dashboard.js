import React, { useState } from 'react';
import MonacoEditor from './components/MonacoEditor';
import Chat from './components/Chat';
import { Select, Button } from '@geist-ui/core';

const Dashboard = () => {
    const [sessionId, setSessionId] = useState('default-session');
    const [language, setLanguage] = useState('javascript');
    const [files, setFiles] = useState([]);

    const handleFileUpload = (event) => {
        const uploadedFiles = event.target.files;
        setFiles([...files, ...uploadedFiles]);
    };

    return (
        <div>
            <h1>Collaborative Code Editor</h1>
            <Select value={language} onChange={(val) => setLanguage(val)}>
                <Select.Option value="javascript">JavaScript</Select.Option>
                <Select.Option value="python">Python</Select.Option>
                <Select.Option value="go">Go</Select.Option>
                <Select.Option value="ruby">Ruby</Select.Option>
                <Select.Option value="php">PHP</Select.Option>
                <Select.Option value="java">Java</Select.Option>
                {/* Add more languages as needed */}
            </Select>
            <Button auto onClick={() => setSessionId(prompt("Enter Session ID"))}>
                Change Session
            </Button>
            <MonacoEditor sessionId={sessionId} language={language} />
            <input type="file" multiple onChange={handleFileUpload} />
            <ul>
                {files.map((file, index) => (
                    <li key={index}>{file.name}</li>
                ))}
            </ul>
            <Chat sessionId={sessionId} />
            {/* Additional components for user presence, roles, etc. */}
        </div>
    );
};

export default Dashboard;
