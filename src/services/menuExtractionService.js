/**
 * Menu Extraction Service
 *
 * This service handles the extraction of menu items from images using Google's Gemini AI.
 * It provides functions for processing images and extracting structured menu data.
 */

/**
 * Encodes an image file to base64 format
 * @param {File} file - The image file to encode
 * @returns {Promise<string>} - A promise that resolves to the base64-encoded image
 */
export const encodeImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Get the base64 string (remove the data:image/jpeg;base64, part)
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * Extracts product information from recognized text when JSON parsing fails
 * @param {string} text - The text to extract products from
 * @returns {Array} - An array of extracted products
 */
export const extractProductsFromText = (text) => {
  // This is an implementation to handle various text formats
  const lines = text.split('\n').filter(line => line.trim() !== '');

  const products = [];
  let currentProduct = {};
  let currentCategory = 'Uncategorized';

  // Try to find product patterns in the text
  for (const line of lines) {
    // Check if this line looks like a category header
    if (line.match(/^#+\s+/) || line.match(/^[A-Z\s]{3,}$/) || line.match(/^[A-Z][\w\s]{2,}:$/)) {
      currentCategory = line.replace(/^#+\s+|:$/g, '').trim();
      continue;
    }

    // Try to detect if this line contains a price
    const priceMatch = line.match(/\$?\d+(\.\d{2})?/);

    if (priceMatch) {
      // If we find a price, assume it's a product with name and price
      const price = priceMatch[0].replace('$', '');
      const priceValue = parseFloat(price);

      // Extract the name by removing the price and any trailing punctuation
      let name = line.replace(priceMatch[0], '').trim();
      name = name.replace(/[-–—:,\.]+$/, '').trim();

      if (name) {
        currentProduct = {
          product_name: name,
          price: priceValue,
          category: currentCategory,
        };
        products.push(currentProduct);
      }
    } else if (line.includes(':') && !line.match(/^[A-Z][\w\s]{2,}:$/)) {
      // Try to parse lines with "Name: Price" format
      const [name, priceStr] = line.split(':').map(part => part.trim());
      const priceMatch = priceStr?.match(/\$?\d+(\.\d{2})?/);

      if (name && priceMatch) {
        const price = priceMatch[0].replace('$', '');
        const priceValue = parseFloat(price);

        currentProduct = {
          product_name: name,
          price: priceValue,
          category: currentCategory,
        };
        products.push(currentProduct);
      }
    }
  }

  // If no products were found, try a more aggressive approach
  if (products.length === 0) {
    // Look for any strings that might be product names followed by numbers
    const productRegex = /([A-Za-z\s&'"-]+)[\s-]*(\$?\d+\.?\d*)/g;
    let match;

    while ((match = productRegex.exec(text)) !== null) {
      const name = match[1].trim();
      const price = match[2].replace('$', '');
      const priceValue = parseFloat(price);

      if (name && !isNaN(priceValue)) {
        products.push({
          product_name: name,
          price: priceValue,
          category: 'Uncategorized',
        });
      }
    }
  }

  return products;
};

/**
 * Processes an image to extract menu items using Google's Gemini AI
 * @param {File} imageFile - The image file to process
 * @param {Function} onProgress - Callback function for progress updates
 * @returns {Promise<Array>} - A promise that resolves to an array of extracted products
 */
export const processMenuImage = async (imageFile, onProgress = () => {}) => {
  if (!imageFile) {
    throw new Error('Please provide an image file');
  }

  try {
    console.log('Starting image processing...');
    onProgress(10); // Start progress

    // Encode image to base64
    const base64Image = await encodeImageToBase64(imageFile);
    console.log('Image encoded to base64 successfully');
    onProgress(30); // Update progress

    // Get API key from environment variables
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error('API key missing in environment variables');
      throw new Error('Gemini API key not found. Please check your environment variables.');
    }

    const apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
    console.log('Using Gemini API URL:', apiUrl);

    // Using the standard Gemini API format with a prompt that requests categorized products
    const requestBody = {
      contents: [
        {
          parts: [
            { text: "Extract all food and drink items from this menu image. For each item, identify its name, price (as a number without currency symbols), and category. If the category isn't clear, use 'Uncategorized'. Format your response as a valid JSON object with this exact structure: {\"products\": [{\"product_name\": \"Item Name\", \"price\": 10.99, \"category\": \"Category Name\"}]}. Only return the JSON object, nothing else." },
            {
              inline_data: {
                mime_type: imageFile.type || "image/jpeg",
                data: base64Image
              }
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 4096
      }
    };

    console.log('Preparing API request with proper MIME type:', imageFile.type || "image/jpeg");
    onProgress(50); // Update progress

    try {
      // Make the API request
      console.log('Sending request to Gemini API...');
      const response = await fetch(`${apiUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      onProgress(80); // Update progress
      console.log('Received response from Gemini API, status:', response.status);

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
      console.log('Successfully parsed API response');

      // Extract the products from the response
      if (data.candidates && data.candidates[0]?.content?.parts) {
        try {
          // Get the text content from the response
          const textContent = data.candidates[0].content.parts[0].text;
          console.log('Received text content from API:', textContent.substring(0, 100) + '...');

          // Try to extract JSON from the text
          const jsonMatch = textContent.match(/```json\s*([\s\S]*?)\s*```/) ||
                          textContent.match(/{[\s\S]*}/);

          if (jsonMatch) {
            console.log('Found JSON content in response');
            // Try to parse the JSON content
            const jsonContent = jsonMatch[0].replace(/```json|```/g, '').trim();

            try {
              const parsedContent = JSON.parse(jsonContent);
              console.log('Successfully parsed JSON content');

              // Check if we have products array directly or nested
              const products = parsedContent.products || parsedContent;
              console.log('Extracted products from JSON:', products ? products.length : 0);

              // Ensure we have an array of products
              const productArray = Array.isArray(products) ? products : [products];

              // Validate the product array
              if (productArray.length === 0) {
                console.warn('No products found in the parsed JSON');
                // Return empty array instead of throwing error
                onProgress(100);
                return [];
              }

              onProgress(100); // Complete progress
              return productArray;
            } catch (jsonError) {
              console.error('JSON parse error:', jsonError, 'Content:', jsonContent);
              throw new Error('Failed to parse JSON from API response: ' + jsonError.message);
            }
          } else {
            console.log('No JSON found in response, using text extraction fallback');
            // If no JSON found, use the text extraction fallback
            const extractedProducts = extractProductsFromText(textContent);
            console.log('Extracted products from text:', extractedProducts.length);
            onProgress(100); // Complete progress
            return extractedProducts;
          }
        } catch (parseError) {
          console.error('Error processing response:', parseError);
          throw new Error('Failed to process the menu: ' + parseError.message);
        }
      } else {
        console.error('Unexpected response format:', data);
        // Return empty array instead of throwing error
        onProgress(100);
        return [];
      }
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      throw new Error('Failed to communicate with Gemini API: ' + fetchError.message);
    }
  } catch (err) {
    console.error('Error in processMenuImage:', err);
    // Rethrow with more descriptive message
    throw new Error(`Menu extraction failed: ${err.message}`);
  }
};

/**
 * Groups products by category
 * @param {Array} products - The array of products to group
 * @returns {Array} - An array of category objects with nested products
 */
export const groupProductsByCategory = (products) => {
  try {
    console.log('Grouping products by category, input:', products);

    // Validate input
    if (!products) {
      console.warn('No products provided to groupProductsByCategory');
      return [];
    }

    // Ensure products is an array
    if (!Array.isArray(products)) {
      console.error('Products is not an array:', products);
      return [];
    }

    if (products.length === 0) {
      console.log('Empty products array, returning empty result');
      return [];
    }

    const categories = {};

    // Group products by category
    products.forEach((product, index) => {
      // Validate product object
      if (!product || typeof product !== 'object') {
        console.warn(`Invalid product at index ${index}:`, product);
        return; // Skip this product
      }

      const category = product.category || 'Uncategorized';
      if (!categories[category]) {
        categories[category] = {
          categorie_name: category,
          products: []
        };
      }

      // Create a sanitized product object with default values for missing properties
      const sanitizedProduct = {
        product_name: product.product_name || product.name || 'Unnamed Product',
        price: typeof product.price === 'number' ? product.price :
               (parseFloat(product.price) || 0),
        description: product.description || '',
        // Add additional properties that might be useful
        isVegetarian: Boolean(product.isVegetarian),
        isSpicy: Boolean(product.isSpicy),
        isHalal: Boolean(product.isHalal),
        calories: product.calories || null
      };

      categories[category].products.push(sanitizedProduct);
    });

    // Convert to array and sort alphabetically
    const result = Object.values(categories).sort((a, b) =>
      a.categorie_name.localeCompare(b.categorie_name)
    );

    console.log('Grouped products result:', result);
    return result;
  } catch (error) {
    console.error('Error in groupProductsByCategory:', error);
    // Return empty array instead of throwing to prevent UI from breaking
    return [];
  }
};

/**
 * Formats the extracted products for export
 * @param {Array} groupedProducts - The array of grouped products
 * @returns {Object} - An object with the formatted data
 */
export const formatProductsForExport = (groupedProducts) => {
  return {
    categories: groupedProducts
  };
};
