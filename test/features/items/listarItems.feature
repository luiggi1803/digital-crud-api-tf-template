Feature: API GET /items

  Scenario Outline: Listar items exitosamente
    Given que se recibe la peticion <peticion>
    And se obtiene la lista de items del repositorio <dataItems>
    When envio la peticion al servicio
    Then deberia recibir una respuesta exitosa <mensaje>

    Examples:
      | peticion   | dataItems   | mensaje            |
      | REQUEST_OK | ITEMS_LIST  | RESPONSE_LISTAR_OK |

  Scenario Outline: Al listar items se muestra un mensaje de error
    Given que se recibe la peticion <peticion>
    And la base de datos no responde al listar
    When envio la peticion al servicio
    Then se debe mostrar la siguiente respuesta <mensaje> y <detalle>

    Examples:
      | peticion   | mensaje                          | detalle            |
      | REQUEST_OK | Error interno en el servidor     | Database Exception |
