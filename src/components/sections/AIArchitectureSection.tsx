import { Separator } from "@/components/ui/separator";
import { Sparkles, Bot, Languages, Image as ImageIcon, BarChart, Search, BrainCircuit, MessageSquare, Layers } from "lucide-react";

export function AIArchitectureSection() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI & Machine Learning</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Intelligent features powering automated menu creation, translation, and analytics.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Core AI Capabilities */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm md:col-span-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Core AI Capabilities
          </h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2"><Bot className="h-4 w-4" /> AI Menu Builder</h3>
                <p className="text-sm text-muted-foreground">Extracts menu items, descriptions, and prices directly from a PDF or photo of a physical menu. Automatically categorizes items and suggests modifiers.</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2"><Languages className="h-4 w-4" /> AI Translator</h3>
                <p className="text-sm text-muted-foreground">Context-aware menu translation. Understands culinary terms (e.g., translating "Mirepoix" or "Sous-vide" correctly rather than literally) across 50+ languages.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2"><ImageIcon className="h-4 w-4" /> AI Image Generator</h3>
                <p className="text-sm text-muted-foreground">Generates appetizing placeholder images for menu items lacking photography, utilizing models tuned for food aesthetics.</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2"><BarChart className="h-4 w-4" /> AI Analytics</h3>
                <p className="text-sm text-muted-foreground">Predicts peak hours and inventory depletion. Natural language queries for restaurant owners (e.g., "What was my most profitable item last weekend?").</p>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Experience AI */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BrainCircuit className="h-5 w-5" />
            Customer Experience
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><Sparkles className="h-4 w-4" /> AI Upsell</h3>
              <p className="text-sm text-muted-foreground">Analyzes current cart contents and historical pairing data to suggest the highest-converting add-ons (e.g., suggesting a specific wine pairing for a steak).</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><Search className="h-4 w-4" /> Semantic Search</h3>
              <p className="text-sm text-muted-foreground">Vector-based search allows customers to search by craving or dietary need (e.g., "something spicy and vegan") rather than exact item names.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg flex items-center gap-2"><MessageSquare className="h-4 w-4" /> AI Assistant</h3>
              <p className="text-sm text-muted-foreground">Chat interface for diners to ask about ingredients, allergens, or get personalized recommendations based on their taste profile.</p>
            </div>
          </div>
        </div>

        {/* Infrastructure & Models */}
        <div className="space-y-6 rounded-xl border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Infrastructure & Models
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">Model Switching (Gemini, Claude, OpenAI)</h3>
              <p className="text-sm text-muted-foreground">Dynamically routes prompts to the best-suited LLM. Gemini for complex vision tasks (Menu OCR), Claude for nuanced translation, and OpenAI for fast structural data extraction.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg">Prompt Management</h3>
              <p className="text-sm text-muted-foreground">Centralized prompt registry in the database. Allows tweaking instructions (e.g., "Make menu descriptions more poetic") without deploying new code.</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold text-lg">Cost & Rate Control</h3>
              <p className="text-sm text-muted-foreground">Tracks token usage per tenant. Implements caching for identical translations or queries to drastically reduce API costs.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
