window.addEventListener("scroll", onScroll);
function onScroll() {
    let top = window.scrollY > 30 ? `0px` : `1vh`;
    document.getElementById("brand-signature").style.top = top;
}