class Chapter1 {
    constructor(game) {
        this.game = game;
        this.plotProgress = 0;
        this.ghostEncountered = false;
        this.keyFound = false;
        this.typingInterval = null;

        // Sound effect elements
        this.horrorDing = document.getElementById('horror-ding');
        this.horrorUp = document.getElementById('horror-up');

        // Ensure game object has showInputDialog method
        if (!this.game.showInputDialog) {
            this.game.showInputDialog = function (message, inputPlaceholder, callback) {
                const dialogueText = document.getElementById('dialogue-text');
                const dialogueChoices = document.getElementById('dialogue-choices');
                const gameActions = document.getElementById('game-actions');
                let typingInterval;

                // Clear dialogue box
                dialogueText.innerHTML = '';
                dialogueChoices.innerHTML = '';
                gameActions.innerHTML = '';

                // Typewriter effect to display message
                let index = 0;
                const typeSpeed = 70; // Typing speed, ms per character

                // Clear any ongoing typing animation
                if (this.typingInterval) {
                    clearInterval(this.typingInterval);
                }

                // Start typing animation
                this.typingInterval = setInterval(() => {
                    if (index < message.length) {
                        dialogueText.textContent += message.charAt(index);
                        index++;
                    } else {
                        clearInterval(this.typingInterval);
                        // Create input elements after typing is complete
                        createInputElements();
                    }
                }, typeSpeed);

                // Function to create input elements
                function createInputElements() {
                    const inputContainer = document.createElement('div');
                    inputContainer.className = 'input-container';

                    const input = document.createElement('input');
                    input.type = 'text';
                    input.placeholder = inputPlaceholder;
                    input.className = 'password-input';
                    input.maxLength = 8;
                    input.style.width = '200px';
                    input.style.padding = '0.8rem';
                    input.style.backgroundColor = '#1a1a1a';
                    input.style.border = '2px solid #555';
                    input.style.color = '#fff';
                    input.style.fontSize = '1rem';
                    input.style.borderRadius = '4px';
                    input.style.marginRight = '10px';
                    input.style.fontFamily = 'mplus_hzk_12, Press Start 2P, cursive';

                    // Create confirm button
                    const confirmBtn = document.createElement('button');
                    confirmBtn.textContent = 'Confirm';
                    confirmBtn.className = 'confirm-btn';
                    confirmBtn.style.padding = '0.8rem';
                    confirmBtn.style.backgroundColor = '#333';
                    confirmBtn.style.border = '2px solid #555';
                    confirmBtn.style.color = '#fff';
                    confirmBtn.style.fontSize = '0.9rem';
                    confirmBtn.style.cursor = 'pointer';
                    confirmBtn.style.transition = 'all 0.3s ease';
                    confirmBtn.style.fontFamily = 'mplus_hzk_12, Press Start 2P, cursive';

                    confirmBtn.addEventListener('mouseover', function () {
                        this.style.backgroundColor = '#555';
                        this.style.borderColor = '#ff4d4d';
                    });

                    confirmBtn.addEventListener('mouseout', function () {
                        this.style.backgroundColor = '#333';
                        this.style.borderColor = '#555';
                    });

                    confirmBtn.addEventListener('click', function () {
                        callback(input.value);
                        inputContainer.remove();
                    });

                    // Allow submission with Enter key
                    input.addEventListener('keypress', function (e) {
                        if (e.key === 'Enter') {
                            callback(input.value);
                            inputContainer.remove();
                        }
                    });

                    inputContainer.appendChild(input);
                    inputContainer.appendChild(confirmBtn);
                    dialogueChoices.appendChild(inputContainer);

                    // Auto-focus input field
                    input.focus();
                }
            };
        }
    }

    // Play sound effect
    playSound(soundName) {
        try {
            switch (soundName) {
                case 'ding':
                    this.horrorDing.currentTime = 0;
                    this.horrorDing.play();
                    break;
                case 'horror':
                    this.horrorUp.currentTime = 0;
                    this.horrorUp.play();
                    break;
            }
        } catch (e) {
            console.warn('Sound effect playback failed:', e);
        }
    }

    // Display dialogue with typewriter effect
    showDialogue(text, choices) {
        // Directly use the game object's showDialogue method
        this.game.showDialogue(text, choices);
    }

