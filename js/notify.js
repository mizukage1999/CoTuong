/*
 * Page Title
 */
//khai báo
let pageTitle = document.title;

// function cho title
export function setTitle(title) {
    pageTitle = title;
    document.title = title;
}


/*
 * Sounds
 */

export function playSound(snd) {
    snd.currentTime = 0;
    snd.play();
}
