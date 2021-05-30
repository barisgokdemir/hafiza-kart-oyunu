function randomDİzi(min, max, uzunluk) {
    let rakam = new Array();
    rand = Math.floor(Math.random() * max + min);
    rakam.push(rand);
    while (rakam.length != uzunluk) {
        rand = Math.floor(Math.random() * max + min);
        if (rakam.indexOf(rand) == -1) {
            rakam.push(rand);
        }
    }
    return rakam;
}


/*
var rand = 0;
var tahminrakam = new Array();
rand = Math.floor(Math.random() * 4 + 1);
tahminrakam.push(rand);
while (tahminrakam.length != 5) {
    rand = Math.floor(Math.random() * 5 + 1);
    if (tahminrakam.indexOf(rand) == -1) {
        tahminrakam.push(rand);
    }
}
console.log(tahminrakam);

var rand1 = 0;
var tahminrakam1 = new Array();
rand1 = Math.floor(Math.random() * 4 + 1);
tahminrakam1.push(rand1);
while (tahminrakam1.length != 5) {
    rand1 = Math.floor(Math.random() * 5 + 1);
    if (tahminrakam1.indexOf(rand1) == -1) {
        tahminrakam1.push(rand1);
    }
}
console.log(tahminrakam1);

var rand2 = 0;
var tahminrakam2 = new Array();
rand2 = Math.floor(Math.random() * 10);
tahminrakam2.push(rand2);
while (tahminrakam2.length != 10) {
    rand2 = Math.floor(Math.random() * 10);
    if (tahminrakam2.indexOf(rand2) == -1) {
        tahminrakam2.push(rand2);
    }
}
console.log(tahminrakam2);
*/


function NewGame(link) {
    window.location.href = link;
}
//terkrar başlatma fonksiyonu leveli 
function NewGame2() {
    window.location.href = "index.html";


}

function nextLevel() {
    window.location.href = "../level4x5/index.html";
}
//ekran daki kartların boyutunu degiştren fonkiyon
function imgSize(class1, class2) {
    document.querySelectorAll(".card").forEach((item) => {
        item.setAttribute("class", "card " + class1);

    });

    document.querySelectorAll(".card").forEach((item) => {

        console.log(item.getElementsByTagName("SPAN")[0].setAttribute("class", class2));

    });
    document.querySelectorAll(".card").forEach((item) => {

        console.log(item.getElementsByTagName("IMG")[0].setAttribute("class", class1));

    });


    // document.querySelector(".card").setAttribute("style", "width: 200px;");

}

//1 ile 5 arasında sayıları tutann ve bu ayıların geliş sirasi random iki dizi birşeltirerek 10 elenmanllı 
//aynı elemenlardan 2şer tane olacak şekilde birbirine ekliyor
var toplamrakam = randomDİzi(1, 5, 5).concat(randomDİzi(1, 5, 5));
//10 elemanlı 0-9 arası random sırada sayı üretiyoruz bu random siradaki sayileri da 
//yazdırırken kullanıyoruz böylelikler ekrana yazılan her sayinin konumu random şekilde oluyor 
var randwrite = randomDİzi(0, 10, 10);
console.log(randwrite);
console.log(toplamrakam);
control = -1;
// random şekilde ekrana yazdıran kısım
document.querySelectorAll(".card").forEach((item) => {
    control++;
    item.setAttribute("data-value", toplamrakam[randwrite[control]])
    item.firstChild.setAttribute("src", "../agac/agac" + toplamrakam[randwrite[control]] + ".jpg")
        //item.innerHTML = toplamrakam[randwrite[control]];

    console.log(item);

});

function playAudio(x) {
    console.log(x);
    x.play();
}

function stopAudio(x) {
    x.pause();
}
//sesi aç kapa fonksiyonu
var sesControl = 0;

function mutedAudio() {
    if (sesControl % 2 == 0) {
        loseAudio.muted = true;
        winAudio.muted = true;
        correctAudio.muted = true;
        sesControl++;
    } else {
        loseAudio.muted = false;
        winAudio.muted = false;
        correctAudio.muted = false;
        sesControl++;
    }

}





