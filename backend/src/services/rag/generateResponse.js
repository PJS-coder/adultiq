import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

/**
 * Response Generation Service
 * Generates structured responses using RAG context
 */

// Initialize AI clients only if API keys are available
let openai = null;
let anthropic = null;

if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY !== 'your-anthropic-api-key-here') {
  anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}

export class ResponseGenerator {
  /**
   * Generate structured document analysis response
   * @param {string} query - User query
   * @param {string} context - Retrieved context from RAG
   * @param {Object} options - Generation options
   * @returns {Promise<Object>} Structured response
   */
  static async generateDocumentAnalysis(query, context, options = {}) {
    try {
      const {
        model = 'gpt-4-turbo-preview',
        temperature = 0.1,
        includeConfidence = true,
        documentType = 'general'
      } = options;

      console.log(`🤖 Generating document analysis for: "${query.substring(0, 50)}..."`);

      const prompt = this.buildDocumentAnalysisPrompt(query, context, documentType);

      let response;
      if (model.startsWith('gpt')) {
        response = await this.generateWithOpenAI(prompt, model, temperature);
      } else if (model.startsWith('claude')) {
        response = await this.generateWithAnthropic(prompt, model, temperature);
      } else {
        throw new Error(`Unsupported model: ${model}`);
      }

      // Parse and structure the response
      const structuredResponse = this.parseDocumentAnalysisResponse(response, includeConfidence);

      console.log(`✅ Generated structured analysis (${structuredResponse.summary.length} chars)`);

      return {
        ...structuredResponse,
        query,
        model,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating document analysis:', error);
      throw new Error(`Response generation failed: ${error.message}`);
    }
  }

  /**
   * Generate personalized AI coach response
   * @param {string} query - User query
   * @param {string} context - Retrieved context
   * @param {Object} userProfile - User profile for personalization
   * @param {Object} options - Generation options
   * @returns {Promise<Object>} Personalized response
   */
  static async generateCoachResponse(query, context, userProfile, options = {}) {
    try {
      const {
        model = 'gpt-4-turbo-preview',
        temperature = 0.3,
        conversationHistory = []
      } = options;

      console.log(`🤖 Generating personalized coach response for user level: ${userProfile.knowledgeLevel}`);

      const prompt = this.buildCoachPrompt(query, context, userProfile, conversationHistory);

      let response;
      if (model.startsWith('gpt')) {
        response = await this.generateWithOpenAI(prompt, model, temperature);
      } else if (model.startsWith('claude')) {
        response = await this.generateWithAnthropic(prompt, model, temperature);
      } else {
        throw new Error(`Unsupported model: ${model}`);
      }

      return {
        response: response.trim(),
        personalization: {
          adaptedFor: userProfile.knowledgeLevel,
          considersFacts: ['age', 'employment', 'goals'].filter(key => userProfile[key]),
          tone: this.determineTone(userProfile)
        },
        query,
        model,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error generating coach response:', error);
      throw new Error(`Coach response generation failed: ${error.message}`);
    }
  }

  /**
   * Generate response using OpenAI
   * @param {string} prompt - System prompt
   * @param {string} model - Model name
   * @param {number} temperature - Temperature setting
   * @returns {Promise<string>} Generated response
   */
  static async generateWithOpenAI(prompt, model = 'gpt-4-turbo-preview', temperature = 0.1) {
    if (!openai) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const completion = await openai.chat.completions.create({
        model,
        messages: [{ role: 'user', content: prompt }],
        temperature,
        max_tokens: 2000,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI generation failed: ${error.message}`);
    }
  }

  /**
   * Generate response using Anthropic Claude
   * @param {string} prompt - System prompt
   * @param {string} model - Model name
   * @param {number} temperature - Temperature setting
   * @returns {Promise<string>} Generated response
   */
  static async generateWithAnthropic(prompt, model = 'claude-3-sonnet-20240229', temperature = 0.1) {
    if (!anthropic) {
      throw new Error('Anthropic API key not configured');
    }

    try {
      const response = await anthropic.messages.create({
        model,
        max_tokens: 2000,
        temperature,
        messages: [{ role: 'user', content: prompt }]
      });

      return response.content[0].text;
    } catch (error) {
      console.error('Anthropic API error:', error);
      throw new Error(`Anthropic generation failed: ${error.message}`);
    }
  }

  /**
   * Build document analysis prompt
   * @param {string} query - User query
   * @param {string} context - Retrieved context
   * @param {string} documentType - Type of document
   * @returns {string} Formatted prompt
   */
  static buildDocumentAnalysisPrompt(query, context, documentType) {
    const typeSpecificInstructions = {
      lease: 'Pay special attention to rent amounts, security deposits, lease terms, pet policies, maintenance responsibilities, and termination clauses.',
      contract: 'Focus on obligations, deadlines, payment terms, penalties, termination conditions, and liability clauses.',
      medical: 'Highlight covered services, copays, deductibles, network restrictions, and claim procedures.',
      insurance: 'Identify coverage limits, exclusions, deductibles, claim processes, and renewal terms.',
      financial: 'Point out fees, interest rates, payment schedules, penalties, and account terms.',
      tax: 'Explain deductions, filing requirements, deadlines, and potential penalties.'
    };

    const specificInstructions = typeSpecificInstructions[documentType] || 'Analyze all important terms and conditions.';

    return `You are an expert document analyzer helping young adults understand complex documents. 

CONTEXT FROM USER'S DOCUMENT:
${context}

USER QUERY: ${query}

DOCUMENT TYPE: ${documentType}

INSTRUCTIONS:
${specificInstructions}

Provide a structured analysis in the following JSON format:

{
  "summary": "Clear, concise summary in simple language (2-3 sentences)",
  "keyPoints": [
    "Important point 1 with specific details",
    "Important point 2 with specific details",
    "Important point 3 with specific details"
  ],
  "redFlags": [
    "Potential issue or concern 1",
    "Potential issue or concern 2"
  ],
  "recommendations": [
    "Specific action the user should take",
    "Another actionable recommendation"
  ],
  "confidence": 0.95,
  "sourceSnippets": [
    "Exact quote from document supporting key point 1",
    "Exact quote from document supporting key point 2"
  ]
}

IMPORTANT:
- Use simple, clear language appropriate for young adults
- Be specific and actionable in recommendations
- Only include red flags if there are genuine concerns
- Base all analysis strictly on the provided context
- Include confidence score (0.0-1.0) based on context quality
- Quote exact text from the document in sourceSnippets`;
  }

  /**
   * Build personalized coach prompt
   * @param {string} query - User query
   * @param {string} context - Retrieved context
   * @param {Object} userProfile - User profile
   * @param {Array} conversationHistory - Previous messages
   * @returns {string} Formatted prompt
   */
  static buildCoachPrompt(query, context, userProfile, conversationHistory) {
    const profileSummary = this.summarizeUserProfile(userProfile);
    const historyContext = conversationHistory.length > 0 
      ? `\nCONVERSATION HISTORY:\n${conversationHistory.slice(-3).map(msg => `${msg.role}: ${msg.content}`).join('\n')}`
      : '';

    return `You are AdultIQ's AI Life Coach, helping young adults navigate life decisions with personalized advice.

USER PROFILE:
${profileSummary}

RELEVANT CONTEXT:
${context}

${historyContext}

USER QUESTION: ${query}

INSTRUCTIONS:
- Provide personalized advice based on the user's profile
- Adapt your language to their knowledge level (${userProfile.knowledgeLevel})
- Consider their specific situation (age: ${userProfile.age}, employment: ${userProfile.employmentStatus})
- Reference their goals: ${userProfile.financialGoals?.join(', ') || 'general financial wellness'}
- Be encouraging and supportive
- Provide specific, actionable steps
- Use examples relevant to their situation
- Keep responses conversational but informative

Respond in a helpful, encouraging tone that matches their experience level.`;
  }

  /**
   * Parse document analysis response into structured format
   * @param {string} response - Raw AI response
   * @param {boolean} includeConfidence - Whether to include confidence scores
   * @returns {Object} Structured response
   */
  static parseDocumentAnalysisResponse(response, includeConfidence = true) {
    try {
      // Try to parse as JSON first
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          summary: parsed.summary || '',
          keyPoints: parsed.keyPoints || [],
          redFlags: parsed.redFlags || [],
          recommendations: parsed.recommendations || [],
          confidence: includeConfidence ? (parsed.confidence || 0.8) : undefined,
          sourceSnippets: parsed.sourceSnippets || []
        };
      }

      // Fallback: parse structured text
      return this.parseStructuredText(response, includeConfidence);
    } catch (error) {
      console.error('Error parsing response:', error);
      return {
        summary: response.substring(0, 200) + '...',
        keyPoints: ['Analysis available in summary'],
        redFlags: [],
        recommendations: ['Review the document carefully'],
        confidence: includeConfidence ? 0.5 : undefined,
        sourceSnippets: []
      };
    }
  }

  /**
   * Parse structured text response (fallback)
   * @param {string} response - Raw response
   * @param {boolean} includeConfidence - Whether to include confidence
   * @returns {Object} Structured response
   */
  static parseStructuredText(response, includeConfidence) {
    const sections = {
      summary: '',
      keyPoints: [],
      redFlags: [],
      recommendations: [],
      sourceSnippets: []
    };

    const lines = response.split('\n').map(line => line.trim()).filter(line => line);
    let currentSection = 'summary';

    for (const line of lines) {
      if (line.toLowerCase().includes('key points') || line.toLowerCase().includes('important points')) {
        currentSection = 'keyPoints';
      } else if (line.toLowerCase().includes('red flags') || line.toLowerCase().includes('concerns')) {
        currentSection = 'redFlags';
      } else if (line.toLowerCase().includes('recommendations') || line.toLowerCase().includes('actions')) {
        currentSection = 'recommendations';
      } else if (line.startsWith('- ') || line.startsWith('• ') || /^\d+\./.test(line)) {
        const cleanLine = line.replace(/^[-•\d.]\s*/, '');
        if (cleanLine && sections[currentSection] && Array.isArray(sections[currentSection])) {
          sections[currentSection].push(cleanLine);
        }
      } else if (currentSection === 'summary' && line.length > 10) {
        sections.summary += (sections.summary ? ' ' : '') + line;
      }
    }

    return {
      ...sections,
      confidence: includeConfidence ? 0.7 : undefined
    };
  }

  /**
   * Summarize user profile for prompt context
   * @param {Object} userProfile - User profile object
   * @returns {string} Profile summary
   */
  static summarizeUserProfile(userProfile) {
    const parts = [];
    
    if (userProfile.age) parts.push(`Age: ${userProfile.age}`);
    if (userProfile.employmentStatus) parts.push(`Employment: ${userProfile.employmentStatus}`);
    if (userProfile.knowledgeLevel) parts.push(`Knowledge Level: ${userProfile.knowledgeLevel}`);
    if (userProfile.income) parts.push(`Income Range: ${userProfile.income}`);
    if (userProfile.livingSituation) parts.push(`Living Situation: ${userProfile.livingSituation}`);
    if (userProfile.riskTolerance) parts.push(`Risk Tolerance: ${userProfile.riskTolerance}`);
    if (userProfile.adultIqScore) parts.push(`AdultIQ Score: ${userProfile.adultIqScore}/100`);
    
    return parts.join('\n');
  }

  /**
   * Determine appropriate tone based on user profile
   * @param {Object} userProfile - User profile
   * @returns {string} Tone description
   */
  static determineTone(userProfile) {
    if (userProfile.knowledgeLevel === 'beginner') {
      return 'simple, encouraging, step-by-step';
    } else if (userProfile.knowledgeLevel === 'advanced') {
      return 'detailed, comprehensive, efficient';
    } else {
      return 'balanced, informative, supportive';
    }
  }

  /**
   * Generate quick response for simple queries
   * @param {string} query - Simple query
   * @param {Object} userProfile - User profile
   * @returns {Promise<string>} Quick response
   */
  static async generateQuickResponse(query, userProfile) {
    try {
      const prompt = `As AdultIQ's AI coach, provide a brief, helpful response to this question from a ${userProfile.age}-year-old ${userProfile.employmentStatus || 'person'} with ${userProfile.knowledgeLevel || 'basic'} knowledge:

Question: ${query}

Keep the response under 100 words, friendly, and actionable.`;

      const response = await this.generateWithOpenAI(prompt, 'gpt-3.5-turbo', 0.3);
      
      return response.trim();
    } catch (error) {
      console.error('Error generating quick response:', error);
      return "I'd be happy to help! Could you provide a bit more detail about your specific situation?";
    }
  }
}

export default ResponseGenerator;