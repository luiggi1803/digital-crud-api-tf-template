Feature: API PUT /items/{id}

  Scenario Outline: Actualizar item exitosamente
    Given que se recibe la peticion <peticion>
    And se obtiene el item del repositorio <dataItem>
    And se actualiza el item en la tabla dynamo
    When envio la peticion al servicio
    Then deberia recibir una respuesta con item actualizado

    Examples:
      | peticion                | dataItem |
      | REQUEST_ACTUALIZAR_OK   | ITEM_ONE |
