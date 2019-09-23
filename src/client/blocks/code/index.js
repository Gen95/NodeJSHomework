import hljs from 'highlight.js';

const getTemplateRow = (row, rowNumber) => `
<td class="code__rowNumber">${rowNumber}</td>
<td class="code__value">${hljs.highlightAuto(row).value}</td>`;


const getTemplateDiffRow = (row, sign, addRowNumber, removeRowNumber) => `
<td class="code__rowNumber">${sign === '-' ? '' : addRowNumber}</td>
<td class="code__rowNumber">${sign === '+' ? '' : removeRowNumber}</td>
<td class="code__value">${hljs.highlightAuto(row).value}</td>`;


const createTable = (block, isDiff = false) => {
  const table = document.createElement('table');
  table.classList.add('code__table');
  const { innerText } = block;

  let rowNumber = 1;
  let addRowNumber = 1;
  let removeRowNumber = 1;

  block.innerText = '';

  if (isDiff) {
    for (let row of innerText.split('\n')) {
      const codeRow = document.createElement('tr');
      const sign = row[0];
      codeRow.classList.add('code__row');
      if (sign === '+') {
        codeRow.classList.add('code__row_add');
        row = row.slice(1);
      }
      if (sign === '-') {
        codeRow.classList.add('code__row_remove');
        row = row.slice(1);
      }
      codeRow.innerHTML = getTemplateDiffRow(row, sign, addRowNumber, removeRowNumber);
      table.appendChild(codeRow);

      if (sign === '+') {
        addRowNumber += 1;
      }

      if (sign === '-') {
        removeRowNumber += 1;
      }

      if (!(sign === '-' || sign === '+')) {
        removeRowNumber += 1;
        addRowNumber += 1;
      }
    }
  } else {
    for (const row of innerText.split('\n')) {
      const codeRow = document.createElement('tr');
      codeRow.classList.add('code__row');
      codeRow.innerHTML = getTemplateRow(row, rowNumber);
      table.appendChild(codeRow);
      rowNumber += 1;
    }
  }

  block.appendChild(table);
};

document.querySelectorAll('.code_show')
  .forEach((block) => {
    createTable(block);
  });

document.querySelectorAll('.code_diff')
  .forEach((block) => {
    createTable(block, true);
  });
