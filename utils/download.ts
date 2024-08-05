export const download = (filename: string, text: string) => {
    const eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    const blob = new Blob([text]);
    eleLink.href = URL.createObjectURL(blob);
    document.body.appendChild(eleLink);
    eleLink.click();
    document.body.removeChild(eleLink);
}