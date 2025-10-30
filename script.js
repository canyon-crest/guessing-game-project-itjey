
// time 
date.textContent = time(); 
// global vriabls/constants 
 let score, answer, level; 
 const levelArr = document.getElementsByName("level"); 
 const scoreArr=[]; 
 //event listeners 

 playBtn.addEventListener("click", play);
 guessBtn.addEventListener("click",makeGuess);


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
        msg.textContent = "Too high, guess again";
        score++; 
    }
    else if (userGuess < answer)
    {
        msg.textContent = "Too low, guess again";
        score++; 
    }
    else
    {
        msg.textContent = "Correct! It took " + score + " tries."; 
        reset()
        updateScore(); 
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