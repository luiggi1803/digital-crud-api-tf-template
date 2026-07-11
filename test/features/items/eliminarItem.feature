Feature: API DELETE /items/{id}

  Scenario Outline: Eliminar item exitosamente
    Given que se recibe la peticion <peticion>
    And se obtiene el item del repositorio <dataItem>
    And se elimina el item de la tabla dynamo
    When envio la peticion al servicio
    Then deberia recibir una respuesta exitosa <mensaje>

    Examples:
      | peticion              | dataItem | mensaje               |
      | REQUEST_ELIMINAR_OK   | ITEM_ONE | RESPONSE_ELIMINAR_OK  |
