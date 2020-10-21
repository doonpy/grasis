import { Controller } from '@nestjs/common';

import { THESIS_PATH } from '../thesis.resource';

@Controller(THESIS_PATH.ADMIN_ROOT)
export class AdminController {}
