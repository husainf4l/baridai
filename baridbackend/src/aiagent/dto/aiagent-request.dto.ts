// This DTO represents the structure of incoming message requests
export class AiAgentRequestDto {
  body: {
    createdDm: {
      senderId: string;
      message: string;
      isVoice?: boolean;
      voiceUrl?: string;
    };
  };
}
