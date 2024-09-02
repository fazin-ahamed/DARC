import React, { useState } from 'react';
import MonacoEditor from './components/MonacoEditor';
import { Button, Input, Text, Select } from '@geist-ui/core';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const Dashboard = () => {
    const [language, setLanguage] = useState('javascript');
    const [editorValue, setEditorValue] = useState('');
    const [analysisResults, setAnalysisResults] = useState(null);
    const [complexity, setComplexity] = useState(null);
    const [reviewComments, setReviewComments] = useState(null);
    const [performance, setPerformance] = useState(null);
    const [optimizedCode, setOptimizedCode] = useState('');
    const [error, setError] = useState(null);
    const [sessionId, setSessionId] = useState('');
    const [newSessionId, setNewSessionId] = useState('');
    const [collabMode, setCollabMode] = useState(false);

    const languages = [
        'javascript',
        'python',
        'java',
        'csharp',
        'ruby',
        'go',
        'typescript',
        'php',
        'html',
        'css'
    ];

    const fetchData = async (endpoint, body) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Unknown error');
            }

            const data = await response.json();
            return data;
        } catch (err) {
            setError(err.message || 'An error occurred');
            return null;
        }
    };

    const handleAnalyze = async () => {
        const result = await fetchData('analyze', { code: editorValue, language });
        if (result) {
            setAnalysisResults(result.suggestions);
        }
    };

    const handleReview = async () => {
        const result = await fetchData('review', { code: editorValue, language });
        if (result) {
            setReviewComments(result.comments);
        }
    };

    const handleOptimize = async () => {
        const result = await fetchData('optimize', { code: editorValue, language });
        if (result) {
            setOptimizedCode(result.optimized_code);
        }
    };

    const handleComplexity = async () => {
        const result = await fetchData('complexity', { code: editorValue, language });
        if (result) {
            setComplexity(result.complexity_score);
        }
    };

    const handleProfile = async () => {
        const result = await fetchData('profile', { code: editorValue, language });
        if (result) {
            setPerformance(result.performance);
        }
    };

    const handleSessionCreate = async () => {
        const result = await fetchData('sessions/create-session', {});
        if (result) {
            setSessionId(result.session_id);
            setCollabMode(true);
        }
    };


    const handleSessionJoin = async () => {
        const result = await fetchData('sessions/join-session', { session_id: newSessionId });
        if (result) {
            setSessionId(JSON.stringify(result.session_id));
            setCollabMode(true);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => alert('Session ID copied to clipboard!'))
            .catch(err => alert('Failed to copy text: ' + err));
    };

    return (
        <div className="Dashboard">
            <h1>Code Analysis Dashboard</h1>

            {!collabMode ? (
                <div>
                    <h2>Session Management</h2>
                    <Button auto onClick={handleSessionCreate}>Create New Session</Button>
                    <Input placeholder="Enter Session ID" onChange={(e) => setNewSessionId(e.target.value)} />
                    <Button auto onClick={handleSessionJoin}>Join Session</Button>
                </div>
            ) : (
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                        <Text>Session ID: {sessionId}</Text>
                        <Button auto onClick={() => copyToClipboard(sessionId)} style={{ marginLeft: '1rem' }}>Copy</Button>
                    </div>

                    <Select value={language} onChange={(value) => setLanguage(value)}>
                        {languages.map(lang => (
                            <Select.Option key={lang} value={lang}>
                                {lang}
                            </Select.Option>
                        ))}
                    </Select>

                    <MonacoEditor
                        sessionId={sessionId}
                        language={language}
                        initialValue={editorValue}
                        onChange={(value) => setEditorValue(value)}
                    />

                    <Button auto onClick={handleAnalyze}>Analyze Code</Button>
                    <Button auto onClick={handleReview}>Review Code</Button>
                    <Button auto onClick={handleOptimize}>Optimize Code</Button>
                    <Button auto onClick={handleComplexity}>Analyze Complexity</Button>
                    <Button auto onClick={handleProfile}>Profile Code Performance</Button>

                    {error && <Text>{`Error: ${error}`}</Text>}

                    {analysisResults && (
                        <div>
                            <h2>Code Analysis Results</h2>
                            <pre>{JSON.stringify(analysisResults, null, 2)}</pre>
                        </div>
                    )}

                    {reviewComments && (
                        <div>
                            <h2>Code Review Comments</h2>
                            <pre>{JSON.stringify(reviewComments, null, 2)}</pre>
                        </div>
                    )}

                    {complexity && (
                        <div>
                            <h2>Code Complexity</h2>
                            <pre>{JSON.stringify(complexity, null, 2)}</pre>
                        </div>
                    )}

                    {optimizedCode && (
                        <div>
                            <h2>Optimized Code</h2>
                            <pre>{optimizedCode}</pre>
                        </div>
                    )}

                    {performance && (
                        <div>
                            <h2>Code Performance Profile</h2>
                            <pre>{JSON.stringify(performance, null, 2)}</pre>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
