import { Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';

@Module({
  imports: [WinstonModule.forRoot({})],
})
export class CommonModule {}
