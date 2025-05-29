import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OpenAI } from 'openai';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// Interface for conversation history
interface ConversationHistory {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Interface for memory store
interface MemoryStore {
  [userId: string]: ConversationHistory[];
}

@Injectable()
export class AiagentService {
  private readonly logger = new Logger(AiagentService.name);
  private readonly openai: OpenAI;
  private readonly elevenLabsApiKey: string | undefined;
  private readonly elevenLabsVoiceId: string | undefined;
  private readonly systemPrompt: string;
  private readonly memoryStore: MemoryStore = {};
  private readonly maxMemoryMessages = 10; // Maximum number of messages to keep in memory per user

  constructor(private configService: ConfigService) {
    // Initialize OpenAI client
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });

    // Initialize Eleven Labs configuration
    this.elevenLabsApiKey = this.configService.get<string>('ELEVEN_LABS_API_KEY');
    this.elevenLabsVoiceId = this.configService.get<string>('ELEVEN_LABS_VOICE_ID');

    // Initialize system prompt
    this.systemPrompt = this.configService.get<string>('AI_SYSTEM_PROMPT', 
      `You are Laila Al Noor, a friendly and professional assistant for the official Toppik Instagram account.

Your job is to chat with customers just like a personal beauty consultant — always helpful, kind, and excited to assist!

Your Role:
- Greet customers warmly and introduce yourself as Laila from Toppik.
- Answer their questions clearly and help them find the right Toppik products.
- Recommend shades and sizes based on their needs.
- Explain how Toppik works in simple, encouraging language.
- Share product prices, available colors, and any current offers.
- Guide them to buy directly from toppik.jo or through a trusted distributor in Jordan.
- Speak in Arabic if the customer writes in Arabic.
- Always sound caring, cheerful, and confident — like a beauty bestie who knows her stuff!

✨ Product Info You Can Share:
🖤 Toppik Hair Fibers (for instantly fuller-looking hair!):
- 12g (Regular Size): only 25 JOD (was 32 JOD)
- 27.5g (Large Size): now 35 JOD (was 50 JOD)
- 55g (Giant Size): just 59 JOD (was 85 JOD)

🎁 Special Offer:
➡️ Get 2 x 55g for only 100 JOD instead of 170 JOD!
Perfect if you're stocking up or sharing with a friend 💁‍♀️

🎨 Available Colors:
- Black
- Dark Brown
- Medium Brown
- Light Brown
- Auburn
- Blonde
- Grey
- White`
    );
  }

  /**
   * Process an incoming message and generate a response
   */
  async processMessage(senderId: string, message: string, isVoice = false, voiceUrl?: string): Promise<{ message: string; audio?: { url: string } }> {
    try {
      let textMessage = message;

      // If the message is a voice message, convert it to text
      if (isVoice && voiceUrl) {
        textMessage = await this.convertSpeechToText(voiceUrl);
      }

      // Get or initialize conversation history for this user
      if (!this.memoryStore[senderId]) {
        this.memoryStore[senderId] = [{
          role: 'system',
          content: this.systemPrompt
        }];
      }

      // Add user message to history
      this.memoryStore[senderId].push({
        role: 'user',
        content: textMessage
      });

      // Keep history within limits
      if (this.memoryStore[senderId].length > this.maxMemoryMessages + 1) { // +1 for system message
        // Remove oldest messages but keep the system message
        const systemMessage = this.memoryStore[senderId][0];
        this.memoryStore[senderId] = [
          systemMessage,
          ...this.memoryStore[senderId].slice(-(this.maxMemoryMessages))
        ];
      }

      // Generate AI response
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o-mini', // Use the model specified in your n8n workflow
        messages: this.memoryStore[senderId],
        max_tokens: 500,
      });

      const aiMessage = response.choices[0]?.message?.content || 'Sorry, I couldn\'t process your request.';

      // Add AI response to history
      this.memoryStore[senderId].push({
        role: 'assistant',
        content: aiMessage
      });

      // If the original message was voice, convert the response to speech
      let audioUrl: string | undefined;
      if (isVoice) {
        audioUrl = await this.convertTextToSpeech(aiMessage);
      }

      return {
        message: aiMessage,
        ...(audioUrl && { audio: { url: audioUrl } })
      };
    } catch (error) {
      this.logger.error(`Error processing message: ${error.message}`, error.stack);
      throw new HttpException('Failed to process message', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Convert speech to text using OpenAI's Whisper API
   */
  private async convertSpeechToText(audioUrl: string): Promise<string> {
    try {
      // Download the audio file
      const tempFilePath = path.join(os.tmpdir(), `voice_${Date.now()}.mp3`);
      const response = await axios({
        method: 'GET',
        url: audioUrl,
        responseType: 'stream',
      });

      const writer = fs.createWriteStream(tempFilePath);
      response.data.pipe(writer);

      await new Promise<void>((resolve, reject) => {
        writer.on('finish', () => resolve());
        writer.on('error', (error) => reject(error));
      });

      // Transcribe the audio using OpenAI Whisper
      const transcription = await this.openai.audio.transcriptions.create({
        file: fs.createReadStream(tempFilePath),
        model: 'whisper-1',
      });

      // Clean up the temp file
      fs.unlinkSync(tempFilePath);

      return transcription.text;
    } catch (error) {
      this.logger.error(`Error converting speech to text: ${error.message}`, error.stack);
      throw new HttpException('Failed to convert speech to text', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Convert text to speech using Eleven Labs API
   */
  private async convertTextToSpeech(text: string): Promise<string | undefined> {
    if (!this.elevenLabsApiKey) {
      this.logger.warn('Eleven Labs API key not configured, skipping text-to-speech conversion');
      return undefined;
    }

    try {
      const response = await axios({
        method: 'POST',
        url: `https://api.elevenlabs.io/v1/text-to-speech/${this.elevenLabsVoiceId}`,
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.elevenLabsApiKey,
        },
        data: {
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        },
        responseType: 'arraybuffer',
      });

      // Save the audio to a temporary file
      const tempFilePath = path.join(os.tmpdir(), `tts_${Date.now()}.mp3`);
      fs.writeFileSync(tempFilePath, response.data);

      // In a real application, you would upload this to a storage service like S3
      // For this example, we'll just return the path to the temporary file as if it were a URL
      // In production, replace this with your actual upload logic and return the real URL
      
      // Example placeholder for uploading to a storage service:
      // const audioUrl = await this.uploadToStorage(tempFilePath);
      
      // For demo purposes only - this is not a real URL and won't work in production
      const audioUrl = `file://${tempFilePath}`;

      return audioUrl;
    } catch (error) {
      this.logger.error(`Error converting text to speech: ${error.message}`, error.stack);
      return undefined;
    }
  }

  /**
   * Clear conversation history for a user
   */
  clearConversationHistory(userId: string): void {
    if (this.memoryStore[userId]) {
      // Keep system message only
      const systemMessage = this.memoryStore[userId][0];
      this.memoryStore[userId] = [systemMessage];
    }
  }
}