function puanShow(puan) {
    document.querySelector(".point").innerHTML = puan;
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
var startStop = true;

async function timecountdown() {


    let snformt = -1; // 0 saniyenin mod 60 da 0 ra eşit ilk if çalıştıgı için -1 verdik 
    let snformat2 = 0;
    for (let sn = 0; sn < 120; sn++) {
        if (startStop == false) {
            break;
        }
        if (sn % 60 == 0) {
            snformt++;
            snformat2 = 0;
        } else {
            snformat2++;
        }
        await sleep(1000);
        document.querySelector(".time").innerHTML = snformt + ":" + snformat2;

    }
    // süre bittiginde çalışacak yer
    if (trueCount != 5 && guessCount != 0) {
        gameOver(loseAudio, textLoseTime);

        console.log("başaramadın");
    };





}




timecountdown();


function gameOver(audio, state) {

    // oyun bittiginde state gözükmesin
    startStop = false;

    document.querySelectorAll(".card").forEach((item) => {

        // item.setAttribute("style", "visibility:hidden");
        item.setAttribute("style", "display:none");

    });
    document.querySelector(".Result").setAttribute("style", "display:block;");
    document.querySelector(".Rstate").innerHTML = state;
    document.querySelector(".Rskor").innerHTML = Skor;
    document.querySelector(".Rtime").innerHTML = document.querySelector(".time").innerHTML;
    document.querySelector(".state").setAttribute("style", "visibility:hidden");

    playAudio(audio);
    console.log("başaramadın");



}

var winAudio = document.getElementById("WinMp3");
var loseAudio = document.getElementById("LoseMp3");
var correctAudio = document.getElementById("correctMp3");

var textWin = "KAZANDINIZ";
var textLoseTime = "KAYBETTİNİZ </br> Zaman Doldu";
var textLoseCount = "KAYBETİNİZ </br> TAHMİN HAKKINIZ KALMADİ";

var sayac = 0;
var temp = 0;
var tempElement;
var tempelementsayac = 0;
var controlclik = 0;
var trueCount = 0;
var derece = 0;
var Skor = 0;
var currentElement;
var guessCount = 10;
// ekranda tıklanılan kutucugun degerini bulma aynı sayılar ise dogru kart uyarısını verme 
document.querySelector(".game").addEventListener('click', async(e) => {


    if (e.target.dataset.row != "row") { // row satırına tıklanma kontrolu

        if (tempElement != e.target && e.target.firstChild != null) {
            //aynı elemente iki kez basma kontrolu 
            controlclik++;

            //iki tane nesne tıklandıktan sonra 3. bir tıklama önceki işlem bitmeden olmasın  kontrolu
            if (controlclik < 3) {
                // içerdeki sayi olan spana tıklanmış tıklanmamış kontorlu ve e.target currentElement atması
                console.log(controlclik);
                if (e.target.nodeName == "SPAN") {

                    currentElement = e.target.parentElement;

                } else {
                    currentElement = e.target;
                }
                console.log(currentElement)


                sayac++;
                console.log(e.target.nodeName);
                // son evlat span tıklanıgına gizlenir 

                console.log(currentElement.childNodes);
                console.log(currentElement.children[1]);




                currentElement.firstChild.setAttribute("style", "visibility:visible;");
                currentElement.children[1].setAttribute("style", "visibility:hidden;");


                currentElement.setAttribute("style", "transform: rotateY(" + (720 + derece) + "deg);"); // tıklanan elemente animasyon ekliyor  

                console.log(e.target.firstChild);





                if (sayac % 2 == 0) {
                    if (temp == currentElement.dataset.value) {
                        console.log("ogru kartı buldunuz");
                        await sleep(1000);
                        // puan degişkenini artır
                        Skor = Skor + 10;



                        puanShow(Skor);


                        //resim gizlenir
                        currentElement.firstChild.setAttribute("style", "visibility: hidden;");
                        tempElement.firstChild.setAttribute("style", "visibility: hidden;");
                        //card elemnti ortadan kalkar
                        currentElement.setAttribute("style", "background-color:rgba(201, 25, 25, 0.5);visibility: hidden;");
                        tempElement.setAttribute("style", "background-color:rgba(201, 25, 25, 0.5);visibility: hidden;");
                        controlclik = 0;
                        trueCount++;
                        if (trueCount == 5) {

                            await sleep(1000);
                            //kazanma sesi
                            gameOver(winAudio, textWin);

                            startStop = false;







                        }
                        //dogru buldun sesi
                        playAudio(correctAudio);

                    } else {
                        console.log("yanlış tahmın");
                        guessCount--;


                        document.querySelector(".guessCount").innerHTML = guessCount;


                        console.log("bura çalıştı transforum");

                        //stopAudio(loseAudio);

                        playAudio(loseAudio);

                        await sleep(1000);



                        currentElement.firstChild.setAttribute("style", "background-color: dark;");
                        tempElement.firstChild.setAttribute("style", "background-color: dark;");
                        //
                        currentElement.setAttribute("style", "");
                        tempElement.setAttribute("style", "");
                        //sayıları tekrar görünür yapma
                        currentElement.children[1].setAttribute("style", "visibility:visible;");
                        tempElement.children[1].setAttribute("style", "visibility:visible;");
                        //
                        derece = 0;

                        controlclik = 0;

                    }


                }
                temp = currentElement.dataset.value;

                tempElement = currentElement;

                console.log(e.target.dataset.value);
                console.log(sayac);
                console.log(temp + "temp" + e.target.dataset.card);

                // tahmin hakkı bittiginde son yanlışta tahmin hakkı 0 oldugu için son yanlışta oyunu bitir 
                if (guessCount == 0) {
                    gameOver(loseAudio, textLoseCount);
                }

                tempelementsayac++; //en son tıklanana tekrar tıklayabilmek için kontrol sayacı




            }
            //en son tıklanana tekrar tıklayabilmek için kontrol sayacı kontrolu


            if (tempelementsayac == 2) {

                tempElement = null;
                tempelementsayac = 0;
            }

        }
    }
});