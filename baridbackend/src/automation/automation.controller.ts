import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AutomationService } from './automation.service';
import { CreateAutomationDto, UpdateAutomationDto } from './dto/automation.dto';

@Controller('automations')
export class AutomationController {
  constructor(private automationService: AutomationService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserAutomations(@Request() req) {
    return this.automationService.getAutomations(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getAutomationById(@Request() req, @Param('id') automationId: string) {
    return this.automationService.getAutomationById(
      req.user.userId,
      automationId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createAutomation(
    @Request() req,
    @Body() createAutomationDto: CreateAutomationDto,
  ) {
    return this.automationService.createAutomation(
      req.user.userId,
      createAutomationDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateAutomation(
    @Request() req,
    @Param('id') automationId: string,
    @Body() updateAutomationDto: UpdateAutomationDto,
  ) {
    return this.automationService.updateAutomation(
      req.user.userId,
      automationId,
      updateAutomationDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteAutomation(@Request() req, @Param('id') automationId: string) {
    return this.automationService.deleteAutomation(
      req.user.userId,
      automationId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/toggle')
  async toggleAutomation(@Request() req, @Param('id') automationId: string) {
    return this.automationService.toggleAutomation(
      req.user.userId,
      automationId,
    );
  }
}
