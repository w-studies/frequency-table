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

const thirtyOne = Array.from({length: 31}, (_, i) => i + 1)

// THEAD
const headTexts = ['Mês/Dia', ...thirtyOne, 'Total Falta', 'Total Abon.', 'Total Pres.', '% Freq.']
// create a tr
const row = document.createElement('tr')
for (const index of headTexts) {
  // create a th
  const th = document.createElement('th')
  th.innerText = index
  row.append(th)
}

frequencyTable.querySelector('thead').append(row)

// TBODY
const getMothName = (date, length = 'short') => {
  return new Date(date).toLocaleDateString('pt-br', {
    month: length,
  })
}
for (let m = 0; m < 12; m++) {
  // create a tr
  const row = document.createElement('tr')

  for (const index in headTexts) {
    // insert an empty cell into tr
    // insert first cell with month name
    row.insertCell().innerHTML = index > 0 ? '' : getMothName(new Date().setMonth(m)).toUpperCase()
  }
  // insert complete tr into tbody
  frequencyTable.querySelector('tbody').append(row)
}

// highlight columns
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

// unhighlight columns
frequencyTable.addEventListener('mouseout', e => {
  tableColumStyle.innerHTML = ''
})

// when clicking on a cell
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
      const calcTotalFrom = [
        // presence total
        {child: 2, class: 'present'},
        // aboned total
        {child: 3, class: 'aboned'},
        // ausent total
        {child: 4, class: 'ausent'},
      ]
      for (const object of calcTotalFrom) {
        tr.querySelector(`td:nth-last-child(${object.child})`).innerHTML = tr.getElementsByClassName(object.class).length
      }
    }
  }
})
