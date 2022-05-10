const frequencyTable = document.querySelector('table')
const tableColumStyle = document.querySelector('#table-column')
const inputName = document.querySelector('input')
const params = new URLSearchParams(location.search)
const userId = params.get('id')
const eList = document.querySelector('.list')
const tdOptions = [{
  option: 'P', class: 'present',
}, {
  option: 'F', class: 'ausent',
}, {
  option: 'A', class: 'aboned',
}, {
  option: '', class: '',
}]

//
const calcTotalFrom = [         // presence total
  {child: 2, class: 'present'}, // aboned total
  {child: 3, class: 'aboned'}, // ausent total
  {child: 4, class: 'ausent'}]

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

const getMothName = (date, length = 'short') => {
  return new Date(date).toLocaleDateString('pt-br', {
    month: length,
  })
}

// TBODY
const fillTbody = (data = []) => {
  for (let m = 0; m < 12; m++) {
    // create a tr
    const row = document.createElement('tr')

    const currentMonthData = data[m] ?? null

    for (const index in headTexts) {

      const cell = row.insertCell()
      // insert first cell with month name
      if (index == 0) {
        cell.innerHTML = getMothName(new Date().setMonth(m)).toUpperCase()
      } else if (currentMonthData) {
        const setIndex = parseInt(currentMonthData.days[index])
        if (setIndex > -1) {
          cell.dataset.option = setIndex
          cell.className = tdOptions[setIndex].class
          cell.innerText = tdOptions[setIndex].option
        }
      } else {
        cell.innerHTML = ''
      }

    }

    // insert complete tr into tbody
    frequencyTable.querySelector('tbody').append(row)
    calcTotals([row])
  }

// highlight
  for (const col of calcTotalFrom) {
    for (const cell of frequencyTable.querySelectorAll(`td:nth-last-child(${col.child})`)) {
      const tr = cell.parentNode
      cell.addEventListener('mouseover', () => {
        for (const check of tr.getElementsByClassName(col.class)) {
          check.classList.add('border')
        }
      })
      cell.addEventListener('mouseout', () => {
        for (const check of tr.getElementsByClassName(col.class)) {
          check.classList.remove('border')
        }
      })
    }
  }
}

// highlight columns
frequencyTable.addEventListener('mouseover', e => {
  const element = e.target
  if (element.matches('td, th')) {
    const index = ++element.cellIndex
    if (index > 1) {
      tableColumStyle.innerHTML = `
      table thead tr th:nth-child(${index}),
      table tbody tr td:nth-child(${index}){
        background-color: #fffce7;
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

      calcTotals([element.parentNode])
    }

  }
})

const calcTotals = (trs) => {
  // calc totals
  trs = trs || frequencyTable.querySelectorAll('tr > td[class]:first-of-type')
  for (const tr of trs) {
    for (const object of calcTotalFrom) {
      tr.querySelector(`td:nth-last-child(${object.child})`).innerHTML = tr.getElementsByClassName(object.class).length
    }
  }
}

document.querySelector('button').addEventListener('click', async () => {
  const name = inputName.value
  if (!name) {
    inputName.className = 'is-invalid'
    return false
  }

  inputName.className = ''

  const frequencySchema = []
  const trs = frequencyTable.querySelectorAll('tbody tr')
  for (const tr of trs) {
    const cells = tr.querySelectorAll('td:nth-child(n+2):nth-child(-n+32)')
    const month = {month: tr.rowIndex, days: []}
    for (const c of cells) {
      month.days[c.cellIndex] = c.dataset.option || 3
    }
    frequencySchema.push(month)
  }

  const fData = new FormData()

  fData.append('name', name)
  fData.append('frequency', JSON.stringify(frequencySchema))

  const response = await saveStudent(fData)

  // se response estiver ok
  if (response.statusCode === 200) {
    window.location = './'
  } else {
    eList.classList.add('text-danger')
    eList.innerHTML = response.body
  }
})

/**
 * Funçõo para submeter requests a um servidor, esperendo json como resposta
 * @param url
 * @param data
 * @param method
 * @returns {Promise<any>}
 */
const fetchJson = async (url, data, method = 'POST') => {

  const headers = {
    method: method,
  }

  if (method === 'POST') {
    headers.body = data
  }

  // faz o request
  const request = await fetch(url, headers)

  try {

    // converte o resultado da request em json
    const body = await request.json()
    // retorna a resposta
    return {statusCode: request.status, body}
  } catch (e) {
    return {statusCode: 404, body: e}
  }
}

/**
 * Função pra buscar students
 * @param id
 * @returns {Promise<*>}
 */
const getStudents = async (id) => {
  const response = await fetchJson(`api/${id ? `?id=${id}` : ''}`, '', 'GET')

  // se response estiver ok
  if (response.statusCode === 200 && response.body.data) {
    return response.body.data
  }
}

const fillList = (data) => {
  for (const s of data) {
    const a = document.createElement('a')
    a.href = `?id=${s.id}`
    a.className = 'p-12'
    a.innerText = s.student

    eList.append(a)
  }
}

/**
 * Função para salvar students
 * @param id
 * @returns {Promise<void>}
 */
const saveStudent = async (data, id) => {

  id = id || userId
  const response = await fetchJson(`api/save/${id ? `?id=${id}` : ''}`, data)

  return response
}

// assim q o html for carregado
document.addEventListener('DOMContentLoaded', async (e) => {
  // carrega a página inicial
  const students = await getStudents()
  if (students) {
    fillList(students)
  }

  if (userId && students) {
    inputName.parentNode.className = 'd-none'
    const [register] = students.filter(student => student.id == userId)

    if (register) {
      inputName.value = register.student
      fillTbody(JSON.parse(register.frequency))
    }
  } else {
    fillTbody()
  }
})
