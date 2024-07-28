'use strict'

document.addEventListener('DOMContentLoaded', event => {
    document.addEventListener('dragover', event => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'copy'
    })
    document.addEventListener('drop', event => {
        event.preventDefault()
        for (const file of event.dataTransfer.files) {
            if (!file || file.type.indexOf('text/') < 0) continue
            const fr = new FileReader()
            fr.readAsText(file, "UTF-8")
            fr.onload = e => importData(fr.result)
        }
    })
})