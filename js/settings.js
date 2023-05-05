function setupSettings(){
    const anchorIcons = document.getElementsByName('anchor-icon')
    for (let index = 0; index < anchorIcons.length; index++) {
        const element = anchorIcons[index];
        const parentId = (element.parentElement.parentElement).id
        element.addEventListener('click', function(){
            copyToClipboard(`https://mikitz.github.io/mikitz-ttrpg/html/settings.html#${parentId}`, false)
            makeToast(`<b>${parentId}</b> link copied to the clipboard!`, 'success')
        })
    }
}