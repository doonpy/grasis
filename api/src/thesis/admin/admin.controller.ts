import { Controller } from '@nestjs/common';

import { ThesisPath } from '../thesis.resource';

@Controller(ThesisPath.ADMIN_ROOT)
export class AdminController {}
