import Card from './Card.js';
import Game from './Game.js';
import TaskQueue from './TaskQueue.js';
import SpeedRate from './SpeedRate.js';
import Creature from './Card.js';

// Отвечает является ли карта уткой.
function isDuck(card) {
    return card && card.quacks && card.swims;
}

// Отвечает является ли карта собакой.
function isDog(card) {
    return card instanceof Dog;
}

// Дает описание существа по схожести с утками и собаками
export function getCreatureDescription(card) {
    if (isDuck(card) && isDog(card)) {
        return 'Утка-Собака';
    }
    if (isDuck(card)) {
        return 'Утка';
    }
    if (isDog(card)) {
        return 'Собака';
    }
    return 'Существо';
}

class Duck extends Card {
    constructor(name = "Мирная утка", level = 2, image = 'bandit.png') {
        super(name, level, image);
    }

    quacks() {
        console.log("Кря! Мирная утка крякает");
    }

    swims() {
        console.log("Плывет как утка");
    }
}

class Dog extends Card {
    constructor(name = "Пес-бандит", level = 3, image = 'bandit.png') {
        super(name, level, image);
    }
}

class Lad extends Dog {
    constructor(name = "Браток", level = 2, image = 'bandit.png') {
        super(name, level, image);
    }

    static getInGameCount() {
        return this.inGameCount || 0;
    }

    static setInGameCount(value) {
        this.inGameCount = value;
    }

    static getBonus() {
        const count = this.getInGameCount();
        return count * (count + 1) / 2;
    }

    doAfterComingIntoPlay(gameContext, continuation) {
        Lad.setInGameCount(Lad.getInGameCount() + 1);
        continuation();
    }

    doBeforeRemoving(continuation) {
        Lad.setInGameCount(Lad.getInGameCount() - 1);
        continuation();
    }

    modifyDealedDamageToCreature(value, toCard, gameContext, continuation) {
        const bonus = Lad.getBonus();
        continuation(value + bonus);
    }

    modifyTakenDamage(value, fromCard, gameContext, continuation) {
        const bonus = Lad.getBonus();
        continuation(value - bonus);
    }

    getDescriptions() {
        let descriptions = super.getDescriptions();

        if (Lad.prototype.hasOwnProperty('modifyDealedDamageToCreature') ||
            Lad.prototype.hasOwnProperty('modifyTakenDamage')) {
            descriptions.push('Чем их больше, тем они сильнее');
        }

        return descriptions;
    }
}

class Gatling extends Creature {
    constructor(name = "Гатлинг", level = 6, image = 'bandit.png') {
        super(name, level, image);
    }

    attack(gameContext, continuation) {
        const taskQueue = new TaskQueue();
        const oppositePlayer = gameContext.oppositePlayer;

        taskQueue.push(onDone => this.view.showAttack(onDone));

        const cards = oppositePlayer.table.filter(card => card !== null && card !== undefined);

        cards.forEach(card => {
            taskQueue.push(onDone => {
                this.dealDamageToCreature(2, card, gameContext, onDone);
            });
        });

        taskQueue.continueWith(continuation);
    }
}

// Замена карт в колодах
const seriffStartDeck= [
    new Lad(),
    new Lad(),
];

const banditStartDeck = [
    new Duck(),
    new Duck(),
    new Duck(),
];


/*const seriffStartDeck = [
    new Gatling(),
    new Duck(),
    new Duck(),
    new Duck(),
];

const banditStartDeck = [
    new Trasher(),
    new Dog(),
    new Dog(),
];*/


// Создание игры.
const game = new Game(seriffStartDeck, banditStartDeck);

// Глобальный объект, позволяющий управлять скоростью всех анимаций.
SpeedRate.set(1);

// Запуск игры.
game.play(false, (winner) => {
    alert('Победил ' + winner.name);
});


