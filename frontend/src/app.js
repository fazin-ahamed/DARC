import React, { useState } from 'react';
import MonacoEditor from './components/MonacoEditor';
import { Button, Text } from '@geist-ui/core';

const API_BASE_URL = process.env.REACT_APP_API_URL;

const App = () => {
    const [language, setLanguage] = useState('javascript');
    const [editorValue, setEditorValue] = useState('');
    const [analysisResults, setAnalysisResults] = useState(null);
    const [complexity, setComplexity] = useState(null);
    const [reviewComments, setReviewComments] = useState(null);
    const [performance, setPerformance] = useState(null);
    const [optimizedCode, setOptimizedCode] = useState('');
    const [error, setError] = useState(null);

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

    return (
        <div className="App">
            <h1>Code Analysis Dashboard</h1>
            <MonacoEditor sessionId="example-session" language={language} initialValue={editorValue} onChange={(value) => setEditorValue(value)} />
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
    );
};

export default App;
