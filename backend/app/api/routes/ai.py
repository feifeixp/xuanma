from typing import Optional

import json
import asyncio
from typing import AsyncGenerator

from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sse_starlette.sse import EventSourceResponse

from app.core.engine import calculate_chart

router = APIRouter()

# DeepSeek API config — override via env vars
import os
DEEPSEEK_API_KEY = os.environ.get("DEEPSEEK_API_KEY", "sk-ce194c8aa5794610ac2e5a00fbfee37e")
DEEPSEEK_BASE_URL = os.environ.get("DEEPSEEK_BASE_URL", "https://api.deepseek.com")
DEEPSEEK_MODEL = os.environ.get("DEEPSEEK_MODEL", "deepseek-chat")

SYSTEM_PROMPT = """你是一位精通奇门遁甲的大师，名叫「玄码」。你的解读风格：
1. 先概述盘面基本信息（阴阳遁、局数、节气、四柱）
2. 定位用神（根据用户问的事情，找到盘面对应的宫位）
3. 分析用神宫位的星、门、神、奇仪组合
4. 给出吉凶判断和行动建议
5. 用词专业但不晦涩，让爱好者能理解

每个宫位包含：
- 地盘天干（奇仪）
- 天盘天干
- 九星（天蓬/天芮/天冲/天辅/天禽/天心/天柱/天任/天英）
- 八门（休/死/伤/杜/开/惊/生/景）
- 八神（值符/螣蛇/太阴/六合/白虎/玄武/九地/九天）

请在解读中引用具体的星门神组合，不要泛泛而谈。"""

QUESTION_PROMPTS = {
    "general": "请对这个奇门遁甲盘面做一个全面的解读，包括整体趋势、关键格局、以及各个方面的吉凶提示。",
    "career": "请从事业/工作的角度解读这个盘面，重点分析：升迁机会、项目进展、合作关系、以及需要注意的风险。",
    "relationship": "请从感情/人际关系的角度解读这个盘面，分析桃花运、伴侣关系、人际交往的吉凶方向。",
    "health": "请从健康角度解读这个盘面，分析身体状况趋势、需要注意的方面、以及养生建议。",
    "wealth": "请从财运角度解读这个盘面，分析正财偏财、投资方向、以及需要注意的破财信号。",
}


class InterpretRequest(BaseModel):
    chart_data: Optional[dict] = None  # if None, use current time
    question_type: str = "general"  # general, career, relationship, health, wealth
    custom_question: Optional[str] = None  # overrides question_type
    api_key: Optional[str] = None  # user-provided API key (optional)


async def stream_deepseek(
    chart: dict,
    question: str,
    api_key: Optional[str] = None,
) -> AsyncGenerator[str, None]:
    """Stream DeepSeek response via SSE"""
    import httpx

    key = api_key or DEEPSEEK_API_KEY

    user_message = json.dumps(chart, ensure_ascii=False, indent=2)
    user_prompt = f"以下是一个奇门遁甲盘面的完整数据：\n\n```json\n{user_message}\n```\n\n{question}"

    payload = {
        "model": DEEPSEEK_MODEL,
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        "stream": True,
        "temperature": 0.7,
        "max_tokens": 4096,
    }

    async with httpx.AsyncClient(timeout=120.0) as client:
        async with client.stream(
            "POST",
            f"{DEEPSEEK_BASE_URL}/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json",
            },
            json=payload,
        ) as response:
            if response.status_code != 200:
                body = await response.aread()
                yield f"data: {json.dumps({'error': f'DeepSeek API error {response.status_code}: {body.decode()[:200]}'})}\n\n"
                return

            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    data_str = line[6:]
                    if data_str == "[DONE]":
                        yield "data: [DONE]\n\n"
                        break
                    try:
                        data = json.loads(data_str)
                        delta = data.get("choices", [{}])[0].get("delta", {})
                        content = delta.get("content", "")
                        if content:
                            yield f"data: {json.dumps({'content': content})}\n\n"
                    except json.JSONDecodeError:
                        continue


@router.post("/interpret")
async def interpret(request: InterpretRequest):
    """Stream AI interpretation of a Qimen Dunjia chart"""
    if request.chart_data:
        chart = request.chart_data
    else:
        chart = calculate_chart()

    question = request.custom_question or QUESTION_PROMPTS.get(
        request.question_type, QUESTION_PROMPTS["general"]
    )

    return EventSourceResponse(stream_deepseek(chart, question, request.api_key))
