class SchoolHorrorGame {
    constructor() {
        // Define local storage keys first
        const unlockedChaptersKey = 'schoolHorrorGame_unlockedChapters';

        // Load unlocked chapters first
        const unlockedChapters = this.loadUnlockedChapters(unlockedChaptersKey);

        // Game state
        this.gameState = {
            // Local storage key for storing unlocked chapters
            unlockedChaptersKey: unlockedChaptersKey,
            playerName: '',
            playerGender: '',
            currentScene: 'start',
            currentChapter: '',
            gameTime: '21:00',
            plotProgress: 0,
            inventory: [],
            hasKey: false,
            hasSeenGhost: false,
            // Unlocked chapters
            unlockedChapters: unlockedChapters
        };

        // Removed code that always unlocked custom chapters, now custom chapters remain locked

        // Time update timer
        this.timeUpdateInterval = null;
        // Typewriter effect timer
        this.typingInterval = null;
        this.mainMenuTypingInterval = null;

        // DOM elements
        this.elements = {
            startScreen: document.getElementById('start-screen'),
            chapterSelectScreen: document.getElementById('chapter-select-screen'),
            gameScreen: document.getElementById('game-screen'),
            deathScreen: document.getElementById('death-screen'),
            resultScreen: document.getElementById('result-screen'),
            playerNameInput: document.getElementById('player-name'),
            maleOption: document.getElementById('male-option'),
            femaleOption: document.getElementById('female-option'),
            startButton: document.getElementById('start-game'),
            restartButton: document.getElementById('restart-game'),
            nextChapterBtn: document.getElementById('next-chapter-btn'),
            backToChapterSelectBtn: document.getElementById('back-to-chapter-select'),
            currentTimeDisplay: document.getElementById('current-time'),
            playerNameDisplay: document.getElementById('player-name-display'),
            playerGenderDisplay: document.getElementById('player-gender-display'),
            gameMap: document.getElementById('game-map'),
            gameActions: document.getElementById('game-actions'),
            dialogueText: document.getElementById('dialogue-text'),
            dialogueChoices: document.getElementById('dialogue-choices'),
            deathMessage: document.getElementById('death-message'),
            resultChapter: document.getElementById('result-chapter'),
            resultTime: document.getElementById('result-time'),
            backToMainBtn: document.getElementById('back-to-main')
        };

        // Sound effect elements
        this.horrorDing = document.getElementById('horror-ding');
        this.horrorUp = document.getElementById('horror-up');

        // Bind result screen button events
        this.elements.nextChapterBtn.addEventListener('click', () => this.goToNextChapter());
        this.elements.backToChapterSelectBtn.addEventListener('click', () => this.returnToChapterSelect());
        // Bind return to main menu button event
        this.elements.backToMainBtn.addEventListener('click', () => this.backToMainScreen());

        // Bind event listeners
        this.bindEvents();
    }

