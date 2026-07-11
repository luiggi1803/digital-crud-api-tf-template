import { Module } from '@nestjs/common';
import { getRegion } from '../../../config/env';
import { AdaptadorDynamo } from './AdaptadorDynamo';

@Module({
  providers: [
    {
      provide: AdaptadorDynamo,
      useFactory: () => new AdaptadorDynamo(getRegion())
    }
  ],
  exports: [AdaptadorDynamo]
})
export class DynamoModule {}
