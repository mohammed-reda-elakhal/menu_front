/**
 * Business Presentation Generation Service
 *
 * This service handles the generation of compelling business presentations using Google's Gemini AI.
 * It provides functions for creating personalized, context-aware business descriptions and presentations.
 */

/**
 * Available presentation styles/tones
 */
export const PRESENTATION_STYLES = {
  PROFESSIONAL: 'professional',
  CASUAL: 'casual',
  CREATIVE: 'creative',
  WARM: 'warm',
  MODERN: 'modern',
  TRADITIONAL: 'traditional'
};

/**
 * Style configurations with descriptions and prompts
 */
export const STYLE_CONFIGS = {
  [PRESENTATION_STYLES.PROFESSIONAL]: {
    name: 'Professional',
    description: 'Formal, business-focused tone that builds trust and credibility',
    prompt: 'Write in a professional, formal tone that emphasizes expertise, quality, and reliability. Use business language that builds trust and credibility.'
  },
  [PRESENTATION_STYLES.CASUAL]: {
    name: 'Casual & Friendly',
    description: 'Relaxed, approachable tone that feels personal and welcoming',
    prompt: 'Write in a casual, friendly tone that feels personal and welcoming. Use conversational language that makes customers feel at home.'
  },
  [PRESENTATION_STYLES.CREATIVE]: {
    name: 'Creative & Unique',
    description: 'Artistic, innovative tone that highlights uniqueness and creativity',
    prompt: 'Write in a creative, artistic tone that highlights uniqueness and innovation. Use imaginative language that showcases the business\'s creative spirit.'
  },
  [PRESENTATION_STYLES.WARM]: {
    name: 'Warm & Inviting',
    description: 'Cozy, family-friendly tone that emphasizes comfort and hospitality',
    prompt: 'Write in a warm, inviting tone that emphasizes comfort, hospitality, and family-friendly atmosphere. Use language that makes people feel welcome and cared for.'
  },
  [PRESENTATION_STYLES.MODERN]: {
    name: 'Modern & Trendy',
    description: 'Contemporary, trendy tone that appeals to modern customers',
    prompt: 'Write in a modern, trendy tone that appeals to contemporary customers. Use current language and emphasize innovation, technology, and modern lifestyle.'
  },
  [PRESENTATION_STYLES.TRADITIONAL]: {
    name: 'Traditional & Authentic',
    description: 'Classic, heritage-focused tone that emphasizes tradition and authenticity',
    prompt: 'Write in a traditional, authentic tone that emphasizes heritage, time-tested methods, and classic values. Use language that conveys tradition and authenticity.'
  }
};

/**
 * Business type specific context for better generation
 */
export const BUSINESS_TYPE_CONTEXTS = {
  coffee: {
    keywords: ['coffee', 'espresso', 'latte', 'cappuccino', 'beans', 'roasted', 'café', 'barista', 'atmosphere'],
    focus: 'coffee quality, atmosphere, and customer experience'
  },
  restaurant: {
    keywords: ['cuisine', 'dishes', 'chef', 'ingredients', 'dining', 'flavors', 'menu', 'culinary', 'gastronomy'],
    focus: 'culinary excellence, dining experience, and food quality'
  },
  snack: {
    keywords: ['quick', 'fresh', 'snacks', 'fast', 'convenient', 'tasty', 'grab-and-go', 'light meals'],
    focus: 'convenience, freshness, and quick service'
  },
  coffeeToGo: {
    keywords: ['takeaway', 'on-the-go', 'quick', 'mobile', 'busy', 'convenient', 'fast', 'portable'],
    focus: 'speed, convenience, and quality for busy customers'
  },
  bakery: {
    keywords: ['fresh', 'baked', 'bread', 'pastries', 'artisan', 'traditional', 'daily', 'homemade'],
    focus: 'freshness, traditional baking methods, and artisan quality'
  },
  pizzeria: {
    keywords: ['pizza', 'dough', 'toppings', 'oven', 'Italian', 'authentic', 'crispy', 'melted cheese'],
    focus: 'authentic pizza making, quality ingredients, and Italian tradition'
  }
};

/**
 * Generates a business presentation using Gemini AI
 * @param {Object} businessData - The business information
 * @param {string} businessData.nom - Business name
 * @param {string} businessData.type - Business type
 * @param {string} businessData.customType - Custom business type if type is 'other'
 * @param {string} businessData.ville - City
 * @param {string} businessData.adress - Address
 * @param {Array} businessData.tags - Business tags
 * @param {string} businessData.bio - Existing bio (optional)
 * @param {string} businessData.customPrompt - Custom user prompt/description (optional)
 * @param {string} style - Presentation style from PRESENTATION_STYLES
 * @param {string} language - Target language (default: 'fr')
 * @param {Function} onProgress - Progress callback function
 * @returns {Promise<Object>} - Generated presentation data
 */