    // Start Chapter 1
    // Start Chapter 1, accept optional start time parameter
    start(startTime = null) {
        this.game.gameState.currentChapter = 'chapter1';
        // Initialize game time
        if (startTime) {
            this.updateGameTime(startTime);
        } else {
            this.updateGameTime('21:30'); // Default start time
        }
        this.game.updateGameMap('corridor');
        this.plotProgress = 0;
        this.loadScene('corridor');
    }

    // Load scene
    loadScene(sceneName) {
        this.game.clearDialogue();

        switch (sceneName) {
            case 'corridor':
                this.showCorridorScene();
                break;
            case 'staircase':
                this.showStaircaseScene();
                break;
            case 'artRoom':
                this.showArtRoomScene();
                break;
            case 'basement':
                this.showBasementScene();
                break;
            case 'undergroundPassage':
                this.showUndergroundPassageScene();
                break;
            default:
                this.showCorridorScene();
        }
    }

    // Underground passage scene
    showUndergroundPassageScene() {
        this.game.gameState.currentScene = 'undergroundPassage';
        this.game.updateGameMap('undergroundPassage');
        this.showDialogue('At the end of the stone steps is a damp underground passage with strange symbols carved on the walls. The sound of dripping water and faint whispers can be heard in the distance.', [
            { text: 'Continue forward', action: () => this.deepenExploration() }
        ]);
    }

    deepenExploration() {
        this.showDialogue('Three branching paths appear ahead in the passage, each emitting a different scent—rust, decay, and disinfectant.', [
            { text: 'Take the rust-scented path', action: () => this.chooseRustPath() },
            { text: 'Take the decay-scented path', action: () => this.chooseDecayPath() },
            { text: 'Take the disinfectant-scented path', action: () => this.chooseDisinfectantPath() }
        ]);
    }

    chooseRustPath() {
        this.showDialogue('The rust-scented passage is lined with pipes on the walls, one of which is dripping a red liquid. A metal door is faintly visible at the end.', [
            { text: 'Inspect the iron door', action: () => this.examineIronDoor() }
        ]);
    }

    chooseDecayPath() {
        this.showDialogue('The decay-scented passage floor is covered in a sticky black substance, and the walls are oozing slime. A sound resembling chewing comes from the distance.', [
            { text: 'Navigate around the slime', action: () => this.navigateSlime() }
        ]);
    }

    chooseDisinfectantPath() {
        this.showDialogue('The disinfectant-scented passage is unusually clean, with metal cabinets labeled "Specimen" lined on both sides. The lights flicker on and off.', [
            { text: 'Open the nearest cabinet', action: () => this.openExperimentCabinet() }
        ]);
    }

    examineIronDoor() {
        // Create password input in the form of an input box
        this.game.showInputDialog('There is an eight-digit combination lock on the iron door, with a yellowed note beside it: "The password is the birthday of the first victim."',
            'Please enter the eight-digit password',
            (input) => this.validatePassword(input));
    }

    // Validate password
    validatePassword(inputPassword) {
        if (inputPassword === '19980613') {
            this.showDialogue('You entered ' + inputPassword + ', the iron door makes a heavy sound and slowly opens. Behind it is a larger underground space.', [
                { text: 'Enter the iron door', action: () => this.enterIronDoorArea() }
            ]);
        } else {
            this.showDialogue('Wrong password! The iron door emits a piercing alarm, and hurried footsteps can be heard in the distance.', [
                { text: 'Re-enter', action: () => this.examineIronDoor() },
                { text: 'Return to the fork', action: () => this.deepenExploration() }
            ]);
        }
    }

    navigateSlime() {
        this.showDialogue('You tiptoe around the slime but kick a metal can. The sound alerts something in the darkness—a pair of glowing eyes is moving towards you.', [
            { text: 'Return to the fork', action: () => this.deepenExploration() },
            { text: 'Use the map as a shield', action: () => this.useMapAsShield() }
        ]);
    }

    openExperimentCabinet() {
        this.showDialogue('Inside the cabinet is a glass container soaking an organ resembling a heart, labeled: "Specimen-07, 1998.06.13".', [
            { text: 'Record the date', action: () => this.noteExperimentDate() }
        ]);
    }

    noteExperimentDate() {
        this.game.gameState.experimentDate = '19980613';
        this.showDialogue('You note the date: June 13, 1998. This date seems important, possibly related to some password.', [
            { text: 'Continue exploring', action: () => this.deepenExploration() }
        ]);
    }

