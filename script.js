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
            <th style='width: 10%' contenteditable>Worker name</th>
            <td style='width: 70%' contenteditable>CHRISTOPHER BLOODWORTH</td>
            <td style='width: 10%; text-align: center;' contenteditable>Yes</td>
            <td style='width: 10%; text-align: center;' contenteditable>S</td>
            <td style='display: contents'>
                <span onclick='removeRow()' class='remove-row'>Remove</span>
            </td>`
    }
    
    else if(tableIndex == 3) {
        newRow.innerHTML = `
            <th contenteditable>Steps</th>
            <td style='text-align: center;' contenteditable>NO</td>
            <th style='max-width: 25px;' contenteditable>Hand- Power tools</th>
            <td style='text-align: center;' contenteditable>NO</td>
            <th style='max-width: 25px;' contenteditable>Generator</th>
            <td style='text-align: center;' contenteditable>NO</td>
            <th style='max-width: 25px;' contenteditable>Hop ups</th>
            <td style='text-align: center;' contenteditable>NO</td>
            <td style='display: contents'>
                <span onclick='removeRow()' class='remove-row'>Remove</span>
            </td>`
    }

    else if(tableIndex == 4) {
        newRow.innerHTML = `
            <td contenteditable>C BLOODWORTH</td>
            <td contenteditable></td>
            <td contenteditable>DD/MM/YYYY</td>
            <td contenteditable>PREMIER DECORATORS UK LTD</td>
            <td contenteditable>G COPE</td>
            <td style='display: contents'>
                <span onclick='removeRow()' class='remove-row'>Remove</span>
            </td>`
    }

    tableBody.appendChild(newRow)
    addPageBreaks()
}

function removeRow() {
    const row = event.target.closest('tr')
    const tableBody = row.closest('tbody')

    tableBody.removeChild(row)
    addPageBreaks()
}


function mmToPx(mm) {
    return mm * 3.78
}


function addPageBreaks() {
    const containers = [container1, container2, container3]
    const existingBreaks = document.querySelectorAll('.page-break')
    const pageBreakPx = mmToPx(210)

    existingBreaks.forEach(breakLine => breakLine.remove())

    for (let i = 0; i < containers.length; i++) {
        const container = containers[i]
        const containerHeight = containers[i].offsetHeight
        const numberOfBreaks = Math.floor(containerHeight / pageBreakPx)

        for (let n = 1; n <= numberOfBreaks; n++) {
            const pageBreak = document.createElement('div')
            const pageBreakText = document.createElement('span')

            pageBreak.classList.add('page-break')

            pageBreakText.onclick = function(event) {
                if(event.target.innerText == "Hide break") {
                    event.target.innerText = "Show break"
                    this.style.opacity = '0.6'
                    this.parentElement.style.background = 'none'
                    this.parentElement.style.boxShadow = 'none'
                }
                else {
                    event.target.innerText = "Hide break"
                    this.style.opacity = '1'
                    this.parentElement.style.background = 'yellow'
                    this.parentElement.style.boxShadow = '0px 0px 5px 1px black'
                }
            }

            if(i == 0){
                pageBreak.style.top = `${(n * pageBreakPx) + ((n * 67) + (n * 4) - 5 + .5)}px`

                if (parseFloat(pageBreak.style.top) < containerHeight + 25) {
                    container.appendChild(pageBreak)
                }
            }

            else {
                pageBreak.style.top = `${(n * pageBreakPx) + ((n * 67) + (n * 4) - 1 + .5)}px`

                if (parseFloat(pageBreak.style.top) < containerHeight + 21) {
                    container.appendChild(pageBreak)
                }
            }

            pageBreakText.innerText = "Hide break"
            pageBreak.appendChild(pageBreakText)
        }
    }
}

async function exportToPDF(event, download = true) {
    const {jsPDF} = window.jspdf
    const pdf = new jsPDF('landscape', 'mm', 'a4')
    const containers = [container1, container2, container3]
    let toDelete = []
    let totalHeight = -5
    
    document.querySelectorAll('.add-row, .remove-row, .page-break').forEach(element => {
        element.style.display = 'none'
    });

    pdf.setDocumentProperties({
        title: "Risk Assessment & Method Statement"
    });

    for (let i = 0; i < containers.length; i++) {
        const container = containers[i]

        await pdf.html(container, {
            x: -4,
            y: totalHeight,
            width: 297,
            windowWidth: 1223,
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

window.onload = function () {

    const container1 = document.querySelector('#container1')
    window.container1 = container1
    const container2 = document.querySelector('#container2')
    window.container2 = container2
    const container3 = document.querySelector('#container3')
    window.container3 = container3

}

document.addEventListener('input', (event) => {
    if (event.target.hasAttribute('contenteditable')) {
        addPageBreaks();
    }
});