export const generateBusinessPresentation = async (businessData, style = PRESENTATION_STYLES.PROFESSIONAL, language = 'fr', onProgress = () => {}) => {
  if (!businessData || !businessData.nom) {
    throw new Error('Business name is required for presentation generation');
  }

  try {
    console.log('Starting presentation generation...', { businessData, style, language });
    onProgress(10);

    // Get API key from environment variables
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('API key missing in environment variables');
      throw new Error('Gemini API key not found. Please check your environment variables.');
    }

    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    console.log('Using Gemini API URL:', apiUrl);

    // Prepare business context
    const businessType = businessData.type === 'other' ? businessData.customType : businessData.type;
    const typeContext = BUSINESS_TYPE_CONTEXTS[businessData.type] || {
      keywords: ['business', 'service', 'quality', 'customer'],
      focus: 'quality service and customer satisfaction'
    };

    const styleConfig = STYLE_CONFIGS[style] || STYLE_CONFIGS[PRESENTATION_STYLES.PROFESSIONAL];

    // Build context information
    const contextInfo = [
      `Business Name: ${businessData.nom}`,
      `Business Type: ${businessType}`,
      `Location: ${businessData.ville}${businessData.adress ? `, ${businessData.adress}` : ''}`,
      businessData.tags && businessData.tags.length > 0 ? `Tags: ${businessData.tags.join(', ')}` : '',
      businessData.bio ? `Existing Bio: ${businessData.bio}` : '',
      businessData.customPrompt ? `Custom Description/Instructions: ${businessData.customPrompt}` : ''
    ].filter(Boolean).join('\n');

    // Create the prompt based on language
    const languageInstructions = {
      'fr': 'Répondez en français.',
      'en': 'Respond in English.',
      'ar': 'Respond in Arabic.'
    };

    // Create enhanced prompt that considers custom user input
    let prompt;

    if (businessData.customPrompt) {
      prompt = `You are an expert business copywriter specializing in creating compelling business presentations.

BUSINESS CONTEXT:
${contextInfo}

STYLE REQUIREMENTS:
${styleConfig.prompt}

USER'S CUSTOM INSTRUCTIONS:
The business owner has provided specific information and instructions: "${businessData.customPrompt}"

IMPORTANT: Pay special attention to the custom instructions above. Use this information as the primary source for understanding the business's unique qualities, target audience, and key messaging points.

TASK:
Create a compelling business presentation that includes:

1. A main presentation/description (150-250 words) that will be used as the primary business description
2. A shorter bio (50-100 words) for quick introductions
3. 3-5 suggested tags that capture the essence of the business

REQUIREMENTS:
- ${languageInstructions[language] || languageInstructions['fr']}
- Follow the user's custom instructions closely
- Make it engaging and customer-focused
- Highlight what makes this business special based on the custom description
- Include emotional appeal appropriate to the style
- Avoid generic phrases - be specific and memorable
- Consider the local context (Morocco/Maroc)
- Make it sound authentic and genuine
- Incorporate specific details from the custom instructions

FORMAT YOUR RESPONSE AS JSON:
{
  "presentation": "Main business presentation text here...",
  "bio": "Shorter bio text here...",
  "suggestedTags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

Only return the JSON object, nothing else.`;
    } else {
      prompt = `You are an expert business copywriter specializing in creating compelling business presentations.

BUSINESS CONTEXT:
${contextInfo}

STYLE REQUIREMENTS:
${styleConfig.prompt}

BUSINESS TYPE FOCUS:
This is a ${businessType} business. Focus on ${typeContext.focus}. Consider incorporating these relevant concepts: ${typeContext.keywords.join(', ')}.

TASK:
Create a compelling business presentation that includes:

1. A main presentation/description (150-250 words) that will be used as the primary business description
2. A shorter bio (50-100 words) for quick introductions
3. 3-5 suggested tags that capture the essence of the business

REQUIREMENTS:
- ${languageInstructions[language] || languageInstructions['fr']}
- Make it engaging and customer-focused
- Highlight what makes this business special
- Include emotional appeal appropriate to the style
- Avoid generic phrases - be specific and memorable
- Consider the local context (Morocco/Maroc)
- Make it sound authentic and genuine

FORMAT YOUR RESPONSE AS JSON:
{
  "presentation": "Main business presentation text here...",
  "bio": "Shorter bio text here...",
  "suggestedTags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}

Only return the JSON object, nothing else.`;
    }

    onProgress(30);

    // Prepare the request body
    const requestBody = {
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7, // Higher creativity for presentation writing
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 2048
      }
    };

    console.log('Sending request to Gemini API...');
    onProgress(50);

    // Make the API request
    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    onProgress(70);

    if (!response.ok) {
      let errorMessage = 'Unknown error occurred';
      try {
        const errorData = await response.json();
        console.error('API error response:', errorData);
        errorMessage = errorData.error?.message ||
                      errorData.error?.status ||
                      `HTTP error ${response.status}`;
      } catch (e) {
        console.error('Failed to parse error response:', e);
        errorMessage = `HTTP error ${response.status}`;
      }
      throw new Error(`API Error: ${errorMessage}`);
    }

    const data = await response.json();
    console.log('Successfully received API response');
    onProgress(90);

    // Extract the generated content
    if (data.candidates && data.candidates[0]?.content?.parts) {
      try {
        const textContent = data.candidates[0].content.parts[0].text;
        console.log('Received text content from API:', textContent.substring(0, 100) + '...');

        // Try to extract JSON from the response
        const jsonMatch = textContent.match(/```json\s*([\s\S]*?)\s*```/) ||
                         textContent.match(/{[\s\S]*}/);

        if (jsonMatch) {
          const jsonContent = jsonMatch[0].replace(/```json|```/g, '').trim();
          const generatedContent = JSON.parse(jsonContent);

          // Validate the response structure
          if (!generatedContent.presentation || !generatedContent.bio) {
            throw new Error('Invalid response structure from AI');
          }

          // Ensure suggestedTags is an array
          if (!Array.isArray(generatedContent.suggestedTags)) {
            generatedContent.suggestedTags = [];
          }

          console.log('Successfully parsed generated content');
          onProgress(100);

          return {
            success: true,
            data: {
              presentation: generatedContent.presentation.trim(),
              bio: generatedContent.bio.trim(),
              suggestedTags: generatedContent.suggestedTags.slice(0, 5), // Limit to 5 tags
              style: style,
              language: language,
              generatedAt: new Date().toISOString()
            }
          };
        } else {
          throw new Error('No valid JSON found in AI response');
        }
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        throw new Error('Failed to parse AI response: ' + parseError.message);
      }
    } else {
      throw new Error('Invalid response format from AI service');
    }

  } catch (error) {
    console.error('Error in generateBusinessPresentation:', error);
    onProgress(100);
    return {
      success: false,
      error: error.message || 'Failed to generate business presentation'
    };
  }
};

