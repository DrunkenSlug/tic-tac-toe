import {
    tictac
} from './tictacFunc.js'

import createData from './data.js';
import start from './start.js'

const player = {
    player1: document.getElementById('player1'),
    player2: document.getElementById('player2')
}
const body = document.getElementById('body')
const box = document.getElementById('box');
const styleBox = document.getElementById('styleBox');
const styleHeigh = document.getElementById('styleHeigh');
const submit = document.getElementById('submit');
styleBox.addEventListener('input', ()=> {
    const value = ~~styleBox.value;
    
    console.log(value)
    box.style.width = `${value * 10}%`;
})
styleHeigh.addEventListener('input', ()=> {
    const value = ~~styleHeigh.value;
    
    
    box.style.height = `${value/3}rem`
    console.log(box.style.height)
})
submit.addEventListener('click', ()=> {
    console.log(createData)
    createData.height = box.clientHeight;
    createData.width = box.clientWidth;
    createData.verticalBox = Math.floor(styleHeigh.value/10);
    createData.horizontalBox = styleBox.value;
    
    player.player1.value ||= 'player1';
    player.player2.value ||= 'player2'
    const createElement =
    `<span id='player1'>${player.player1.value}</span> :
    <span id="player1Score"> </span>
    <br>
    <span id='player2'>${player.player2.value} </span> :
    <span id="player2Score"></span>
    <div id='turn' style='padding-top:5%;margin-bottom:5%;'>turn : x </div>
    <span class="timeBox block margin" id="time"> </span>
    <div class="container margin">
    <div id="gameBoxContainer"> </div>
    </div>
    <div id="winMessage">
    </div>
    `


    body.innerHTML = createElement
    tictac.onInnerhtmlLoad('timeData', {
        timeBox: document.querySelector('.timeBox')})
    try {
        start();
    }catch(e) {
        console.log(e.stack)
    }
})