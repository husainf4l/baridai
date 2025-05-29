import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { AiAgentRequestDto, AiAgentResponseDto } from './dto';
import { AiagentService } from './aiagent.service';

@Controller('aiagent')
export class AiagentController {
  constructor(private readonly aiagentService: AiagentService) {}

  /**
   * Process incoming messages and generate AI responses
   */
  @Post('process')
  async processMessage(@Body() request: AiAgentRequestDto): Promise<AiAgentResponseDto> {
    const { senderId, message, isVoice, voiceUrl } = request.body.createdDm;
    
    return await this.aiagentService.processMessage(
      senderId,
      message,
      isVoice,
      voiceUrl
    );
  }

  /**
   * Clear conversation history for a user
   */
  @Get('clear/:userId')
  clearConversation(@Param('userId') userId: string): { status: string } {
    this.aiagentService.clearConversationHistory(userId);
    return { status: 'Conversation history cleared' };
  }
}
