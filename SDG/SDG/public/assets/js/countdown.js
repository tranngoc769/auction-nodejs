function startTimer(duration, display) {
    var start = Date.now(),
        diff,
        minutes,
        seconds;
    function timer() {
        // get the number of seconds that have elapsed since 
        // startTimer() was called
        diff = duration - (((Date.now() - start) / 1000) | 0);

        // does the same job as parseInt truncates the float
        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (diff <= 0) {
            // add one second so that the count down starts at the full duration
            // example 05:00 not 04:59
            start = Date.now() + 1000;
        }
    };
    // we don't want to wait a full second before the timer starts
    timer();
    setInterval(timer, 1000);
}
window.onload = function () {
   
       
    for (let i = 1; i <= 6; i++) {
        let display = document.querySelector('#ending .time' + i);
        let value = $('#ending .time' + i).attr('data-delay');
        let Minutes = 60 * parseInt(value);
        startTimer(Minutes, display);
    }

    for (let i = 1; i <= 6; i++) {
        let display = document.querySelector('#mostBid .time' + i);
        let value = $('#mostBid .time' + i).attr('data-delay');
        let Minutes = 60 * parseInt(value);
        startTimer(Minutes, display);
    }
    for (let i = 1; i <= 6; i++) {
        let display = document.querySelector('#time' + i);
        let value = $('#time' + i).attr('data-delay');
        let Minutes = 60 * parseInt(value);
        startTimer(Minutes, display);
    }
};