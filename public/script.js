console.log('script loaded')

document.querySelector('button').addEventListener('click', () => {
    const first_name = document.querySelector('#first_name').value
    const last_name = document.querySelector('#last_name').value
    const url = new URL('/api/by_name', window.location.origin);
    url.searchParams.append('first_name', first_name);
    url.searchParams.append('last_name', last_name);

    fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())

        .then((data) => {
            console.log(data);

            const div = document.querySelector('#output')
            div.innerHTML = ""

            function createTableFromData(dataArray) {
                // Create a table element
                const table = document.createElement('table');
                table.style.width = '100%';
                table.setAttribute('border', '1');
                table.setAttribute('cellspacing', '0');
                table.setAttribute('cellpadding', '5');

                // Create the table header row
                const thead = document.createElement('thead');
                let headerRow = document.createElement('tr');
                Object.keys(dataArray[0]).forEach(headerText => {
                    let header = document.createElement('th');
                    let textNode = document.createTextNode(headerText.toUpperCase());
                    header.appendChild(textNode);
                    headerRow.appendChild(header);
                });
                thead.appendChild(headerRow);
                table.appendChild(thead);

                // Create the table body
                const tbody = document.createElement('tbody');
                dataArray.forEach(obj => {
                    let row = document.createElement('tr');
                    Object.values(obj).forEach(text => {
                        let cell = document.createElement('td');
                        let textNode = document.createTextNode(text);
                        cell.appendChild(textNode);
                        row.appendChild(cell);
                    });
                    tbody.appendChild(row);
                });
                table.appendChild(tbody);

                // Append the table to the div
                div.appendChild(table);
            }            
            createTableFromData(data);

        })
        .catch((error) => {
          console.error('error:', error);
        });
})