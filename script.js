
// time 
// temporery comment out date.textContent = time(); 
// global vriabls/constants 
let score, answer, level;
const levelArr = document.getElementsByName("level");
const scoreArr = [];
const timeArr = [];
let timerInterval; // define timerInterval globally
// define startTime globally
let startTime;
// store completed round durations (ms)
const roundDurations = [];
let roundRunning = false; // true while a round is in progress
// streak tracking
let streak = 0;
const streakHistory = [];
const timerElem = document.getElementById("timer"); // element to show live round time
const giveUpBtn = document.getElementById("giveUpBtn"); // optional give up button

// common DOM elements used in the script (explicitly grab them)
const playBtn = document.getElementById("playBtn");
const guessBtn = document.getElementById("guessBtn");
const guess = document.getElementById("guess");
const nameBtn = document.getElementById("nameBtn");
const nameOutput = document.getElementById("nameOutput");
const msg = document.getElementById("msg");
const wins = document.getElementById("wins");
const avgScore = document.getElementById("avgScore");
const resetStatsBtn = document.getElementById('resetStatsBtn');

// player's stored name
let playerName = "";

// ensure initial button states: don't allow play until name entered
if (playBtn) playBtn.disabled = true;
if (giveUpBtn) giveUpBtn.disabled = true;

// event listeners
if (giveUpBtn) giveUpBtn.addEventListener("click", giveUp);
if (resetStatsBtn) resetStatsBtn.addEventListener('click', resetStats);



 // date part from csp book 
const dateElem = document.getElementById("date");
 function pad(n){ return n < 10 ? "0"+n : n; }
function updateClock(){
    const now = new Date(); 
    let dow = now.getDay();
    let month = now.getMonth();
    let year = now.getFullYear();
    let mins = pad(now.getMinutes());
    let hour = now.getHours();
    let secs = pad(now.getSeconds());
    let amPm = "a.m.";

    switch(dow){
        case 0: dow = "Sunday"; break;
        case 1: dow = "Monday"; break;
        case 2: dow = "Tuesday"; break;
        case 3: dow = "Wednesday"; break;
        case 4: dow = "Thursday"; break;
        case 5: dow = "Friday"; break;
        case 6: dow = "Saturday"; break;
    }
    switch(month){
        case 0: month = "January"; break;
        case 1: month = "February"; break;
        case 2: month = "March"; break;
        case 3: month = "April"; break;
        case 4: month = "May"; break;
        case 5: month = "June"; break;
        case 6: month = "July"; break;
        case 7: month = "August"; break;
        case 8: month = "September"; break;
        case 9: month = "October"; break;
        case 10: month = "November"; break;
        case 11: month = "December"; break;
    }
    if (hour >= 12) { hour -= 12; amPm = "p.m."; }
    if (hour == 0) { hour = 12; }
    const fullDate = "Today is " + dow + ", " + month + " " + dow + ", " + year + ". The time is " + hour + ":" + mins + ":" + secs + " " + amPm;
    if (dateElem) dateElem.textContent = fullDate;
}
updateClock();
setInterval(updateClock, 1000);

 playBtn.addEventListener("click", play);
 guessBtn.addEventListener("click", makeGuess);
 nameBtn.addEventListener("click", myName); 