    // Old password entry method, kept but no longer used
    enterDoorPassword() {
        this.validatePassword('19980613');
    }

    useMapAsShield() {
        this.showDialogue('You quickly pull out the map and hold it in front of you. The map suddenly emits a faint light, forcing the creature in the darkness to retreat.', [
            { text: 'Continue forward', action: () => this.proceedThroughSlime() }
        ]);
    }

    enterIronDoorArea() {
        this.game.gameState.currentScene = 'ironDoorArea';
        this.game.updateGameMap('ironDoorArea');
        this.showDialogue('Behind the iron door is a massive underground laboratory. In the center rests a glowing container, inside which floats a shadowy humanoid figure.', [
            { text: 'Approach the container', action: () => this.approachContainer() }
        ]);
    }

    proceedThroughSlime() {
        this.game.gameState.currentScene = 'slimeExit';
        this.game.updateGameMap('slimeExit');
        this.showDialogue('You pass through the slime area and discover a stone door carved with strange symbols. The symbols are identical to the marks in the prologue diary.', [
            { text: 'Try to open the door', action: () => this.tryOpenStoneDoor() }
        ]);
    }

    approachContainer() {
        this.showDialogue('As you approach the container, the humanoid shadow inside suddenly opens its eyes, staring intently at you. Cracks begin to appear on the container\'s surface.', [
            { text: 'Back away', action: () => this.backAwayFromContainer() },
            { text: 'Touch the container', action: () => this.touchContainer() }
        ]);
    }

    tryOpenStoneDoor() {
        if (this.game.gameState.inventory.includes('Basement Map')) {
            this.showDialogue('You press the map against the stone door. The map emits a golden light, resonating with the symbols on the door. The stone door slowly opens.', [
                { text: 'Enter the door', action: () => this.enterStoneDoor() }
            ]);
        } else {
            this.showDialogue('The stone door remains motionless. You need to find some key or method to open it.', [
                { text: 'Return to the fork', action: () => this.deepenExploration() }
            ]);
        }
    }

    backAwayFromContainer() {
        this.playSound('horror');
        this.showDialogue('You quickly back away as the container explodes before you, releasing a large amount of black smoke. A piercing scream echoes from within the smoke.', [
            { text: 'Escape the laboratory', action: () => this.escapeLab() }
        ]);
    }

    touchContainer() {
        this.showDialogue('The moment you touch the container, a bright flash occurs. You find yourself standing on the school playground, but everything around you appears in an eerie red hue.', [
            { text: 'Explore the red playground', action: () => this.exploreRedPlayground() }
        ]);
    }

    enterStoneDoor() {
        this.game.gameState.currentScene = 'stoneDoorChamber';
        this.game.updateGameMap('stoneDoorChamber');
        this.showDialogue('Behind the door is an ancient stone chamber. In the center stands an altar with a black-covered book resting on it.', [
            { text: 'Open the book', action: () => this.openBlackBook() }
        ]);
    }

    escapeLab() {
        this.showDialogue('You flee the laboratory along the path you came, only to find that the exit has somehow become a classroom door. When you push it open, you find yourself back in the classroom after evening self-study, as if nothing ever happened.', [
            { text: 'Check the classroom', action: () => this.returnToClassroom() }
        ]);
    }

    exploreRedPlayground() {
        this.game.gameState.currentScene = 'redPlayground';
        this.game.updateGameMap('redPlayground');
        this.showDialogue('The red playground is eerily silent, with strange marks left on the track. A faded flag hangs from the flagpole in the center, bearing the same symbol as the stone door.', [
            { text: 'Walk towards the flagpole', action: () => this.approachFlagpole() }
        ]);
    }

    openBlackBook() {
        this.showDialogue('The moment the book opens, countless black characters fly out from its pages, drilling into your mind. You see the school\'s past, the forgotten souls.', [
            { text: 'Continue reading', action: () => this.continueReadingBook() }
        ]);
    }

    approachFlagpole() {
        this.game.showDialogue('As you approach the flagpole, the flag suddenly shakes violently, emitting a harsh noise. The ground begins to tremble, and a huge crack opens before you.', [
            { text: 'Back away', action: () => this.backAwayFromCrack() },
            { text: 'Jump into the crack', action: () => this.jumpIntoCrack() }
        ]);
    }

