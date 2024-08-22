import React, { useState } from 'react';

const Dashboard = () => {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('python');
    const [analysisResults, setAnalysisResults] = useState(null);
    const [complexity, setComplexity] = useState(null);
    const [reviewComments, setReviewComments] = useState(null);
    const [performance, setPerformance] = useState(null);
    const [optimizedCode, setOptimizedCode] = useState('');
    const [error, setError] = useState(null);

    // Get the API base URL from the environment variable
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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
            const formattedOptimizedCode = reformatCode(result.optimized_code);
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
        <div className="dashboard">
            <h1>Code Analysis Dashboard</h1>
            <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your code here"
                rows="10"
            />
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="javascript">JavaScript</option>
                <option value="go">Go</option>
                <option value="ruby">Ruby</option>
                <option value="php">PHP</option>
                {/* Add options for the additional languages */}
            </select>
            <button onClick={handleAnalyze}>Analyze Code</button>
            <button onClick={handleComplexity}>Analyze Complexity</button>
            <button onClick={handleReview}>Review Code</button>
            <button onClick={handleOptimize}>Optimize Code</button>
            <button onClick={handleProfile}>Profile Code Performance</button>

            {error && (
                <div className="error">
                    <h2>Error</h2>
                    <pre>{error}</pre>
                </div>
            )}

            {analysisResults && (
                <div className="analysis-results">
                    <h2>Code Analysis</h2>
                    <pre>{analysisResults}</pre>
                </div>
            )}

            {complexity && (
                <div className="complexity-results">
                    <h2>Code Complexity</h2>
                    <pre>{complexity}</pre>
                </div>
            )}

            {reviewComments && (
                <div className="review-results">
                    <h2>Code Review Comments</h2>
                    <pre>{reviewComments}</pre>
                </div>
            )}

            {optimizedCode && (
                <div className="optimization-results">
                    <h2>Optimized Code</h2>
                    <pre>{optimizedCode}</pre>
                </div>
            )}

            {performance && (
                <div className="performance-results">
                    <h2>Code Performance</h2>
                    <pre>{performance}</pre>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
