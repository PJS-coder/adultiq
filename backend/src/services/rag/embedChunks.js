import OpenAI from 'openai';

/**
 * Embedding Service
 * Generates embeddings for document chunks using OpenAI
 */

// Initialize OpenAI client only if API key is available
let openai = null;

if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here') {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-small';
const BATCH_SIZE = 100; // Process embeddings in batches

export class EmbeddingService {
  /**
   * Generate embeddings for a single text
   * @param {string} text - Text to embed
   * @returns {Promise<Array>} Embedding vector
   */
  static async generateEmbedding(text) {
    if (!openai) {
      throw new Error('OpenAI API key not configured for embeddings');
    }

    try {
      if (!text || text.trim().length === 0) {
        throw new Error('Text cannot be empty');
      }

      const response = await openai.embeddings.create({
        model: EMBEDDING_MODEL,
        input: text.trim(),
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      throw new Error(`Failed to generate embedding: ${error.message}`);
    }
  }

  /**
   * Generate embeddings for multiple texts in batches
   * @param {Array} texts - Array of texts to embed
   * @returns {Promise<Array>} Array of embedding vectors
   */
  static async generateBatchEmbeddings(texts) {
    if (!openai) {
      throw new Error('OpenAI API key not configured for embeddings');
    }

    try {
      if (!texts || texts.length === 0) {
        return [];
      }

      // Filter out empty texts
      const validTexts = texts.filter(text => text && text.trim().length > 0);
      
      if (validTexts.length === 0) {
        return [];
      }

      const embeddings = [];
      
      // Process in batches to avoid rate limits
      for (let i = 0; i < validTexts.length; i += BATCH_SIZE) {
        const batch = validTexts.slice(i, i + BATCH_SIZE);
        
        const response = await openai.embeddings.create({
          model: EMBEDDING_MODEL,
          input: batch,
        });

        const batchEmbeddings = response.data.map(item => item.embedding);
        embeddings.push(...batchEmbeddings);

        // Add small delay between batches to respect rate limits
        if (i + BATCH_SIZE < validTexts.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      return embeddings;
    } catch (error) {
      console.error('Error generating batch embeddings:', error);
      throw new Error(`Failed to generate batch embeddings: ${error.message}`);
    }
  }

  /**
   * Generate embeddings for document chunks
   * @param {Array} chunks - Document chunks with content
   * @returns {Promise<Array>} Chunks with embeddings
   */
  static async embedChunks(chunks) {
    try {
      if (!chunks || chunks.length === 0) {
        return [];
      }

      console.log(`🔄 Generating embeddings for ${chunks.length} chunks...`);

      // Extract text content from chunks
      const texts = chunks.map(chunk => chunk.content);
      
      // Generate embeddings
      const embeddings = await this.generateBatchEmbeddings(texts);

      // Combine chunks with their embeddings
      const embeddedChunks = chunks.map((chunk, index) => ({
        ...chunk,
        embedding: embeddings[index]
      }));

      console.log(`✅ Generated ${embeddings.length} embeddings`);
      return embeddedChunks;
    } catch (error) {
      console.error('Error embedding chunks:', error);
      throw error;
    }
  }

  /**
   * Generate query embedding for similarity search
   * @param {string} query - User query
   * @returns {Promise<Array>} Query embedding vector
   */
  static async embedQuery(query) {
    try {
      if (!query || query.trim().length === 0) {
        throw new Error('Query cannot be empty');
      }

      console.log(`🔍 Generating embedding for query: "${query.substring(0, 50)}..."`);
      
      const embedding = await this.generateEmbedding(query);
      
      console.log(`✅ Generated query embedding (${embedding.length} dimensions)`);
      return embedding;
    } catch (error) {
      console.error('Error embedding query:', error);
      throw error;
    }
  }

  /**
   * Calculate cosine similarity between two embeddings
   * @param {Array} embedding1 - First embedding vector
   * @param {Array} embedding2 - Second embedding vector
   * @returns {number} Similarity score (0-1)
   */
  static calculateSimilarity(embedding1, embedding2) {
    try {
      if (!embedding1 || !embedding2 || embedding1.length !== embedding2.length) {
        return 0;
      }

      let dotProduct = 0;
      let norm1 = 0;
      let norm2 = 0;

      for (let i = 0; i < embedding1.length; i++) {
        dotProduct += embedding1[i] * embedding2[i];
        norm1 += embedding1[i] * embedding1[i];
        norm2 += embedding2[i] * embedding2[i];
      }

      const similarity = dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
      return Math.max(0, Math.min(1, similarity)); // Clamp to [0, 1]
    } catch (error) {
      console.error('Error calculating similarity:', error);
      return 0;
    }
  }

  /**
   * Find most similar chunks using cosine similarity
   * @param {Array} queryEmbedding - Query embedding vector
   * @param {Array} chunks - Chunks with embeddings
   * @param {number} topK - Number of top results to return
   * @returns {Array} Top K most similar chunks with scores
   */
  static findSimilarChunks(queryEmbedding, chunks, topK = 5) {
    try {
      if (!queryEmbedding || !chunks || chunks.length === 0) {
        return [];
      }

      // Calculate similarity scores
      const scoredChunks = chunks
        .filter(chunk => chunk.embedding && chunk.embedding.length > 0)
        .map(chunk => ({
          ...chunk,
          similarity: this.calculateSimilarity(queryEmbedding, chunk.embedding)
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topK);

      console.log(`🎯 Found ${scoredChunks.length} similar chunks`);
      scoredChunks.forEach((chunk, index) => {
        console.log(`  ${index + 1}. Similarity: ${chunk.similarity.toFixed(3)} - "${chunk.content.substring(0, 60)}..."`);
      });

      return scoredChunks;
    } catch (error) {
      console.error('Error finding similar chunks:', error);
      return [];
    }
  }

  /**
   * Validate embedding vector
   * @param {Array} embedding - Embedding vector to validate
   * @returns {boolean} True if valid
   */
  static validateEmbedding(embedding) {
    return (
      Array.isArray(embedding) &&
      embedding.length > 0 &&
      embedding.every(val => typeof val === 'number' && !isNaN(val))
    );
  }

  /**
   * Get embedding model info
   * @returns {Object} Model information
   */
  static getModelInfo() {
    return {
      model: EMBEDDING_MODEL,
      dimensions: EMBEDDING_MODEL.includes('3-small') ? 1536 : 1536,
      batchSize: BATCH_SIZE
    };
  }
}

export default EmbeddingService;