    continueReadingBook() {
        this.game.showDialogue('The text in the book tells you that this school was built on an ancient altar, requiring a soul sacrifice every year to maintain balance. This year\'s sacrifice date is today. The book also marks the altar\'s location, deep within the school\'s underground core.', [
            { text: 'Close the book', action: () => this.closeBlackBook() },
            { text: 'Go to the underground core', action: () => this.reachFinalArea() }
        ]);
    }

    backAwayFromCrack() {
        this.game.showDialogue('You quickly back away as the crack closes behind you. The playground returns to calm, but the color remains an eerie red. You notice a glowing symbol has appeared in the center of the playground, identical to the mark you saw underground for the core area.', [
            { text: 'Walk towards the symbol', action: () => this.reachFinalArea() },
            { text: 'Search for an exit', action: () => this.searchForExit() }
        ]);
    }

    jumpIntoCrack() {
        this.game.gameState.currentScene = 'undergroundAbyss';
        this.game.updateGameMap('undergroundAbyss');
        this.game.showDialogue('You jump into the crack, falling for a long time before landing. It\'s pitch black all around, only the sound of dripping water can be heard in the distance.', [
            { text: 'Explore forward', action: () => this.exploreAbyss() }
        ]);
    }

    closeBlackBook() {
        this.game.showDialogue('You close the book, and the altar begins to shake. A new passage appears on the stone chamber wall.', [
            { text: 'Enter the new passage', action: () => this.enterNewPassage() }
        ]);
    }

    searchForExit() {
        this.game.showDialogue('You search for an exit on the red playground, finding all school gates blocked by red mist. Something seems to be moving within the mist. You suddenly remember the underground core area mentioned in the book—perhaps that is the real exit.', [
            { text: 'Return to the classroom', action: () => this.returnToClassroom() },
            { text: 'Search for the underground core entrance', action: () => this.reachFinalArea() }
        ]);
    }

    exploreAbyss() {
        this.game.showDialogue('You explore forward, the ground beneath your feet becoming increasingly slippery. Suddenly, you hear a low breathing sound ahead.', [
            { text: 'Continue forward', action: () => this.faceAbyssCreature() }
        ]);
    }

    enterNewPassage() {
        this.game.gameState.currentScene = 'hiddenCatacombs';
        this.game.updateGameMap('hiddenCatacombs');
        this.game.showDialogue('The new passage leads to an underground catacomb, its walls covered in strange symbols. At the end of the passage is a bronze door embedded with a glowing gemstone.', [
            { text: 'Touch the gemstone', action: () => this.touchGemstone() }
        ]);
    }

    faceAbyssCreature() {
        this.game.showDialogue('You continue forward and see a massive black creature curled up in a corner of the cave. Its eyes emit a faint green glow, and it notices your presence.', [
            { text: 'Attempt communication', action: () => this.communicateWithCreature() },
            { text: 'Turn and run', action: () => this.runFromCreature() }
        ]);
    }

    touchGemstone() {
        this.game.showDialogue('You touch the gemstone, and it emits a blinding light. The bronze door slowly opens, revealing a passage behind it.', [
            { text: 'Enter the passage', action: () => this.enterBronzeDoor() }
        ]);
    }

    returnToClassroom() {
        this.game.gameState.currentScene = 'classroom';
        this.game.updateGameMap('classroom');
        this.game.showDialogue('You return to the classroom. Everything seems normal, as if the previous experience was just a dream. But you know it wasn\'t.', [
            { text: 'Check the classroom again', action: () => this.examineClassroomAgain() },
            { text: 'Leave the classroom', action: () => this.leaveClassroom() }
        ]);
    }

    communicateWithCreature() {
        this.game.showDialogue('You attempt to communicate with the creature. It emits a low sound, as if trying to say something. You don\'t understand its language, but you can sense its pain and anger.', [
            { text: 'Show friendliness', action: () => this.showFriendship() }
        ]);
    }

    runFromCreature() {
        this.game.showDialogue('You turn and run, but the creature is much faster than you imagined. It easily catches up, enveloping you in its shadow.', [
            { text: 'Give up resistance', action: () => this.surrenderToCreature() }
        ]);
    }

    enterBronzeDoor() {
        this.game.gameState.currentScene = 'innerSanctum';
        this.game.updateGameMap('innerSanctum');
        this.game.showDialogue('The passage behind the bronze door leads to a sacred inner sanctum. In the center is a pool of water with a black lotus floating on it.', [
            { text: 'Touch the lotus', action: () => this.touchBlackLotus() },
            { text: 'Explore the inner sanctum', action: () => this.reachFinalArea() }
        ]);
    }

