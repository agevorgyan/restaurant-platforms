# Enterprise AI Gateway Platform (`@saas/ai`)

## Overview
The **Enterprise AI Gateway** provides unified, provider-agnostic model inference, intelligent model routing, runtime provider failover, token cost tracking, and health monitoring across the Enterprise Restaurant SaaS ERP platform.

### Scope Boundaries
- **Model Abstraction & Routing**: Owns provider abstraction, model capability selection, provider failover, cost tracking, and unified inference.
- **Strict Isolation**: Application code is 100% provider-agnostic (`ProviderAdapterPort`). Provider SDKs (OpenAI, Anthropic, Gemini, Azure, Bedrock, Ollama, LM Studio, vLLM) are isolated strictly inside infrastructure adapters.
- **NO RAG, NO AI Agents, NO Prompt Execution Logic, NO Business Logic**.

---

## Supported Providers & Model Capabilities

### Supported Providers
- OpenAI (`OPENAI`)
- Anthropic (`ANTHROPIC`)
- Google Gemini (`GOOGLE_GEMINI`)
- Azure OpenAI (`AZURE_OPENAI`)
- AWS Bedrock (`AWS_BEDROCK`)
- Ollama (`OLLAMA`)
- LM Studio (`LM_STUDIO`)
- vLLM (`VLLM`)
- Custom Provider (`CUSTOM`)

### Supported Model Types
- `CHAT`, `COMPLETION`, `EMBEDDING`, `VISION`, `SPEECH`, `REASONING`, `FUNCTION_CALLING`, `MULTIMODAL`

---

## REST API Endpoints

Base Path: `/ai`

- `GET /ai/providers`: Query registered AI providers catalog.
- `POST /ai/providers`: Register a new AI provider definition.
- `GET /ai/models`: Query catalog of supported models & context window sizes.
- `POST /ai/inference`: Execute unified AI inference with automatic routing & failover.
- `GET /ai/inference/history`: Query audit history log of inference executions.
- `GET /ai/providers/health`: Query health dashboard for all configured AI providers.
- `GET /ai/costs`: Query token spend and cost tracking analytics.

---

## Automatic Provider Failover Pipeline

```
Inference Request (POST /ai/inference)
           │
           ▼
[1. CostTrackingService] (Check tenant budget limit)
           │
           ▼
[2. RoutingService] (Select top-priority HEALTHY provider e.g. OpenAI)
           │
           ▼
[3. ProviderAdapter.executeInference] ──► [ERROR / 503 Rate Limit]
           │
           ▼
[4. FailoverService] (Trigger ProviderFailoverTriggeredEvent & switch to Anthropic / Gemini)
           │
           ▼
[5. Successful Response & Token Cost Accounting]
```
