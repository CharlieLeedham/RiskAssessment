let currentOrientation = localStorage.getItem('orientation') || "portrait"

function addRow(event, tableIndex) {
    const tableBody = event.target.closest('table').querySelector('tbody')
    const newRow = document.createElement('tr')

    if(tableIndex == 1) {
        newRow.innerHTML = `
            <td contenteditable>Use of decorators hand tools</td>
            <td style='text-align: center' contenteditable>YES</td>
            <td contenteditable>Knives, Scissors, Scrapers etc</td>
            <td contenteditable style='text-align: center'>E</td>
            <td contenteditable>All tools maintained in a safe condition. Instruction provided on safe
                use. Gloves and
                other
                PPE
                worn as instructed or required.</td>
            <td style='text-align: center' contenteditable>YES</td>
            <td contenteditable>Monitor</td>
            <td style='display: contents'>
                <span onclick='removeRow()' class='remove-row'>Remove</span>
            </td>`
    }
    
    else if(tableIndex == 2) {
        newRow.innerHTML = `
            <th style='width: 17%; vertical-align: middle' contenteditable>Worker name</th>
            <td style='width: 63%; vertical-align: middle' contenteditable>CHRISTOPHER BLOODWORTH</td>
            <td style='width: 10%; text-align: center; vertical-align: middle' contenteditable>Yes</td>
            <td style='width: 10%; text-align: center; vertical-align: middle' contenteditable>S</td>
            <td style='display: contents'>
                <span onclick='removeRow()' class='remove-row'>Remove</span>
            </td>`
    }
    
    else if(tableIndex == 3) {
        newRow.innerHTML = `
            <th style='width: 15%; max-width: 25px;' contenteditable>Steps</th>
            <td style='text-align: center; vertical-align: middle' contenteditable>NO</td>
            <th style='width: 15%; max-width: 25px;' contenteditable>Hand- Power tools</th>
            <td style='text-align: center; vertical-align: middle' contenteditable>NO</td>
            <th style='width: 15%; max-width: 25px;' contenteditable>Generator</th>
            <td style='text-align: center; vertical-align: middle' contenteditable>NO</td>
            <th style='width: 15%; max-width: 25px;' contenteditable>Hop ups</th>
            <td style='text-align: center; vertical-align: middle' contenteditable>NO</td>
            <td style='display: contents'>
                <span onclick='removeRow()' class='remove-row'>Remove</span>
            </td>`
    }

    else if(tableIndex == 4) {
        newRow.innerHTML = `
            <td style='vertical-align: middle; height: 40px; text-align: center' contenteditable>C BLOODWORTH</td>
            <td style='vertical-align: middle; height: 40px; text-align: center' contenteditable></td>
            <td style='vertical-align: middle; height: 40px; text-align: center' contenteditable>DD/MM/YYYY</td>
            <td style='vertical-align: middle; height: 40px; text-align: center' contenteditable>PREMIER DECORATORS UK LTD</td>
            <td style='vertical-align: middle; height: 40px; text-align: center' contenteditable>G COPE</td>
            <td style='display: contents'>
                <span onclick='removeRow()' class='remove-row'>Remove</span>
            </td>`
    }

    tableBody.appendChild(newRow)
    addPageBreaks()
    saveContent()
}

function removeRow() {
    const row = event.target.closest('tr')
    const tableBody = row.closest('tbody')

    tableBody.removeChild(row)
    addPageBreaks()
    saveContent();
}


function mmToPx(mm) {
    return mm * 3.78
}


