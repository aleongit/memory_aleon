'use strict';
//Aleix Leon

//8 parelles
const emojis = ['&#128557;','&#128525;','&#129322;','&#129324;',
                '&#128534;','&#128541;','&#129321;','&#128517;'];

const blancs = ['&#9898;','&#9898;','&#9898;','&#9898;',
'&#9898;','&#9898;','&#9898;','&#9898;'];

const gameover = [' ', ' ', ' ', ' ',
                  'G', 'A', 'M', 'E',
                  'O', 'V', 'E', 'R',
                  ' ', ' ', ' ', ' '];

const youwin = [' ', ' ', ' ', ' ',
                 'Y', 'O', 'U', ' ',
                 'W', 'I', 'N', '&#127881;',
                 ' ', ' ', ' ', ' '];

const ids = ['c00','c01','c02','c03',
       'c10','c11','c12','c13',
       'c20','c21','c22','c23',
       'c30','c31','c32','c33',];

// [id, contingut (per img o text), estat]
/*let joc = [
            ['00', '&#128557;','destapada'],
            ['01', '&#128557;','tapada'],
            ['02', '&#128525;','tapada'],
            ['03', '&#128525;','tapada'],
        ]*/

const TEMPS_JOC = 60;
const TEMPS_DES = 2;

let conta = 0;
let timeout;
let interval;

let joc = [];
let caselles;

//random id
const tria_id = (arra) => {
    let id = arra[Math.floor(Math.random()*arra.length)];
    //console.log(id);   
return id;
}

//treu id
const treu_id = (id,arra) => {
    let pos = arra.indexOf(id);
    arra.splice(pos,1);
    //console.log(pos);
    //console.log(arra);
}

const neteja_taula = () => {

    //treu contingut
    let ps = document.querySelectorAll('td div p');
    //console.log(ps);
    ps.forEach( p => p.remove());
    //console.log(ps);

    //treu ok i ko de td
    let tds = document.querySelectorAll('td');
    //console.log(tds);
    tds.forEach( td => td.className = 'ok');
    //console.log(tds);
}

const neteja_joc = () => {

    //netejar timeouts i intervals
    clearInterval(interval);
    clearTimeout(timeout);
    conta = 0;

    //neteja taula
    neteja_taula();

    //buida arra joc
    joc = [];

    //timer pàgina
    document.getElementById('timer_joc').style.visibility = 'hidden';
    document.getElementById('timer_joc').innerHTML = "00:00";

    //no deixar clicar a taula
    document.querySelector('#taula').className = 'ko';
}

//crear array joc
const crea_missatge_taula = (arra,estat) => {

    //copia per si (emojis o text) = tipus de joc
    let items = arra.slice();

    //copia ids
    let ids_copia = ids.slice();
    //console.log(ids_copia);

    //per cada id posa item correlatiu
    
    let i = 0;
    ids_copia.forEach( id => {
    
        let joc_id = [];
        joc_id.push(id, items[i],estat);
        joc.push(joc_id);
        i ++;
    })
    //console.log(joc);

    //ordena per id
    //joc.sort();
    //console.log(joc);
}

//crear array joc
const crea_joc = (arra,estat) => {

    //copia per si (emojis o text) = tipus de joc
    let items = arra.slice();

    //copia ids
    let ids_copia = ids.slice();
    //console.log(ids_copia);

    items.forEach( item => {
        //per cada item tria 2 ids
        for (let i=0; i< 2; i++) {
            let joc_id = [];
            //joc_id.push(id,'&#128557;','tapada');
        
            let id = tria_id(ids_copia);
            joc_id.push(id, item,estat);
            joc.push(joc_id);

            //un cop assignada id, treu de llista ids
            treu_id(id,ids_copia);
        }
    })
    //console.log(joc);

    //ordena per id
    joc.sort();
    //console.log(joc);
}

const joc_taula = () => {

    //COL·LOCAR JOC A TAULA HTML
    //per cada element array joc
    joc.forEach( el => {
        
    //obtenir id div dins td
    let div = document.getElementById(el[0]);
    //console.log(div);
        
    //creo element 'p' amb contingut dins 'div'
    let abc = document.createElement('p');
    abc.innerHTML = el[1];
    div.appendChild(abc);

    //inicialitzar estat casella
    div.className = el[2];
    })

}

//temps a false en 60 segons
const temps_partida = segon => {
    let timeout = setTimeout(function(){
        //console.log("Timeout ON");
        perduda(); // fi partida
        },segon * 1000);

    return timeout;
}

//cada segon, incrementa comptador
const conta_partida = () => {
    let interval = setInterval(function(){
        
        //console.log("Interval ON");
        conta ++;
        document.querySelector('#timer_joc').innerHTML = "00:" + (TEMPS_JOC - conta);

        },1000);

    return interval;
}

//caselles class 'ok' per click
const update_caselles = () => {
    let oks = document.querySelectorAll("#taula td[class ='ok']");
    return oks;
    }

//mirar marcades
const mira_marcades = () => document.querySelectorAll("#taula td[class*='marcada']");

