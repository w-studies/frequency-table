<?php

  // conecta ao database
  require 'connection.php';
  require 'helpers/httpResponse.php';

  // define a query de busca
  $query = 'select * from frequencies';

  // executa a query de busca e guarda o resultado em $result
  $result = $sqli->query($query);

  // verifica se houve alguma falha na execução da query
  if ($sqli->error) {
    // se houve alguma falha, exibe mensagem:
    die('<p class="error">Falha na conexão: ' . $sqli->error . '</p>' . __FILE__ . ' at line: ' . __LINE__);

    // se não houve falha e algum registro foi encontrado
  } elseif ($result->num_rows) {
    // guarda os registros em $dada
    $data = $result->fetch_all(MYSQLI_ASSOC);

    // encerra o script devolvendo um json
    jsonResponse(['data' => $data]);

    // se não houve erro, e nenhum registro foi encontrado
  } else {
    // devolve json com mensagem
    jsonResponse('Nenhum registro foi encontrado.', 404);

  }
