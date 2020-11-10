let isDownloaded = false

const broadcastHistoryURL = 'https://www.mirrativ.com/broadcast/history'

// case 1: navigated from "配信開始" button
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // reset flag at history page
    if (request.url == broadcastHistoryURL) isDownloaded = false
    const stopButton = document.getElementsByClassName('m-btn-primary t-btn-red')[0]
    listenForStop(stopButton, 'onMessage')
})

// case 2: refreshed page
window.onload = () => {
    const stopButton = document.getElementsByClassName('m-btn-primary t-btn-red')[0]
    listenForStop(stopButton, 'onLoad')
}

const listenForStop = (stopButton, initiator) => {
    if (stopButton) {
        console.log(`${initiator}: streaming...`)
        // remove listener
        stopButton.removeEventListener('click', downloadComments, true)
        // add event listener 
        stopButton.addEventListener("click", () => {
            downloadComments()
        }, true)
    }
}

// download comments as .txt file
// in descending order
const downloadComments = () => {
    if (isDownloaded) return

    console.log('download')
    // get comments from page
    let ary = []
    let divs = document.getElementsByClassName('m-user-comment')
    divs = Array.from(divs).reverse()
    divs.forEach(elm => {
        const name = elm.children[0].innerHTML
        const text = elm.children[1].innerHTML
        !text.includes('が入室しました') && !name.includes('Mirrativ bot') && ary.push(`${name}「${text}」`)
    })

    // get current time
    let d = new Date()
    let year = d.getFullYear()
    let month = d.getMonth() + 1
    let day = d.getDate()
    let hours = d.getHours()
    let minutes = d.getMinutes()

    if (month < 10) month = '0' + month
    if (day < 10) day = '0' + day
    if (hours < 10) hours = '0' + hours
    if (minutes < 10) minutes = '0' + minutes


    let ymd = [year, month, day].join('-')
    let hm = [hours, minutes].join('-')

    // set file properties
    let fileType = 'text/plain'
    let fileName = `${ymd}_${hm}.txt`

    let blob = new Blob([ary.join('\r\n')], { type: 'text/plain' });

    // download file
    let a = document.createElement('a');
    a.download = fileName;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [fileType, a.download, a.href].join(':');
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function() { URL.revokeObjectURL(a.href); }, 1500);

    // set flag
    isDownloaded = true
}
