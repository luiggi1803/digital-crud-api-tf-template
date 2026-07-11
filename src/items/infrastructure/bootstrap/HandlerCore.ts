import { INestApplicationContext } from '@nestjs/common';
import { ItemsModule } from '../controller/ItemsModule';
import { ItemController } from '../controller/ItemController';
import { isCrudAction } from '../../../common/core/resolve-crud-action';

const handlerCore = (appContext: INestApplicationContext, action: string): ItemController | undefined => {
  if (!isCrudAction(action)) {
    return undefined;
  }

  const itemController = appContext.select(ItemsModule).get(ItemController);
  if (typeof itemController[action] === 'function') {
    return itemController;
  }

  return undefined;
};

export default handlerCore;
