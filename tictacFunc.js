class Tictac {
    constructor() {
        this.turn = 'x';
        this.timeData = {
            time: 0
        };
        this.dataLength = 0;
        this.score = {
            x: 0,
            o: 0
        };

        this.extraEndFunction = [];
    };
    addExtraEndFunction(func) {
        console.log(typeof func)
        if (typeof func === 'function')
            this.extraEndFunction.push(func);
        else{
        console.log(`'${func}' must be a function`)
        }
    };
    createArray(verticalBox, horizontalBox) {

        this.data = Array.from({
            length: verticalBox
        }, x=> Array.from({
                length: horizontalBox
            }, y => y))
        console.log(this.data)
        return this.data;
    };

    addData(innerIndex, outerIndex, value) {

        this.data[outerIndex][innerIndex] = value;
    };
    onInnerhtmlLoad(target, data) {
        Object.assign(this[target], data)
    };
    nextTurn() {
        if (this.turn === 'x')
            this.turn = 'o'
        else {
            this.turn = 'x';
        }
    };
    setInterval(callBack, time, parameter = []) {
        this.interval = setInterval(callBack, time, ...parameter);
    };
    clearInterval() {
        clearInterval(this.interval);
    };
    #endRound() {
        if (this.dataLength <= 0) {
            this.end();
        }
        
    }
    //default end method
    end() {


        const xPlayer = document.getElementById('player1').innerText.toString();
        const oPlayer = document.getElementById('player2').innerText.toString();
        const check = this.score.x > this.score.o ? xPlayer: oPlayer;
        const winMessage = document.getElementById('winMessage');
        console.log(this.score.x !== this.score.o);
        (this.score.x !== this.score.o
            ?
            winMessage.innerText = `${check} win`:
            winMessage.innerText = 'tie')
        this.clearInterval();
        const nodeListener = document.getElementById('gameBoxContainer');


        //  removeListener.replaceWith(removeListener.cloneNode(true))
        this.extraEndFunction.forEach(fn => {
            fn();
        })

    }
    #calculateRightBox (index, length, name = '') {
        const calculate = (index + 1 + length) - length;

        return calculate;
    };
    #calculateLeftBox(index, length) {
        const calculate = (index - 1 - length) + length;

        return calculate;
    }
    //adding one and reducing one
    #calculateMoreBox(right, left) {
        return {
            right: right + 1,
            left: left - 1
        }
    }
    checkLength (index, length) {
        const isOverflow = [{
            status: true
        },
            {
                status: true
            },
            {
                status: true
            }]
        let calcBox = {
            right: this.#calculateRightBox(index, length),
            left: this.#calculateLeftBox(index, length)
        };

        if (this.lessThan(calcBox.right, length) && this.lessThan(-1, calcBox.left)) {
            isOverflow[0].indexContainer = [calcBox.right,
                index,
                calcBox.left]
            isOverflow[0].status = false;

        }
        //change calcBox right and left
        Object.assign(calcBox, this.#calculateMoreBox(calcBox.right, calcBox.left));

        if (this.lessThan(calcBox.right, length)) {
            isOverflow[1].indexContainer = [index,
                calcBox.right - 1,
                calcBox.right]

            isOverflow[1].status = false;
        }
        if (this.lessThan(-1, calcBox.left)) {
            isOverflow[2].indexContainer = [index,
                calcBox.left + 1,
                calcBox.left]
            isOverflow[2].status = false;
        }
        // console.log(isOverflow)
        return isOverflow;
    };
    //a should be number
    lessThan(a, length) {

        return a < length;
    }
    #checkMatch(a, b, c, className) {
        const argument = [a,
            b,
            c];

        const text = {
            a: a.box.textContent.toString(),
            b: b.box.textContent.toString(),
            c: c.box.textContent.toString()
        };
        if (text.a === text.b && a.stack < 2 && text.b === text.c && b.stack < 2 && text.c === text.a && c.stack < 2) {
            argument.forEach(element => {
                element.stack += 1;
                console.log('amp,')
                console.log(element.stack)
                const hasClass = element.box.querySelector(`.${className}`);
                console.log(hasClass);
                if (!hasClass) {
                    const div = document.createElement('div');
                    div.className = className;
                    element.box.appendChild(div);
                    console.log(element.box)
                }
            })
            const xScore = document.getElementById('player1Score')
            const oScore = document.getElementById('player2Score')
            const score = this.score[this.turn] += 1;
            (this.turn === 'x' ?
                xScore.innerText = score:
                oScore.innerText = score);



        }
        this.#endRound();
    }
    //sendDiagonalparam and sendParam is send to #checkMatch
    #sendDiagonalparam(indexContainer,
        className) {

        const index = {
            one: indexContainer[0],
            two: indexContainer[1],
            three: indexContainer[2]
        };
        const data = this.data;

        this.#checkMatch(data[index.one.y][index.one.x],
            data[index.two.y][index.two.x],
            data[index.three.y][index.three.x],
            className
        );

    }
    #diagonalMirror(array,
        xLength,
        yLength) {
        //copy array

        const mirrorDirection = structuredClone(array);

        for (let i = 0; i < mirrorDirection.length; i++) {

            const index = mirrorDirection[i].indexContainer;
            let topLeft = 0;
            let bottomLeft = 0;
            if (i === 0) {
                topLeft = index[0].x += 2;
                bottomLeft = index[2].x -= 2;
            }
            if (i === 1) {
                topLeft = index[1].x -= 2;
                bottomLeft = index[2].x -= 4;
            }
            if (i === 2) {
                topLeft = index[1].x += 2;
                bottomLeft = index[2].x += 4;
            }
            const check = index.every(obj => obj.y < yLength && obj.y > -1 && topLeft < xLength && topLeft > -1 && bottomLeft > -1 && bottomLeft < xLength);
            mirrorDirection[i].status = !check;

        }

        return mirrorDirection;
    };
    checkDiagonalLength(x, y, xLength, yLength) {

        const isOverflow = [{
            status: true,
            index: 0
        },
            {
                status: true,
                index: 1
            },
            {
                status: true,
                index: 2
            }]
        //right is top and left is bottom
        const calcVertical = {
            right: this.#calculateRightBox(y, yLength),
            left: this.#calculateLeftBox(y, yLength)
        }


        const calcHorizontal = {
            right: this.#calculateRightBox(x, xLength),
            left: this.#calculateLeftBox(x, xLength)
        }
        const check = {
            verRight: ()=> this.lessThan(calcVertical.right, yLength),
            horRight: ()=> this.lessThan(calcHorizontal.right, xLength),
            verLeft: ()=> this.lessThan(-1, calcVertical.left),
            horLeft: ()=> this.lessThan(-1, calcHorizontal.left)
        };
        //this is equal to check.verLeft,check.verRight,etc

        const {
            verLeft,
            verRight,
            horLeft,
            horRight
        } = check;

        if (verRight() && horRight() && verLeft() && horLeft()) {
            isOverflow[0].status = false;
        }
        isOverflow[0].indexContainer =
        [{
            y: calcVertical.left,
            x: calcHorizontal.left
        },
            {
                x: x,
                y: y
            },
            {
                y: calcVertical.right,
                x: calcHorizontal.right
            }];

        Object.assign(calcVertical, this.#calculateMoreBox(calcVertical.right, calcVertical.left));

        Object.assign(calcHorizontal, this.#calculateMoreBox(calcHorizontal.right, calcHorizontal.left));

        if (verRight() && horRight()) {
            isOverflow[1].status = false;
        }
        isOverflow[1].indexContainer =
        [{
            x: x,
            y: y
        },
            {
                y: calcVertical.right - 1,
                x: calcHorizontal.right - 1
            },
            {
                y: calcVertical.right,
                x: calcHorizontal.right
            }]

        if (verLeft() && horLeft()) {
            isOverflow[2].status = false;
        }
        isOverflow[2].indexContainer =
        [{
            y: y,
            x: x

        },
            {
                y: calcVertical.left + 1,
                x: calcHorizontal.left +1
            },
            {
                y: calcVertical.left,
                x: calcHorizontal.left
            }]


        //topToBottom


        return {
            leftToRight: isOverflow,
            rightToLeft: this.#diagonalMirror(isOverflow, xLength, yLength)
        }
    }
    checkWin(outerIndex, innerIndex) {
        const length = {
            outer: this.data.length,
            inner: this.data[0].length
        }

        const horizontal = this.checkLength(innerIndex, length.inner)
        const vertical = this.checkLength(outerIndex, length.outer)
        const diagonal = this.checkDiagonalLength(innerIndex, outerIndex, length.inner, length.outer);

        horizontal.forEach(x => {
            if (!x.status) {
                const index = x.indexContainer;
                this.#checkMatch(this.data[outerIndex][index[0]], this.data[outerIndex][index[1]], this.data[outerIndex][index[2]], 'horizontal')
            }
        });
        vertical.forEach(x => {
            const index = x.indexContainer;
            if (!x.status) {

                this.#checkMatch(this.data[index[0]][innerIndex], this.data[index[1]][innerIndex], this.data[index[2]][innerIndex], 'vertical')

            }
        });
        console.log(diagonal)
        diagonal.leftToRight.forEach(element => {

            if (!element.status) {


                this.#sendDiagonalparam(element.indexContainer, 'diagonalLeft');
            }
        });

        diagonal.rightToLeft.forEach(element => {
            if (!element.status) {

                this.#sendDiagonalparam(element.indexContainer, 'diagonalRight');
            }
        });

    }
}export const tictac = new Tictac();