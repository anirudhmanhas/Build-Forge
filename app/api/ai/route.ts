import { NextResponse } from 'next/server';
import { BrandProject } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stage, context, project } = body;

    const rawIdea = context?.rawIdea || project?.rawIdea || 'AI Powered Developer Tools';

    // Simulated network delay for realistic experience
    await new Promise((resolve) => setTimeout(resolve, 800));

    let mockResponse: Partial<BrandProject> = {};

    switch (stage) {
      case 'understand':
        mockResponse = {
          understanding: {
            targetUser: context?.targetUser || 'Indie hackers, startup founders, and product builders seeking a fast, cohesive brand strategy.',
            coreProblem: context?.coreProblem || 'Founders spend weeks struggling with brand positioning, tone, and visual direction or thousands hiring agencies.',
            constraints: context?.constraints || 'Limited budget ($0), tight launch timeline (under 48h), need for actionable developer/design handoff.',
            openQuestions: [
              `How will ${rawIdea} differentiate from existing generic copy generators?`,
              'Should the brand voice lean heavily technical or broad consumer-friendly?',
              'What specific design tokens and typography pairings work best for early adopters?'
            ]
          }
        };
        break;

      case 'position':
        mockResponse = {
          positioning: {
            category: 'AI Brand Strategy & Identity Platform',
            differentiator: 'Automated multi-stage brand forging with active red-teaming critique & consistency verification.',
            valueProp: 'Transform raw product concepts into battle-tested positioning, personality, visual direction, and launch assets.',
            competitiveAngle: 'Unlike basic AI copy generators, BrandForge acts as a stern brand strategist that audits conflicts and refines messaging.'
          }
        };
        break;

      case 'shape':
        mockResponse = {
          personality: {
            traits: ['Pragmatic', 'Bold', 'Insightful', 'Refined', 'Tech-Forward'],
            traitsToAvoid: ['Corporate Jargon', 'Gimmicky', 'Over-promising', 'Childish'],
            justification: 'Resonates with serious builders who value speed, substance, and high aesthetic polish.'
          },
          namingDirections: [
            { name: 'BrandForge', rationale: 'Evokes strength, craftsmanship, and raw ideas hammered into structured perfection.' },
            { name: 'FoundryAI', rationale: 'Industrial precision combined with modern intelligent synthesis.' },
            { name: 'AetherBrand', rationale: 'Lightweight, swift, and visionary brand architecture.' }
          ],
          tagline: 'Forge your identity before the world sees it.',
          onePitchLine: `${rawIdea} is an AI co-pilot that turns raw ideas into battle-ready brand positioning, visual guidelines, and launch collateral.`
        };
        break;

      case 'challenge':
        mockResponse = {
          challengeLog: [
            {
              issue: 'Tagline might sound overly developer-centric',
              why: "The word 'Forge' might suggest software engineering rather than brand strategy to non-tech founders.",
              betterAlternative: 'Shape your brand identity with precision before launch.'
            },
            {
              issue: 'Target user scope is initially too broad',
              why: 'Indie creators and enterprise founders require different tone guidelines and visual directions.',
              betterAlternative: 'Narrow focus to tech-forward B2B SaaS and AI product creators for v1.'
            },
            {
              issue: 'Visual direction risks feeling like standard dark-mode templates',
              why: 'Dark mode with neon accents is common in dev tools.',
              betterAlternative: 'Use Obsidian dark mode with custom geometric glassmorphic cards and warm electric amber highlights.'
            }
          ]
        };
        break;

      case 'visualize':
        mockResponse = {
          visualDirection: {
            typographyStyle: 'Modern neo-grotesk sans-serif (Inter / Plus Jakarta Sans) paired with crisp monospaced accents.',
            colorMood: 'Deep Obsidian (#0F172A), Electric Amber (#F59E0B), Vibrant Indigo (#6366F1), Slate Grey (#64748B).',
            imageryStyle: 'High-contrast UI previews, 3D frosted glassmorphic geometry, clean wireframe schematics.',
            shapesToAvoid: 'Childish rounded blobs, pastel watercolor gradients, clip-art style generic icons.'
          }
        };
        break;

      case 'consistency':
      case 'launch':
        mockResponse = {
          consistencyReport: {
            conflicts: [
              'Original tagline was slightly technical compared to the accessible product positioning.',
              'Softened visual gradients to maintain a polished, high-end feel matching the pragmatic personality traits.'
            ],
            resolved: true
          },
          launchAssets: {
            landingHeadline: 'Stop Guessing Your Brand Identity. Forge It in Minutes.',
            onePagePitch: `${rawIdea} empowers founders to generate, stress-test, and polish their entire brand identity—from positioning to visual direction and social copy—all in a structured 6-step flow.`,
            socialPost: `🚀 Excited to announce BrandForge! Turn raw product ideas into complete brand positioning, visual directions, and launch kits in minutes. Check it out: https://brandforge.ai #buildinpublic #ai`
          }
        };
        break;

      default:
        return NextResponse.json({ error: `Unknown stage: ${stage}` }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      stage,
      data: mockResponse
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Failed to process AI request' },
      { status: 500 }
    );
  }
}
