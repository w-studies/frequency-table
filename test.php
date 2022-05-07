<?php
  $t = '';
  foreach (['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'] as $index => $item) {
    $t .= '<tr>'."<td>$item</td>";
    for ($i = 1; $i < 32; $i++) {
      $t .= "<td></td>";
    }
    $t .= '
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    </tr>';
  }

  echo '<pre>$t: ';
  print_r($t);
  echo '</pre>';
  die(__FILE__ . ' at line: ' . __LINE__);