function time()
{
    let d = new Date(); 
    //concatenate the date and the time 
    let str = d.getMonth()+1 + "/" + d.getDate() + "/" + d.getFullYear(); 
    // update here 
}
 function play()
 {
    // require player name before starting
    const nameInput = document.getElementById('nameInput');
    if (!nameInput || !nameInput.value.trim()) {
        if (nameOutput) nameOutput.textContent = "Please enter your name before playing.";
        return;
    }
    // store player's formatted name
    playerName = nameInput.value[0].toUpperCase() + nameInput.value.slice(1).toLowerCase();
    if (nameOutput) nameOutput.textContent = `Hello ${playerName}, let's play a game :)`;

    playBtn.disabled = true;
     guessBtn.disabled = false; 
     guess.disabled = false;
 
     for (let i = 0; i < levelArr.length; i++)
     {
         levelArr[i].disabled = false;
         if(levelArr[i].checked)
         {
             level = levelArr[i].value
         }
     }
     answer = Math.floor(Math.random()*level)+1;
     msg.textContent = "Guess a number 1-" + level; 
   guess.placeholder = answer; 
    score = 0; 
        // enable give up while a round is running
        if (giveUpBtn) giveUpBtn.disabled = false;
    // when the user clicks play, start the timer and dispay it 

    startTime = Date.now();                       // replace `let startTime = Date.now();`
    // remove the extra setInterval that used an undefined `timer` variable
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; } // add clearing previous interval
    roundRunning = true;
    if (timerElem) timerElem.textContent = `Time: 0.00s`;
    timerInterval = setInterval(() => {
        if (!startTime) return;
        const elapsed = Date.now() - startTime;
        if (timerElem) timerElem.textContent = `Time: ${(elapsed/1000).toFixed(2)}s`;
    }, 250);

}


function makeGuess()
{   
    let userGuess = parseInt(guess.value); 
    if (isNaN(userGuess) || userGuess < 1 || userGuess > level)
    {
        msg.textContent = "INVALID, guess a number!"; 
        return; 
    }
    score ++; 
    // adaptive hinting
    const diff = Math.abs(userGuess - answer);
    const base = userGuess > answer ? 'Too high' : 'Too low';
    const adaptive = getAdaptiveHint(diff, level, score, roundDurations);
    msg.textContent = base + ', ' + adaptive;
    // any incorrect guess breaks the streak immediately
    if (userGuess !== answer) {
        if (streak !== 0) {
            streak = 0;
            updateStreakDisplay();
            if (typeof drawStats === 'function') drawStats();
        }
    }
     if (userGuess === answer)
     {
         msg.textContent = "";
         msg.textContent = "Correct! It took " + score + " tries."; 
         {
             if (score < 3)
             {
                msg.textContent += "Your score was excellent, " + (playerName || "");
             }
             else if (score < 6)
             {
                 msg.textContent += "Your score was good! :)";
             }
             else
             {
                 msg.textContent += "Your score could be better. :(";
             }
            // now stop the timer and add it to the array 
            clearInterval(timerInterval); // timer interval needs to be defined globally
            timeArr.push(Date.now() - startTime); // start time needs to be defined globally
       updateTimeLeaderboard();
            // stop timer and record duration
            if (roundRunning && startTime) {
                const elapsed = Date.now() - startTime;
                roundDurations.push(elapsed);
                roundRunning = false;
            }
            // update streak: only increment when correct on first try
            if (score === 1) {
                streak = (streak || 0) + 1;
            }
            // record streak after this round and refresh
            streakHistory.push(streak);
            updateStreakDisplay();
            if (typeof drawStats === 'function') drawStats();
            if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
            startTime = null;
            updateTimeLeaderboard();
         }
         reset()
         updateScore(); 
     }
    
}
function reset()
 {
     guessBtn.disabled = true; 
     guess.value = ""; 
    guess.placehodler = ""; 
   guess.placeholder = ""; 
     playBtn.disabled = false; 
     guess.disabled = true; 
     for (let i = 0; i < levelArr.length; i++)
     {
         levelArr[i].disabled = false;

   }
    // stop live display (do not start a new round)
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    if (timerElem) timerElem.textContent = "";
    // disable give up after reset
    if (giveUpBtn) giveUpBtn.disabled = true;
}
function updateScore(){
    scoreArr.push(score); // adds current score to array of scores 
    wins.textContent = "Total wins: " + scoreArr.length; 
    let sum = 0; 
    scoreArr.sort((a,b) => a-b); // score ascending // leaderboard?
    const lb = document.getElementsByName("leaderboard");

    for (let i = 0; i < scoreArr.length; i++)
    {
        sum += scoreArr[i]; 
        if (i < lb.length)
        {
            lb[i].textContent = scoreArr[i]; 
        }
    }
    let avg = sum/(scoreArr.length); 
    avgScore.textContent = "Average Score: " + avg.toFixed(2); 
    // refresh charts
    if (typeof drawStats === 'function') drawStats();

}
function updateTimeLeaderboard(){

    roundDurations.sort((a,b) => a-b);
    const lb = document.getElementsByName("leaderboardtime");
    for (let i = 0; i < lb.length; i++) {
        if (i < roundDurations.length) {
            lb[i].textContent = (roundDurations[i]/1000).toFixed(2) + "s";
        } else {
            lb[i].textContent = "";
        }
    }
    // optional: update fastest / average displays if present
    const fastestElem = document.getElementById("fastestTime");
    const avgElem = document.getElementById("avgTime");
    if (roundDurations.length) {
        const fastest = Math.min(...roundDurations);
        const avg = roundDurations.reduce((s,t) => s + t, 0) / roundDurations.length;
        if (fastestElem) fastestElem.textContent = `Fastest Time: ${(fastest/1000).toFixed(2)}s`;
        if (avgElem) avgElem.textContent = `Average Time: ${(avg/1000).toFixed(2)}s`;
    } else {
        if (fastestElem) fastestElem.textContent = "";
        if (avgElem) avgElem.textContent = "";
    }
    // refresh charts
    if (typeof drawStats === 'function') drawStats();
}

