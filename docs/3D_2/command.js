// ================================================== [50]
//     Key Listener

'use strict'

const input = document.createElement('input')
const log = []
input.addEventListener('focus', (e) => { input.style.opacity = 1  })
input.addEventListener('blur' , (e) => { input.style.opacity = .3 })
input.addEventListener('change', (e) => {})

window.addEventListener('load', init_command)
function init_command() {
    const log_container = document.getElementById('log-container')
    for (let i = 0; i < 10; i++) {
        const div = document.createElement('div')
        div.classList.add('log')
        log.push(div)
        log_container.append(div)
    }

    const form = document.querySelector('form')
    form.addEventListener('submit', submit)
    form.append(input)
    input.style.opacity = .3
}
function submit(e) {
    e.preventDefault()
    if (input.value === '') return

    const len = log.length
    for (let i = 1; i < len; i++)
        log[i-1].innerText = log[i].innerText
    log[len-1].innerText = input.value
    const token = input.value.split(' ')

    // ========================= //
    switch (token[0]) {
        case 'clear':
            for (const l of log) l.innerText = ''
            break
        case 'subdiv':
            if (2 <= token.length) subdivSphere(token[1])
            paint()
            break
        default:
            console.log(token)
    }
    // ========================= //

    input.value = ''
}

document.addEventListener('keydown', key_Down, false)
function key_Down(event) {
    if (event.key === 'Enter') {
        if (document.activeElement !== input) input.focus()
        else if (input.value === '')          input.blur()
        return
    }
}

// ================================================== [50]
//     END
// ================================================== [50]