//tapa casella, previ timeout
const tapa_casella = (marcades) => {
    //tornem a tapar (div) *per visibility = hidden
    //deixem td com a 'ok' en joc i desmarquem
    marcades.forEach( marcada => {
        marcada.querySelector('div').className = 'tapada';
        marcada.className = 'ok';
    })
    //torna deixar clicar taula
    document.querySelector('#taula').className = '';

    //neteja timer torn
    document.querySelector('#timer_torn').innerHTML = "";
}

//mira destapades ko
const mira_destapades = () => document.querySelectorAll("#taula td[class*='ko']");

//completada
const completada = () => {

    let totals = joc.length / 2;
    let n_des = mira_destapades().length / 2;

    //missatge estat completades
    document.querySelector('#missatge').innerHTML = n_des + ' / ' + totals;

    return totals == n_des;
}

//xuleta
const xuleta = () => {

    let pistes = document.querySelectorAll('#taula td div p');
    let xul = "";
    for (let i = 0; i < pistes.length; i ++) {
        if ( i % 4 == 0) { xul += '\n'};
        xul += pistes[i].innerHTML;
        
    }
   console.log(xul);
}

//entrem a event clicks
const juga_caselles = (casella) => {
    
    //console.log(casella);

    //xuleta console.log
    xuleta();

    //marca casella
    casella.className += ' marcada';
    
    //obté id dins td
    let div = casella.querySelector('div');
    //console.log(div.id);
    
    //destapa id
    div.className ='destapada';

    //mira marcades
    //console.log(mira_marcades().length);
    let marcades = mira_marcades();

    //si 2 marcades
    if (marcades.length == 2) {         
        
        //no deixar clicar a taula
        document.querySelector('#taula').className = 'ko';

        //iguals ?
        //console.log('comprovar si iguals');
        //console.log(marcades);

        //array 2 marcades, agafem 'p' de 'div' de 'td' per índex i comparem
        let c1 = marcades[0].querySelector('div').querySelector('p').innerHTML;
        let c2 = marcades[1].querySelector('div').querySelector('p').innerHTML;
        //console.log(c1 == c2);

        //si continguts iguals, match
        if (c1 == c2) {
            //deixem com a destapades (div) *per visibility = visible
            //marquem td com a 'ko'
            marcades.forEach( marcada => marcada.className = 'ko' );
            completada();
            //torna deixar clicar taula
            document.querySelector('#taula').className = '';

            //si últim match, partida completada i guanyada
            //console.log(completada());
            if(completada()) {guanyada();}

            }
        //si no iguals
        else {
            //console.log('pause ?');
            //printar segons - no cal
            //time out per tapar casella
            setTimeout(function () { tapa_casella(marcades); }, TEMPS_DES * 1000);
        }
    }
}

//estat inicial
const inicial = () => {

    //neteja
    neteja_joc();

    //crea joc random
    crea_joc(blancs,'destapada');

    //passa joc a taula html
    joc_taula();

     //missatge
     document.querySelector('#missatge').innerHTML = 'HOLA :)';

}

//partida perduda
const perduda = () => {

    //neteja
    neteja_joc();

    //crea joc no random
    crea_missatge_taula(gameover,'destapada');

    //passa joc a taula html
    joc_taula();

     //missatge
     document.querySelector('#missatge').innerHTML = 'GAME OVER :(';

}

//partida guanyada
const guanyada = () => {

    //neteja
    neteja_joc();

    //crea joc no random
    crea_missatge_taula(youwin,'destapada');

    //passa joc a taula html
    joc_taula();

     //missatge
     document.querySelector('#missatge').innerHTML = 'YOU WIN :)';

}

const confirma = () => {
    //si partida començada
    //console.log(conta);
    if (conta > 0) {
        //confirma
        let ok = confirm("Tornem a començar ?");
        if (ok) {
            //txt = "You pressed OK!";
            jugar();
        } else {
            //txt = "You pressed Cancel!";
        }
    }
    else { jugar() };
}


//inici programa ------------------------------------------
const jugar = () => {

    //neteja
    neteja_joc();

    //crea joc random
    crea_joc(emojis,'tapada');
   
    //passa joc a taula html
    joc_taula();

    //paràmetres joc
    document.querySelector('#missatge').innerHTML = 'GO GO GO!';
    document.getElementById('timer_joc').style.visibility = 'visible';
    document.querySelector('#taula').className = '';
    conta = 0; //per timer joc

    //inici temps time out
    //setTimeout(function () { fi_partida(); }, 60000);
    timeout = temps_partida(TEMPS_JOC);
    interval = conta_partida();
    
    //agafem caselles
    caselles = update_caselles();
    //console.log(caselles);
   
    //per cada casella tapada, event click
        caselles.forEach(casella => {
            //console.log(casella);
            casella.addEventListener('click', function() { juga_caselles(casella); } );
            //console.log("HE SORTIT DEL EVENT CLICK");
            });
        //console.log("HE SORTIT DEL FOREACH DE EVENTS CLICKS");
        }

    //inicial càrrega pàgina
    window.addEventListener('load',function () {
        inicial();
    });