function resetStats() {
    // clear arrays
    scoreArr.length = 0;
    timeArr.length = 0;
    roundDurations.length = 0;
    streakHistory.length = 0;
    streak = 0;

    // clear leaderboard DOM
    const lb = document.getElementsByName('leaderboard');
    for (let i = 0; i < lb.length; i++) lb[i].textContent = '';
    const lbt = document.getElementsByName('leaderboardtime');
    for (let i = 0; i < lbt.length; i++) lbt[i].textContent = '';

    // clear summary elements
    if (wins) wins.textContent = 'Total wins: 0';
    if (avgScore) avgScore.textContent = 'Average Score: ';
    const avgElem = document.getElementById('avgTime'); if (avgElem) avgElem.textContent = 'Average Time: ';
    const fastestElem = document.getElementById('fastestTime'); if (fastestElem) fastestElem.textContent = '';
    updateStreakDisplay();

    // redraw empty charts
    if (typeof drawStats === 'function') drawStats();
}
function giveUp(){

   if (!roundRunning) {
        msg.textContent = "No round in progress to give up.";
        return;
    }
    // record elapsed (optional: treat give-up as completed round)
    // Do NOT log time or score for a give-up. Stop the timer and end round.
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    roundRunning = false;
    // giving up resets the active streak
    if (streak !== 0) {
        streak = 0;
        updateStreakDisplay();
        if (typeof drawStats === 'function') drawStats();
    }
    startTime = null;
    msg.textContent = `You gave up. The answer was ${answer}.`;
    reset();

}
   
function myName()
{
     const nameInput = document.getElementById('nameInput');
    const n = nameInput.value.trim(); // this is basically String()
    if (!n) {
        nameOutput.textContent = "Please enter your name";
        return;
    }
    // normalize and store the player's name, and enable Play
    let temp = nameInput.value[0].toUpperCase() + nameInput.value.slice(1).toLowerCase();
    playerName = temp;
    nameOutput.textContent = `Hello ${temp}, let's play a game :)`;
    msg.textContent = "Select a Level, " + temp;
    if (playBtn) playBtn.disabled = false;
}

