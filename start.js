import createData from './data.js'
import {tictac} from './tictacFunc.js'
 function createCanvas(height,width,vertical,horizontal){
     const heightBox = vertical;
     const totalBox = horizontal;
     const styleBox = document.getElementById('gameBoxContainer');
     styleBox.style.height = `${height}px`
    styleBox.style.width = `${width}px`
    styleBox.style.gridTemplateColumns = `repeat(${totalBox},1fr)`
       tictac.dataLength = heightBox * totalBox;
       
       tictac.createArray(heightBox,totalBox)
       
        for(let q = 0; q< tictac.data.length; q++){
          for(let j =0; j< tictac.data[0].length; j++){
              let i = q;
            const box = document.createElement('div');
             const callBack = ()=>{
                 const parentIndex = i;
                 const index = j;
                 box.innerHTML = `<span id="text">${tictac.turn}</span>`;
                 
            
                 tictac.dataLength -= 1;
                 console.log(tictac.dataLength)
                 try{
                 tictac.checkWin(parentIndex,index);
                 tictac.nextTurn();
                 tictac.timeData.time = 0;
                
                 tictac.timeData.timeBox.style.background = "blue"
                 
                 box.removeEventListener('click',callBack);
                 }catch(e){
                   console.log(e.stack)
                 }
               }
               box.addEventListener('click',callBack)
               
               
               box.className = 'gameBox';
              tictac.addData(i,j,{box,j,i});
                
              styleBox.appendChild(box);
              
            //     console.table(tictac.data[i][j])
             
          }
         };
        
     }
 function start(){
   
   const {height,verticalBox,horizontalBox,width} = createData;
   tictac.setInterval(time,1000)
   createCanvas(height,width,verticalBox,horizontalBox);
 }
 function time(){
     
     const data = tictac.timeData;
     
     data.time++
     
     if(data.time <= 30){
    const percent = Math.round((data.time / 30)*100);
    const a = 100 - percent;
    const b = percent;
     data.timeBox.style.background = `linear-gradient(to right,blue ${a}%,white ${a}% ${b}%)`;
     }
     else{
      tictac.end();
     }
  }
 
export default start;
