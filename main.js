const carCount = 500;
const laneCount = 3;

const carCanvas = document.getElementById('carCanvas');
const networkCanvas = document.getElementById('networkCanvas');
const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

let fps = 0;
let frameCount = 0;
let lastFrameTime = performance.now();

carCanvas.width = 200;
networkCanvas.width = 300;

const generateCars = (carCount) => {
    return Array.from({
        length: carCount
    }, () => new Car(road.getLaneCenter(1), 100, 30, 50, 'AI'));
};

const save = () => {
    localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain));
};

const remove = () => {
    localStorage.removeItem('bestBrain');
};

const drawFps = (ctx) => {
    ctx.fillStype = 'black';
    ctx.font = 'normal 16pt Arial';
    ctx.fillText(`${fps} fps`, 15, 26);
};

const handleFps = (time) => {
    fps = Math.floor(1 / ((performance.now() - lastFrameTime) / 1000));
    lastFrameTime = time;
    frameCount++;
};

const update = (time) => {
    handleFps(time);

    if (frameCount % 250 === 0) {
        traffic.push(new Car(road.getLaneCenter(getRandomInteger(laneCount)), bestCar.y - carCanvas.height, 30, 50, 'TRAFFIC', getRandomFloat(2.5, .75)),);
        traffic.push(new Car(road.getLaneCenter(getRandomInteger(laneCount)), bestCar.y - carCanvas.height, 30, 50, 'TRAFFIC', getRandomFloat(2.5, .75)),);
    }

    traffic.forEach((car, index) => {
        car.update(road.borders, []);

        if (car.controlType === 'TRAFFIC') {
            if (bestCar.y + carCanvas.height < car.y) {
                traffic.splice(index, 1);
            }
        }
    });

    cars.forEach((car, index) => {
        car.update(road.borders, traffic);

        if (car.controlType === 'AI') {
            if (bestCar.y + carCanvas.height < car.y) {
                cars.splice(index, 1);
            }
        }
    });

    bestCar = cars.find(car => car.y === Math.min(...cars.map(c => c.y)));
};

const draw = (time) => {
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y + carCanvas.height * .7);

    road.draw(carCtx);

    traffic.forEach(car => {
        car.draw(carCtx);
    });

    carCtx.globalAlpha = .2;

    cars.forEach(car => {
        car.draw(carCtx);
    });

    carCtx.globalAlpha = 1;

    bestCar.draw(carCtx, true);

    carCtx.restore();

    networkCtx.lineDashOffset = -time / 50;

    Visualizer.drawNetwork(networkCtx, bestCar.brain);

    requestAnimationFrame(loop);

    drawFps(carCtx);
};

const loop = (time) => {
    update(time);
    draw(time);
}

const road = new Road(carCanvas.width / 2, carCanvas.width * .9, laneCount);
const cars = generateCars(carCount);
const traffic = [
    new Car(road.getLaneCenter(getRandomInteger(laneCount)), -carCanvas.width * 4, 30, 50, 'TRAFFIC', getRandomFloat(2.5, .75)),
    new Car(road.getLaneCenter(getRandomInteger(laneCount)), -carCanvas.width * 4, 30, 50, 'TRAFFIC', getRandomFloat(2.5, .75)),
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

loop();