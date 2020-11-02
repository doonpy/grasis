import { Controller, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../common/guards/admin.guard';
import { TopicPath } from './topic.resource';
import { TopicService } from './topic.service';

@UseGuards(JwtAuthGuard, AdminGuard)
@Controller(TopicPath.ADMIN_ROOT)
export class TopicAdminController {
  constructor(private topicService: TopicService) {}
}