/**
 * Generates multiple presentation variations for comparison
 * @param {Object} businessData - The business information
 * @param {Array} styles - Array of styles to generate
 * @param {string} language - Target language
 * @param {Function} onProgress - Progress callback function
 * @returns {Promise<Array>} - Array of generated presentations
 */
export const generateMultiplePresentations = async (businessData, styles = [PRESENTATION_STYLES.PROFESSIONAL, PRESENTATION_STYLES.CASUAL], language = 'fr', onProgress = () => {}) => {
  const results = [];
  const totalStyles = styles.length;

  for (let i = 0; i < totalStyles; i++) {
    const style = styles[i];
    const progressStart = (i / totalStyles) * 100;
    const progressEnd = ((i + 1) / totalStyles) * 100;

    try {
      const result = await generateBusinessPresentation(
        businessData,
        style,
        language,
        (progress) => {
          const adjustedProgress = progressStart + (progress / 100) * (progressEnd - progressStart);
          onProgress(adjustedProgress);
        }
      );

      if (result.success) {
        results.push({
          style: style,
          styleName: STYLE_CONFIGS[style]?.name || style,
          ...result.data
        });
      }
    } catch (error) {
      console.error(`Failed to generate presentation for style ${style}:`, error);
      // Continue with other styles even if one fails
    }
  }

  onProgress(100);
  return results;
};

/**
 * Improves an existing presentation based on feedback or additional context
 * @param {string} currentPresentation - The current presentation text
 * @param {Object} businessData - The business information
 * @param {string} improvementRequest - Specific improvement request
 * @param {string} style - Presentation style
 * @param {string} language - Target language
 * @param {Function} onProgress - Progress callback function
 * @returns {Promise<Object>} - Improved presentation data
 */