    // Bind event listeners
    bindEvents() {
        // Name input event
        this.elements.playerNameInput.addEventListener('input', () => {
            this.gameState.playerName = this.elements.playerNameInput.value.trim();
            this.checkStartConditions();
        });

        // Gender selection events
        this.elements.maleOption.addEventListener('click', () => {
            this.gameState.playerGender = 'male';
            this.elements.maleOption.classList.add('selected');
            this.elements.femaleOption.classList.remove('selected');
            this.clearSpecialGenderSelection();
            this.checkStartConditions();
        });

        this.elements.femaleOption.addEventListener('click', () => {
            this.gameState.playerGender = 'female';
            this.elements.femaleOption.classList.add('selected');
            this.elements.maleOption.classList.remove('selected');
            this.clearSpecialGenderSelection();
            this.checkStartConditions();
        });

        // More gender button events
        const moreGenderBtn = document.getElementById('more-gender');
        const genderPopup = document.getElementById('gender-popup');
        const closeGenderPopup = document.getElementById('close-gender-popup');

        if (moreGenderBtn && genderPopup) {
            moreGenderBtn.addEventListener('click', () => {
                genderPopup.classList.remove('hidden');
            });

            closeGenderPopup.addEventListener('click', () => {
                genderPopup.classList.add('hidden');
            });

            // Close popup when clicking outside
            genderPopup.addEventListener('click', (e) => {
                if (e.target === genderPopup) {
                    genderPopup.classList.add('hidden');
                }
            });

            // Special gender selection events
            document.querySelectorAll('.special-gender-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.gameState.playerGender = btn.dataset.gender;
                    this.elements.maleOption.classList.remove('selected');
                    this.elements.femaleOption.classList.remove('selected');
                    this.markSpecialGenderSelection(btn.dataset.gender);
                    genderPopup.classList.add('hidden');
                    this.checkStartConditions();
                });
            });
        }

        // Start game button
        this.elements.startButton.addEventListener('click', () => {
            this.elements.startScreen.classList.add('hidden');
            this.elements.chapterSelectScreen.classList.remove('hidden');
            // Update chapter availability status
            this.updateChapterAvailability();
        });

        // Restart button
        this.elements.restartButton.addEventListener('click', () => this.restartGame());

        // Chapter selection events
        document.querySelectorAll('.chapter-item').forEach(item => {
            item.addEventListener('click', () => {
                const chapter = item.dataset.chapter;
                if (chapter === 'custom') {
                    // Custom chapter specific prompt
                    this.showMainMenuDialog('This feature is still in beta testing and temporarily unavailable', [
                        { text: 'OK', action: () => { } },
                        { text: 'Understand', action: () => this.showCustomChapterInfo() }
                    ]);
                } else if (item.classList.contains('available')) {
                    this.startGame(chapter);
                } else {
                    this.showMainMenuDialog('You have not unlocked this level yet', [
                        { text: 'OK', action: () => { } }
                    ]);
                }
            });
        });
    }

    // Check start game conditions
    checkStartConditions() {
        if (this.gameState.playerName && this.gameState.playerGender) {
            this.elements.startButton.disabled = false;
        } else {
            this.elements.startButton.disabled = true;
        }
    }

    // Clear special gender selection status
    clearSpecialGenderSelection() {
        document.querySelectorAll('.special-gender-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
    }

    // Mark special gender selection
    markSpecialGenderSelection(gender) {
        document.querySelectorAll('.special-gender-btn').forEach(btn => {
            if (btn.dataset.gender === gender) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
    }

    // Start game
    startGame(chapter, startTime = null) {
        // Set current chapter
        this.gameState.currentChapter = chapter;

        // Update player info display
        this.elements.playerNameDisplay.textContent = this.gameState.playerName;
        let genderDisplay = '';
        switch (this.gameState.playerGender) {
            case 'male':
                genderDisplay = 'Male';
                break;
            case 'female':
                genderDisplay = 'Female';
                break;
            case '沃尔玛购物袋':
                genderDisplay = 'Walmart Shopping Bag';
                break;
            case '武装直升机':
                genderDisplay = 'Attack Helicopter';
                break;
            default:
                genderDisplay = this.gameState.playerGender;
        }
        this.elements.playerGenderDisplay.textContent = genderDisplay;

        // If start time is provided, update game time
        if (startTime) {
            this.updateGameTime(startTime);
        } else {
            // Otherwise reset to default time
            this.updateGameTime('21:00');
        }

        // Switch screens
        this.elements.chapterSelectScreen.classList.add('hidden');
        this.elements.gameScreen.classList.remove('hidden');

        // Start automatic time updates
        this.startAutoTimeUpdate();

        // Update inventory display
        this.updateInventoryDisplay();

        // Initialize first scene based on chapter
        if (chapter === 'prologue') {
            // Prologue default adds phone to inventory
            if (this.gameState && this.gameState.inventory && !this.gameState.inventory.includes('Phone')) {
                this.gameState.inventory.push('Phone');
                // Update inventory display
                this.updateInventoryDisplay();
            }
            this.loadScene('classroom');
        } else if (chapter === 'chapter1') {
            // Load Chapter1 starting scene
            if (window.Chapter1) {
                this.chapter1 = new Chapter1(this);
                this.chapter1.start();
            } else {
                this.showDialogue('Unable to load Chapter 1 content, please ensure Chapter1.js is correctly loaded.', [
                    { text: 'Return to Chapter Select', action: () => this.returnToChapterSelect() }
                ]);
            }
        } else if (chapter === 'chapter2') {
            // Load Chapter2 starting scene
            if (window.Chapter2) {
                this.chapter2 = new Chapter2(this);
                this.chapter2.start();
            } else {
                this.showDialogue('Unable to load Chapter 2 content, please ensure Chapter2.js is correctly loaded.', [
                    { text: 'Return to Chapter Select', action: () => this.returnToChapterSelect() }
                ]);
            }
        } else if (chapter === 'chapter3') {
            // Load Chapter3 starting scene
            if (window.Chapter3) {
                this.chapter3 = new Chapter3(this);
                this.chapter3.start();
            } else {
                this.showDialogue('Unable to load Chapter 3 content, please ensure Chapter3.js is correctly loaded.', [
                    { text: 'Return to Chapter Select', action: () => this.returnToChapterSelect() }
                ]);
            }
        } else if (chapter === 'chapter4') {
            // Load Chapter4 starting scene
            if (window.Chapter4) {
                this.chapter4 = new Chapter4(this);
                this.chapter4.start();
            } else {
                this.showDialogue('Unable to load Chapter 4 content, please ensure Chapter4.js is correctly loaded.', [
                    { text: 'Return to Chapter Select', action: () => this.returnToChapterSelect() }
                ]);
            }

        } else if (chapter === 'custom') {
            // Load custom chapter
            if (window.CustomChapter) {
                this.customChapter = new CustomChapter(this);
                this.customChapter.start();
            } else {
                this.showDialogue('Unable to load custom chapter content, please ensure CustomChapter.js is correctly loaded.', [
                    { text: 'Return to Chapter Select', action: () => this.returnToChapterSelect() }
                ]);
            }
        }
    }

    // Unlock chapter
    unlockChapter(chapter) {
        if (!this.gameState.unlockedChapters.includes(chapter)) {
            this.gameState.unlockedChapters.push(chapter);
            // Save to local storage
            this.saveUnlockedChapters();
            // Update chapter selection interface
            this.updateChapterAvailability();
            console.log('Unlocked chapter:', chapter);
            console.log('Current unlocked chapters list:', this.gameState.unlockedChapters);
        }
    }

    // Update chapter availability
    updateChapterAvailability() {
        document.querySelectorAll('.chapter-item').forEach(item => {
            const chapter = item.dataset.chapter;
            if (this.gameState.unlockedChapters.includes(chapter)) {
                item.classList.remove('locked');
                item.classList.add('available');
                const lockIcon = item.querySelector('.lock-icon');
                const chapterDesc = item.querySelector('p'); // Select <p> tag as description element
                if (lockIcon) {
                    lockIcon.remove(); // Completely remove lock icon
                }
                if (chapterDesc) {
                    if (chapter === 'chapter1') {
                        chapterDesc.textContent = 'Explore the school\'s mysterious events, uncover hidden secrets. Find the rusty key, face the ghost in the mirror, reveal the truth behind the campus.';
                    } else if (chapter === 'chapter2') {
                        chapterDesc.textContent = 'Meet the first friend, discover more about the school\'s secrets. Explore the dormitory area, solve the ghost mystery.';
                    } else if (chapter === 'chapter3') {
                        chapterDesc.textContent = 'Uncover the school\'s ultimate secret, face the truth. Delve into the underground laboratory, stop the dark ritual.';
                    } else if (chapter === 'chapter4') {
                        chapterDesc.textContent = 'After escaping the school, the curse still follows you. Search for a way to lift the curse, face the shadows of the past.';

                    }
                }
            }
        });
    }

    // Load scene
    loadScene(sceneName) {
        this.clearDialogue();

        switch (sceneName) {
            case 'classroom':
                this.showClassroomScene();
                break;
            case 'corridor':
                this.showCorridorScene();
                break;
            case 'library':
                this.showLibraryScene();
                break;
            case 'bathroom':
                this.showBathroomScene();
                break;
            case 'principalOffice':
                this.showPrincipalOfficeScene();
                break;
            default:
                this.showClassroomScene();
        }
    }

    // Show classroom scene
    showClassroomScene() {
        this.gameState.currentScene = 'classroom';
        this.updateGameMap('classroom');

        if (this.gameState.plotProgress === 0) {
            this.showDialogue(`The evening self-study bell rang long ago, ${this.gameState.playerName}, why are you still in the classroom?`, [
                { text: 'Pack bag and go home', action: () => this.leaveClassroom() },
                { text: 'Review a bit longer', action: () => this.stayInClassroom() }
            ]);
        } else {
            this.showDialogue('The classroom is empty, only your desk remains in place.', [
                { text: 'Leave classroom', action: () => this.goToCorridor() }
            ]);
        }
    }

    // Show corridor scene
    showCorridorScene() {
        this.gameState.currentScene = 'corridor';
        this.updateGameMap('corridor');

        this.showDialogue('The corridor lights flicker on and off, you hear footsteps behind you...', [
            { text: 'Turn around to check', action: () => this.checkFootsteps() },
            { text: 'Continue forward', action: () => this.continueCorridor() }
        ]);
    }

    // Show library scene
    showLibraryScene() {
        this.gameState.currentScene = 'library';
        this.updateGameMap('library');

        this.showDialogue('The library is filled with the musty smell of old books, the books on the shelves seem to be shaking slightly.', [
            { text: 'Check bookshelf', action: () => this.checkBookshelf() },
            { text: 'Leave library', action: () => this.goToCorridor() }
        ]);
    }

    // Show bathroom scene
    showBathroomScene() {
        this.gameState.currentScene = 'bathroom';
        this.updateGameMap('bathroom');

        this.showDialogue('The bathroom mirror has the words "HELP" written in red liquid.', [
            { text: 'Approach mirror', action: () => this.approachMirror() },
            { text: 'Flee bathroom', action: () => this.goToCorridor() }
        ]);
    }

    // Show principal office scene
    showPrincipalOfficeScene() {
        this.gameState.currentScene = 'principalOffice';
        this.updateGameMap('principalOffice');

        if (this.gameState.hasKey) {
            this.showDialogue('You used the key to open the principal\'s office door, it\'s pitch black inside.', [
                { text: 'Turn on light', action: () => this.turnOnLight() },
                { text: 'Search in darkness', action: () => this.searchInDark() }
            ]);
        } else {
            this.showDialogue('The principal\'s office door is locked, you need to find the key to enter.', [
                { text: 'Return to corridor', action: () => this.goToCorridor() }
            ]);
        }
    }

    // Update game map display
    updateGameMap(location) {
        const locations = {
            classroom: '🏫 Your Classroom',
            corridor: '🚪 School Corridor',
            library: '📚 Library',
            bathroom: '🚻 Bathroom',
            principalOffice: '🔑 Principal\'s Office',
            staircase: '🔺 Staircase',
            artRoom: '🎨 Art Room',
            basement: '🔻 Basement',
            deepCorridor: '🚶‍♂️ Dim Corridor',
            exit: '🚪 Side Exit',
            undergroundPassage: '🔦 Underground Passage',
            ironDoorArea: '🔐 Iron Door Area',
            slimeExit: '💧 Slime Exit',
            stoneDoorChamber: '🏛️ Stone Door Chamber',
            redPlayground: '🔴 Red Playground',
            undergroundAbyss: '🕳️ Underground Abyss',
            hiddenCatacombs: '⚰️ Hidden Catacombs',
            innerSanctum: '🔮 Inner Sanctum',
            flowerField: '🌺 Flower Field Space',
            upperFloor: '🔼 Upper Floor',
            upperFloorCorridor: '🔄 Upstairs Corridor',
            principalsOffice: '👨‍💼 Principal\'s Office',
            creatureLair: '🐉 Creature Lair',
            lotusDimension: '🪷 Lotus Dimension',
            entrance: '🚪 School Entrance',
            quadrangle: '🏫 Campus Square',
            dormitory: '🏠 Dormitory Area',
            canteen: '🍽️ Cafeteria',
            storageRoom: '🔒 Storage Room',
            schoolGate: '🚪 School Gate',
            foyer: '🏫 School Building Lobby',
            abandonedWing: '🏚️ Abandoned School Building',
            labyrinth: '🌀 Underground Maze',
            altarRoom: '🩸 Altar Room'
        };

        this.elements.gameMap.innerHTML = `<div class="location-name">${locations[location] || 'Unknown Location'}</div>
<div class="pixel-map">${this.generatePixelMap(location)}</div>`;

        // Update inventory display
        this.updateInventoryDisplay();
    }

    // Update inventory display
    updateInventoryDisplay() {
        const inventoryElement = document.getElementById('inventory-items');
        if (!inventoryElement) return;

        inventoryElement.innerHTML = '';

        if (this.gameState.inventory.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'inventory-empty';
            emptyMessage.textContent = 'Inventory is empty';
            inventoryElement.appendChild(emptyMessage);
            return;
        }

        // Item description mapping
        const itemDescriptions = {
            'Phone': 'Your smartphone, fully charged, can be used for lighting and checking time.',
            'Silver Glowing Key': 'A silver glowing key, engraved with "Principal\'s Office".',
            'Notebook': 'An old notebook, recording student diaries and some strange symbols.',
            'Flashlight': 'A tool that can illuminate in the dark, battery level unknown.',
            'Herb': 'A mysterious herb emitting a faint fragrance, may have special effects.',
            'Water Fear Note': 'A note found in the classroom, it reads: "It dislikes noise, water can temporarily drive it away".',
            'Mirror Reflection Note': 'A yellowed note found in the principal\'s office drawer, it reads: "Don\'t trust the reflection in the mirror".',
            'Basement Map': 'A hand-drawn map, detailing the school\'s underground structure and safe paths to the basement.',
            'Rusty Key': 'A rusty iron key obtained in Chapter 1, can be used to dispel ghosts and open hidden doors.',
            'Library Key': 'An ordinary key engraved with "Library".',
            'Mysterious Key': 'A bronze key engraved with mysterious symbols, seems related to school history.',
            'Diary Fragment': 'A fragment of student diary, recording abnormal events on October 13th.',
            'Hammer': 'A rusty iron hammer, handle wrapped with rags, still shows signs of use.',
            'Restricted Area Map': 'A yellowed map marking mysterious areas, with mysterious annotations.',
            'Badge': 'Silver school badge, edge engraved with same symbols as the key.',
            'Mineral Water': 'Unopened mineral water, bottle has convenience store label.',
            'Gauze': 'Medical sterile gauze, packaging slightly damaged.',
            'Note': 'A note paper with mysterious information.',
            'Ritual Dagger': 'A dagger used for rituals, blade glinting coldly.',
            'Ancient Scroll': 'An ancient scroll recording school history, text somewhat faded.',
            'Water Artifact': 'Blue gemstone containing water power, engraved with mysterious symbols.',
            'Life Artifact': 'Green gemstone containing life power, engraved with mysterious symbols.',
            'Fire Artifact': 'Red gemstone containing fire power, engraved with mysterious symbols.',
        };

        this.gameState.inventory.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'inventory-item';
            itemElement.title = itemDescriptions[item] || 'Unknown item';

            // Choose different icons for different items
            let icon = '🎒'; // Default backpack icon
            if (item === 'Phone') icon = '📱';
            else if (item === 'Rusty Key' || item === 'Silver Glowing Key' || item === 'Library Key' || item === 'Mysterious Key') icon = '🔑';
            else if (item === 'Notebook') icon = '📓';
            else if (item === 'Flashlight') icon = '🔦';
            else if (item === 'Herb') icon = '🌿';
            else if (item === 'Water Fear Note' || item === 'Mirror Reflection Note' || item === 'Diary Fragment' || item === 'Note' || item === 'Ancient Scroll') icon = '📜';
            else if (item === 'Basement Map' || item === 'Restricted Area Map') icon = '🗺️';
            else if (item === 'Hammer') icon = '🔨';
            else if (item === 'Badge') icon = '🛡️';
            else if (item === 'Mineral Water') icon = '💧';
            else if (item === 'Gauze') icon = '🩹';
            else if (item === 'Ritual Dagger') icon = '🗡️';
            else if (item === 'Water Artifact') icon = '💎🔵';
            else if (item === 'Life Artifact') icon = '💎🟢';
            else if (item === 'Fire Artifact') icon = '💎🔴';
            else if (item === 'Dark Artifact') icon = '⚫💎';
            else if (item === 'Engraved Ring') icon = '💍';

            itemElement.innerHTML = `
                <div class="inventory-item-icon">${icon}</div>
                <div class="inventory-item-name">${item}</div>
            `;

            inventoryElement.appendChild(itemElement);
        });
    }

    // Use item
    useItem(item) {
        // Add item usage logic here
        // For example, if it's a phone, show phone content
        if (item === 'Phone') {
            // Check if current chapter has phone-related functions
            if (this.gameState.currentChapter === 'chapter3' && window.Chapter3 && this.chapter3) {
                this.chapter3.checkPhone();
            } else {
                this.showDialogue('You checked your phone but didn\'t receive any new messages.', [
                    { text: 'Continue', action: () => this.clearDialogue() }
                ]);
            }
        } else {
            this.showDialogue(`You used ${item}, but nothing happened.`, [
                { text: 'Continue', action: () => this.clearDialogue() }
            ]);
        }
    }

    // Generate pixel style map
    generatePixelMap(location) {
        // Add pixel maps for Chapter 3 scenes
        if (location === 'schoolGate') {
            return `■■■■■■■■■■
■   ■■■   ■
■  ■   ■  ■
■   ■■■   ■
■■■■■■■■■■`;
        } else if (location === 'foyer') {
            return `■■■■■■■■■■
■  ■     ■ ■
■  ■  ■  ■ ■
■  ■     ■ ■
■■■■■■■■■■`;
        } else if (location === 'abandonedWing') {
            return `■■■■■■■■■■
■ ▒▒▒ ▒▒▒ ■
■         ■
■ ▒▒▒ ▒▒▒ ■
■■■■■■■■■■`;
        } else if (location === 'labyrinth') {
            return `■■■■■■■■■■
■ ■ ■ ■ ■ ■
■■■■■■■■■■
■ ■ ■ ■ ■ ■
■■■■■■■■■■`;
        } else if (location === 'altarRoom') {
            return `■■■■■■■■■■
■         ■
■   ■■■   ■
■  ■   ■  ■
■■■■■■■■■■`;
        }

        switch (location) {
            case 'classroom':
                return '■■■■■■■■■■\n■         ■\n■   T     ■\n■         ■\n■   C     ■\n■         ■\n■■■■■■■■■■';
            case 'corridor':
                return '■■■■■■■■■■■■■■\n■               ■\n■   D   D   D   ■\n■               ■\n■■■■■■■■■■■■■■';
            case 'library':
                return '■■■■■■■■■■\n■BBBBBBBBB■\n■B       B■\n■BBBBBBBBB■\n■B       B■\n■BBBBBBBBB■\n■■■■■■■■■■';
            case 'bathroom':
                return '■■■■■■\n■   S   ■\n■       ■\n■   M   ■\n■■■■■■';
            case 'principalOffice':
                return '■■■■■■■■\n■   D    ■\n■        ■\n■   F    ■\n■■■■■■■■';
            case 'staircase':
                return '■■■■■\n■  ▲  ■\n■  ▲  ■\n■  ▲  ■\n■  ▼  ■\n■  ▼  ■\n■  ▼  ■\n■■■■■';
            case 'artRoom':
                return '■■■■■■■■■■\n■ P     P ■\n■         ■\n■   E     ■\n■         ■\n■ P     P ■\n■■■■■■■■■■';
            case 'basement':
                return '■■■■■■■■■■\n■   D     ■\n■         ■\n■   S     ■\n■         ■\n■   C     ■\n■■■■■■■■■■';
            case 'deepCorridor':
                return '■■■■■■■■■■■■■■■■\n■                 ■\n■                 ■\n■                 ■\n■                 ■\n■   D             ■\n■■■■■■■■■■■■■■■■';
            case 'exit':
                return '■■■■■■■■■\n■   O     ■\n■         ■\n■■■■■■■■■';
            case 'undergroundPassage':
                return '■■■■■■■■■■■\n■           ■\n■   ▒▒▒▒▒   ■\n■   ▒   ▒   ■\n■   ▒▒▒▒▒   ■\n■           ■\n■■■■■■■■■■■';
            case 'ironDoorArea':
                return '■■■■■■■■■■\n■   █     ■\n■         ■\n■   ▒     ■\n■         ■\n■   █     ■\n■■■■■■■■■■';
            case 'slimeExit':
                return '■■■■■■■■■\n■   ~     ■\n■  ~~     ■\n■   ~     ■\n■■■■■■■■■';
            case 'stoneDoorChamber':
                return '■■■■■■■■■\n■         ■\n■   ▒▒▒   ■\n■   ▒@▒   ■\n■   ▒▒▒   ■\n■         ■\n■■■■■■■■■';
            case 'redPlayground':
                return '■■■■■■■■■■■■■■\n■               ■\n■   ▲           ■\n■               ■\n■■■■■■■■■■■■■■';
            case 'undergroundAbyss':
                return '■■■■■■■■■■\n■           ■\n■           ■\n■   ▓▓▓     ■\n■           ■\n■           ■\n■■■■■■■■■■';
            case 'hiddenCatacombs':
                return '■■■■■■■■■\n■ ☠ ☠ ☠ ■\n■         ■\n■ ☠ ☠ ☠ ■\n■         ■\n■ ☠ ☠ ☠ ■\n■■■■■■■■■';
            case 'innerSanctum':
                return '■■■■■■■■■\n■   ▒     ■\n■  ▒▒▒    ■\n■   ▒     ■\n■  ▒@▒    ■\n■   ▒     ■\n■■■■■■■■■';
            case 'flowerField':
                return '■■■■■■■■■\n■ ⚘ ⚘ ⚘ ■\n■ ⚘ ⚘ ⚘ ■\n■ ⚘ ⚘ ⚘ ■\n■ ⚘ ⚘ ⚘ ■\n■ ⚘ ⚘ ⚘ ■\n■■■■■■■■■';
            case 'upperFloor':
                return '■■■■■■■■■■■■■■\n■               ■\n■   ▒   ▒   ▒   ■\n■               ■\n■■■■■■■■■■■■■■';
            case 'upperFloorCorridor':
                return '■■■■■■■■■■■■■■\n■ ▓ ▓ ▓ ▓ ▓ ▓ ■\n■               ■\n■ ▓ ▓ ▓ ▓ ▓ ▓ ■\n■■■■■■■■■■■■■■';
            case 'principalsOffice':
                return '■■■■■■■■\n■   D    ■\n■  ▓▓▓   ■\n■   F    ■\n■■■■■■■■';
            case 'creatureLair':
                return '■■■■■■■■■\n■         ■\n■   ▓     ■\n■  ▓▓▓    ■\n■   ▓     ■\n■         ■\n■■■■■■■■■';
            case 'lotusDimension':
                return '■■■■■■■■■\n■   ⚘     ■\n■  ⚘⚘⚘    ■\n■   ⚘     ■\n■  ⚘⚘⚘    ■\n■   ⚘     ■\n■■■■■■■■■';
            case 'entrance':
                return '■■■■■■■■■■\n■          ■\n■  ■■■_■■■ ■\n■          ■\n■■■■■■■■■■';
            case 'quadrangle':
                return '■■■■■■■■■■■■■■\n■                ■\n■  ■■■■■■■■■■■■ ■\n■                ■\n■■■■■■■■■■■■■■';
            case 'dormitory':
                return '■■■■■■■■■■\n■ ■■ ■■ ■■ ■\n■ ■■ ■■ ■■ ■\n■ ■■ ■■ ■■ ■\n■■■■■■■■■■';
            case 'canteen':
                return '■■■■■■■■■■\n■ ■■■■■■■■ ■\n■ ■■■■■■■■ ■\n■ ■■■■■■■■ ■\n■■■■■■■■■■';
            case 'storageRoom':
                return '■■■■■■■■■■\n■ ■■■■■■■■ ■\n■ ■■■■■■■■ ■\n■ ■■■■■■■■ ■\n■■■■■■■■■■';
            default:
                return '■■■■■■■■\n■   ?    ■\n■        ■\n■■■■■■■■';
        }
    }

    // Main menu dialog function
    showMainMenuDialog(text, choices) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'dialog-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        overlay.style.zIndex = '999';
        document.body.appendChild(overlay);

        // Create dialog container
        const dialogContainer = document.createElement('div');
        dialogContainer.className = 'main-menu-dialog';
        dialogContainer.style.position = 'fixed';
        dialogContainer.style.top = '50%';
        dialogContainer.style.left = '50%';
        dialogContainer.style.transform = 'translate(-50%, -50%)';
        dialogContainer.style.width = '400px';
        dialogContainer.style.backgroundColor = '#2a2a2a';
        dialogContainer.style.border = '2px solid #ff4d4d';
        dialogContainer.style.borderRadius = '8px';
        dialogContainer.style.padding = '1.5rem';
        dialogContainer.style.zIndex = '1000';
        dialogContainer.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.8)';

        // Create text area
        const textElement = document.createElement('div');
        textElement.className = 'main-menu-dialog-text';
        textElement.style.color = '#ddd';
        textElement.style.marginBottom = '1.5rem';
        textElement.style.minHeight = '60px';
        textElement.style.fontFamily = 'mplus_hzk_12, monospace';

        // Create choices area
        const choicesElement = document.createElement('div');
        choicesElement.className = 'main-menu-dialog-choices';
        choicesElement.style.display = 'flex';
        choicesElement.style.flexWrap = 'wrap';
        choicesElement.style.gap = '0.5rem';

        // Add to container
        dialogContainer.appendChild(textElement);
        dialogContainer.appendChild(choicesElement);

        // Add to document
        document.body.appendChild(dialogContainer);

        // Typewriter effect
        let index = 0;
        const typeSpeed = 70; // Typing speed, milliseconds per character

        // Clear any ongoing typing animation
        if (this.mainMenuTypingInterval) {
            clearInterval(this.mainMenuTypingInterval);
        }

        // Start typing animation
        this.mainMenuTypingInterval = setInterval(() => {
            if (index < text.length) {
                textElement.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(this.mainMenuTypingInterval);
                // Show choices after typing completes
                choices.forEach(choice => {
                    const button = document.createElement('button');
                    button.className = 'choice-btn';
                    button.textContent = choice.text;
                    button.style.padding = '0.5rem 1rem';
                    button.style.backgroundColor = '#333';
                    button.style.border = '1px solid #555';
                    button.style.color = '#fff';
                    button.style.cursor = 'pointer';
                    button.style.fontSize = '0.9rem';
                    button.style.fontFamily = 'mplus_hzk_12, monospace';

                    button.addEventListener('click', () => {
                        choice.action();
                        // Remove dialog and overlay
                        document.body.removeChild(dialogContainer);
                        document.body.removeChild(overlay);
                    });

                    choicesElement.appendChild(button);
                });
            }
        }, typeSpeed);
    }

    // Typewriter effect to show dialogue
    showDialogue(text, choices) {
        this.elements.dialogueText.textContent = '';
        this.elements.dialogueChoices.innerHTML = '';

        let index = 0;
        const typeSpeed = 70; // Typing speed, milliseconds per character (slightly slower)

        // Clear any ongoing typing animation
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
        }

        // Start typing animation
        this.typingInterval = setInterval(() => {
            if (index < text.length) {
                this.elements.dialogueText.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(this.typingInterval);
                // Show choices after typing completes
                choices.forEach(choice => {
                    const button = document.createElement('button');
                    button.className = 'choice-btn';
                    button.textContent = choice.text;
                    button.addEventListener('click', choice.action);
                    this.elements.dialogueChoices.appendChild(button);
                });
            }
        }, typeSpeed);
    }

    // Clear dialogue
    clearDialogue() {
        // Clear any ongoing typing animation
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
            this.typingInterval = null;
        }
        this.elements.dialogueText.textContent = '';
        this.elements.dialogueChoices.innerHTML = '';
    }

    // Game methods and plot branches
    leaveClassroom() {
        this.gameState.plotProgress = 1;
        this.showDialogue('When you reached the classroom door, you found it locked! No matter how you pushed or pulled, it wouldn\'t open.', [
            { text: 'Check windows', action: () => this.checkWindow() },
            { text: 'Search for key', action: () => this.searchForKey() }
        ]);
    }

    stayInClassroom() {
        this.gameState.plotProgress = 2;
        this.updateGameTime('21:15');
        this.showDialogue('Time passed minute by minute, suddenly, all the classroom lights went out!', [
            { text: 'Take out phone for light', action: () => this.usePhoneLight() },
            { text: 'Hide under desk', action: () => this.hideUnderDesk() }
        ]);
    }

    goToCorridor() {
        // Ensure time only moves forward, don't set fixed time
        this.loadScene('corridor');
    }

    approachGirl() {
        this.gameState.hasSeenGhost = true;
        this.updateGameTime('21:45');
        this.showDeath('When you approached her, she slowly turned her head—it was a face without a face! You screamed and fell...');
    }

    fastLeaveCorridor() {
        this.updateGameTime('21:40');
        this.showDialogue('You quickly ran through the corridor, feeling something chasing behind you.', [
            { text: 'Hide in library', action: () => this.goToLibrary() },
            { text: 'Rush into bathroom', action: () => this.goToBathroom() }
        ]);
    }

    checkFootsteps() {
        this.gameState.hasSeenGhost = true;
        this.updateGameTime('21:45');
        this.showDeath('You turned around and saw a legless person floating in mid-air, reaching pale hands toward you...');
    }

    continueCorridor() {
        this.updateGameTime('21:40');
        this.showDialogue('You quickened your pace, there are three doors at the end of the corridor you can enter.', [
            { text: 'Library', action: () => this.goToLibrary() },
            { text: 'Bathroom', action: () => this.goToBathroom() },
            { text: 'Principal\'s Office', action: () => this.goToPrincipalOffice() }
        ]);
    }

    checkBookshelf() {
        if (!this.gameState.hasKey) {
            this.gameState.hasKey = true;
            this.showDialogue('You found a silver glowing key behind the bookshelf!', [
                { text: 'Pick up key', action: () => this.takeKey() },
                { text: 'Leave it', action: () => this.leaveKey() }
            ]);
        } else {
            this.showDialogue('All the books on the shelf suddenly fell down, burying you under a pile of books!', [
                { text: 'Struggle out', action: () => this.escapeBookpile() }
            ]);
        }
    }

    approachMirror() {
        this.gameState.hasSeenGhost = true;
        this.updateGameTime('21:50');
        this.showDeath('When you looked in the mirror, your reflection showed a creepy smile, then slowly crawled out of the mirror...');
    }

    turnOnLight() {
        this.updateGameTime('22:00');
        this.showDialogue('The lights turned on, you saw a diary on the desk.', [
            { text: 'Read diary', action: () => this.readDiary() },
            { text: 'Check drawers', action: () => this.checkDrawer() }
        ]);
    }

    searchInDark() {
        this.gameState.hasSeenGhost = true;
        this.updateGameTime('22:00');
        this.showDeath('Your hand touched something cold, then you heard a voice whisper in your ear: "Are you looking for this?"');
    }

    readDiary() {
        this.updateGameTime('22:10');
        this.showDialogue('The diary recorded a student\'s experience, he disappeared in this school three years ago today...', [
            { text: 'Continue reading', action: () => this.continueReading() },
            { text: 'Close diary', action: () => this.closeDiary() }
        ]);
    }

    // Play sound method
    playSound(soundName) {
        try {
            if (soundName === 'ding' && this.horrorDing) {
                this.horrorDing.currentTime = 0;
                this.horrorDing.play().catch(e => console.log('Sound effect playback failed:', e));
            } else if (soundName === 'horror' && this.horrorUp) {
                this.horrorUp.currentTime = 0;
                this.horrorUp.play().catch(e => console.log('Sound effect playback failed:', e));
            }
        } catch (error) {
            console.log('Sound effect playback error:', error);
        }
    }

    // Typewriter effect to show death message
    showDeath(message) {
        // Play death sound effect
        this.playSound('horror');

        this.elements.gameScreen.classList.add('hidden');
        this.elements.deathScreen.classList.remove('hidden');
        this.elements.deathMessage.textContent = '';

        let index = 0;
        const typeSpeed = 70; // Typing speed, milliseconds per character (slightly slower than dialogue)

        // Clear any ongoing typing animation
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
        }

        // Start typing animation
        this.typingInterval = setInterval(() => {
            if (index < message.length) {
                this.elements.deathMessage.textContent += message.charAt(index);
                index++;
            } else {
                clearInterval(this.typingInterval);
            }
        }, typeSpeed);
    }

    // Complete chapter
    // Show result screen
    showResultScreen() {
        this.elements.gameScreen.classList.add('hidden');
        this.elements.resultScreen.classList.remove('hidden');

        // Show chapter name and completion time
        let chapterName = '';
        if (this.gameState.currentChapter === 'prologue') {
            chapterName = 'Prologue-「After Evening Self-Study」';
            // Show next chapter button
            this.elements.nextChapterBtn.classList.remove('hidden');
        } else if (this.gameState.currentChapter === 'chapter1') {
            chapterName = 'Chapter 1-「First Encounter」';
            // Show next chapter button
            this.elements.nextChapterBtn.classList.remove('hidden');
        } else if (this.gameState.currentChapter === 'chapter2') {
            chapterName = 'Chapter 2-「Deeper into the Strange Realm」';
            // Show next chapter button
            this.elements.nextChapterBtn.classList.remove('hidden');
        } else if (this.gameState.currentChapter === 'chapter3') {
            chapterName = 'Chapter 3-「Destiny\'s End」';
            // Show next chapter button
            this.elements.nextChapterBtn.classList.remove('hidden');
        } else if (this.gameState.currentChapter === 'chapter4') {
            chapterName = 'Chapter 4-「Edge of Darkness」';
            // Show next chapter button
            this.elements.nextChapterBtn.classList.remove('hidden');
        } else if (this.gameState.currentChapter === 'chapter4') {
            chapterName = 'Chapter 4-「Final Chapter: Edge of Darkness」';
            // This is the final chapter, hide next chapter button
            this.elements.nextChapterBtn.classList.add('hidden');
            // Show return to chapter select button
            this.elements.backToChapterSelectBtn.classList.remove('hidden');
        }

        this.elements.resultChapter.textContent = chapterName;
        this.elements.resultTime.textContent = this.gameState.gameTime;
    }

    // Go to next chapter
    goToNextChapter() {
        // Hide result page
        this.elements.resultScreen.classList.add('hidden');

        if (this.gameState.currentChapter === 'prologue') {
            // Save prologue end time
            const endTime = this.gameState.gameTime;
            // Pass time to Chapter 1
            this.startGame('chapter1', endTime);
        } else if (this.gameState.currentChapter === 'chapter1') {
            // Pass time to Chapter 2
            const endTime = this.gameState.gameTime;
            this.startGame('chapter2', endTime);
        } else if (this.gameState.currentChapter === 'chapter2') {
            // Pass time to Chapter 3
            const endTime = this.gameState.gameTime;
            this.startGame('chapter3', endTime);
        } else if (this.gameState.currentChapter === 'chapter3') {
            // Pass time to Chapter 4
            const endTime = this.gameState.gameTime;
            this.startGame('chapter4', endTime);
        } else if (this.gameState.currentChapter === 'chapter4') {
            // Chapter 4 is final chapter, return to chapter selection
            this.showChapterSelect();
        }
    }

    // Complete chapter
    completeChapter() {
        // Play LongScream audio
        const longScream = document.getElementById('long-scream');
        if (longScream) {
            longScream.currentTime = 0;
            longScream.play().catch(error => {
                console.error('Failed to play LongScream audio:', error);
            });

            // Stop playback after 4 seconds
            setTimeout(() => {
                if (!longScream.paused) {
                    longScream.pause();
                }
            }, 4000);
        }

        if (this.gameState.currentChapter === 'prologue') {
            // Unlock Chapter 1
            this.unlockChapter('chapter1');
        } else if (this.gameState.currentChapter === 'chapter1') {
            // Unlock Chapter 2
            this.unlockChapter('chapter2');
        } else if (this.gameState.currentChapter === 'chapter2') {
            // Unlock Chapter 3
            this.unlockChapter('chapter3');
        } else if (this.gameState.currentChapter === 'chapter3') {
            // Unlock Chapter 4
            this.unlockChapter('chapter4');
        } else if (this.gameState.currentChapter === 'chapter4') {
            // Chapter 4 is final chapter, don't unlock new chapters
            console.log('Final chapter completed');
        }

        // Show result screen
        this.showResultScreen();
    }

    // Return to chapter selection
    returnToChapterSelect() {
        // Clear time update timer
        if (this.timeUpdateInterval) {
            clearInterval(this.timeUpdateInterval);
            this.timeUpdateInterval = null;
        }
        this.elements.gameScreen.classList.add('hidden');
        this.elements.deathScreen.classList.add('hidden');
        this.elements.resultScreen.classList.add('hidden');
        this.elements.chapterSelectScreen.classList.remove('hidden');
    }

    // Removed duplicate restartGame method definition
    // Keep the version below, using unified unlockedChaptersKey


    // Load unlocked chapters
    loadUnlockedChapters(unlockedChaptersKey) {
        try {
            const saved = localStorage.getItem(unlockedChaptersKey);
            return saved ? JSON.parse(saved) : ['prologue'];
        } catch (e) {
            console.error('Failed to load unlocked chapters:', e);
            return ['prologue'];
        }
    }

    // Save unlocked chapters
    saveUnlockedChapters() {
        try {
            localStorage.setItem(
                this.gameState.unlockedChaptersKey,
                JSON.stringify(this.gameState.unlockedChapters)
            );
        } catch (e) {
            console.error('Failed to save unlocked chapters:', e);
        }
    }

    // Restart game
    restartGame() {
        // Clear time update timer
        if (this.timeUpdateInterval) {
            clearInterval(this.timeUpdateInterval);
            this.timeUpdateInterval = null;
        }

        // Reset game state, but keep unlocked chapters
        const unlockedChapters = this.gameState.unlockedChapters;
        this.gameState = {
            playerName: this.gameState.playerName,
            playerGender: this.gameState.playerGender,
            currentScene: 'start',
            currentChapter: '',
            gameTime: '21:00',
            plotProgress: 0,
            inventory: [],
            hasKey: false,
            hasSeenGhost: false,
            unlockedChapters: unlockedChapters,
            unlockedChaptersKey: 'schoolHorrorGame_unlockedChapters'
        };

        // Reset interface
        this.elements.deathScreen.classList.add('hidden');
        this.elements.startScreen.classList.remove('hidden');
        this.elements.playerNameInput.value = this.gameState.playerName;
        if (this.gameState.playerGender === 'male') {
            this.elements.maleOption.classList.add('selected');
        } else {
            this.elements.femaleOption.classList.add('selected');
        }
        this.checkStartConditions();
    }

    // Update game time (ensure time only moves forward)
    updateGameTime(time) {
        // Parse current time and new time
        const currentTime = this.parseTime(this.gameState.gameTime);
        const newTime = this.parseTime(time);

        // Only update if new time is later than current time
        if (newTime > currentTime) {
            this.gameState.gameTime = time;
            this.elements.currentTimeDisplay.textContent = time;
        }
    }

    // Parse time string to minutes (for comparison)
    parseTime(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    // Start automatic time updates (update every 30 seconds)
    startAutoTimeUpdate() {
        // Clear any existing timer
        if (this.timeUpdateInterval) {
            clearInterval(this.timeUpdateInterval);
        }

        // Set new timer (update every 30 seconds)
        this.timeUpdateInterval = setInterval(() => {
            // Parse current time
            const [hours, minutes] = this.gameState.gameTime.split(':').map(Number);

            // Add 1 minute
            let newMinutes = minutes + 1;
            let newHours = hours;

            // Handle hour carryover
            if (newMinutes >= 60) {
                newMinutes = 0;
                newHours += 1;
            }

            // Handle 24-hour format
            if (newHours >= 24) {
                newHours = 0;
            }

            // Format new time
            const newTime = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;

            // Update game time
            this.updateGameTime(newTime);
        }, 30000); // 30 seconds
    }

    // More plot methods...
    checkWindow() { this.showDeath('The windows were barred with iron rods, when you approached, a cold hand reached through the bars and grabbed you!'); }
    searchForKey() {
        this.showDialogue('You found a rusty key in the teacher\'s desk drawer!', [
            {
                text: 'Pick up key',
                action: () => {
                    if (this.gameState?.inventory) {
                        if (!this.gameState.inventory.includes('Silver Glowing Key')) {
                            this.gameState.inventory.push('Silver Glowing Key');

                            // Show inventory contents
                            this.showDialogue(
                                `Added Silver Glowing Key to inventory. Current inventory: ${this.gameState.inventory.join(', ')}`,
                                [{
                                    text: 'Try to open door',
                                    action: () => { this.tryDoorKey(); }
                                }]
                            );
                        } else {
                            this.showDialogue('Silver Glowing Key already exists in inventory.', [{
                                text: 'Try to open door',
                                action: () => { this.tryDoorKey(); }
                            }]);
                        }
                    } else {
                        this.showDialogue('Cannot add item, inventory does not exist.', [{
                            text: 'Try to open door',
                            action: () => { this.tryDoorKey(); }
                        }]);
                    }
                }
            }
        ]);
    }
    usePhoneLight() { this.showDialogue('The phone screen lit up, you saw a note on the teacher\'s desk.', [{ text: 'Pick up note', action: () => this.takeNote() }]); }
    hideUnderDesk() { this.showDeath('The desk started shaking violently, then the entire thing collapsed on you...'); }
    goToLibrary() { this.loadScene('library'); }
    goToBathroom() { this.loadScene('bathroom'); }
    goToPrincipalOffice() { this.loadScene('principalOffice'); }
    takeKey() {
        this.showDialogue('You found a silver glowing key!', [
            {
                text: 'Put in backpack',
                action: () => {
                    if (this.gameState && this.gameState.inventory) {
                        if (!this.gameState.inventory.includes('Silver Glowing Key')) {
                            this.gameState.inventory.push('Silver Glowing Key');
                            // Show inventory contents
                            this.showDialogue(
                                `Added Silver Glowing Key to inventory. Current inventory: ${this.gameState.inventory.join(', ')}`
                            );
                            // Add urgent footsteps and timed QTE
                            setTimeout(() => {
                                this.startKeyQTE();
                            }, 1000);
                        } else {
                            this.showDialogue('Silver Glowing Key already exists in inventory.', [{
                                text: 'Leave library',
                                action: () => { this.goToCorridor(); }
                            }]);
                        }
                    } else {
                        this.showDialogue('Cannot add item, inventory does not exist.', [{
                            text: 'Leave library',
                            action: () => { this.goToCorridor(); }
                        }]);
                    }
                }
            }
        ]);
    }

    // New timed QTE method
    startKeyQTE() {
        this.showDialogue('Suddenly, you hear urgent footsteps behind you! Like something is quickly approaching you!', []);

        // Create QTE button
        const qteContainer = document.createElement('div');
        qteContainer.id = 'key-qte-container';
        qteContainer.className = 'qte-container';

        const qteText = document.createElement('p');
        qteText.className = 'qte-text';
        qteText.textContent = 'Quickly click the key icon to try opening the principal\'s office door!';
        qteContainer.appendChild(qteText);

        const qteButton = document.createElement('button');
        qteButton.id = 'key-qte-button';
        qteButton.className = 'big-button';
        qteButton.textContent = '🔑 Quick Click';
        qteContainer.appendChild(qteButton);

        const timerBar = document.createElement('div');
        timerBar.className = 'timer-bar';
        timerBar.style.width = '100%';
        qteContainer.appendChild(timerBar);

        // Add to game interface
        this.elements.gameActions.appendChild(qteContainer);

        // QTE parameters
        let clickCount = 0;
        const requiredClicks = 15;
        const timeLimit = 5000; // 5 seconds
        const startTime = Date.now();

        // Update timer
        const updateTimer = () => {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, timeLimit - elapsedTime);
            const percentage = (remainingTime / timeLimit) * 100;
            timerBar.style.width = `${percentage}%`;

            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                this.elements.gameActions.removeChild(qteContainer);
                this.showDeath('The footsteps are getting closer... You failed to open the door in time and were caught by something in the darkness!');
            }
        };

        const timerInterval = setInterval(updateTimer, 50);
        updateTimer();

        // Button click event
        qteButton.addEventListener('click', () => {
            clickCount++;
            qteText.textContent = `Clicked ${clickCount}/${requiredClicks} times`;

            if (clickCount >= requiredClicks) {
                clearInterval(timerInterval);
                this.elements.gameActions.removeChild(qteContainer);
                this.showDialogue('The key finally turned! The door opened a crack, you quickly squeezed in and closed the door.', [{
                    text: 'Enter principal\'s office',
                    action: () => { this.goToPrincipalOffice(); }
                }]);
            }
        });
    }
    leaveKey() { this.showDeath('You decided not to take the key, then the bookshelf suddenly collapsed, crushing you underneath...'); }
    escapeBookpile() { this.showDialogue('You struggled out from under the pile of books, feeling something staring at you.', [{ text: 'Leave library', action: () => this.goToCorridor() }]); }
    tryDoorKey() { this.showDialogue('The key went into the lock, but wouldn\'t turn. Then you heard footsteps behind you...', [{ text: 'Turn around to see', action: () => this.seeWhoIsThere() }, { text: 'Keep trying to open', action: () => this.keepTryingKey() }]); }
    takeNote() {
        this.showDialogue('The note reads: "It dislikes noise, water can temporarily drive it away"', [
            {
                text: 'Keep note',
                action: () => {
                    // Use this directly instead of window.game
                    if (this.gameState && this.gameState.inventory) {
                        if (!this.gameState.inventory.includes('Water Fear Note')) {
                            this.gameState.inventory.push('Water Fear Note');
                            // Show inventory contents
                            this.showDialogue(
                                `Added Water Fear Note to inventory. Current inventory: ${this.gameState.inventory.join(', ')}`,
                                [{
                                    text: 'Continue',
                                    action: () => { this.goToCorridor(); }
                                }]
                            );
                        } else {
                            this.showDialogue('Water Fear Note already exists in inventory.', [{
                                text: 'Continue',
                                action: () => { this.goToCorridor(); }
                            }]);
                        }
                    } else {
                        this.showDialogue('Cannot add item, inventory does not exist.', [{
                            text: 'Continue',
                            action: () => { this.goToCorridor(); }
                        }]);
                    }
                }
            }
        ]);
    }
    seeWhoIsThere() { this.showDeath('Standing behind you was a student in uniform, his face was slowly melting...'); }

    checkDrawer() {
        if (this.gameState && this.gameState.inventory) {
            const noteItem = 'Mirror Reflection Note';
            if (!this.gameState.inventory.includes(noteItem)) {
                this.gameState.inventory.push(noteItem);
                this.showDialogue(
                    `You opened the drawer, inside was a yellowed note: "Don\'t trust the reflection in the mirror". Added ${noteItem} to inventory. Current inventory: ${this.gameState.inventory.join(', ')}`,
                    [{
                        text: 'Close drawer',
                        action: () => { this.goToCorridor(); }
                    }]
                );
            } else {
                this.showDialogue('You opened the drawer, inside was a yellowed note: "Don\'t trust the reflection in the mirror". You already have this note.', [{
                    text: 'Close drawer',
                    action: () => { this.goToCorridor(); }
                }]);
            }
        } else {
            this.showDialogue('You opened the drawer, inside was a yellowed note: "Don\'t trust the reflection in the mirror"', [{
                text: 'Close drawer',
                action: () => { this.goToCorridor(); }
            }]);
        }
    }
    keepTryingKey() { this.showDeath('The lock suddenly turned, but the moment the door opened, a black mist surged in and swallowed you...'); }
    continueReading() { this.showDialogue('The diary\'s last page reads: "It\'s looking for a replacement, especially people staying at school on this day..."', [{ text: 'Search for exit', action: () => this.findExit() }]); }
    closeDiary() { this.showDialogue('You closed the diary, deciding to find a way to leave the school.', [{ text: 'Leave office', action: () => this.goToCorridor() }]); }
    findExit() { this.showDialogue('Following the diary\'s clues, you found the school\'s side door!', [{ text: 'Try to open door', action: () => this.trySideDoor() }]); }
    trySideDoor() { this.showDialogue('The door wasn\'t locked! You pushed it open and found it wasn\'t the street outside, but a dim corridor with signs pointing to the basement on the wall.', [{ text: 'Enter corridor', action: () => this.enterDeepCorridor() }]); }
    enterDeepCorridor() {
        if (this.gameState && this.gameState.inventory) {
            if (!this.gameState.inventory.includes('Basement Map')) {
                this.gameState.inventory.push('Basement Map');
                // Show inventory contents
                this.showDialogue(
                    `You found a basement map and added it to your inventory. Current inventory: ${this.gameState.inventory.join(', ')}`,
                    [{
                        text: 'Explore according to map',
                        action: () => { this.gameClear(); }
                    }]
                );
            } else {
                this.showDialogue('You already have the basement map. A yellowed map was pinned to the wall at the end of the corridor, marking the school\'s underground structure.', [{
                    text: 'Explore according to map',
                    action: () => { this.gameClear(); }
                }]);
            }
        } else {
            this.showDialogue('A yellowed map was pinned to the wall at the end of the corridor, marking the school\'s underground structure. You realized you were delving into the school\'s unknown areas.', [{
                text: 'Explore according to map',
                action: () => { this.gameClear(); }
            }]);
        }
    }
    gameClear() { this.completeChapter(); }

    // Return to main screen
    backToMainScreen() {
        // Hide chapter selection interface
        this.elements.chapterSelectScreen.classList.add('hidden');
        // Show main interface
        this.elements.startScreen.classList.remove('hidden');
        // Reset chapter selection related status
        this.gameState.selectedChapter = null;
    }

    // Show custom chapter introduction information
    showCustomChapterInfo() {
        // Create image container
        const infoContainer = document.createElement('div');
        infoContainer.id = 'custom-chapter-info';
        infoContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            cursor: pointer;
        `;

        // Create hint text
        const hintText = document.createElement('div');
        hintText.textContent = 'Click anywhere to close image';
        hintText.style.cssText = `
            color: white;
            font-size: 18px;
            margin-bottom: 20px;
            text-align: center;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        `;

        // Create image element
        const infoImage = document.createElement('img');
        infoImage.src = 'assets/img/介绍.png';
        infoImage.style.cssText = `
            max-width: 90%;
            max-height: 80%;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        `;

        // Add to container
        infoContainer.appendChild(hintText);
        infoContainer.appendChild(infoImage);
        document.body.appendChild(infoContainer);

        // Click anywhere to close
        infoContainer.addEventListener('click', () => {
            if (infoContainer.parentNode) {
                infoContainer.parentNode.removeChild(infoContainer);
            }
        });
    }
}

// Game initialization
window.addEventListener('DOMContentLoaded', () => {
    const game = new SchoolHorrorGame();
});