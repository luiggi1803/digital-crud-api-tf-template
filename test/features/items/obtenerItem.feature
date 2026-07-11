Feature: API GET /items/{id}

  Scenario Outline: Obtener item por id exitosamente
    Given que se recibe la peticion <peticion>
    And se obtiene el item del repositorio <dataItem>
    When envio la peticion al servicio
    Then deberia recibir una respuesta exitosa <mensaje>

    Examples:
      | peticion          | dataItem  | mensaje             |
      | REQUEST_OBTENER_OK | ITEM_ONE | RESPONSE_OBTENER_OK |

  Scenario Outline: Al obtener item inexistente se muestra error
    Given que se recibe la peticion <peticion>
    And se obtiene el item del repositorio <dataItem>
    When envio la peticion al servicio
    Then se debe mostrar la siguiente respuesta <mensaje> y <detalle>

    Examples:
      | peticion                 | dataItem   | mensaje          | detalle            |
      | REQUEST_OBTENER_NO_EXISTE | ITEM_EMPTY | Item no encontrado |                  |
