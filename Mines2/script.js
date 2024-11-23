document.addEventListener('DOMContentLoaded', function () {
    const cellsBoard = document.querySelector('.cells-board');
    if (!cellsBoard) {
        console.error('Element .cells-board not found.');
        return;
    }

    let originalState = cellsBoard.innerHTML;

    const params = new URLSearchParams(window.location.search);
    const botName = params.get('botName') || 'Unknown';
    const language = params.get('language') || 'en';

    const trapsOptions = [1, 3, 5, 7];
    let currentPresetIndex = 0;
    const trapsAmountElement = document.getElementById('trapsAmount');
    const prevPresetBtn = document.getElementById('prev_preset_btn');
    const nextPresetBtn = document.getElementById('next_preset_btn');

    function updateTrapsAmount() {
        if (trapsAmountElement) {
            trapsAmountElement.textContent = trapsOptions[currentPresetIndex];
        }
    }

    if (prevPresetBtn) {
        prevPresetBtn.addEventListener('click', function () {
            if (currentPresetIndex > 0) {
                currentPresetIndex--;
                updateTrapsAmount();
            }
        });
    }

    if (nextPresetBtn) {
        nextPresetBtn.addEventListener('click', function () {
            if (currentPresetIndex < trapsOptions.length - 1) {
                currentPresetIndex++;
                updateTrapsAmount();
            }
        });
    }

    updateTrapsAmount();

    function attachCellClickListeners() {
        const cells = document.querySelectorAll('.cells-board .cell');
        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                cell.style.transform = 'scale(0.7)';
                setTimeout(() => {
                    cell.style.transform = 'scale(1)';
                }, 200);
            });
        });
    }

    function reloadSVG(svgElement) {
        const clone = svgElement.cloneNode(true);
        svgElement.parentNode.replaceChild(clone, svgElement);
        
        clone.style.display = 'none';
        setTimeout(() => {
            clone.style.display = '';
        }, 10);
    }

    let isFirstPlay = true;

    const playButton = document.getElementById('playButton');
    if (playButton) {
        playButton.addEventListener('click', function () {
            playButton.disabled = true;

            let cells = document.querySelectorAll('.cells-board .cell');

            if (!isFirstPlay) {
                cellsBoard.innerHTML = '';
                generateCells();
                cells = document.querySelectorAll('.cells-board .cell');
            }

            const trapsAmount = parseInt(trapsAmountElement.textContent);
            const totalCells = cells.length;
            const minePositions = new Set();

            while (minePositions.size < trapsAmount) {
                const randomPos = Math.floor(Math.random() * totalCells);
                minePositions.add(randomPos);
            }

            Promise.all([...cells].map((cell, index) => {
                return new Promise(async (resolve) => {
                    cell.classList.add('cell-fade-out');
                    cell.innerHTML = '';

                    try {
                        const response = await fetch(minePositions.has(index) ? 'img/krest.svg' : 'img/stars.svg');
                        const svgText = await response.text();
                        cell.innerHTML = svgText;
                        
                        const svgElement = cell.querySelector('svg');
                        if (svgElement) {
                            svgElement.setAttribute('width', '40');
                            svgElement.setAttribute('height', '40');
                            svgElement.style.opacity = '0';
                            svgElement.style.transform = 'scale(0)';
                            svgElement.classList.add('star-animation');
                            
                            requestAnimationFrame(() => {
                                svgElement.classList.add('fade-in');
                                reloadSVG(svgElement);
                            });
                        }
                    } catch (error) {
                        const newImg = document.createElement('img');
                        newImg.setAttribute('width', '40');
                        newImg.setAttribute('height', '40');
                        newImg.style.opacity = '0';
                        newImg.style.transform = 'scale(0)';
                        newImg.src = minePositions.has(index) ? 'img/krest.svg' : 'img/stars.svg';
                        cell.appendChild(newImg);
                        newImg.classList.add('star-animation');
                        
                        requestAnimationFrame(() => {
                            newImg.classList.add('fade-in');
                        });
                    }

                    cell.classList.remove('cell-fade-out');
                    resolve();
                });
            })).then(() => {
                playButton.disabled = false;
                if (isFirstPlay) {
                    isFirstPlay = false;
                }
            });
        });
    }

    function generateCells() {
        const cellImages = [
            'output_svgs/image_5450.svg',
            'output_svgs/image_11641.svg',
            'output_svgs/image_18337.svg',
            'output_svgs/image_24493.svg',
            'output_svgs/image_31201.svg',
            'output_svgs/image_37357.svg',
            'output_svgs/image_44065.svg',
            'output_svgs/image_50221.svg',
            'output_svgs/image_56929.svg',
            'output_svgs/image_63085.svg',
            'output_svgs/image_69793.svg',
            'output_svgs/image_75949.svg',
            'output_svgs/image_82645.svg',
            'output_svgs/image_89353.svg',
            'output_svgs/image_95509.svg',
            'output_svgs/image_102217.svg',
            'output_svgs/image_108373.svg',
            'output_svgs/image_115081.svg',
            'output_svgs/image_121237.svg',
            'output_svgs/image_127381.svg',
            'output_svgs/image_134077.svg',
            'output_svgs/image_140221.svg',
            'output_svgs/image_146917.svg',
            'output_svgs/image_153061.svg',
            'output_svgs/image_159757.svg'
        ];

        cellImages.forEach(imageSrc => {
            const cell = document.createElement('button');
            cell.type = 'button';
            cell.className = 'cell';
            cell.innerHTML = `<img width="50" height="50" src="${imageSrc}">`;
            cellsBoard.appendChild(cell);
        });

        attachCellClickListeners();
    }

    generateCells();
});
