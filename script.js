const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
ctx.canvas.width  = window.innerWidth; // pour que le canvas fasse la taille de la fenetre
ctx.canvas.height = window.innerHeight;
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let holeDiameter = 200;
let inHoleDiameter = 0;
let shrinkSpeed = 1;
let centerX = canvas.width / 2;
let centerY = canvas.height / 2;
let particlesArray = [];
let opacity = 0.01;
let turn = 1;
let explosion = 0;

canvas.addEventListener('click', function(event){
    window.location.reload(false);
});


function falseRandom(){
    unif = Math.random();
    beta = Math.sin(unif*Math.PI/2) * Math.sin(unif*Math.PI/2);
    return beta;
}


class Particle {
    constructor(){
        this.x = falseRandom() * 2 * inHoleDiameter +  (centerX - inHoleDiameter); // changement de repère
        if (Math.random() > 0.5) {
            this.y = centerY - Math.sqrt(inHoleDiameter * inHoleDiameter - (this.x - centerX) * (this.x - centerX)); // 2 solutions à l'equation
        } else {
            this.y = centerY + Math.sqrt(inHoleDiameter * inHoleDiameter - (this.x - centerX) * (this.x - centerX));
        }
        
        const fixedX = this.x;
        const fixedY = this.y;

        this.speedX = (fixedX - centerX) * (1 / holeDiameter) * 0.5;
        this.speedY = (fixedY - centerY) * (1 / holeDiameter) * 0.5; //vitesse des particules trop petit quand hole petit donc * 1/holeD
        this.size = 1;
        this.color = 'white';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    draw(){
        //ctx.fillStyle = 'rgba(255,255,255,'+ opacity +')'; // effet clignotant
        ctx.fillStyle = 'white';
        ctx.beginPath(); // commence à dessiner
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function createParticle(){
        for (i = 0; i < 1; i++){
            inHoleDiameter = holeDiameter * 0.95;
            particlesArray.push(new Particle);
        }
}


function handleParticles(){ // fonction qui va actualiser la position de la particule et la dessiner
    for (let i = 0; i < particlesArray.length; i++){
        particlesArray[i].update();
        particlesArray[i].draw();
    }
}

function drawCircle(){ // fonction qui dessine les bords du trou noir
    if (holeDiameter > 1){
        ctx.strokeStyle = "rgba(255, 255, 255, 0.08)" //on change en blanc ou noir à souhait
        ctx.fillStyle = 'black'
        ctx.lineWidth = 1;
        ctx.beginPath(); // commence à dessiner
        ctx.arc(centerX, centerY, holeDiameter, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    } else {
        return 0;
    }
}

function drawBlackCircle(){ // on efface la trainée du trou noir quand on choisit des bords blanc
    if (holeDiameter > 1){
        ctx.strokeStyle = 'black'
        //ctx.fillStyle = 'black'
        ctx.lineWidth = 1;
        ctx.beginPath(); // commence à dessiner
        ctx.arc(centerX, centerY, holeDiameter + 1, 0, Math.PI * 2);
        //ctx.fill();
        ctx.stroke();
    } else {
        return 0;
    }
}

function animation(){
    ctx.fillStyle = "rgba(255, 255, 255, 1)"; // Texte
    ctx.font="30px Optima";
    ctx.fillText("Black Hole Evaporation (v2)", 50,50);
    ctx.font="20px Optima";
    ctx.fillText("> Click to reset", 50,80);

    ctx.fillStyle = 'rgba(0,0,0,0.07)'; // on crée ici un rectangle semi transparant 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawCircle();
    handleParticles();

    if (holeDiameter > 0.1){
        holeDiameter -= 0.01 * shrinkSpeed;
        shrinkSpeed += 0.02;
    } else {
        holeDiameter = 0.0001;
        if (explosion < 10 && Math.random() > 0.9){
            explosion++;
            for (let i = 0; i < 200; i++) { // explosion de particule à la fin
                createParticle();
            }
        }

    }
    
    opacity = Math.sin(Math.PI/32 * turn); // sinus pour effet clignotant
    turn++;
    if (Math.random() > 0.8 && holeDiameter > 1){ // on réduit le nombre de particule créée
        createParticle();
    }
    

    requestAnimationFrame(animation);
}

animation();