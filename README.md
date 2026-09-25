# BrandForge ✦

**AI-Powered Brand Identity Co-Pilot for Indie Developers & Founders**

BrandForge is a 7-stage generative AI workflow built with Next.js and the Gemini API. It transforms a raw, fragmented product idea into a fully documented, stress-tested brand architecture in minutes. Instead of just generating a generic logo or name, BrandForge acts as a virtual brand strategist, guiding you through a rigorous, professional branding process.

## 🚀 The 7-Stage Workflow

1. **Understand:** The AI acts as a strategist, asking clarifying questions to nail down your target user and core problem.
2. **Position:** Defines your category, value proposition, and competitive differentiator with a clear rationale.
3. **Shape:** Establishes the brand's personality traits (and anti-traits), naming territories, and a punchy tagline.
4. **Challenge (Red-Team):** An aggressive "Skeptical Creative Director" AI scans your decisions for startup clichés, generic fluff, and contradictions, forcing you to apply smarter alternatives.
5. **Visualize:** Translates the strategy into a visual system—recommending typography, generating a live Google Font mock wordmark, mapping color hex codes to psychological traits, and defining visual anti-patterns.
6. **Consistency Audit:** A final structural check ensuring all disparate decisions (voice, visuals, positioning) cohere into a single, unified identity.
7. **Deliver & Launch:** Generates high-converting launch copy (landing page headlines, social posts, elevator pitches) written explicitly in the brand's new voice, alongside an exportable JSON/HTML Brand Kit.

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Styling:** Tailwind CSS (Dark Mode, Glassmorphism UI)
- **AI Integration:** `@google/genai` (Gemini API)
- **Language:** TypeScript
- **State:** React Hooks (Local State / JSON Payload)

## ⚡ Quick Start

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set your Gemini API key in a `.env.local` file:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) and start forging your brand.

## 📦 Exporting
At the end of the workflow, you can export your entire Brand Kit as a `.json` file for your database, or as a cleanly styled HTML page to print or share with your team.
