setInterval(slide, 2500);
let i = 0;
function slide() {
    i = i == 3 ? 0 : i + 1;
    document.getElementById("bg-slideshow").style.backgroundImage = `url(../images/slideshow${i}.jpg)`;
}