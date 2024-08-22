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

    // Get the API base URL from the environment variable
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

    function reformatContent(content) {
        // Replace '\n' with spaces
        let formattedContent = content.replace(/\\n/g, ' ');

        // Replace double backslashes with single backslashes
        formattedContent = formattedContent.replace(/\\\\/g, '');

        // Remove multiple spaces
        formattedContent = formattedContent.replace(/\s+/g, ' ').trim();

    return formattedContent;
}

    function reformatCode(content) {
        // Replace '\n' with actual newlines
        let formattedCode = content.replace(/\\n/g, '\n');
    
        // Replace double backslashes with single backslashes
        formattedCode = formattedCode.replace(/\\\\/g, '\\');
    
        // Add newlines after specific characters for readability (e.g., semicolons, braces, colons)
        formattedCode = formattedCode.replace(/(;|{|}|:)/g, '$1\n');
    
        // Remove multiple consecutive newlines
        formattedCode = formattedCode.replace(/\n\s*\n/g, '\n');

        // Trim leading and trailing whitespace
        formattedCode = formattedCode.trim();

    return formattedCode;
}


    
    const handleAnalyze = async () => {
        const response = await fetch(`${API_BASE_URL}/analyze`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, language }),
        });
        const result = await response.json();

        const formattedSuggestions = result.suggestions(reformatContent);

        setAnalysisResults(formattedSuggestions);
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
};

    const handleComplexity = async () => {
        const response = await fetch(`${API_BASE_URL}/complexity`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, language }),
        });
        const result = await response.json();

        // Check if the optimization was successful
        if (response.ok) {
            // Reformat the optimized code before setting it
            const formattedComplexityCode = reformatCode(result.complexity_score);
            setComplexity(formattedComplexityCode);
        } else {
            // Handle any errors returned by the backend
            console.error('Complexity Scanning failed:', result.error || 'Unknown error');
        }
    } catch (error) {
        // Handle network or other unexpected errors
        console.error('An error occurred during complexity scanning:', error);
    }
};

    const handleReview = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/review`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, language }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        const formattedComments = result.comments(reformatContent);

        setReviewComments(formattedComments);
    } catch (error) {
        console.error('Error fetching review comments:', error);
    }
};

    const handleOptimize = async () => {
        const response = await fetch(`${API_BASE_URL}/optimize`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, language }),
        });
        const result = await response.json();
        
        // Check if the optimization was successful
        if (response.ok) {
            // Reformat the optimized code before setting it
            const formattedOptimizedCode = reformatCode(result.optimized_code);
            setOptimizedCode(formattedOptimizedCode);
        } else {
            // Handle any errors returned by the backend
            console.error('Optimization failed:', result.error || 'Unknown error');
        }
    } catch (error) {
        // Handle network or other unexpected errors
        console.error('An error occurred during optimization:', error);
    }
};

    const handleProfile = async () => {
        const response = await fetch(`${API_BASE_URL}/profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, language }),
        });
        const result = await response.json();
        
        // Check if the optimization was successful
        if (response.ok) {
            // Reformat the optimized code before setting it
            const formattedProfileCode = reformatCode(result.performance);
            setPerformance(formattedProfileCode);
        } else {
            // Handle any errors returned by the backend
            console.error('Profiling failed:', result.error || 'Unknown error');
        }
    } catch (error) {
        // Handle network or other unexpected errors
        console.error('An error occurred during profiling:', error);
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
