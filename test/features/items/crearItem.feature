Feature: API POST /items

  Scenario Outline: Crear item exitosamente
    Given que se recibe la peticion <peticion>
    And se registra el item en la tabla dynamo
    When envio la peticion al servicio
    Then deberia recibir una respuesta con item creado

    Examples:
      | peticion           |
      | REQUEST_CREAR_OK   |

  Scenario Outline: Al crear item se muestra un mensaje de error
    Given que se recibe la peticion <peticion>
    And la base de datos no responde al guardar
    When envio la peticion al servicio
    Then se debe mostrar la siguiente respuesta <mensaje> y <detalle>

    Examples:
      | peticion           | mensaje                      | detalle            |
      | REQUEST_CREAR_OK   | Error interno en el servidor   | Database Exception |
