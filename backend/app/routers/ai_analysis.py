from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import re
import timeit
from typing import Dict
import cProfile
import pstats
import io

# Load pre-trained CodeBERTa-language-id model and tokenizer
tokenizer = AutoTokenizer.from_pretrained('huggingface/CodeBERTa-language-id')
model = AutoModelForSequenceClassification.from_pretrained('huggingface/CodeBERTa-language-id')

def preprocess_code(code: str) -> str:
    code = re.sub(r'#.*', '', code)  # Remove single-line comments
    code = re.sub(r'""".*?"""', '', code, flags=re.DOTALL)  # Remove multi-line comments
    code = re.sub(r'/\*.*?\*/', '', code, flags=re.DOTALL)  # Remove multi-line comments for languages like Java and C++
    code = re.sub(r'\s+', ' ', code)  # Replace multiple whitespace with a single space
    code = code.strip()
    return code

def analyze_code(code: str, language: str) -> Dict:
    code = preprocess_code(code)
    inputs = tokenizer(code, return_tensors='pt', truncation=True, padding=True)
    with torch.no_grad():
        outputs = model(**inputs)
    
    predictions = outputs.logits.argmax(dim=-1).tolist()
    suggestions = interpret_predictions(predictions, language)
    
    return {"suggestions": suggestions}

def interpret_predictions(predictions, language):
    suggestion_map = {
        "python": {
            0: "Consider refactoring this function to reduce its complexity.",
            1: "Optimize this loop for better performance.",
            2: "Use list comprehensions for better readability.",
            3: "Avoid excessive nesting of control structures.",
            4: "Use f-strings for string formatting.",
            5: "Ensure proper use of exception handling.",
            6: "Refactor long functions into smaller units.",
            7: "Use built-in functions and libraries where possible.",
            8: "Avoid global variables.",
            9: "Use type hints for better code clarity.",
            10: "Check for redundant code or logic."
        },
        "java": {
            0: "Ensure proper use of Java naming conventions.",
            1: "Consider using Streams for better performance.",
            2: "Avoid using raw types in generics.",
            3: "Ensure that methods are not too long.",
            4: "Use `Optional` to avoid null checks.",
            5: "Refactor large classes into smaller ones.",
            6: "Use the `final` keyword where applicable.",
            7: "Avoid excessive use of synchronized blocks.",
            8: "Optimize import statements.",
            9: "Check for redundant or unused code.",
            10: "Ensure proper exception handling."
        },
        "javascript": {
            0: "Use ES6 features for better readability.",
            1: "Avoid global variables.",
            2: "Optimize the use of asynchronous code.",
            3: "Use `let` and `const` instead of `var`.",
            4: "Minimize the use of `eval`.",
            5: "Ensure proper use of Promises.",
            6: "Refactor large functions into smaller units.",
            7: "Avoid deep nesting of callbacks.",
            8: "Use template literals for string interpolation.",
            9: "Ensure consistent use of semicolons.",
            10: "Check for unused variables and functions."
        },
        "go": {
            0: "Use Go idioms and conventions.",
            1: "Avoid long function definitions.",
            2: "Ensure proper error handling.",
            3: "Optimize the use of goroutines and channels.",
            4: "Refactor large packages into smaller ones.",
            5: "Use `defer` statements judiciously.",
            6: "Minimize the use of global variables.",
            7: "Use Go's built-in types and functions where possible.",
            8: "Avoid unnecessary type conversions.",
            9: "Ensure proper use of interfaces.",
            10: "Check for performance bottlenecks."
        },
        "ruby": {
            0: "Use Ruby idioms and conventions.",
            1: "Optimize the use of blocks and procs.",
            2: "Avoid excessive use of `puts` for debugging.",
            3: "Ensure proper use of modules and classes.",
            4: "Refactor long methods into smaller ones.",
            5: "Use `Enumerable` methods for better performance.",
            6: "Avoid using `eval`.",
            7: "Ensure proper exception handling.",
            8: "Use `ruby-style` for code consistency.",
            9: "Check for redundant or unused code.",
            10: "Optimize the use of `ActiveRecord` queries."
        },
        "php": {
            0: "Use PHP's built-in functions for common tasks.",
            1: "Avoid excessive use of global variables.",
            2: "Ensure proper use of error handling with exceptions.",
            3: "Optimize SQL queries.",
            4: "Refactor long functions into smaller ones.",
            5: "Use type hinting for better code clarity.",
            6: "Avoid deprecated PHP functions.",
            7: "Ensure proper use of namespaces.",
            8: "Check for performance issues in loops.",
            9: "Use Composer for dependency management.",
            10: "Optimize the use of PHP session handling."
        }
    }
    
    language_suggestions = suggestion_map.get(language, {})
    suggestions = [language_suggestions.get(prediction, "General advice") for prediction in predictions]
    return suggestions

def analyze_code_complexity(code: str) -> Dict:
    complexity_score = len(re.findall(r'if|for|while|case|catch|try', code))  # Example complexity metric
    return {"complexity_score": complexity_score}

def generate_review_comments(code: str) -> list:
    comments = [
        "The function should handle edge cases.",
        "Consider breaking down this function into smaller units.",
        "This section could be optimized for performance.",
        "Review the algorithm used in this part.",
        "Add error handling for unexpected inputs.",
        "Ensure that all variables are initialized properly.",
        "Check if this code can be simplified or streamlined.",
        "Verify that all function arguments are necessary.",
        "Consider using a different data structure for efficiency.",
        "Ensure that the code adheres to the style guide.",
        "Add meaningful comments where necessary.",
        "Optimize the use of loops and conditionals.",
        "Remove any commented-out code that is no longer needed.",
        "Check for potential security issues in this code.",
        "Ensure that the code is modular and reusable."
    ]
    return comments

def profile_code_performance(code: str) -> Dict:
    profile = cProfile.Profile()
    profile.enable()
    
    # Execute the code
    exec_globals = {}
    exec_locals = {}
    try:
        exec(code, exec_globals, exec_locals)
    except Exception as e:
        profile.disable()
        return {"error": str(e)}
    
    profile.disable()
    
    # Create a stream to hold profiling data
    stream = io.StringIO()
    stats = pstats.Stats(profile, stream=stream).sort_stats(pstats.SortKey.TIME)
    stats.print_stats()
    
    # Return the profiling data
    profiling_data = stream.getvalue()
    return {"profiling_data": profiling_data}