function addPageBreaks() {
    const containers = [container1, container2, container3]
    const pageBreakPx = mmToPx(currentOrientation == "portrait" ? 297 : 210)

    const containerBreakStates = containers.map(container => {
        const breaks = Array.from(container.querySelectorAll('.page-break'))
        return breaks.map(breakLine => {
            const span = breakLine.querySelector('span')
            return { isHidden: span.style.opacity === "0.6" }
        })
    })

    containers.forEach(container => {
        container.querySelectorAll('.page-break').forEach(breakLine => breakLine.remove())
    })

    containers.forEach((container, containerIndex) => {
        const containerHeight = container.offsetHeight
        const numberOfBreaks = Math.floor(containerHeight / pageBreakPx)
        const breakStates = containerBreakStates[containerIndex]

        for (let n = 1; n <= numberOfBreaks; n++) {
            const pageBreak = document.createElement('div')
            pageBreak.classList.add('page-break')

            const pageBreakText = document.createElement('span')
            pageBreakText.innerText = "Hide break"

            if (breakStates && breakStates[n - 1] && breakStates[n - 1].isHidden) {
                pageBreakText.style.opacity = '0.6'
                pageBreak.style.background = 'none'
                pageBreak.style.boxShadow = 'none'
                pageBreakText.innerText = "Show break"
            }

            pageBreakText.onclick = function (event) {
                if (event.target.innerText === "Hide break") {
                    event.target.innerText = 'Show break'
                    this.style.opacity = 0.6
                    this.parentElement.style.background = 'none'
                    this.parentElement.style.boxShadow = 'none'
                } else {
                    event.target.innerText = "Hide break"
                    this.style.opacity = 1
                    this.parentElement.style.background = 'yellow'
                    this.parentElement.style.boxShadow = '0px 0px 5px 1px black'
                }
            };

            pageBreak.appendChild(pageBreakText)

            const pageBreakTop = `${(n * pageBreakPx) + ((n * (currentOrientation == "portrait" ? 147 : 67)) + (n * 4) - (containerIndex === 0 ? 5 : 1) + 0.5)}px`
            pageBreak.style.top = pageBreakTop

            if (parseFloat(pageBreak.style.top) < containerHeight + 25) {
                container.appendChild(pageBreak)
            }
        }
    })
}

function updatePageLayout(orientation) {
    const containers = [container1, container2, container3]

    if (orientation === "portrait") {
        containers.forEach(container => {
            container.style.maxWidth = '210mm'
            container.style.minHeight = '297mm'
        })
    } else if (orientation === "landscape") {
        containers.forEach(container => {
            container.style.maxWidth = '297mm'
            container.style.minHeight = '210mm'
        })
    }

    currentOrientation = orientation

    localStorage.setItem('orientation', currentOrientation)

    setTimeout(() => {
        addPageBreaks()
    }, 1000)
}


async function exportToPDF(event, download = true) {
    const {jsPDF} = window.jspdf
    const pdf = new jsPDF(currentOrientation, 'mm', 'a4')
    const containers = [container1, container2, container3]
    let toDelete = []
    let totalHeight = -5

    document.querySelectorAll('.add-row, .remove-row, .page-break').forEach(element => {
        element.style.display = 'none'
    })

    pdf.setDocumentProperties({
        title: "Risk Assessment & Method Statement"
    })

    for (let i = 0; i < containers.length; i++) {
        const container = containers[i]

        await pdf.html(container, {
            x: -4,
            y: totalHeight,
            width: currentOrientation == "portrait" ? 210 : 297,
            windowWidth: currentOrientation == "portrait" ? 900 : 1223,
            callback: function (doc) {
                const numPages = doc.internal.pages.length
                const pageHeight = doc.internal.pageSize.height

                totalHeight = ((pageHeight - 5) * (numPages - 1)) + ((numPages - 2) * 5)

                for (let pageIndex = numPages - 1; pageIndex >= 2; pageIndex--) {
                    const pageContent = doc.internal.pages[pageIndex]

                    if (pageContent.length < 150) {
                        toDelete.push(pageIndex)
                    }
                }
            }
        })
    }

    for (let i = toDelete.length - 1; i >= 0; i--) {
        const pageIndexToDelete = toDelete[i]

        pdf.deletePage(pageIndexToDelete)
    }

    const finalDocPages = pdf.internal.pages.length - 1

    for (let i = 1; i <= finalDocPages; i++) {
        const pageWidth = pdf.internal.pageSize.width
        const pageHeight = pdf.internal.pageSize.height

        pdf.setPage(i)
        pdf.setFontSize(8)
        pdf.text(pageWidth - 7.5, pageHeight - 6.5, `Page  ${i}  of  ${finalDocPages}`, null, 90)
    }

    if (download) {
        pdf.save("Risk_Assessment_&_Method_Statement.pdf")
    } else {
        const previewContainer = document.getElementById('pdfPreviewContainer')
        const htmlBody = document.querySelector('body')

        if (event.target.innerText == "View Preview") {
            const pdfBlob = pdf.output('blob')
            const pdfUrl = URL.createObjectURL(pdfBlob)

            event.target.innerText = "Exit Preview"
            htmlBody.style.overflow = 'hidden'
            previewContainer.querySelector('iframe').src = pdfUrl
            previewContainer.style.display = 'block'

        } else {
            previewContainer.style.display = 'none'
            htmlBody.style.overflow = 'initial'
            event.target.innerText = "View Preview"
        }
    }

    document.querySelectorAll('.add-row, .remove-row, .page-break').forEach(element => {
        element.style.display = 'block'
    })
}


