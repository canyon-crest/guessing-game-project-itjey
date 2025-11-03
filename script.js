
// time 
// temporery comment out date.textContent = time(); 
// global vriabls/constants 
 let score, answer, level; 
 const levelArr = document.getElementsByName("level"); 
 const scoreArr=[]; 
 //event listeners 

 // date part from csp book 

 var date = new Date();
 var dom = date.getDate(); 
 var dow = date.getDay(); 
 var month = date.getMonth(); 
 var year = date.getFullYear(); 
 var mins = date.getMinutes(); 
 var hour = date.getHours(); 
 var amPm = "a.m."; 
 
 switch(dow)

{
    case 0: dow = "Sunday"; break; 
    case 1: dow = "Monday"; break; 
    case 2: dow = "Tuesday"; break; 
    case 3: dow = "wednesday"; break; 
    case 4: dow = "Thursday"; break; 
    case 5: dow = "Friday"; break; 
    case 6: dow = "Saturday"; break; 

}

switch(month)
{
    case 0: month = "January"; break; 
    case 1: month = "February"; break; 
    case 2: month = "March"; break; 
    case 3: month = "April"; break; 
    case 4: month = "May"; break; 
    case 5: month = "June"; break; 
    case 6: month = "July"; break; 
    case 7: month = "August"; break; 
    case 8: month = "Septemeber"; break; 
    case 9: month = "October"; break; 
    case 10: month = "Novemenber"; break; 
    case 11: month = "December"; break; 
}

if (hour >= 12)
{
    hour -= 12; 
    amPm = "p.m."; 
}
if (hour == 0)
{
    hour = 12; 
}
if (mins < 10)
{
    mins = "0" + mins; 
}
alert("Today is " + dow + ", " + month + " " + dom + ", " + year + ". The time is " + hour + ":" + mins + " " + amPm); 



 playBtn.addEventListener("click", play);
 guessBtn.addEventListener("click", makeGuess);
 nameBtn.addEventListener("click", myName); 


function time()
{
    let d = new Date(); 
    //concatenate the date and the time 
    let str = d.getMonth()+1 + "/" + d.getDate() + "/" + d.getFullYear(); 
    // update here 
    d = str; 
    return d; 
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
        score++; 
        
    }
    else if (userGuess < answer)
    {
        msg.textContent = "Too low, guess again.";
        score++; 
    }
    else
    {
        msg.textContent = "Correct! It took " + score + " tries."; 
        reset()
        updateScore(); 
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
}
function reset()
{
    guessBtn.disabled = true; 
    guess.value = ""; 
    guess.placehodler = ""; 
    playBtn.disabled = false; 
    guess.disabled = true; 
    for (let i = 0; i < levelArr.length; i++)
    {
        levelArr[i].disabled = false; 

    }
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
    avgScore.textcontent = "Average Score: " + avg.toFixed(2); 

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
}