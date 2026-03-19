'use server';
/**
 * @fileOverview A Genkit flow for generating compelling and detailed property descriptions based on structured input data.
 *
 * - generatePropertyDescription - A function that handles the property description generation process.
 * - PropertyDescriptionGeneratorInput - The input type for the generatePropertyDescription function.
 * - PropertyDescriptionGeneratorOutput - The return type for the generatePropertyDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PropertyDescriptionGeneratorInputSchema = z.object({
  title: z.string().describe('The title of the property listing.'),
  type: z.enum(['rent', 'sale']).describe('Whether the property is for rent or sale.'),
  propertyType: z.enum(['house', 'flat', 'land', 'commercial']).describe('The type of property.'),
  price: z.number().describe('The price of the property.'),
  areaSqFt: z.number().describe('The area of the property in square feet.'),
  address: z.string().describe('The full address of the property.'),
  amenities: z.array(z.string()).describe('A list of key amenities the property offers.'),
  nearbyPlaces: z.array(z.string()).describe('A list of significant nearby places like schools, hospitals, or bus stops.'),
});
export type PropertyDescriptionGeneratorInput = z.infer<typeof PropertyDescriptionGeneratorInputSchema>;

const PropertyDescriptionGeneratorOutputSchema = z.object({
  description: z.string().describe('A compelling and detailed description of the property.'),
});
export type PropertyDescriptionGeneratorOutput = z.infer<typeof PropertyDescriptionGeneratorOutputSchema>;

export async function generatePropertyDescription(input: PropertyDescriptionGeneratorInput): Promise<PropertyDescriptionGeneratorOutput> {
  return propertyDescriptionGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'propertyDescriptionGeneratorPrompt',
  input: {schema: PropertyDescriptionGeneratorInputSchema},
  output: {schema: PropertyDescriptionGeneratorOutputSchema},
  prompt: `You are an expert real estate copywriter. Your task is to generate a compelling and detailed property description based on the provided structured data.

Craft a description that highlights the property's best features, location advantages, and overall appeal to attract potential buyers or renters. Ensure the tone is engaging and professional.

Property Details:
Title: {{{title}}}
Type: {{{type}}}
Property Type: {{{propertyType}}}
Price: $ {{{price}}} USD
Area: {{{areaSqFt}}} sq ft
Address: {{{address}}}

Amenities:
{{#if amenities}}
{{#each amenities}}- {{{this}}}
{{/each}}
{{else}}
No specific amenities listed.
{{/if}}

Nearby Places:
{{#if nearbyPlaces}}
{{#each nearbyPlaces}}- {{{this}}}
{{/each}}
{{else}}
No specific nearby places listed.
{{/if}}

Generate a detailed and compelling description for this property:`,
});

const propertyDescriptionGeneratorFlow = ai.defineFlow(
  {
    name: 'propertyDescriptionGeneratorFlow',
    inputSchema: PropertyDescriptionGeneratorInputSchema,
    outputSchema: PropertyDescriptionGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