function saveContent() {
    const containers = [container1, container2, container3]
    const contentData = {}

    containers.forEach((container, containerIndex) => {
        const tables = container.querySelectorAll('table')
        contentData[`container_${containerIndex}`] = []

        tables.forEach((table, tableIndex) => {
            const tableData = {
                thead: [],
                tbody: []
            }

            const thead = table.querySelector('thead');
            if (thead) {
                thead.querySelectorAll('tr').forEach((row) => {
                    const rowData = []
                    row.querySelectorAll('th, td').forEach((cell) => {
                        const cellData = {
                            tag: cell.tagName.toLowerCase(),
                            content: cell.innerHTML,
                            attributes: {}
                        };
                        Array.from(cell.attributes).forEach((attr) => {
                            cellData.attributes[attr.name] = attr.value
                        })
                        rowData.push(cellData)
                    })
                    tableData.thead.push(rowData)
                })
            }

            const tbody = table.querySelector('tbody');
            if (tbody) {
                tbody.querySelectorAll('tr').forEach((row) => {
                    const rowData = []
                    row.querySelectorAll('td, th').forEach((cell) => {
                        const cellData = {
                            tag: cell.tagName.toLowerCase(),
                            content: cell.innerHTML,
                            attributes: {}
                        }
                        Array.from(cell.attributes).forEach((attr) => {
                            cellData.attributes[attr.name] = attr.value
                        })
                        rowData.push(cellData)
                    })
                    tableData.tbody.push(rowData)
                })
            }

            contentData[`container_${containerIndex}`].push({
                tableIndex,
                tableData
            })
        })
    })

    localStorage.setItem('editableContent', JSON.stringify(contentData))
}

function loadContent() {
    const savedContent = localStorage.getItem('editableContent')
    if (savedContent) {
        const contentData = JSON.parse(savedContent)

        const containers = [container1, container2, container3]

        containers.forEach((container, containerIndex) => {
            const tables = container.querySelectorAll('table')
            const containerData = contentData[`container_${containerIndex}`]

            if (!containerData) return

            containerData.forEach((tableContent, tableIndex) => {
                const table = tables[tableIndex]
                if (!table) return

                const thead = table.querySelector('thead') || document.createElement('thead')
                thead.innerHTML = ''
                tableContent.tableData.thead.forEach((rowData) => {
                    const newRow = document.createElement('tr')
                    rowData.forEach((cellData) => {
                        const newCell = document.createElement(cellData.tag)
                        newCell.innerHTML = cellData.content

                        Object.keys(cellData.attributes).forEach((attr) => {
                            newCell.setAttribute(attr, cellData.attributes[attr])
                        })

                        newRow.appendChild(newCell)
                    })
                    thead.appendChild(newRow)
                })

                if (!table.querySelector('thead')) {
                    table.prepend(thead)
                }

                const tbody = table.querySelector('tbody') || document.createElement('tbody')
                tbody.innerHTML = ''
                tableContent.tableData.tbody.forEach((rowData) => {
                    const newRow = document.createElement('tr')
                    rowData.forEach((cellData) => {
                        const newCell = document.createElement(cellData.tag)
                        newCell.innerHTML = cellData.content

                        Object.keys(cellData.attributes).forEach((attr) => {
                            newCell.setAttribute(attr, cellData.attributes[attr])
                        })

                        newRow.appendChild(newCell)
                    })
                    tbody.appendChild(newRow)
                })

                if (!table.querySelector('tbody')) {
                    table.appendChild(tbody)
                }
            })
        })
    }
}

function resetDefault() {
    const userConfirmed = confirm("Are you sure you want to reset all changes and delete the saved content?");
    
    if (userConfirmed) {
        localStorage.removeItem('editableContent')
        location.reload()
    }
}

window.onload = function () {
    document.querySelector('main').style.opacity = 1

    const container1 = document.querySelector('#container1')
    window.container1 = container1
    const container2 = document.querySelector('#container2')
    window.container2 = container2
    const container3 = document.querySelector('#container3')
    window.container3 = container3

    updatePageLayout(currentOrientation)
    loadContent()
}

document.addEventListener('input', (event) => {
    if (event.target.hasAttribute('contenteditable')) {
        addPageBreaks()
        saveContent()
    }
})