export const improvePresentation = async (currentPresentation, businessData, improvementRequest, style = PRESENTATION_STYLES.PROFESSIONAL, language = 'fr', onProgress = () => {}) => {
  if (!currentPresentation || !improvementRequest) {
    throw new Error('Current presentation and improvement request are required');
  }

  try {
    console.log('Starting presentation improvement...', { improvementRequest, style, language });
    onProgress(10);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key not found. Please check your environment variables.');
    }

    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    const styleConfig = STYLE_CONFIGS[style] || STYLE_CONFIGS[PRESENTATION_STYLES.PROFESSIONAL];

    const languageInstructions = {
      'fr': 'Répondez en français.',
      'en': 'Respond in English.',
      'ar': 'Respond in Arabic.'
    };

    const prompt = `You are an expert business copywriter. I need you to improve an existing business presentation.

CURRENT PRESENTATION:
"${currentPresentation}"

BUSINESS CONTEXT:
Business Name: ${businessData.nom}
Business Type: ${businessData.type === 'other' ? businessData.customType : businessData.type}
Location: ${businessData.ville}

IMPROVEMENT REQUEST:
${improvementRequest}

STYLE REQUIREMENTS:
${styleConfig.prompt}

TASK:
Improve the current presentation based on the improvement request while maintaining the specified style.

REQUIREMENTS:
- ${languageInstructions[language] || languageInstructions['fr']}
- Keep the same general length (150-250 words)
- Address the specific improvement request
- Maintain the business's core identity
- Make it more engaging and compelling

FORMAT YOUR RESPONSE AS JSON:
{
  "improvedPresentation": "Improved presentation text here...",
  "changesExplanation": "Brief explanation of what was changed and why..."
}

Only return the JSON object, nothing else.`;

    onProgress(30);

    const requestBody = {
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.6,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 1024
      }
    };

    onProgress(50);

    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    onProgress(70);

    if (!response.ok) {
      throw new Error(`API Error: HTTP ${response.status}`);
    }

    const data = await response.json();
    onProgress(90);

    if (data.candidates && data.candidates[0]?.content?.parts) {
      const textContent = data.candidates[0].content.parts[0].text;
      const jsonMatch = textContent.match(/```json\s*([\s\S]*?)\s*```/) ||
                       textContent.match(/{[\s\S]*}/);

      if (jsonMatch) {
        const jsonContent = jsonMatch[0].replace(/```json|```/g, '').trim();
        const improvedContent = JSON.parse(jsonContent);

        onProgress(100);

        return {
          success: true,
          data: {
            improvedPresentation: improvedContent.improvedPresentation.trim(),
            changesExplanation: improvedContent.changesExplanation.trim(),
            originalPresentation: currentPresentation,
            style: style,
            language: language,
            improvedAt: new Date().toISOString()
          }
        };
      }
    }

    throw new Error('Invalid response format from AI service');

  } catch (error) {
    console.error('Error in improvePresentation:', error);
    onProgress(100);
    return {
      success: false,
      error: error.message || 'Failed to improve presentation'
    };
  }
};

/**
 * Validates if a presentation meets quality standards
 * @param {string} presentation - The presentation text to validate
 * @returns {Object} - Validation result with suggestions
 */
export const validatePresentation = (presentation) => {
  const issues = [];
  const suggestions = [];

  if (!presentation || presentation.trim().length === 0) {
    issues.push('Presentation is empty');
    return { isValid: false, issues, suggestions };
  }

  const wordCount = presentation.trim().split(/\s+/).length;

  if (wordCount < 20) {
    issues.push('Presentation is too short (less than 20 words)');
    suggestions.push('Add more details about your business offerings and what makes you special');
  }

  if (wordCount > 300) {
    issues.push('Presentation is too long (more than 300 words)');
    suggestions.push('Consider shortening the text to focus on the most important points');
  }

  // Check for generic phrases
  const genericPhrases = [
    'best quality',
    'excellent service',
    'we are the best',
    'number one',
    'world class'
  ];

  const hasGenericPhrases = genericPhrases.some(phrase =>
    presentation.toLowerCase().includes(phrase.toLowerCase())
  );

  if (hasGenericPhrases) {
    suggestions.push('Consider replacing generic phrases with specific details about your business');
  }

  // Check for emotional appeal
  const emotionalWords = [
    'welcome', 'warm', 'cozy', 'friendly', 'passionate', 'love', 'care',
    'special', 'unique', 'authentic', 'traditional', 'fresh', 'homemade'
  ];

  const hasEmotionalAppeal = emotionalWords.some(word =>
    presentation.toLowerCase().includes(word.toLowerCase())
  );

  if (!hasEmotionalAppeal) {
    suggestions.push('Consider adding emotional appeal to connect with customers');
  }

  return {
    isValid: issues.length === 0,
    issues,
    suggestions,
    wordCount,
    hasEmotionalAppeal
  };
};