    examineClassroomAgain() {
        this.game.showDialogue('You check the classroom again and find words that have appeared on the blackboard: "No exit, only deeper."', [
            { text: 'Sit back at the desk', action: () => this.sitAtDesk() }
        ]);
    }

    leaveClassroom() {
        this.game.showDialogue('You leave the classroom. The corridor is empty. All classroom doors are closed, only the stairwell door is slightly ajar.', [
            { text: 'Go to the stairwell', action: () => this.goToStairs() }
        ]);
    }

    showFriendship() {
        this.game.showDialogue('You show friendliness to the creature. It seems to sense your goodwill and gradually calms down. It turns and walks deeper into the cave, gesturing for you to follow.', [
            { text: 'Follow the creature', action: () => this.followCreature() }
        ]);
    }

    surrenderToCreature() {
        this.game.showDialogue('You give up resistance and close your eyes. But the expected pain never comes. When you open your eyes, you find yourself back in the classroom, everything around you normal.', [
            { text: 'Doubt reality', action: () => this.doubtReality() }
        ]);
    }

    touchBlackLotus() {
        this.game.showDialogue('You touch the black lotus. It suddenly blooms, emitting a strong light. After the light dissipates, you find yourself standing at the entrance of a massive underground space.', [
            { text: 'Enter the space', action: () => this.reachFinalArea() }
        ]);
    }

    sitAtDesk() {
        this.game.showDialogue('You sit back at the desk and find a note on it that reads: "Welcome back, the next exploration is about to begin."', [
            { text: 'Wait', action: () => this.waitForNextEvent() }
        ]);
    }

    goToStairs() {
        this.game.gameState.currentScene = 'stairs';
        this.game.updateGameMap('stairs');
        this.game.showDialogue('You arrive at the stairwell. The stairs seem longer than usual. Below is pitch black, while above is shrouded in red mist.', [
            { text: 'Go downstairs', action: () => this.goDownstairs() },
            { text: 'Go upstairs', action: () => this.goUpstairs() }
        ]);
    }

    followCreature() {
        this.game.gameState.currentScene = 'creatureLair';
        this.game.updateGameMap('creatureLair');
        this.game.showDialogue('You follow the creature to its lair. In the center of the lair is a glowing crystal. The creature gently touches the crystal with its head, and the crystal emits a soft light.', [
            { text: 'Touch the crystal', action: () => this.touchCrystal() }
        ]);
    }

    doubtReality() {
        this.game.showDialogue('You begin to doubt the reality of your surroundings. Everything looks normal, but you know something is wrong. You decide to explore the school again.', [
            { text: 'Leave the classroom', action: () => this.leaveClassroom() }
        ]);
    }

    acceptAbsorption() {
        this.game.gameState.currentScene = 'lotusDimension';
        this.game.updateGameMap('lotusDimension');
        this.game.showDialogue('You are sucked into the lotus and find yourself in a strange dimension. Surrounding you is an endless field of flowers, each emitting a faint glow.', [
            { text: 'Explore the flower field', action: () => this.exploreFlowerField() }
        ]);
    }

    waitForNextEvent() {
        this.game.showDialogue('You wait, and the classroom lights suddenly flicker a few times. When the lights return to normal, the words on the blackboard are gone, replaced by a map marking various areas of the school.', [
            { text: 'Check the map', action: () => this.examineNewMap() }
        ]);
    }

    goUpstairs() {
        this.game.gameState.currentScene = 'upperFloor';
        this.game.updateGameMap('upperFloor');
        this.game.showDialogue('You go upstairs and find the corridor here completely different from the one below. Ancient portraits hang on the walls, and the people in them seem to be watching you.', [
            { text: 'Continue forward', action: () => this.exploreUpperFloor() }
        ]);
    }

    touchCrystal() {
        this.game.showDialogue('You touch the crystal, and it emits a dazzling light. After the flash, you find yourself at the entrance of an unfamiliar underground space.', [
            { text: 'Enter the space', action: () => this.reachFinalArea() }
        ]);
    }

