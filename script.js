/*  SELECTION DU DOM */
const cartes = document.querySelectorAll(".carte"); 
const scoreDisplay = document.querySelector(".score"); 
const niveauDisplay = document.querySelector(".niveau"); 
const bouton = document.querySelector("button"); 

/* VARIABLES */
let carte1 = null; 
let carte2 = null; 
let bloquer = false;
let score = 0;
let niveau = 1;
let pairesTrouvees = 0; 

/* CHRONO */
let temps = 0;/* Variable pour suivre le temps écoulé */
let interval; 

/* 3. INITIALISATION */
demarrerJeu();

function demarrerJeu() { 
    melangerCartes();
    demarrerChrono();
}

/* GESTION DU CHRONO */
function demarrerChrono() {
    interval = setInterval(() => { /* Incrémente le temps et met à jour l'affichage du score */
        temps++;
        scoreDisplay.textContent = "Temps: " + temps + "s"; 
        /* LIMITE DE TEMPS (60s) */
        if (temps >= 60) {

            clearInterval(interval);

            alert("Temps écoulé ⏱️ Partie réinitialisée");

            relancerJeu();
        }
    }, 1000); /* Mise à jour toutes les secondes */
}

/* MELANGE DES CARTES */
function melangerCartes() { /* Mélange les cartes en les regroupant, les mélangeant, puis les redistribuant dans les sections */
    const sections = document.querySelectorAll(".cartes1, .cartes2, .cartes3");

    let toutesLesCartes = [];

    sections.forEach(section => {
        toutesLesCartes.push(...section.querySelectorAll(".carte"));/* Récupère toutes les cartes de chaque section et les ajoute à un tableau global */
    });

    /* Mélange aléatoire */
    toutesLesCartes.sort(() => Math.random() - 0.5); 

    let index = 0;

    sections.forEach(section => {
        section.innerHTML = ""; /* Vide la section avant de redistribuer les cartes mélangées */

        for (let i = 0; i < 4; i++) {
            section.appendChild(toutesLesCartes[index]);/* Redistribue les cartes mélangées dans les sections */
            index++;
        }
    });
}

/* GESTION DU CLICK SUR LES CARTES */
cartes.forEach(carte => {
    carte.addEventListener("click", () => { /* Gère le clic sur une carte et vérifie les conditions pour l'activer */

        if (bloquer) return;
        if (carte === carte1) return;
        if (carte.classList.contains("trouve")) return;

        carte.classList.add("active");

        if (!carte1) {
            carte1 = carte;
        } else {
            carte2 = carte;
            bloquer = true;
            verifierPaire();
        }
    });
});

/* VERIFICATION DES PAIRES */
function verifierPaire() { /* Compare les images des deux cartes sélectionnées */

    let img1 = carte1.querySelector("img").src; 
    let img2 = carte2.querySelector("img").src; 

    if (img1 === img2) { 
        /* Bonne paire */
        carte1.classList.add("trouve"); 
        carte2.classList.add("trouve");

        pairesTrouvees++;

        resetSelection();

        verifierFin();
    } else {
        // Mauvaise paire
        carte1.classList.add("shak");
        carte2.classList.add("shak");

        setTimeout(() => { /* Retire les classes "active" et "shak" après l'animation de secousse */
            carte1.classList.remove("active", "shak");
            carte2.classList.remove("active", "shak");

            resetSelection();
        }, 800);
    }
}

/* RESET SELECTION */
function resetSelection() { /* Réinitialise les cartes sélectionnées et débloque le jeu */
    carte1 = null;
    carte2 = null;
    bloquer = false;
}

/* FIN DE PARTIE */
function verifierFin() { // Vérifie si toutes les paires ont été trouvées */

    if (pairesTrouvees === cartes.length / 2) {

        clearInterval(interval);

        setTimeout(() => {
            alert("Bravo ! Niveau terminé 🎉");

            niveau++;
            niveauDisplay.textContent = "Niveau: " + niveau;

            relancerJeu();

        }, 500);
    }
}

/* RELANCER PARTIE */
function relancerJeu() {

    cartes.forEach(carte => { /* Parcourt toutes les cartes et les réinitialise */
        carte.classList.remove("active", "trouve"); /* Réinitialise l'état de chaque carte */
    });

    pairesTrouvees = 0; 
    temps = 0;

    melangerCartes();
    demarrerChrono();
}

/* BOUTON RECOMMENCER */
bouton.addEventListener("click", () => { /* Arrête le chrono et relance le jeu */
    clearInterval(interval);
    location.reload();
});