// Adaptive hint helper and tips panel (kept at bottom)
function getAdaptiveHint(diff, levelVal, attempts, pastDurations) {
    // diff: absolute difference between guess and answer
    // levelVal: max number (string or number)
    const lvl = Number(levelVal) || 10;
    // relative distance 0..1
    const rel = Math.min(1, diff / Math.max(1, Math.floor(lvl / 4)));
    // recent performance: average of last 3 durations (s)
    let recentAvg = null;
    if (pastDurations && pastDurations.length) {
        const last = pastDurations.slice(-3);
        recentAvg = last.reduce((s,t)=>s+t,0)/last.length/1000;
    }
    if (diff === 0) return 'Correct!';
    if (rel > 0.9) return 'Way off — try a very different number.';
    if (rel > 0.6) return 'Far — you are in the wrong area.';
    if (rel > 0.35) return 'Not too close yet — try moving a chunk higher or lower.';
    if (rel > 0.12) return 'Close — you are getting warmer.';
    // very close
    if (rel <= 0.12) {
        // if player is slow overall, encourage quicker guessing
        if (recentAvg && recentAvg > 6) return 'Very close — nudging just a bit should do it (try faster!).';
        return 'Very close — you are nearly there.';
    }
    return 'Keep trying.';
}

// Tips panel: cycles through short tips with a simple slide animation
(function createTipsPanel(){
    const tips = [
        'Guess faster to lower your time.',
        'Use the detailed stats below to spot patterns.',
        'Try the harder levels for a bigger challenge.',
        'You can give up anytime to see the answer.',
        'Lower scores are better — aim for fewer tries.'
    ];
    const panel = document.createElement('div');
    panel.id = 'tipsPanel';
    const panelHeight = 44; // one tip visible
    Object.assign(panel.style, {
        position: 'fixed', right: '12px', top: '110px', width: '260px',
        height: panelHeight + 'px',
        background: 'rgba(18,19,22,0.95)', color: '#d7e6f8', padding: '0',
        border: '1px solid rgba(255,255,255,0.04)', borderRadius: '2px', overflow: 'hidden',
        boxSizing: 'border-box', zIndex: 8000, fontSize: '13px'
    });
    const inner = document.createElement('div');
    inner.style.transition = 'transform 400ms ease';
    inner.style.willChange = 'transform';
    inner.style.display = 'block';
    inner.style.height = (tips.length * panelHeight) + 'px';
    panel.appendChild(inner);
    tips.forEach(t => {
        const p = document.createElement('div');
        p.textContent = t;
        p.style.height = panelHeight + 'px';
        p.style.display = 'flex';
        p.style.alignItems = 'center';
        p.style.padding = '0 10px';
        p.style.margin = '0';
        p.style.boxSizing = 'border-box';
        p.style.whiteSpace = 'normal';
        inner.appendChild(p);
    });
    document.body.appendChild(panel);

    let idx = 0;
    function showNext() {
        idx = (idx + 1) % tips.length;
        inner.style.transform = `translateY(${-idx * panelHeight}px)`;
    }
    // pause on hover
    panel.addEventListener('mouseenter', () => clearInterval(panel._timer));
    panel.addEventListener('mouseleave', () => { panel._timer = setInterval(showNext, 3500); });
    // start
    panel._timer = setInterval(showNext, 3500);
})();


// --- detailed stats charts (kept at the bottom so it's easy to separate) ---
(function createStatsUI() {
    const sec = document.createElement('section');
    sec.id = 'detailedStats';
    sec.style.maxWidth = '700px';
    sec.style.margin = '18px';
    sec.innerHTML = `
        <h3>Detailed Stats</h3>
        <p id="streakDisplay" style="margin:6px 0;color:#d7e6f8"></p>
        <canvas id="scoreChart" width="600" height="160" style="width:100%;border:1px solid #eee"></canvas>
        <canvas id="timeChart" width="600" height="160" style="width:100%;border:1px solid #eee;margin-top:12px"></canvas>
        <canvas id="streakChart" width="600" height="100" style="width:100%;border:1px solid #eee;margin-top:12px"></canvas>
    `;
    document.body.appendChild(sec);
})();

