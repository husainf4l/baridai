import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAutomationDto, UpdateAutomationDto } from './dto/automation.dto';

@Injectable()
export class AutomationService {
  constructor(private prisma: PrismaService) {}

  async getAutomations(userId: string) {
    return this.prisma.automation.findMany({
      where: { userId },
      include: {
        dms: true,
        keywords: true,
        listener: true,
        posts: true,
        trigger: true,
      },
    });
  }

  async getAutomationById(userId: string, automationId: string) {
    const automation = await this.prisma.automation.findFirst({
      where: {
        id: automationId,
        userId,
      },
      include: {
        dms: true,
        keywords: true,
        listener: true,
        posts: true,
        trigger: true,
      },
    });

    if (!automation) {
      throw new NotFoundException('Automation not found');
    }

    return automation;
  }

  async createAutomation(
    userId: string,
    createAutomationDto: CreateAutomationDto,
  ) {
    return this.prisma.automation.create({
      data: {
        ...createAutomationDto,
        userId,
      },
    });
  }

  async updateAutomation(
    userId: string,
    automationId: string,
    updateAutomationDto: UpdateAutomationDto,
  ) {
    const existingAutomation = await this.prisma.automation.findFirst({
      where: {
        id: automationId,
        userId,
      },
    });

    if (!existingAutomation) {
      throw new NotFoundException('Automation not found');
    }

    return this.prisma.automation.update({
      where: { id: automationId },
      data: updateAutomationDto,
    });
  }

  async deleteAutomation(userId: string, automationId: string) {
    const existingAutomation = await this.prisma.automation.findFirst({
      where: {
        id: automationId,
        userId,
      },
    });

    if (!existingAutomation) {
      throw new NotFoundException('Automation not found');
    }

    return this.prisma.automation.delete({
      where: { id: automationId },
    });
  }

  async toggleAutomation(userId: string, automationId: string) {
    const existingAutomation = await this.prisma.automation.findFirst({
      where: {
        id: automationId,
        userId,
      },
    });

    if (!existingAutomation) {
      throw new NotFoundException('Automation not found');
    }

    return this.prisma.automation.update({
      where: { id: automationId },
      data: { active: !existingAutomation.active },
    });
  }
}
