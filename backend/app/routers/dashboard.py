from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from .ai_analysis import analyze_code, analyze_code_complexity, generate_review_comments, profile_code_performance

router = APIRouter()

class CodeInput(BaseModel):
    code: str
    language: str

@router.post("/analyze")
async def analyze_code_endpoint(request: CodeInput):
    code = request.code
    language = request.language
    try:
        results = analyze_code(code, language)
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/complexity")
async def code_complexity_endpoint(request: CodeInput):
    code = request.code
    try:
        complexity = analyze_code_complexity(code)
        return {"complexity": complexity}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/review")
async def automated_code_review_endpoint(request: CodeInput):
    code = request.code
    language = request.language
    try:
        review_comments = generate_review_comments(code)
        return {"comments": review_comments}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/optimize")
async def code_optimization_endpoint(request: CodeInput):
    code = request.code
    language = request.language
    try:
        optimized_code = optimize_code(code, language)
        return {"optimized_code": optimized_code}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/profile")
async def code_performance_profiling_endpoint(request: CodeInput):
    code = request.code
    try:
        performance = profile_code_performance(code)
        return {"performance": performance}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def optimize_code(code: str, language: str) -> str:
    optimized_code = code

    # Python-specific optimizations
    if language == 'python':
        optimized_code = re.sub(r'for i in range(len\(.+\)):', 'for i, _ in enumerate(\1):', optimized_code)
        optimized_code = re.sub(r'\bprint\((.+)\)\s*#\s*DEBUG\b', '', optimized_code)
        optimized_code = re.sub(r'(\bdef\b.+?)\s*->\s*None', r'\1', optimized_code)
        optimized_code = re.sub(r'(\bimport\b\s+\w+)', lambda m: f'from {m.group(1).split()[1]} import {m.group(1).split()[1]}', optimized_code)

    # Java-specific optimizations
    elif language == 'java':
        optimized_code = re.sub(r'\bpublic static void main\(String\[\] args\)', '', optimized_code)
        optimized_code = re.sub(r'\bfor\s*\((\w+)\s+(\w+)\s*:\s*(\w+)\)', r'for (\1 \2 : \3)', optimized_code)
        optimized_code = re.sub(r'\bSystem\.out\.println\((.+)\)\s*//\s*DEBUG\b', '', optimized_code)

    # JavaScript-specific optimizations
    elif language == 'javascript':
        optimized_code = re.sub(r'console\.log\((.+)\)\s*//\s*DEBUG\b', '', optimized_code)
        optimized_code = re.sub(r'function\s+(\w+)\s*\((.*?)\)\s*{', r'const \1 = (\2) => {', optimized_code)
        optimized_code = re.sub(r'\bvar\b\s+(\w+)\s*=', 'let \1 =', optimized_code)

    # Go-specific optimizations
    elif language == 'go':
        optimized_code = re.sub(r'fmt\.Println\((.+)\)\s*//\s*DEBUG\b', '', optimized_code)
        optimized_code = re.sub(r'\bfor\s+(\w+)\s*:=\s*0;\s*\1\s*<\s*(\w+);\s*\1\s*\+\+', r'for \1 := 0; \1 < \2; \1++', optimized_code)

    # Ruby-specific optimizations
    elif language == 'ruby':
        optimized_code = re.sub(r'puts\s+(.+)\s*#\s*DEBUG\b', '', optimized_code)
        optimized_code = re.sub(r'\bdef\s+(\w+)\s*\((.*?)\)\s*', r'def \1(\2) {', optimized_code)

    # PHP-specific optimizations
    elif language == 'php':
        optimized_code = re.sub(r'\becho\s*(.+)\s*;//\s*DEBUG\b', '', optimized_code)
        optimized_code = re.sub(r'\bfor\s*\((\w+)\s*=\s*0;\s*\1\s*<\s*(\w+);\s*\1\+\+\)', r'for (\1 = 0; \1 < \2; \1++)', optimized_code)

    return optimized_code
