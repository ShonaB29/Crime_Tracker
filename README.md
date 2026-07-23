# CrimeTracker AI

CrimeTracker is an AI-powered crime analysis platform. It features a schema-aware Text-to-SQL module that translates natural language questions into structured PostgreSQL queries and executes them against the database.

## Configuration & LLM Integration

The Text-to-SQL engine automatically detects API keys configured in your environment. You can set them in a `.env` file at the root of the project:

```env
# Google Gemini API Key (Uses gemini-1.5-flash)
GEMINI_API_KEY="your-gemini-api-key"

# OpenAI API Key (Falls back to gpt-4o-mini if Gemini is not configured)
OPENAI_API_KEY="your-openai-api-key"
```

### LLM Resolution Hierarchy:

1. **Google Gemini**: If `GEMINI_API_KEY` is present in `.env`, the system automatically routes queries to `gemini-1.5-flash`.
2. **OpenAI GPT**: If `GEMINI_API_KEY` is absent but `OPENAI_API_KEY` is present, the system routes queries to `gpt-4o-mini`.
3. **Offline Query Compiler**: If no API keys are present (or if the API calls fail), the system runs an intent-aware dynamic query compiler simulator that builds correct PostgreSQL queries matching the schema.

### Core Features:

- **Dynamic Schema Awareness**: Fetches active PostgreSQL `information_schema` at runtime to construct accurate query representations.
- **SQL Validation Loop**: Sanitizes and validates query safety (`SELECT` only, no mutation keywords) and performs syntax compilation checks before execution.
- **Collapsible Frontend Metrics**: Displays the generated query, tabular execution results, rows returned, execution time, and natural language explanations directly inside the chat interface.
