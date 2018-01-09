/*
 * Create a list that holds all of your cards
 */
'use strict';

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
// function shuffle(array) {
//     var currentIndex = array.length, temporaryValue, randomIndex;
//
//     while (currentIndex !== 0) {
//         randomIndex = Math.floor(Math.random() * currentIndex);
//         currentIndex -= 1;
//         temporaryValue = array[currentIndex];
//         array[currentIndex] = array[randomIndex];
//         array[randomIndex] = temporaryValue;
//     }
//
//     return array;
// }
// Shuffle function from https://discussions.youdaxue.com/t/topic/48414
// The code is referended from https://github.com/yangyunhan/memory-game
function shuffle() {
    return Math.random()>0.5 ? -1 : 1;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

 $(document).ready(function () {
     let cards = [
         'fa-diamond','fa-diamond',
         'fa-paper-plane-o','fa-paper-plane-o',
         'fa-anchor','fa-anchor',
         'fa-bolt','fa-bolt',
         'fa-cube','fa-cube',
         'fa-leaf','fa-leaf',
         'fa-bicycle','fa-bicycle',
         'fa-bomb','fa-bomb'
     ];
     cards = cards.sort(shuffle);
     let $card = $('.card');
     addDOM($card,cards);
     play($card);
     restart('.restart');
     //设置鼠标右键禁用提醒
     $("div").bind("contextmenu", function(){
        return false;
    })
     $('.card').bind("contextmenu", function(e) {
         if (3 == e.which) {
            alert("please use the left mouse button")
        } else {
            return false;
        }
     });
 });

 
//添加卡片名称
function addDOM($card,cards) {
     $card.each(function (i) {
         $(this).find('.fa').addClass(cards[i]);
     });
 }

//设置卡片显示
function displaySymbol($card,index) {
    $card[index].className += ' open show';
}

//锁定卡片
function lockCard($card,openCard) {
    let match = [];
    $.each(openCard,function (i,data) {
        $card[data].className = 'card match animated swing';
        match.push(data);
    })
    $.each($card,function (index) {
        for(var j=0;j<match.length;j++) {
            if(index == match[j]){
                let cancel = $card[index];
                $(cancel).unbind("click");
            }
        }
    })
}

//查找配对
function checkMatch(openCard,matchlength,counter,startnum,clearid,mydate,$card) {
    let second;
    let card1 = $card[openCard[0]].children[0].className;
    let card2 = $card[openCard[1]].children[0].className;
    if(card1 === card2){
        lockCard($card,openCard);
        matchlength.push(openCard[0]);
        matchlength.push(openCard[1]);
    }else {
        removeCard($card,openCard);
    }
    if(matchlength.length === 16){
        second = seconds(mydate);
        addMessage(counter,startnum,second);
        clearTimeout(clearid);
    }
}

//设置配对失败处理
function removeCard($card,openCard) {
    $.each(openCard,function (i,data) {
        $card[data].className = 'card notm animated shake';
        (function (n) {
            function f() {
                n.className = 'card';
            }
            setTimeout(f,1500);
        })($card[data])
    })
}


function displayNum(counter) {
    $('.moves').text("").append(counter);
}

//显示星级
function displayStar(counter) {
    if(counter>12 && counter<=16){
        $('.stars>li:eq(2)').remove();
    }else if(counter>16){
        $('.stars>li:eq(1)').remove();
    }
    let starnum = $(".stars>li").length;
    return starnum;
}

//处理卡片游戏
function play($card) {
    let openCard = [];//opened card, length is 2
    let matchlength = [];//all the matched card, length is increase
    let counter = 0;//counter the pace
    let startnum, clearid, mydate;
    let time = true;
    $card.bind("click",function () {
        if(time){
            let beDate = new Date();
            mydate = beDate.getTime();
            clearid=timer(0);
            time = false;
        }
        let n = $card.index(this);
        openCard.push(n);
        if (openCard[0]!=openCard[1]) {
            displaySymbol($card,n);
        }else {
            openCard.pop();
        }
        if(openCard.length === 2){
            counter += 1;
            displayNum(counter);
            startnum = displayStar(counter);
            checkMatch(openCard,matchlength,counter,startnum,clearid,mydate,$card);
            openCard.splice(0,openCard.length);
        }

    })
}

//刷新页面
function restart(classname) {
    $(classname).bind("click",function () {
        window.location.reload();
    })
}

function interval(func, wait) {
    let id;
    let interv = function () {
        func.call(null);
        id = setTimeout(interv, wait);
    };
    id = setTimeout(interv ,wait);
    return id;
}

function timer(i) {
    let id = interval(function () {
        i++;
        $('.time span').text("").append(i);
    },1000);
    return id;
}

function seconds(bsDate) {
    let date = new Date();
    let second = Math.floor((date.getTime() - bsDate)/1000);
    return second;
}

//成功页面
function addMessage(counter,startnum,second) {
    $('.container').remove();
    let html = $('<div class="result animated bounceInDown"></div>');
    let info1 = $('<p class="re-won">Congratulations!</p>');
    let info2 = $('<p class="re-moves">With&nbsp;'+counter+'&nbsp;Moves&nbsp;&nbsp;,&nbsp;&nbsp;'+second+'&nbsp;seconds&nbsp;&nbsp;and&nbsp;&nbsp;'+startnum+'&nbsp;Stars. </p>');
    let info3 = $('<p class="re-moves">Woooooo!</p>');
    let button = $('<p class="re-button">Play again!</p>');
    html.append(info1,info2,info3,button);
    $(document.body).append(html);
    restart('.re-button');
}
