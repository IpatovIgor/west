import Card from './Card.js';
import Game from './Game.js';
import Creature from './Card.js';
import TaskQueue from './TaskQueue.js';
import SpeedRate from './SpeedRate.js';

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

class Duck extends Creature {
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

class Dog extends Creature {
    constructor(name = "Пес-бандит", level = 3, image = 'bandit.png') {
        super(name, level, image);
    }
}

class Trasher extends Dog {
    constructor(name = "Громила", level = 5, image = 'bandit.png') {
        super(name, level, image);
    }

    modifyTakenDamage(value, fromCard, gameContext, continuation) {
        this.view.signalAbility(() => {continuation(value-1)});
    }

    getDescriptions() {
        let result = super.getDescriptions();
        result.push('урон уменьшается на 1')
        return result;
    }
}

// Замена карт в колодах
const seriffStartDeck = [
    new Duck(),
    new Duck(),
    new Duck(),
    new Duck(),
];
const banditStartDeck = [
    new Trasher(),
];

// Создание игры.
const game = new Game(seriffStartDeck, banditStartDeck);

// Глобальный объект, позволяющий управлять скоростью всех анимаций.
SpeedRate.set(1);

// Запуск игры.
game.play(false, (winner) => {
    alert('Победил ' + winner.name);
});
