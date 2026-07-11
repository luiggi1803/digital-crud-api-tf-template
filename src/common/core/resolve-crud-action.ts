export type CrudAction = 'listarItems' | 'obtenerItem' | 'crearItem' | 'actualizarItem' | 'eliminarItem';

export const CRUD_ACTIONS: readonly CrudAction[] = [
  'listarItems',
  'obtenerItem',
  'crearItem',
  'actualizarItem',
  'eliminarItem'
] as const;

export const resolveCrudAction = (
  method: string,
  pathname: string,
  pathParams?: { id?: string } | null
): CrudAction | undefined => {
  const id = pathParams?.id;

  if (method === 'GET' && pathname.endsWith('/items') && !id) return 'listarItems';
  if (method === 'GET' && id) return 'obtenerItem';
  if (method === 'POST' && pathname.endsWith('/items')) return 'crearItem';
  if (method === 'PUT' && id) return 'actualizarItem';
  if (method === 'DELETE' && id) return 'eliminarItem';

  return undefined;
};

export const isCrudAction = (action: string): action is CrudAction =>
  (CRUD_ACTIONS as readonly string[]).includes(action);
