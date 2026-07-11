import { Module } from '@nestjs/common';
import { DynamoModule } from '../../../common/infrastructure/adapters/dynamo/DynamoModule';
import { ItemController } from './ItemController';
import { ItemRequestValidation } from '../../application/validation/ItemRequestValidation';
import { ItemDomainService } from '../../domain/service/ItemDomainService';
import { ItemDynamoRepository } from '../repository/ItemDynamoRepository';

@Module({
  imports: [DynamoModule],
  controllers: [ItemController],
  providers: [
    ItemRequestValidation,
    ItemDomainService,
    {
      provide: 'ItemRepository',
      useClass: ItemDynamoRepository
    }
  ]
})
export class ItemsModule {}
