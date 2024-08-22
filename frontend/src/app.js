import React from 'react';
import ErrorBoundary from './errorboundary'; // Adjust the path as needed
import Dashboard from './dashboard'; // Adjust the path as needed

const App = () => (
    <ErrorBoundary>
        <Dashboard />
    </ErrorBoundary>
);

export default App;