    exploreFlowerField() {
        this.game.gameState.currentScene = 'flowerField';
        this.game.updateGameMap('flowerField');
        this.game.showDialogue('You explore the flower field and discover that each flower corresponds to a soul in the school. They seem to be trying to tell you something.', [
            { text: 'Listen to the souls', action: () => this.listenToSouls() },
            { text: 'Leave the flower field', action: () => this.reachFinalArea() }
        ]);
    }

    listenToSouls() {
        this.game.showDialogue('You listen to the souls\'诉说. They tell you the school\'s secrets and a forgotten underground core area. The souls guide you to the entrance of the core area.', [
            { text: 'Enter the core area', action: () => this.reachFinalArea() }
        ]);
    }

    examineNewMap() {
        this.game.showDialogue('You examine the map and discover an area you\'ve never seen before—"Underground Core". The map shows that this is the final area you\'ve been searching for.', [
            { text: 'Go to the underground core', action: () => this.reachFinalArea() }
        ]);
    }

    exploreUpperFloor() {
        this.game.gameState.currentScene = 'upperFloorCorridor';
        this.game.updateGameMap('upperFloorCorridor');
        this.game.showDialogue('You continue forward and find a door at the end of the corridor with a sign that reads "Principal\'s Office".', [
            { text: 'Enter the principal\'s office', action: () => this.enterPrincipalsOffice() },
            { text: 'Return to the stairwell', action: () => this.goToStairs() }
        ]);
    }

    enterPrincipalsOffice() {
        this.game.gameState.currentScene = 'principalsOffice';
        this.game.updateGameMap('principalsOffice');
        this.game.showDialogue('The principal\'s office is covered in dust. On the desk is a yellowed photo of a person wearing an old-style school uniform. An old school map hangs on the wall.', [
            { text: 'Check the old map', action: () => this.examineOldMap() }
        ]);
    }

    examineOldMap() {
        this.game.showDialogue('The old map marks various areas of the school. The basement area is specially circled and labeled "To the Core".', [
            { text: 'Go to the basement core', action: () => this.reachFinalArea() }
        ]);
    }

    // Corridor scene
    showCorridorScene() {
        this.game.gameState.currentScene = 'corridor';
        this.game.updateGameMap('corridor');

        if (this.plotProgress === 0) {
            this.game.showDialogue('The corridor after evening self-study is unusually quiet. You keep feeling like something is watching you.', [
                { text: 'Go to the stairs', action: () => this.goToStaircase() },
                { text: 'Return to the classroom', action: () => this.returnToClassroom() }
            ]);
        } else if (this.plotProgress === 1) {
            this.game.showDialogue('The temperature in the corridor suddenly drops. You see strange shadows moving on the wall.', [
                { text: 'Continue forward', action: () => this.goToStaircase() },
                { text: 'Examine the shadow', action: () => this.examineShadow() }
            ]);
        } else {
            this.game.showDialogue('Eerie laughter echoes in the corridor. You must leave here quickly.', [
                { text: 'Rush to the stairs', action: () => this.goToStaircase() }
            ]);
        }
    }

    // Staircase scene
    showStaircaseScene() {
        this.game.gameState.currentScene = 'staircase';
        this.game.updateGameMap('staircase');

        if (this.plotProgress === 1 && !this.ghostEncountered) {
            if (this.game.gameState.inventory.includes('Basement Map')) {
                this.game.showDialogue('You arrive at the stairwell and remember the basement map obtained in the prologue. You decide to explore according to the map\'s instructions.', [
                    { text: 'Go downstairs to the basement as per the map', action: () => this.goToBasement() },
                    { text: 'Go to the art room first', action: () => this.goDownstairs() }
                ]);
            } else {
                this.game.showDialogue('You arrive at the stairwell. There seems to be a sound of dripping water on the stairs, but there\'s no water around.', [
                    { text: 'Go upstairs', action: () => this.goUpstairs() },
                    { text: 'Go downstairs', action: () => this.goDownstairs() }
                ]);
            }
        } else if (this.plotProgress === 2 && this.ghostEncountered) {
            this.game.showDialogue('You escaped the art room. The ghost\'s cries echo behind you.', [
                { text: 'Continue downstairs', action: () => this.goToBasement() }
            ]);
        } else {
            this.game.showDialogue('A foul smell permeates the stairwell. You dare not stay long.', [
                { text: 'Go downstairs to the basement', action: () => this.goToBasement() },
                { text: 'Return to the corridor', action: () => this.returnToCorridor() }
            ]);
        }
    }

