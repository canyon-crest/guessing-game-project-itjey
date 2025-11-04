
// time 
// temporery comment out date.textContent = time(); 
// global vriabls/constants 
 let score, answer, level; 
 const levelArr = document.getElementsByName("level"); 
 const scoreArr=[]; 
const timeArr=[];
let timerInterval; // define timerInterval globally
// define startTime globally
let startTime;
// store completed round durations (ms)
const roundDurations = [];
let roundRunning = false; // true while a round is in progress
const timerElem = document.getElementById("timer"); // element to show live round time
const giveUpBtn = document.getElementById("giveUpBtn"); // optional give up button
 //event listeners 
if (giveUpBtn) giveUpBtn.addEventListener("click", giveUp);



 // date part from csp book 
const dateElem = document.getElementById("date");
 function pad(n){ return n < 10 ? "0"+n : n; }
function updateClock(){
    const now = new Date();
    let dom = now.getDate();
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
    const fullDate = "Today is " + dow + ", " + month + " " + dom + ", " + year + ". The time is " + hour + ":" + mins + ":" + secs + " " + amPm;
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
    // when the user clicks play, start the timer and dispay it 

    let startTime = Date.now();
    setInterval(() => {
        let elapsedTime = Date.now() - startTime;
        let seconds = Math.floor(elapsedTime / 1000);
        timer.textContent = `Time: ${seconds}s`;
    }, 1000);
    timeArr.push(startTime);
    updateTimeLeaderboard();
    roundRunning = true;
    if (timerElem) timerElem.textContent = `Time: 0.00s`;
    if (timerInterval) clearInterval(timerInterval);
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
    if (userGuess > answer)
    {
        msg.textContent = "Too high, guess again.";
        
    }
    else if (userGuess < answer)
    {
        msg.textContent = "Too low, guess again.";
    }
    if (Math.abs(userGuess-answer) > 6)
    {
        msg.textContent += " You are cold."
    }
    else if (Math.abs(userGuess-answer) > 4)
    {
        msg.textContent += " You are warm."
    }
    else
    {
        msg.textContent += " You are hot."
    }
     if (userGuess === answer)
     {
         msg.textContent = "";
         msg.textContent = "Correct! It took " + score + " tries."; 
         {
             if (score < 3)
             {
                 msg.textContent += "Your score was excellent, " + name;
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
   if (timerElem) timerElem.textContent = "";}
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
    avgScore.textcontent = "Average Score: " + avg.toFixed(2); 

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
        if (fastestElem) fastestElem.textContent = `Fastest: ${(fastest/1000).toFixed(2)}s`;
        if (avgElem) avgElem.textContent = `Average: ${(avg/1000).toFixed(2)}s`;
    } else {
        if (fastestElem) fastestElem.textContent = "";
        if (avgElem) avgElem.textContent = "";
    }
}
function giveUp(){

   if (!roundRunning) {
        msg.textContent = "No round in progress to give up.";
        return;
    }
    // record elapsed (optional: treat give-up as completed round)
    if (startTime) roundDurations.push(Date.now() - startTime);
    if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
    roundRunning = false;
    startTime = null;
    updateTimeLeaderboard();
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
    nameOutput.textContent = "Hello " + nameInput.value[0].toUpperCase() + nameInput.value.slice(1).toLowerCase() + ", lets play a game :)";
    let temp = nameInput.value[0].toUpperCase() + nameInput.value.slice(1).toLowerCase(); 
    msg.textContent = "Select a Level, " + temp;
}