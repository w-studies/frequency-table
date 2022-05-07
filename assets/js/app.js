const frequencyTable = document.querySelector('table')
const tableColumStyle = document.querySelector('#table-column')
const tdOptions = [
  {
    option: 'P',
    class : 'present',
  },
  {
    option: 'F',
    class : 'ausent',
  },
  {
    option: 'A',
    class : 'aboned',
  },
  {
    option: '',
    class : '',
  },
]

// generate trs
const getMothName = (date, length = 'short') => {
  return new Date(date).toLocaleDateString('pt-br', {
    month: length,
  })
}
for (let m = 0; m < 12; m++) {
  // create a tr
  const row = document.createElement('tr')

  // insert first cell with month name
  row.insertCell().innerHTML = getMothName(new Date().setMonth(m)).toUpperCase()

  // from 1 to 35
  for (let c = 1; c < 36; c++) {
    // insert a cell into tr
    row.insertCell()
  }
  // insert complete tr into tbody
  frequencyTable.querySelector('tbody').append(row)
}

frequencyTable.addEventListener('mouseover', e => {
  const element = e.target
  if (element.matches('td, th')) {
    const index = ++element.cellIndex
    if (index > 1) {
      tableColumStyle.innerHTML = `
      table th:nth-child(${index}),
      table td:nth-child(${index}){
        background-color: #fffce7 !important;
      }
    `
    }
  }
})

frequencyTable.addEventListener('mouseout', e => {
  tableColumStyle.innerHTML = ''
})


frequencyTable.addEventListener('click', e => {
  const element = e.target
  if (element.matches('td')) {
    const elementIndex = ++element.cellIndex
    if (elementIndex > 1 && elementIndex < 33) {
      const optionIndex = element.dataset.option || 0

      let setIndex = 0

      if (optionIndex && optionIndex < tdOptions.length - 1) {
        setIndex = +optionIndex + 1
      }

      element.dataset.option = setIndex
      element.className = tdOptions[setIndex].class
      element.innerText = tdOptions[setIndex].option

      const tr = element.parentNode

      // calc totals
      // presence total
      const presentCells = tr.querySelectorAll('.present')

      tr.querySelector('td:nth-last-child(2)').innerHTML = presentCells.length

      // aboned total
      const abonedCells = tr.querySelectorAll('.aboned')

      tr.querySelector('td:nth-last-child(3)').innerHTML = abonedCells.length

      // ausent total
      const ausentCells = tr.querySelectorAll('.ausent')

      tr.querySelector('td:nth-last-child(4)').innerHTML = ausentCells.length
    }
  }
})
