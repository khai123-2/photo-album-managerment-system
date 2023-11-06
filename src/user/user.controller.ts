import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class UserController {
  @Get('')
  Test() {
    {
      return { data: 123 };
    }
  }
}
