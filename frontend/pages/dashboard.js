import React from 'react';
import { useState } from 'react';

const Dashboard = () => {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('python');
    const [analysisResults, setAnalysisResults] = useState(null);
    const [complexity, setComplexity] = useState(null);
    const [reviewComments, setReviewComments] = useState(null);
    const [performance, setPerformance] = useState(null);
    const [optimizedCode, setOptimizedCode] = useState('');

    const handleAnalyze = async () => {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, language }),
        });
        const result = await response.json();
        setAnalysisResults(result.suggestions);
    };

    const handleComplexity = async () => {
        const response = await fetch('/api/complexity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, language }),
        });
        const result = await response.json();
        setComplexity(result.complexity_score);
    };

    const handleReview = async () => {
        const response = await fetch('/api/review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, language }),
        });
        const result = await response.json();
        setReviewComments(result.comments);
    };

    const handleOptimize = async () => {
        const response = await fetch('/api/optimize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, language }),
        });
        const result = await response.json();
        setOptimizedCode(result.optimized_code);
    };

    const handleProfile = async () => {
        const response = await fetch('/api/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, language }),
        });
        const result = await response.json();
        setPerformance(result.performance);
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
            </select>
            <button onClick={handleAnalyze}>Analyze Code</button>
            <button onClick={handleComplexity}>Analyze Complexity</button>
            <button onClick={handleReview}>Review Code</button>
            <button onClick={handleOptimize}>Optimize Code</button>
            <button onClick={handleProfile}>Profile Code Performance</button>

            {analysisResults && (
                <div className="analysis-results">
                    <h2>Code Analysis</h2>
                    <pre>{JSON.stringify(analysisResults, null, 2)}</pre>
                </div>
            )}

            {complexity && (
                <div className="complexity-results">
                    <h2>Code Complexity</h2>
                    <pre>{JSON.stringify(complexity, null, 2)}</pre>
                </div>
            )}

            {reviewComments && (
                <div className="review-results">
                    <h2>Code Review Comments</h2>
                    <pre>{JSON.stringify(reviewComments, null, 2)}</pre>
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
                    <pre>{JSON.stringify(performance, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
