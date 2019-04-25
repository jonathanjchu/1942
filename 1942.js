const heroSpeed = 10;
const bulletSpeed = 10;
const lowerBound = 530;
const rightBound = 700;
const loopTimer = 100;
const startLives = 3;

var hero = {
    x: 300,
    y: 500,
    isAlive: true,
    heroExplosionStep: 0,
    lives: startLives
};

var enemies = [];
var bullets = [];
var explosions = [];
var enemyBullets = [];

var score = 0;
var enemySpeed = 3;
var maxEnemies = 4;
var maxBullets = 12;
var level = 1;

function resetAll() {
    console.log("Resetting Game");

    document.getElementById("gameover").style.display = "none";
    hero = {
        x: 300,
        y: 500,
        isAlive: true,
        heroExplosionStep: 0,
        lives: startLives
    };

    enemies = [];
    bullets = [];
    explosions = [];
    enemyBullets = [];

    score = 0;
    enemySpeed = 3;
    maxEnemies = 4;
    maxBullets = 12;
    level = 1;

    document.getElementById("hero_explosion").style.display = "none";
    document.getElementById("hero").style.display = "block";
}

function gameOver() {
    document.getElementById("gameover").style.display = "block";
}

function displayHero() {
    if (hero.isAlive) {
        document.getElementById("hero").style["top"] = hero.y + "px";
        document.getElementById("hero").style["left"] = hero.x + "px";
    }
    else {


        if (hero.heroExplosionStep < 4) {
            var output = "<div class='hero_explosion" + hero.heroExplosionStep +
                "' style='top:" + hero.y +
                "px; left:" + hero.x + "px;'></div>"

            document.getElementById("hero_explosion").innerHTML = output;

            hero.heroExplosionStep++;
        }
        else {
            if (hero.lives < 0) {
                // game over
                gameOver();
            }
            else {
                document.getElementById("hero_explosion").style["display"] = "none";
                respawnHero();
            }
        }
    }
}

function displayEnemies() {
    var output = "";

    for (var i = 0; i < enemies.length; i++) {
        output += "<div class='enemy" + enemies[i].type + "' style='top:" + enemies[i].y +
            "px; left:" + enemies[i].x + "px;'></div>";
    }

    document.getElementById("enemies").innerHTML = output;
}

function displayBullets() {
    var output = "";

    for (var i = 0; i < bullets.length; i++) {
        output += "<div class='bullet' style='top:" + bullets[i].y +
            "px; left:" + bullets[i].x + "px;'></div>";
    }

    for (var j = 0; j < enemyBullets.length; j++) {
        output += "<div class='bullet' style='top:" + enemyBullets[j].y +
            "px; left:" + enemyBullets[j].x + "px;'></div>";
    }

    document.getElementById("bullets").innerHTML = output;
}

function displayScore() {
    document.getElementById("score").innerHTML = score;
}

function displayExplosions() {
    var output = "";

    for (var i = 0; i < explosions.length; i++) {
        output += "<div class='explosion" + explosions[i].step +
            "' style='top:" + explosions[i].y +
            "px; left:" + explosions[i].x + "px;'></div>";

        explosions[i].step++;
    }

    document.getElementById("explosions").innerHTML = output;
}

function displayLives() {
    if (hero.lives >= 0) {
        // document.getElementById("lives").innerHTML = hero.lives;
    }

    var output = "";
    for (var i=0; i<hero.lives; i++) {
        output += "<div class='lives'></div>";
    }

    document.getElementById("life_counter").innerHTML = output;
}

function moveEnemies() {
    console.log("Enemy count: " + enemies.length);

    for (var i = 0; i < enemies.length; i++) {
        enemies[i].y += enemySpeed;

        if (enemies[i].y > lowerBound) {
            enemies.splice(i, 1);
            i--;
        }
    }
}

function moveBullets() {
    for (var i = 0; i < bullets.length; i++) {
        bullets[i].y -= bulletSpeed;
    }

    for (var j = 0; j < enemyBullets.length; j++) {
        enemyBullets[j].y += (enemySpeed + (bulletSpeed / 2));
    }
}

function respawnHero() {
    hero.x = 300;
    hero.y = 500;
    hero.isAlive = true;
    hero.heroExplosionStep = 0;
    document.getElementById("hero").style["top"] = hero.y + "px";
    document.getElementById("hero").style["left"] = hero.x + "px";
    document.getElementById("hero").style["display"] = "block";
}

function spawnEnemies() {
    // if number of enemies is less than max, then 30% chance of spawning another enemy
    //  to spread out the spawn rate
    var spawnChance = Math.random() * 10;
    if (enemies.length < maxEnemies
        && spawnChance < 3) {
        addNewEnemy();
    }
}

function addNewEnemy() {
    var ranType = Math.floor(Math.random() * 2);
    //var ranType = 0;

    enemies.push({
        x: Math.random() * rightBound,
        y: 0,
        type: ranType
    });
}

function addExplosion(x, y) {
    // console.log("adding explosion at " + x + ", " + y);
    explosions.push({
        x: x,
        y: y,
        step: 0
    });
    // console.log(explosions);
}

