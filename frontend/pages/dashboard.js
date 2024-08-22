import React, { useState, useEffect } from 'react';
import { Page, Textarea, Select, Button, Text, Card, Divider } from '@geist-ui/react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nightOwl } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Dashboard = () => {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('python');
    const [analysisResults, setAnalysisResults] = useState(null);
    const [complexity, setComplexity] = useState(null);
    const [reviewComments, setReviewComments] = useState(null);
    const [performance, setPerformance] = useState(null);
    const [optimizedCode, setOptimizedCode] = useState('');
    const [error, setError] = useState(null);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

    function reformatContent(content) {
        if (typeof content === 'string') {
            let formattedContent = content.replace(/\\n/g, ' ');
            formattedContent = formattedContent.replace(/\\\\/g, '');
            formattedContent = formattedContent.replace(/\s+/g, ' ').trim();
            return formattedContent;
        }
        console.warn('Expected string but received:', content);
        return content;
    }

    function reformatCode(content) {
        if (typeof content === 'string') {
            let formattedCode = content.replace(/\\n/g, '\n');
            formattedCode = formattedCode.replace(/\\\\/g, '\\');
            formattedCode = formattedCode.replace(/(;|{|}|:)/g, '$1\n');
            formattedCode = formattedCode.replace(/\n\s*\n/g, '\n');
            formattedCode = formattedCode.trim();
            return formattedCode;
        }
        console.warn('Expected string but received:', content);
        return content;
    }

    async function fetchData(url, method, body) {
        try {
            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Unknown error');
            }

            return await response.json();
        } catch (err) {
            console.error('Fetch error:', err);
            setError(err.message || 'An error occurred');
            return null;
        }
    }

    const handleAnalyze = async () => {
        const result = await fetchData(`${API_BASE_URL}/analyze`, 'POST', { code, language });
        if (result) {
            const formattedSuggestions = reformatContent(result.suggestions);
            setAnalysisResults(formattedSuggestions);
        }
    };

    const handleComplexity = async () => {
        const result = await fetchData(`${API_BASE_URL}/complexity`, 'POST', { code, language });
        if (result) {
            const formattedComplexityCode = reformatCode(result.complexity_score);
            setComplexity(formattedComplexityCode);
        }
    };

    const handleReview = async () => {
        const result = await fetchData(`${API_BASE_URL}/review`, 'POST', { code, language });
        if (result) {
            const formattedComments = reformatContent(result.comments);
            setReviewComments(formattedComments);
        }
    };

    const handleOptimize = async () => {
        const result = await fetchData(`${API_BASE_URL}/optimize`, 'POST', { code, language });
        if (result) {
            let optimizedCodeContent = result.optimized_code;
            if (typeof optimizedCodeContent !== 'string') {
                optimizedCodeContent = JSON.stringify(optimizedCodeContent);
            }
            // Remove surrounding triple backticks
            optimizedCodeContent = optimizedCodeContent.replace(/(^```[a-z]*\n|\n```$)/g, '');
            const formattedOptimizedCode = reformatCode(optimizedCodeContent);
            setOptimizedCode(formattedOptimizedCode);
        }
    };

    const handleProfile = async () => {
        const result = await fetchData(`${API_BASE_URL}/profile`, 'POST', { code, language });
        if (result) {
            const formattedProfileCode = reformatCode(result.performance);
            setPerformance(formattedProfileCode);
        }
    };

    return (
        <Page>
            <Text h1>Code Analysis Dashboard</Text>
            <Textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your code here"
                rows="10"
                width="100%"
            />
            <Select
                value={language}
                onChange={setLanguage}
                placeholder="Select Language"
                width="100%"
            >
                <Select.Option value="python">Python</Select.Option>
                <Select.Option value="java">Java</Select.Option>
                <Select.Option value="javascript">JavaScript</Select.Option>
                <Select.Option value="go">Go</Select.Option>
                <Select.Option value="ruby">Ruby</Select.Option>
                <Select.Option value="php">PHP</Select.Option>
            </Select>
            <Button auto onClick={handleAnalyze}>Analyze Code</Button>
            <Button auto onClick={handleComplexity}>Analyze Complexity</Button>
            <Button auto onClick={handleReview}>Review Code</Button>
            <Button auto onClick={handleOptimize}>Optimize Code</Button>
            <Button auto onClick={handleProfile}>Profile Code Performance</Button>

            {error && (
                <Card shadow type="error">
                    <Text h2>Error</Text>
                    <Text>{error}</Text>
                </Card>
            )}

            {analysisResults && (
                <Card shadow>
                    <Text h2>Code Analysis</Text>
                    <Text>{JSON.stringify(analysisResults, null, 2)}</Text>
                </Card>
            )}

            {complexity && (
                <Card shadow>
                    <Text h2>Code Complexity</Text>
                    <Text>{JSON.stringify(complexity, null, 2)}</Text>
                </Card>
            )}

            {reviewComments && (
                <Card shadow>
                    <Text h2>Code Review Comments</Text>
                    <Text>{JSON.stringify(reviewComments, null, 2)}</Text>
                </Card>
            )}

            {optimizedCode && (
                <Card shadow>
                    <Text h2>Optimized Code</Text>
                    <SyntaxHighlighter language={language} style={nightOwl}>
                        {optimizedCode}
                    </SyntaxHighlighter>
                </Card>
            )}

            {performance && (
                <Card shadow>
                    <Text h2>Code Performance</Text>
                    <Text>{JSON.stringify(performance, null, 2)}</Text>
                </Card>
            )}

            <Divider />
        </Page>
    );
};

export default Dashboard;
