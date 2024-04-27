
setInterval(tic, 1000);
function tic() {
    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let date = now.getDate();
    let hour = now.getHours();
    let minutes = now.getMinutes();
    let seconds = now.getSeconds();
    document.getElementById("date").innerHTML = `${year}/${formatTime(month)}/${formatTime(date)} ${formatTime(hour)}:${formatTime(minutes)}:${formatTime(seconds)}`;
}

function formatTime(value) {
    return value >= 10 ? value : "0" + value;
}