function addBullet() {
    if (bullets.length < maxBullets) {
        bullets.push({
            x: hero.x + 8,
            y: hero.y - 10
        });
    }
}

function addEnemyBullets() {
    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].y < lowerBound / 2) {
            // only allow enemy to shoot if it's in the upper half

            var rnd = Math.random() * 100;

            if (rnd > 99) {
                enemyBullets.push({
                    x: enemies[i].x + 8,
                    y: enemies[i].y + 10
                });
            }
        }
    }
}

function cleanUpBullets() {
    for (var i = 0; i < bullets.length; i++) {
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }

    for (var j = 0; j < enemyBullets.length; j++) {
        if (enemyBullets[j].y > lowerBound) {
            enemyBullets.splice(j, 1);
            j--;
        }
    }
}

function cleanUpExplosions() {
    for (var i = 0; i < explosions.length; i++) {
        if (explosions[i].step >= 4) {
            explosions.splice(i, 1);
            i--;
        }
    }
}

function detectCollision() {
    for (var i = 0; i < enemies.length; i++) {
        if (isHeroHit(enemies[i].x, enemies[i].y)) {
            console.log("hero and enemy " + i + " collided");
            // hero death
            heroDeath();
            deductScore();
            enemyDeath(i);
            //displayHero();
            break;
        }

        for (var j = 0; j < bullets.length; j++) {
            if (isEnemyShot(enemies[i], bullets[j])) {
                // enemy is shot
                console.log("bullet " + j + " & enemy " + i + " collided");

                enemyDeath(i);
                incrementScore();
                increaseDifficulty();

                bullets.splice(j, 1);
                break;
            }
        }

    }
}

function isEnemyShot(e, b) {
    return (Math.abs(b.x - e.x) < 20 && Math.abs(b.y - e.y) < 15);
}

function isHeroHit(x, y) {
    if ((Math.abs(hero.x - x) < 20 && Math.abs(hero.y - y) < 15)) {
        console.log("Hero x, y:" + hero.x + ", " + hero.y);
        console.log("Tango x, y: " + x + ", " + y);
        return true;
    }
    return false;
}

function isHeroShot() {
    if (!hero.isAlive)
        return;

    for (var i = 0; i < enemyBullets.length; i++) {
        if (isHeroHit(enemyBullets[i].x, enemyBullets[i].y)) {
            heroDeath();
            enemyBullets.splice(i, 1);
            i--;
        }
    }
}

function incrementScore() {
    score += 10;
}

function deductScore() {
    if (score > 500) {
        score -= 500;
    }
    else {
        score = 0;
    }
}

function increaseDifficulty() {
    // increase difficulty
    // if (score > 100 && maxEnemies < 7) {
    //     maxEnemies = 7;
    //     level++;
    // }
    // else if (score > 250 && maxEnemies < 10) {
    //     maxEnemies = 10;
    //     level++;
    // }
    // else if (score > 600 && maxEnemies < 15) {
    //     maxEnemies = 15;
    //     enemySpeed = 5;
    //     level++;
    // }
    // // else if (score > 1000 && maxEnemies < 20) {
    // //     maxEnemies = 20;
    // //     enemySpeed = 6;
    // //     level++;
    // // }
    // else
    if (score > level * 200) {
        level++;
        maxEnemies = level * 4 - 1;
        enemySpeed = level + 2;
        console.log("level: " + level);
        console.log("max enemies: " + maxEnemies);
        console.log("enemy speed: " + enemySpeed);
    }
}

function enemyDeath(idx) {
    addExplosion(enemies[idx].x, enemies[idx].y);
    enemies.splice(idx, 1);

    var audio = new Audio("explosion.wav");
    audio.play();
}

function heroDeath() {
    document.getElementById("hero").style["display"] = "none";
    document.getElementById("hero_explosion").style["display"] = "block";

    hero.isAlive = false;
    hero.lives--;

    var audio = new Audio("explosion.wav");
    audio.play();
}

function gameLoop() {
    spawnEnemies();
    addEnemyBullets();

    moveEnemies();
    moveBullets();

    detectCollision();
    isHeroShot();

    displayHero();
    displayEnemies();
    displayBullets();
    displayScore();
    displayExplosions();
    displayLives();

    cleanUpBullets();
}

document.onkeydown = function (e) {
    if (!hero.isAlive)
        return;

    if (e.keyCode == 37
        && hero.x > 0) {            // left
        hero.x -= heroSpeed;
    }
    else if (e.keyCode == 39
        && hero.x < rightBound) {   // right
        hero.x += heroSpeed;
    }
    else if (e.keyCode == 40
        && hero.y < lowerBound) {   // down
        hero.y += heroSpeed;
    }
    else if (e.keyCode == 38 &&
        hero.y > lowerBound / 2) {               // up
        hero.y -= heroSpeed;
    }
    else if (e.keyCode == 32) { // spacebar
        addBullet();
        displayBullets();
    }

    displayHero();
}

gameLoop();

setInterval(gameLoop, loopTimer);

