import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DeleteCommand,
  DeleteCommandInput,
  DynamoDBDocumentClient,
  GetCommand,
  GetCommandInput,
  GetCommandOutput,
  PutCommand,
  PutCommandInput,
  ScanCommand,
  ScanCommandInput,
  ScanCommandOutput
} from '@aws-sdk/lib-dynamodb';
import { Logger } from '../../../Logger';

export class AdaptadorDynamo {
  private readonly clienteDocumento: DynamoDBDocumentClient;
  private readonly logger: Logger = new Logger(AdaptadorDynamo.name);

  constructor(region: string) {
    this.logger.log(`AdaptadorDynamo::constructor - región: ${region}`);
    const cliente = new DynamoDBClient({ region });
    this.clienteDocumento = DynamoDBDocumentClient.from(cliente);
  }

  async obtener(params: GetCommandInput): Promise<GetCommandOutput> {
    this.logger.log('AdaptadorDynamo::obtener', { TableName: params.TableName, Key: params.Key });
    return this.clienteDocumento.send(new GetCommand(params));
  }

  async insertar(params: PutCommandInput): Promise<void> {
    await this.clienteDocumento.send(new PutCommand(params));
  }

  async eliminar(params: DeleteCommandInput): Promise<void> {
    await this.clienteDocumento.send(new DeleteCommand(params));
  }

  // ponytail: Scan sin paginación; OK para tablas pequeñas; usar Query + GSI si crece
  async listar(params: ScanCommandInput): Promise<ScanCommandOutput> {
    return this.clienteDocumento.send(new ScanCommand(params));
  }
}
