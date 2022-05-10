<?php

// definição de variáveis para conexão
  $host     = 'localhost';      // servidor
  $user     = 'root';           // nome do utilizador
  $pass     = 'my-secret-pw';   // senha ou password
  $database = 'frequency';      // nome da base de dados

// estabelecer conexão:
  $sqli = new mysqli($host, $user, $pass);

// verificando se conectou de boas:
  if ($sqli->connect_error) {
    // se houver alguma falha, exibe mensagem:
    die('<p class="error">Falha na conexão: ' . $sqli->connect_error . '</p>');
  }

// definir o padrão de caracteres
  if (!$sqli->set_charset('utf8')) {
    // se não conseguir definir o padrão de caracteres, exibe o padrão disponível
    die("<p class='error'>Seu charset não é utf8, chefe!<br>$sqli->character_set_name()</p>");
  }

// selecionar/abrir o banco de dados para trabalhar
  if (!$sqli->select_db($database)) {
    // se o banco de dados não for encontrado
    die("<p class='error'>Banco de dados não encontrado, chefe!</p>");
  }
