import { Injectable, OnModuleInit } from '@nestjs/common';
import { AuthService } from './app/auth/auth.service';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(private authService: AuthService) {}

  async onModuleInit() {
    await this.authService.createAdmin();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
