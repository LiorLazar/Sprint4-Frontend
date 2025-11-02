export function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

export function makeLorem(size = 100) {
    var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}


export function randomPastTime() {
    const HOUR = 1000 * 60 * 60
    const DAY = 1000 * 60 * 60 * 24
    const WEEK = 1000 * 60 * 60 * 24 * 7

    const pastTime = getRandomIntInclusive(HOUR, WEEK)
    return Date.now() - pastTime
}

export function debounce(func, timeout = 300) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => { func.apply(this, args) }, timeout)
    }
}

export function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

export function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}

// ===== Utility to adjust brightness =====
function adjustColorBrightness(hex, percent) {
    if (!hex) return '#838c91'
    const num = parseInt(hex.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = (num >> 8 & 0x00FF) + amt
    const B = (num & 0x0000FF) + amt
    return '#' + (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
    ).toString(16).slice(1)
}

// ===== Get dominant color near top of image (for header matching) =====
async function getAverageColor(imageUrl) {
    return new Promise((resolve) => {
        const img = new Image()
        img.crossOrigin = 'Anonymous'
        img.src = imageUrl

        img.onload = () => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            const width = (canvas.width = Math.max(50, img.width / 8))
            const height = (canvas.height = Math.max(50, img.height / 8))

            ctx.drawImage(img, 0, 0, width, height)

            const topHeight = Math.floor(height * 0.4)
            const data = ctx.getImageData(0, 0, width, topHeight).data

            const colorMap = {}

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i]
                const g = data[i + 1]
                const b = data[i + 2]
                const a = data[i + 3]

                if (a < 150) continue
                if (r > 240 && g > 240 && b > 240) continue
                if (r < 20 && g < 20 && b < 20) continue

                const key = `${Math.round(r / 20) * 20},${Math.round(g / 20) * 20},${Math.round(b / 20) * 20}`
                colorMap[key] = (colorMap[key] || 0) + 1
            }

            const dominant = Object.entries(colorMap).sort((a, b) => b[1] - a[1])[0]
            if (!dominant) return resolve('#838c91')

            const [r, g, b] = dominant[0].split(',').map(Number)
            const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
            resolve(hex)
        }

        img.onerror = () => resolve('#838c91')
    })
}

export const utilService = {
    makeId,
    makeLorem,
    getRandomIntInclusive,
    randomPastTime,
    debounce,
    saveToStorage,
    loadFromStorage,
    getAverageColor,
    adjustColorBrightness,
}
