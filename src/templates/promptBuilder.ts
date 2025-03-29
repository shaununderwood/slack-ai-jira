export type PromptTemplate = {
  system: string;
  user: string;
  format: string;
};

export class PromptBuilder {
  private template: PromptTemplate;

  constructor(template: PromptTemplate) {
    this.template = template;
  }

  build(variables: Record<string, string>): string {    
    // Replace variables in user prompt
    let userPrompt = this.template.user;
    Object.entries(variables).forEach(([key, value]) => {
      userPrompt = userPrompt.replace(`{${key}}`, value);
    });
    
    const prompt = `${this.template.system}\n\n${userPrompt}\n\n${this.template.format}`;
    return prompt;
  }
}