    // Art room scene
    showArtRoomScene() {
        this.game.gameState.currentScene = 'artRoom';
        this.game.updateGameMap('artRoom');

        if (!this.ghostEncountered) {
            this.game.showDialogue('The paintings in the art room have all been turned out. Brushes and paint are scattered on the floor. On the wall is an unfinished portrait with empty spaces for eyes.', [
                { text: 'Examine the portrait', action: () => this.examinePainting() },
                { text: 'Leave the classroom', action: () => this.returnToStaircase() }
            ]);
        } else {
            this.game.showDialogue('Red liquid flows from the portrait\'s eyes. A ghostly hand reaches out from the canvas!', [
                { text: 'Quickly escape', action: () => this.escapeArtRoom() }
            ]);
        }
    }

    // Basement scene
    showBasementScene() {
        this.game.gameState.currentScene = 'basement';
        this.game.updateGameMap('basement');

        if (!this.keyFound) {
            this.game.showDialogue('The basement is dark and damp. Old furniture and杂物 are piled in the corner. A rusty key hangs on the wall.', [
                { text: 'Take the key', action: () => this.takeKey() },
                { text: 'Explore other areas', action: () => this.exploreBasement() }
            ]);
        } else {
            this.game.showDialogue('You found a strange key. It seems to open some important door.', [
                { text: 'Return to the stairwell', action: () => this.returnToStaircase() }
            ]);
        }
    }

    // Scene transition methods
    goToStaircase() {
        this.plotProgress = 1;
        this.loadScene('staircase');
    }

    returnToClassroom() {
        this.game.showDialogue('The classroom door is already locked; you cannot enter.', [
            { text: 'Return to the corridor', action: () => this.loadScene('corridor') }
        ]);
    }

    examineShadow() {
        this.game.showDialogue('The shadow suddenly becomes clear—it\'s the outline of a girl in school uniform. She slowly turns her face, and you see blood flowing from her eyes.', [
            { text: 'Back away', action: () => this.goToStaircase() },
            { text: 'Stay still', action: () => this.encounterGhost() }
        ]);
    }

    goUpstairs() {
        this.game.showDialogue('The door upstairs is locked; you cannot pass through.', [
            { text: 'Go downstairs', action: () => this.goDownstairs() }
        ]);
    }

    goDownstairs() {
        this.plotProgress = 2;
        this.loadScene('artRoom');
    }

    examinePainting() {
        this.ghostEncountered = true;
        this.playSound('horror');
        this.game.showDialogue('You approach the portrait. Suddenly, the eyes in the painting start bleeding, and the girl\'s mouth slightly opens, emitting a piercing scream!', [
            { text: 'Flee the classroom', action: () => this.escapeArtRoom() }
        ]);
    }

    returnToStaircase() {
        this.loadScene('staircase');
    }

    escapeArtRoom() {
        this.plotProgress = 3;
        this.loadScene('staircase');
    }

    encounterGhost() {
        this.ghostEncountered = true;
        this.playSound('horror');
        this.showDeath('The girl\'s ghost rushes at you. You feel a bone-chilling cold, and then know nothing more...');
    }

    goToBasement() {
        this.plotProgress = 4;
        this.loadScene('basement');
    }

    returnToCorridor() {
        this.loadScene('corridor');
    }

    takeKey() {
        this.keyFound = true;
        this.game.gameState.inventory.push('Rusty Key');
        // Update inventory display
        this.game.updateInventoryDisplay();
        this.game.showDialogue('You picked up the rusty key. It looks very old.', [
            { text: 'Continue exploring', action: () => this.exploreBasement() }
        ]);
    }

    exploreBasement() {
        if (this.keyFound) {
            if (!this.ghostEncountered) {
                this.game.showDialogue('You hear footsteps behind you. A girl in school uniform appears at the basement entrance, blood flowing from her eyes.', [
                    { text: 'Run away', action: () => this.encounterGhost() },
                    { text: 'Use the key against the ghost', action: () => this.useKeyAgainstGhost() }
                ]);
            } else {
                this.game.showDialogue('You discover a hidden door deep in the basement with an ancient lock. Your key fits it perfectly!', [
                    { text: 'Open the door', action: () => this.openSecretDoor() }
                ]);
            }
        } else {
            this.game.showDialogue('Strange sounds come from deep in the basement. You think it\'s best not to approach.', [
                { text: 'Return to the stairwell', action: () => this.returnToStaircase() }
            ]);
        }
    }

