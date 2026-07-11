import { Module } from '@nestjs/common';
import { ItemsModule } from '../controller/ItemsModule';

@Module({
  imports: [ItemsModule]
})
export class AppModule {}
