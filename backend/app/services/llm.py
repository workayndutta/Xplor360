import anthropic
from functools import lru_cache
from app.core.config import get_settings


@lru_cache
def get_anthropic_client() -> anthropic.Anthropic:
    settings = get_settings()
    return anthropic.Anthropic(api_key=settings.anthropic_api_key)


# Model IDs — change here to upgrade across the whole app
CLAUDE_PRIMARY = "claude-sonnet-4-6"      # Main reasoning tasks
CLAUDE_FAST = "claude-haiku-4-5-20251001" # Short, cheap tasks (captions, summaries)


async def complete(
    prompt: str,
    system: str = "",
    model: str = CLAUDE_PRIMARY,
    max_tokens: int = 4096,
    temperature: float = 0.7,
) -> str:
    """Single-turn LLM call. Returns the text response."""
    client = get_anthropic_client()
    messages = [{"role": "user", "content": prompt}]

    response = client.messages.create(
        model=model,
        max_tokens=max_tokens,
        temperature=temperature,
        system=system,
        messages=messages,
    )
    return response.content[0].text


async def complete_json(
    prompt: str,
    system: str = "",
    model: str = CLAUDE_PRIMARY,
    max_tokens: int = 4096,
) -> str:
    """LLM call that instructs the model to return valid JSON only."""
    json_system = (
        (system + "\n\n" if system else "")
        + "You must respond with valid JSON only. No markdown code fences, no explanation — pure JSON."
    )
    return await complete(prompt, system=json_system, model=model, max_tokens=max_tokens, temperature=0)
