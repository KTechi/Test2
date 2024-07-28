'use strict'

function tex2html() {
    // ================ TeX ================ //
    document.body.innerHTML = document.body.innerHTML.replace(/```math([\s\S]*?)```/g, '<div class="tex">$1</div>')
    document.body.innerHTML = document.body.innerHTML.replace(/`([\s\S]*?)`/g, '<span class="tex">$1</span>')
    for (const span of document.querySelectorAll('span.tex'))
        span.parentNode.replaceChild(TeXZilla.toMathML(span.textContent), span)
    for (const div of document.querySelectorAll('div.tex'))
        div.parentNode.replaceChild(TeXZilla.toMathML(div.textContent, true), div)
}

function importData(string) {
    if (document.body.innerText != '' && !confirm('Import Data')) return

    document.body.innerHTML = ""
    for (let row of string.split('\n')) {
        row = row.replace(/^# (.*)$/g, '<h1>$1</h1>')
        row = row.replace(/^## (.*)$/g, '<h2>$1</h2>')
        row = row.replace(/^### (.*)$/g, '<h3>$1</h3>')
        row = row.replace(/^#### (.*)$/g, '<h4>$1</h4>')
        row = row.replace(/^##### (.*)$/g, '<h5>$1</h5>')
        row = row.replace(/^###### (.*)$/g, '<h6>$1</h6>')
        document.body.innerHTML += row
    }
    tex2html()
}