function drawStats() {
    const scoreCanvas = document.getElementById('scoreChart');
    const timeCanvas = document.getElementById('timeChart');
    if (!scoreCanvas || !timeCanvas) return;
    const sc = scoreCanvas.getContext('2d');
    const tc = timeCanvas.getContext('2d');
    const streakCanvas = document.getElementById('streakChart');
    const kc = streakCanvas ? streakCanvas.getContext('2d') : null;
    const cw = scoreCanvas.width, ch = scoreCanvas.height;
    const tw = timeCanvas.width, th = timeCanvas.height;
    sc.clearRect(0, 0, cw, ch);
    tc.clearRect(0, 0, tw, th);
    if (kc) kc.clearRect(0,0, streakCanvas.width, streakCanvas.height);

    // Score points (scatter) — one dot per recorded score
    if (scoreArr.length) {
        const padding = 30;
        const sorted = scoreArr.slice().sort((a,b) => a-b);
        const minS = Math.min(...sorted);
        const maxS = Math.max(...sorted);
    sc.font = '12px sans-serif';
    sc.fillStyle = '#e6eef6';
    sc.fillText('Scores (lower is better)', padding, 14);
    sc.strokeStyle = 'rgba(255,255,255,0.06)';
        sc.beginPath(); sc.moveTo(padding, ch - padding); sc.lineTo(cw - padding, ch - padding); sc.stroke();
        const step = (cw - padding * 2) / Math.max(sorted.length - 1, 1);
        sorted.forEach((val, i) => {
            const x = padding + i * step;
            const norm = (maxS === minS) ? 0.5 : (val - minS) / (maxS - minS);
            const y = ch - padding - (norm * (ch - padding * 2));
            sc.fillStyle = '#FF9800';
            sc.beginPath(); sc.arc(x, y, 4, 0, Math.PI * 2); sc.fill();
        });
    } else {
        sc.fillStyle = '#e6eef6'; sc.font = '14px sans-serif';
        sc.fillText('No scores yet', 10, 20);
    }

    // Time chart (simple scatter across rounds)
    if (roundDurations.length) {
        const times = roundDurations.map(t => t / 1000);
        const padding = 30;
        const maxT = Math.max(...times);
    tc.font = '12px sans-serif'; tc.fillStyle = '#e6eef6';
    tc.fillText('Round times (s)', padding, 14);
    tc.strokeStyle = 'rgba(255,255,255,0.06)'; tc.beginPath(); tc.moveTo(padding, th - padding); tc.lineTo(tw - padding, th - padding); tc.stroke();
        const step = (tw - padding * 2) / Math.max(times.length - 1, 1);
        times.forEach((val, i) => {
            const x = padding + i * step;
            const y = th - padding - ((val / maxT) * (th - padding * 2));
            tc.fillStyle = '#2196F3';
            tc.beginPath(); tc.arc(x, y, 4, 0, Math.PI * 2); tc.fill();
        });
    } else {
        tc.fillStyle = '#e6eef6'; tc.font = '14px sans-serif';
        tc.fillText('No times yet', 10, 20);
    }

    // Streak chart (show streak value over completed rounds)
    if (kc) {
        const data = streakHistory.slice();
        const sw = streakCanvas.width, sh = streakCanvas.height;
    kc.font = '12px sans-serif'; kc.fillStyle = '#e6eef6';
    kc.fillText('Streak over rounds', 10, 14);
    kc.strokeStyle = 'rgba(255,255,255,0.06)'; kc.beginPath(); kc.moveTo(10, sh - 20); kc.lineTo(sw - 10, sh - 20); kc.stroke();
        if (data.length) {
            const max = Math.max(...data, 1);
            const step = (sw - 20) / Math.max(data.length - 1, 1);
            data.forEach((val, i) => {
                const x = 10 + i * step;
                const y = sh - 20 - ((val / max) * (sh - 40));
                kc.fillStyle = '#E91E63'; kc.beginPath(); kc.arc(x, y, 4, 0, Math.PI*2); kc.fill();
            });
        } else {
            kc.fillStyle = '#e6eef6'; kc.font = '14px sans-serif'; kc.fillText('No streak data yet', 10, 40);
        }
    }
}

function updateStreakDisplay(){
    const el = document.getElementById('streakDisplay');
    if (!el) return;
    el.textContent = (streak > 0) ? `Streak: ${streak}` : '';
}

// initial draw (in case there are existing values)
drawStats();
updateStreakDisplay();