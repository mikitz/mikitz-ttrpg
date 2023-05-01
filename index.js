function setupIndex(){
    const versionNumberElements = document.querySelectorAll('.version-number')
    for (let index = 0; index < versionNumberElements.length; index++) {
        const element = versionNumberElements[index];
        const versionNumber = element.id.replace('-','')
        element.innerHTML = eval(versionNumber)
    }   

    addTippy('feedback-definition', '<span class="definition">Feedback</span> is defined as any ideas that you would like to see implemented, or for constructive criticism about the UI, UX, or the algorithms.')
}