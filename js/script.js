const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let alive = document.querySelector('.alive');
let generation = document.querySelector('.generation');

let isStarted = false;

let resolution = 10;
canvas.width = 100;
canvas.height = 100;

const COLS = canvas.width / resolution;
const ROWS = canvas.height / resolution;

function buildGrid(cols, rows) {
    return new Array(cols).fill(null)
        .map(() => new Array(rows).fill(0));
}

let grid = buildGrid(COLS, ROWS);

render(grid);

let intervalId;
function start() {
    if (!isStarted) {
        isStarted = true;

        intervalId = setInterval(() => {
            grid = nextGeneration(grid);
            grid = grid.map((row, rowIndex) => {
                return row.map((cell, cellIndex) => {
                    if (cell == 1) {
                        ctx.fillStyle = 'blue';
                        ctx.fillRect(cellIndex * resolution, rowIndex * resolution, resolution, resolution);
                        ctx.beginPath();
                        ctx.rect(cellIndex * resolution, rowIndex * resolution, resolution, resolution);
                        ctx.stroke();
                    } else {
                        ctx.fillStyle = 'white';
                        ctx.fillRect(cellIndex * resolution, rowIndex * resolution, resolution, resolution);
                        ctx.beginPath();
                        ctx.rect(cellIndex * resolution, rowIndex * resolution, resolution, resolution);
                        ctx.stroke();
                    }

                    return cell
                });
            });
            render(grid);


            alive.textContent = grid.flat().reduce((acc, cur) => acc + cur, 0);
            if (alive.textContent == 0) {
                stop();
            }
            generation.textContent = Number(generation.textContent) + 1;

        }, 100);
    }
}

function stop() {
    if (isStarted) {
        isStarted = false;
        clearInterval(intervalId);
    }
}
function random() {
    grid = grid.map((row, rowIndex) => {
        return row.map((cell, cellIndex) => {
            cell = Math.random() < 0.5 ? 1 : 0;
            if (cell == 1) {
                ctx.fillStyle = 'blue';
                ctx.fillRect(cellIndex * resolution, rowIndex * resolution, resolution, resolution);
                ctx.beginPath();
                ctx.rect(cellIndex * resolution, rowIndex * resolution, resolution, resolution);
                ctx.stroke();
            } else {
                ctx.fillStyle = 'white';
                ctx.fillRect(cellIndex * resolution, rowIndex * resolution, resolution, resolution);
                ctx.beginPath();
                ctx.rect(cellIndex * resolution, rowIndex * resolution, resolution, resolution);
                ctx.stroke();
            }
            return cell
        });
    });
    render(grid);
    alive.textContent = grid.flat().reduce((acc, cur) => acc + cur, 0);
}

canvas.addEventListener('click', function (event) {
    const boundingRect = canvas.getBoundingClientRect();
    const x = event.clientX - boundingRect.left;
    const y = event.clientY - boundingRect.top;
    const col = Math.floor(x / resolution);
    const row = Math.floor(y / resolution);
    
    if (col >= 0 && col < grid.length && row >= 0 && row < grid[0].length) {
        grid[col][row] = grid[col][row] ? 0 : 1;
        if (grid[col][row] == 1) {
            ctx.fillStyle = 'blue';
        } else {
            ctx.fillStyle = 'white';
        }
        ctx.fillRect(col * resolution, row * resolution, resolution, resolution);
        ctx.beginPath();
        ctx.rect(col * resolution, row * resolution, resolution, resolution);
        ctx.stroke();
        render(grid);
    }
    alive.textContent = grid.flat().reduce((acc, cur) => acc + cur, 0);
});

function clear() {
    grid = grid.map((row, rowIndex) => {
        return row.map((cell, cellIndex) => {
            cell = 0;
            ctx.fillStyle = 'white';
            ctx.fillRect(cellIndex * resolution, rowIndex * resolution, resolution, resolution);
            ctx.beginPath();
            ctx.rect(cellIndex * resolution, rowIndex * resolution, resolution, resolution);
            ctx.stroke();

            return cell
        });
    });
    alive.textContent = 0;
    generation.textContent = 0;
    render(grid);
}

function size() {
    const newWidthSize = parseInt(document.getElementById('width').value);
    const newHeightSize = parseInt(document.getElementById('height').value);
    if(!isNaN(newWidthSize) && !isNaN(newHeightSize) && newWidthSize !== 0 && newHeightSize !== 0){
        if(newWidthSize >= 100 && newWidthSize <= 499|| newHeightSize >= 100 && newHeightSize <= 499){
            resolution = 7;
        } else if(newWidthSize >= 500 && newWidthSize <= 999 || newHeightSize >= 500 && newHeightSize <= 999){
            resolution = 5;
        } else if(newWidthSize >= 1000 || newHeightSize >= 1000){
            resolution = 3;
        } else {
            resolution = 10;
        }
        canvas.width = newWidthSize * resolution;
        canvas.height = newHeightSize * resolution; 
        grid = buildGrid(newWidthSize, newHeightSize);
        render(grid);
    }
}

function reset() {
    canvas.width = 100;
    canvas.height = 100;
    resolution = 10;
    document.getElementById('height').value = '';
    document.getElementById('width').value = '';
    grid = buildGrid(COLS, ROWS);
    render(grid);
    alive.textContent = 0;
    generation.textContent = 0;
}

function updateGrid() {
    grid = nextGeneration(grid);
    render(grid);
    requestAnimationFrame(updateGrid);
}

function nextGeneration(grid) {
    const nextGeneration = grid.map(arr => [...arr]);
    const cols = grid.length;
    const rows = grid[0].length;

    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            const cell = grid[col][row];
            let aliveNeighbors = 0;
            for (let i = -1; i < 2; i++) {
                for (let j = -1; j < 2; j++) {
                    if (i === 0 && j === 0) {
                        continue;
                    }
                    const x_cell = (col + i + cols) % cols;
                    const y_cell = (row + j + rows) % rows;

                    aliveNeighbors += grid[x_cell][y_cell];
                }
            }
            if (cell === 1 && aliveNeighbors < 2) {
                nextGeneration[col][row] = 0;
            } else if (cell === 1 && aliveNeighbors > 3) {
                nextGeneration[col][row] = 0;
            } else if (cell === 0 && aliveNeighbors === 3) {
                nextGeneration[col][row] = 1;
            }
        }
    }

    return nextGeneration;
}

function render(grid) {
    for (let col = 0; col < grid.length; col++) {
        for (let row = 0; row < grid[col].length; row++) {
            const cell = grid[col][row];
            ctx.beginPath();
            ctx.rect(col * resolution, row * resolution, resolution, resolution);
            ctx.strokeStyle = '#7f7e7e';
            ctx.stroke();
        }
    }
}
