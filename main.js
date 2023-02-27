const carCount = 500;
const laneCount = 3;

const carCanvas = document.getElementById('carCanvas');
const networkCanvas = document.getElementById('networkCanvas');
const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

carCanvas.width = 200;
networkCanvas.width = 300;

const generateCars = (carCount) => {
    return Array.from({
        length: carCount
    }, () => new Car(road.getLaneCenter(1), 100, 30, 50, 'AI'));
}

const save = () => {
    localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain));
}

const remove = () => {
    localStorage.removeItem('bestBrain');
}

const animate = (time) => {
    traffic.forEach(car => {
        car.update(road.borders, []);
    });

    cars.forEach(car => {
        car.update(road.borders, traffic);
    });

    bestCar = cars.find(car => car.y === Math.min(...cars.map(c => c.y)));

    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * .7);

    road.draw(carCtx);

    traffic.forEach(car => {
        car.draw(carCtx, 'red');
    });

    carCtx.globalAlpha = .2;

    cars.forEach(car => {
        car.draw(carCtx, 'blue');
    });

    carCtx.globalAlpha = 1;

    bestCar.draw(carCtx, 'green', true);

    carCtx.restore();

    networkCtx.lineDashOffset = -time / 50;

    Visualizer.drawNetwork(networkCtx, bestCar.brain);

    requestAnimationFrame(animate);
}

const road = new Road(carCanvas.width / 2, carCanvas.width * .9, laneCount);
const cars = generateCars(carCount);
const traffic = [
    new Car(road.getLaneCenter(1), -100, 30, 50, 'TRAFFIC', 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, 'TRAFFIC', 2),
    new Car(road.getLaneCenter(2), -100, 30, 50, 'TRAFFIC', 2),
    new Car(road.getLaneCenter(0), -500, 30, 50, 'TRAFFIC', 2),
    new Car(road.getLaneCenter(1), -500, 30, 50, 'TRAFFIC', 2),
    new Car(road.getLaneCenter(1), -700, 30, 50, 'TRAFFIC', 2),
    new Car(road.getLaneCenter(2), -700, 30, 50, 'TRAFFIC', 2),
];

let bestCar = cars[0];

if (localStorage.getItem('bestBrain')) {
    cars.forEach((car, i) => {
        car.brain = JSON.parse(localStorage.getItem('bestBrain'));

        if (i > 0) {
            NeuralNetwork.mutate(car.brain, .1);
        }
    });
}

animate();