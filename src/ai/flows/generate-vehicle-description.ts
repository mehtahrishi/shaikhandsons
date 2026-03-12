'use server';
/**
 * @fileOverview An AI agent for generating engaging, editorial-style marketing descriptions for electronic vehicles.
 *
 * - generateVehicleDescription - A function that handles the vehicle description generation process.
 * - GenerateVehicleDescriptionInput - The input type for the generateVehicleDescription function.
 * - GenerateVehicleDescriptionOutput - The return type for the generateVehicleDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateVehicleDescriptionInputSchema = z.object({
  make: z.string().describe('The make of the electronic vehicle (e.g., "Veridian").'),
  model: z.string().describe('The model of the electronic vehicle (e.g., "Aether").'),
  year: z.number().int().min(1900).describe('The model year of the electronic vehicle.'),
  trim: z.string().optional().describe('The specific trim level of the vehicle (e.g., "Grand Touring").'),
  batteryRangeKm: z.number().int().min(1).describe('The estimated battery range in kilometers.'),
  horsepower: z.number().int().min(1).describe('The maximum horsepower of the vehicle.'),
  zeroToSixtySeconds: z.number().min(0.1).describe('The acceleration time from 0 to 60 mph in seconds.'),
  features: z.array(z.string()).describe('A list of key features of the vehicle.'),
  designPhilosophy: z.string().optional().describe('A brief description of the vehicle\'s design philosophy or unique selling proposition.'),
});
export type GenerateVehicleDescriptionInput = z.infer<typeof GenerateVehicleDescriptionInputSchema>;

const GenerateVehicleDescriptionOutputSchema = z.object({
  description: z.string().describe("An engaging, editorial-style marketing description for the electronic vehicle."),
});
export type GenerateVehicleDescriptionOutput = z.infer<typeof GenerateVehicleDescriptionOutputSchema>;

export async function generateVehicleDescription(input: GenerateVehicleDescriptionInput): Promise<GenerateVehicleDescriptionOutput> {
  return generateVehicleDescriptionFlow(input);
}

const generateVehicleDescriptionPrompt = ai.definePrompt({
  name: 'generateVehicleDescriptionPrompt',
  input: {schema: GenerateVehicleDescriptionInputSchema},
  output: {schema: GenerateVehicleDescriptionOutputSchema},
  prompt: `
    You are a luxury automotive marketing copywriter specializing in high-end electric vehicles. Your task is to create an engaging, editorial-style marketing description for a new electronic vehicle.
    The description should be aspirational, sophisticated, and highlight its cutting-edge technology, luxurious design, exhilarating performance, and environmental benefits.
    Aim for a tone that appeals to a discerning, high-end clientele.

    Here are the detailed vehicle specifications:
    Make: {{{make}}}
    Model: {{{model}}}
    Year: {{{year}}}
    {{#if trim}}Trim: {{{trim}}}{{/if}}
    Battery Range: {{{batteryRangeKm}}} km
    Horsepower: {{{horsepower}}} HP
    0-60 mph: {{{zeroToSixtySeconds}}} seconds

    {{#if features}}
    Key Features:
    {{#each features}}
    - {{{this}}}
    {{/each}}
    {{/if}}

    {{#if designPhilosophy}}
    Design Philosophy: {{{designPhilosophy}}}
    {{/if}}

    Craft a compelling and immersive description that tells a story, evokes emotion, and positions the vehicle as a leader in its class. The description should be at least 300 words long.
    Ensure the output is a JSON object with a single field named 'description' containing the generated text.
  `,
});

const generateVehicleDescriptionFlow = ai.defineFlow(
  {
    name: 'generateVehicleDescriptionFlow',
    inputSchema: GenerateVehicleDescriptionInputSchema,
    outputSchema: GenerateVehicleDescriptionOutputSchema,
  },
  async input => {
    const {output} = await generateVehicleDescriptionPrompt(input);
    return output!;
  }
);
