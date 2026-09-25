import { NextResponse } from 'next/server';
import { BrandProject } from '@/lib/types';
import Groq from 'groq-sdk';

// Initialize the Groq SDK
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function callGemini(prompt: string, fallbackData: any, stage: string, retries = 3) {
  try {
    const response = await groq.chat.completions.create({
      model: 'deepseek-r1-distill-llama-70b',
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.2,
    });

    let content = response.choices[0]?.message?.content || '';
    
    // Strip out DeepSeek <think> tags and their contents
    content = content.replace(/<think>[\s\S]*?<\/think>/g, '');
    
    let cleanedJson = content.trim();
    
    // If it's wrapped in markdown code blocks, extract just the JSON part
    const jsonMatch = cleanedJson.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      cleanedJson = jsonMatch[1];
    }
    
    cleanedJson = cleanedJson.trim();
    
    // Fallback: if it still has garbage around it, try to find the first { and last }
    if (!cleanedJson.startsWith('{') && cleanedJson.includes('{')) {
      const start = cleanedJson.indexOf('{');
      const end = cleanedJson.lastIndexOf('}');
      if (start !== -1 && end !== -1) {
        cleanedJson = cleanedJson.substring(start, end + 1);
      }
    }

    return JSON.parse(cleanedJson);
  } catch (e: any) {
    if (e.status === 503 && retries > 0) {
      console.warn(`Groq API 503 High Demand for stage ${stage}. Retrying... (${retries} left)`);
      // Wait for 2 seconds before retrying
      await new Promise(resolve => setTimeout(resolve, 2000));
      return callGemini(prompt, fallbackData, stage, retries - 1);
    }
    
    console.error(`Groq API call failed for stage ${stage}. Error:`, e.message);
    
    // Inject the error directly into the UI so the user can see it
    return {
      ...fallbackData,
      understanding: {
        ...fallbackData.understanding,
        targetUser: `API ERROR DETECTED: ${e.message}. Please check your GROQ_API_KEY.`,
      }
    };
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stage, context, project } = body;
    const rawIdea = context?.rawIdea || project?.rawIdea || '';
    const understanding = context?.understanding || project?.understanding || {};
    const qaHistory = understanding.qaHistory || [];

    if (!rawIdea) {
      return NextResponse.json({ error: 'rawIdea is required.' }, { status: 400 });
    }

    if (stage === 'understand') {
      const prompt = `You are an expert brand strategist. Your goal is to analyze a raw product idea and diagnose the core understanding required for brand positioning.

Raw Idea: "${rawIdea}"

Prior Q&A (if any):
${qaHistory.length > 0 ? qaHistory.map((qa: any) => `Q: ${qa.question}\nA: ${qa.answer}`).join('\n') : 'None yet.'}

Instructions:
1. Return ONLY valid JSON matching the exact schema below. Do not include markdown formatting.
2. The schema represents the 'understanding' stage.
3. If you lack critical information to determine the targetUser, coreProblem, or constraints, generate up to 3 'openQuestions'.
4. If you have enough information to confidently define all fields, leave 'openQuestions' as an empty array [].
5. Do NOT invent a name, tagline, or visual style yet — this stage is strictly diagnostic.

Schema:
{
  "understanding": {
    "targetUser": "string (description of the target audience)",
    "coreProblem": "string (the main pain point being solved)",
    "constraints": "string (inferred or stated constraints like budget, time, or channel)",
    "openQuestions": ["string (question 1)", "string (question 2)", "string (question 3)"] // MAX 3. Empty array if nothing material is missing.
  }
}`;

      const fallbackData = {
        understanding: {
          targetUser: 'Indie hackers, startup founders, and product builders seeking a fast, cohesive brand strategy.',
          coreProblem: 'Founders spend weeks struggling with brand positioning, tone, and visual direction or thousands hiring agencies.',
          constraints: 'Limited budget ($0), tight launch timeline (under 48h), need for actionable developer/design handoff.',
          openQuestions: qaHistory.length > 0 ? [] : [
            `How will this differentiate from existing generic copy generators?`,
            'Should the brand voice lean heavily technical or broad consumer-friendly?',
          ]
        }
      };

      const data = await callGemini(prompt, fallbackData, stage);
      return NextResponse.json({ success: true, stage, data });
    }

    if (stage === 'position') {
      const prompt = `You are an expert brand strategist. Your goal is to define the strategic positioning for a new product, given its foundational context.

Raw Idea: "${rawIdea}"

Foundational Context (Understanding):
- Target User: ${understanding.targetUser || 'Unknown'}
- Core Problem: ${understanding.coreProblem || 'Unknown'}
- Constraints: ${understanding.constraints || 'Unknown'}

Instructions:
1. Return ONLY valid JSON matching the exact schema below. Do not include markdown formatting.
2. Define the product's market category, a unique differentiator, a one-sentence value proposition, and a competitive angle.
3. Provide a 'differentiatorJustification' (one sentence) that explicitly ties the differentiator back to the Target User's Core Problem. This reasoning trail is critical.

Schema:
{
  "positioning": {
    "category": "string (e.g. AI Brand Strategy Platform)",
    "differentiator": "string (what makes this impossible to copy overnight?)",
    "differentiatorJustification": "string (one sentence tying differentiator back to targetUser and coreProblem)",
    "valueProp": "string (primary value proposition in one sentence)",
    "competitiveAngle": "string (how to frame against incumbents)"
  }
}`;

      const fallbackData = {
        positioning: {
          category: 'AI Brand Strategy & Identity Platform',
          differentiator: 'Automated multi-stage brand forging with active red-teaming critique & consistency verification.',
          differentiatorJustification: 'By actively critiquing output, founders ensure they solve their core problem of poor positioning without hiring an expensive agency.',
          valueProp: 'Transform raw product concepts into battle-tested positioning, personality, visual direction, and launch assets.',
          competitiveAngle: 'Unlike basic AI copy generators, BrandForge acts as a stern brand strategist that audits conflicts and refines messaging.'
        }
      };

      const data = await callGemini(prompt, fallbackData, stage);
      return NextResponse.json({ success: true, stage, data });
    }

    if (stage === 'shape') {
      const positioning = context?.positioning || project?.positioning || {};
      
      const prompt = `You are an expert brand strategist. Your goal is to shape the brand personality, naming directions, tagline, and elevator pitch.

Raw Idea: "${rawIdea}"

Foundational Context (Understanding):
- Target User: ${understanding.targetUser || 'Unknown'}
- Core Problem: ${understanding.coreProblem || 'Unknown'}
- Constraints: ${understanding.constraints || 'Unknown'}

Positioning Context:
- Category: ${positioning.category || 'Unknown'}
- Differentiator: ${positioning.differentiator || 'Unknown'}
- Value Proposition: ${positioning.valueProp || 'Unknown'}

Instructions:
1. Return ONLY valid JSON matching the exact schema below. Do not include markdown formatting.
2. Define 3-5 brand personality traits, each with a one-line justification tied back to the target audience.
3. Define 2-3 traits explicitly to avoid and why.
4. Suggest 3 distinct naming directions/territories (e.g., "descriptive-literal", "abstract-evocative", "compound-invented"). Do not provide final names, but for each direction provide 2 example names and a rationale for why this direction fits the brand.
5. Provide a strong, memorable tagline (under 6 words).
6. Provide a one-sentence elevator pitch.

Schema:
{
  "personality": {
    "traits": [
      { "trait": "string", "justification": "string" }
    ],
    "traitsToAvoid": [
      { "trait": "string", "why": "string" }
    ]
  },
  "namingDirections": [
    { "direction": "string", "examples": ["string", "string"], "rationale": "string" }
  ],
  "tagline": "string",
  "onePitchLine": "string"
}`;

      const fallbackData = {
        personality: {
          traits: [
            { trait: 'Pragmatic', justification: 'Appeals to indie developers who value practical tools.' },
            { trait: 'Bold', justification: 'Cuts through the noise of generic B2B SaaS.' },
            { trait: 'Insightful', justification: 'Demonstrates deep understanding of brand strategy.' }
          ],
          traitsToAvoid: [
            { trait: 'Corporate Jargon', why: 'Alienates the indie hacker and solo founder audience.' },
            { trait: 'Gimmicky', why: 'Undermines the seriousness of the brand positioning architecture.' }
          ]
        },
        namingDirections: [
          { direction: 'Compound-Invented', examples: ['BrandForge', 'FoundryAI'], rationale: 'Evokes strength, craftsmanship, and raw ideas hammered into structured perfection.' },
          { direction: 'Descriptive-Literal', examples: ['BrandBuilder', 'PositioningCopilot'], rationale: 'Immediately communicates the core utility to fast-moving founders.' },
          { direction: 'Abstract-Evocative', examples: ['Aether', 'OnyxBrand'], rationale: 'Provides a blank canvas for a highly polished, sleek tech aesthetic.' }
        ],
        tagline: 'Forge your identity before launch.',
        onePitchLine: `${rawIdea} is an AI co-pilot that turns raw ideas into battle-ready brand positioning and launch collateral.`
      };

      const data = await callGemini(prompt, fallbackData, stage);
      return NextResponse.json({ success: true, stage, data });
    }

    if (stage === 'challenge') {
      const personality = context?.personality || project?.personality || {};
      const positioning = context?.positioning || project?.positioning || {};
      const tagline = context?.tagline || project?.tagline || '';
      
      const prompt = `You are a highly skeptical, ruthless Creative Director. Your job is to red-team the brand architecture generated so far.
Scan the positioning, personality, naming directions, and tagline for:
- Startup clichés (e.g. "Airbnb for X", "Uber of Y", "AI-powered revolutionary paradigm")
- Generic language that could apply to any company
- Contradictions (e.g. "Playful" personality but "Industrial" naming direction)
- Audience mismatch (e.g. corporate jargon for indie hackers)

Foundational Context:
- Target User: ${understanding.targetUser}
- Core Problem: ${understanding.coreProblem}
- Constraints: ${understanding.constraints}

Elements to Audit:
- Positioning: ${JSON.stringify(positioning)}
- Personality: ${JSON.stringify(personality)}
- Tagline: ${tagline}

Instructions:
1. Return ONLY valid JSON matching the exact schema below.
2. For each major issue found, provide the issue description, why it's a problem, a specific better alternative, the precise field to update (e.g. "tagline", "positioning.valueProp", "personality.traits.0.trait"), and the EXACT string to replace it with in 'suggestedValue'.
3. DO NOT invent filler critique. If there are genuinely zero issues, return an empty array for challengeLog.
4. Set 'status' to "pending" for all issues.

Schema:
{
  "challengeLog": [
    {
      "issue": "string",
      "why": "string",
      "betterAlternative": "string",
      "fieldToUpdate": "string",
      "suggestedValue": "string",
      "status": "pending"
    }
  ]
}`;

      const fallbackData = {
        challengeLog: [
          {
            issue: 'Tagline might sound overly developer-centric',
            why: "The word 'Forge' might suggest software engineering rather than brand strategy to non-tech founders.",
            betterAlternative: 'Shape your brand identity with precision before launch.',
            fieldToUpdate: 'tagline',
            suggestedValue: 'Shape your brand identity with precision before launch.',
            status: 'pending'
          }
        ]
      };

      const data = await callGemini(prompt, fallbackData, stage);
      return NextResponse.json({ success: true, stage, data });
    }

    if (stage === 'visualize') {
      const personality = context?.personality || project?.personality || {};
      const positioning = context?.positioning || project?.positioning || {};
      
      const prompt = `You are an expert brand designer. Your goal is to translate the brand strategy into a concrete visual direction.
Based on the brand's personality and positioning, define the core visual rules.

Foundational Context:
- Target User: ${understanding.targetUser}
- Category: ${positioning.category}
- Differentiator: ${positioning.differentiator}
- Personality Traits: ${JSON.stringify(personality.traits)}

Instructions:
1. Return ONLY valid JSON matching the exact schema below.
2. Provide a 'typographyStyle' description (e.g. "geometric sans, high x-height").
3. Recommend the closest available Google Font in 'recommendedGoogleFont' (e.g. "Inter", "Space Grotesk", "Outfit"). Just the font family name.
4. Provide a 'colorMood' with exactly 3 to 5 colors. For each, provide a hex code, a descriptive name, and a rationale tying it to the personality.
5. Provide a description of the 'imageryStyle' (e.g. photography, illustrations, 3D).
6. Suggest 'symbolicMotifs' to consider for brand assets.
7. Explicitly list 'shapesToAvoid' given the personality (e.g. no rounded bubbly shapes for a serious brand).

Schema:
{
  "visualDirection": {
    "typographyStyle": "string",
    "recommendedGoogleFont": "string",
    "colorMood": [
      { "hex": "string", "name": "string", "rationale": "string" }
    ],
    "imageryStyle": "string",
    "symbolicMotifs": "string",
    "shapesToAvoid": "string"
  }
}`;

      const fallbackData = {
        visualDirection: {
          typographyStyle: 'Modern neo-grotesk sans-serif paired with crisp monospaced accents.',
          recommendedGoogleFont: 'Inter',
          colorMood: [
            { hex: '#0F172A', name: 'Deep Obsidian', rationale: 'Provides a stark, high-contrast canvas that feels premium and tech-forward.' },
            { hex: '#F59E0B', name: 'Electric Amber', rationale: 'Injects pragmatic energy and draws attention to primary actions.' },
            { hex: '#6366F1', name: 'Vibrant Indigo', rationale: 'Adds a touch of visionary creativity without losing the serious tech vibe.' }
          ],
          imageryStyle: 'High-contrast UI previews, 3D frosted glassmorphic geometry, clean wireframe schematics.',
          symbolicMotifs: 'Grids, interconnected nodes, forged geometric sparks.',
          shapesToAvoid: 'Childish rounded blobs, pastel watercolor gradients, clip-art style generic icons.'
        }
      };

      const data = await callGemini(prompt, fallbackData, stage);
      return NextResponse.json({ success: true, stage, data });
    }

    if (stage === 'consistency') {
      const personality = context?.personality || project?.personality || {};
      const positioning = context?.positioning || project?.positioning || {};
      const tagline = context?.tagline || project?.tagline || '';
      const namingDirections = context?.namingDirections || project?.namingDirections || [];
      const selectedDirection = namingDirections.find((d: any) => d.selected);
      const visualDirection = context?.visualDirection || project?.visualDirection || {};
      
      const prompt = `You are a strict Brand Architect performing a final consistency audit.
Your job is to look at the ENTIRE brand system and ensure all parts cohere into ONE single unified brand.
This runs AFTER an initial challenge phase, so you are looking specifically for conflicts that emerged from combining decisions across stages.

Brand System:
- Name Direction: ${JSON.stringify(selectedDirection)}
- Tagline: ${tagline}
- Personality: ${JSON.stringify(personality.traits)}
- Visual Direction: ${JSON.stringify(visualDirection)}
- Positioning: ${JSON.stringify(positioning)}

Instructions:
1. Return ONLY valid JSON matching the exact schema below.
2. Check for conflicts (e.g. the visual color mood contradicts the personality traits, or the tagline tone doesn't match the selected naming direction).
3. If conflicts exist, list them in 'conflicts' with the 'field' that is problematic and the 'issue'. Set 'resolved' to false.
4. If everything coheres perfectly, return an empty array for conflicts and set 'resolved' to true.

Schema:
{
  "consistencyReport": {
    "conflicts": [
      { "field": "string (e.g. 'tagline', 'visualDirection.colorMood')", "issue": "string" }
    ],
    "resolved": "boolean"
  }
}`;

      const fallbackData = {
        consistencyReport: {
          conflicts: [],
          resolved: true
        }
      };

      const data = await callGemini(prompt, fallbackData, stage);
      return NextResponse.json({ success: true, stage, data });
    }





    if (stage === 'launch') {
      const personality = context?.personality || project?.personality || {};
      const positioning = context?.positioning || project?.positioning || {};
      const tagline = context?.tagline || project?.tagline || '';
      
      const prompt = `You are a world-class Copywriter. The brand system is finalized and coherent.
Your job is to generate the final launch assets.

Brand System:
- Personality: ${JSON.stringify(personality.traits)}
- Tagline: ${tagline}
- Positioning: ${JSON.stringify(positioning)}
- Target User: ${understanding.targetUser}
- Core Problem: ${understanding.coreProblem}

Instructions:
1. Return ONLY valid JSON matching the exact schema below.
2. Write a 'landingHeadline' and a supporting 'landingSubhead'.
3. Write a 'onePagePitch' broken down into 'problem', 'solution', 'whyNow', and a 'personalityOneLiner' (a quick summary of the brand's vibe).
4. Write a 'socialPost' to announce the brand.
5. IMPORTANT: Write ALL copy in the voice implied by the personality traits. Don't just state the traits—demonstrate them in the copy (e.g. if the brand is 'rebellious', the copy should be punchy and provocative).

Schema:
{
  "launchAssets": {
    "landingHeadline": "string",
    "landingSubhead": "string",
    "onePagePitch": {
      "problem": "string",
      "solution": "string",
      "whyNow": "string",
      "personalityOneLiner": "string"
    },
    "socialPost": "string"
  }
}`;

      const fallbackData = {
        launchAssets: {
          landingHeadline: 'Stop Guessing Your Brand Identity.',
          landingSubhead: 'Forge it in minutes with AI.',
          onePagePitch: {
            problem: 'Founders lack branding expertise.',
            solution: 'An AI-powered co-pilot that stress-tests and builds your positioning.',
            whyNow: 'Because building a generic brand is no longer an option.',
            personalityOneLiner: 'Crisp, bold, and unapologetically pragmatic.'
          },
          socialPost: '🚀 Excited to announce BrandForge! Turn raw product ideas into complete brand positioning in minutes.'
        }
      };

      const data = await callGemini(prompt, fallbackData, stage);
      return NextResponse.json({ success: true, stage, data });
    }

    return NextResponse.json({ error: `Unknown stage: ${stage}` }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to process AI request' },
      { status: 500 }
    );
  }
}
