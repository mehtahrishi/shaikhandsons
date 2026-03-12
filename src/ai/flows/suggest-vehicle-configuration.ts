'use server';
/**
 * @fileOverview An AI agent that suggests vehicle configuration options and packages.
 *
 * - suggestVehicleConfiguration - A function that suggests popular or complementary configuration options and packages.
 * - AdminVehicleConfigurationSuggesterInput - The input type for the suggestVehicleConfiguration function.
 * - AdminVehicleConfigurationSuggesterOutput - The return type for the suggestVehicleConfiguration function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdminVehicleConfigurationSuggesterInputSchema = z.object({
  make: z.string().describe('The make of the vehicle.'),
  model: z.string().describe('The model of the vehicle.'),
  year: z.number().describe('The model year of the vehicle.'),
  baseFeatures: z.array(z.string()).describe('A list of standard features included with the vehicle.'),
  availableOptions: z.array(z.string()).describe('A list of all individual options and components available for this vehicle model.'),
  targetAudience: z.string().describe('A description of the primary target audience for this vehicle, guiding suggestion relevance.'),
});
export type AdminVehicleConfigurationSuggesterInput = z.infer<typeof AdminVehicleConfigurationSuggesterInputSchema>;

const AdminVehicleConfigurationSuggesterOutputSchema = z.object({
  suggestedPackages: z.array(
    z.object({
      name: z.string().describe('The name of the suggested package.'),
      description: z.string().describe('A brief description of what the package offers.'),
      includedOptions: z.array(z.string()).describe('A list of specific options included in this package, chosen from the availableOptions.'),
    })
  ).describe('A list of suggested vehicle packages, bundling complementary options.'),
  suggestedIndividualOptions: z.array(z.string()).describe('A list of highly recommended individual options that are not part of a suggested package, chosen from the availableOptions.'),
  rationale: z.string().describe('A brief explanation for the suggested packages and options, considering the target audience.'),
});
export type AdminVehicleConfigurationSuggesterOutput = z.infer<typeof AdminVehicleConfigurationSuggesterOutputSchema>;

export async function suggestVehicleConfiguration(input: AdminVehicleConfigurationSuggesterInput): Promise<AdminVehicleConfigurationSuggesterOutput> {
  return adminVehicleConfigurationSuggesterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adminVehicleConfigurationSuggesterPrompt',
  input: {schema: AdminVehicleConfigurationSuggesterInputSchema},
  output: {schema: AdminVehicleConfigurationSuggesterOutputSchema},
  prompt: `You are an expert vehicle product manager specializing in electronic vehicle configurations. Your task is to suggest popular and complementary configuration options and packages for a new vehicle model, based on its features and target audience.\n\nConsider the following details for the vehicle:\n\nMake: {{{make}}}\nModel: {{{model}}}\nYear: {{{year}}}\nBase Features:\n{{#each baseFeatures}}- {{{this}}}\n{{/each}}\nAvailable Options:\n{{#each availableOptions}}- {{{this}}}\n{{/each}}\nTarget Audience: {{{targetAudience}}}\n\nBased on this information, propose 2-3 compelling packages that bundle complementary options, and 2-3 highly recommended individual options. Ensure that all suggested options and package components are selected directly from the 'Available Options' list provided. Provide a brief rationale for your suggestions, considering the specified target audience.`,
});

const adminVehicleConfigurationSuggesterFlow = ai.defineFlow(
  {
    name: 'adminVehicleConfigurationSuggesterFlow',
    inputSchema: AdminVehicleConfigurationSuggesterInputSchema,
    outputSchema: AdminVehicleConfigurationSuggesterOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