    useKeyAgainstGhost() {
        this.ghostEncountered = true;
        this.playSound('ding');
        this.game.showDialogue('You point the rusty key at the ghost. The key emits a faint light, and the ghost takes a few steps back.', [
            { text: 'Check the hidden door', action: () => this.exploreBasement() }
        ]);
    }

    // Open secret door
    openSecretDoor() {
        this.game.showDialogue('Behind the door is a stone staircase extending downward, with damp beads of water seeping from the walls. This area isn\'t marked on the map. You are entering the school\'s never-recorded deep structure.', [
            { text: 'Continue descending', action: () => this.loadScene('undergroundPassage') }
        ]);
    }

    // Common ending area
    reachFinalArea() {
        // Update game time
        this.updateGameTime('22:30');
        this.game.showDialogue('You pass through the final door and find yourself in a massive underground space. In the center is a glowing altar carved with the same symbols as the map.', [
            { text: 'Approach the altar', action: () => this.approachFinalAltar() }
        ]);
    }

    approachFinalAltar() {
        // Update game time to ending time
        this.updateGameTime('22:45');
        this.game.showDialogue('As you approach the altar, the ground begins to shake. The symbols on the altar emit a blinding light, and you feel your consciousness fading...', [
            { text: 'Accept everything', action: () => this.completeChapter() }
        ]);
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

        // Show result screen
        this.showResultScreen();
    }

    // Display death message with typewriter effect
    showDeath(message) {
        // Clear any ongoing typing animation
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
            this.typingInterval = null;
        }

        // Get death message element
        const deathMessageElement = this.game.elements.deathMessage;
        deathMessageElement.textContent = ''; // Clear text

        // Hide game screen and show death screen
        this.game.elements.gameScreen.classList.add('hidden');
        this.game.elements.deathScreen.classList.remove('hidden');

        let index = 0;
        const typeSpeed = 70; // Typing speed, 70ms per character

        // Start typing animation
        this.typingInterval = setInterval(() => {
            if (index < message.length) {
                deathMessageElement.textContent += message.charAt(index);
                index++;
            } else {
                clearInterval(this.typingInterval);
                this.typingInterval = null;
                // Show restart button
                setTimeout(() => {
                    this.game.elements.restartBtn.classList.remove('hidden');
                    this.game.elements.restartBtn.onclick = () => {
                        // Call game restart method
                        this.game.returnToMainMenu();
                    };
                }, 500);
            }
        }, typeSpeed);
    }

    // Update game time (ensure time can only move forward)
    updateGameTime(time) {
        // Parse current time and new time
        const currentTime = this.parseTime(this.game.gameState.gameTime || '21:30');
        const newTime = this.parseTime(time);

        // Only update if new time is later than current time
        if (newTime > currentTime) {
            this.game.gameState.gameTime = time;
        }
    }

    // Parse time string to minutes (for comparison)
    parseTime(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    // Result screen
    showResultScreen() {
        // Hide game screen, show result screen
        this.game.elements.gameScreen.classList.add('hidden');
        this.game.elements.resultScreen.classList.remove('hidden');

        // Display chapter name and completion time
        const chapterName = 'Chapter 1 - 「First Encounter」';
        const gameTime = this.game.gameState.gameTime || '22:30'; // Default value

        this.game.elements.resultChapter.textContent = chapterName;
        this.game.elements.resultTime.textContent = gameTime;

        // Show next chapter button
        const nextChapterBtn = this.game.elements.nextChapterBtn;
        nextChapterBtn.textContent = 'Enter Chapter 2';
        nextChapterBtn.classList.remove('hidden');
        nextChapterBtn.onclick = () => this.game.goToNextChapter();

        // Ensure Chapter 2 is unlocked
        setTimeout(() => {
            this.game.unlockChapter('chapter2');
        }, 500);
    }

    // Return to main menu
    returnToMainMenu() {
        // Hide result screen
        this.game.elements.resultScreen.classList.add('hidden');
        // Ensure Chapter 2 is unlocked
        this.game.unlockChapter('chapter2');
        // Force update chapter selection interface
        this.game.updateChapterAvailability();
        // Show chapter selection screen
        this.game.returnToChapterSelect();
    }
}

// Export Chapter1 class to window object for use in main game
window.Chapter1 = Chapter1;