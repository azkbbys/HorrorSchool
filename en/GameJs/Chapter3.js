class Chapter3 {
    constructor(game) {
        this.game = game;
        this.plotProgress = 0;
        this.artifactCollected = false;
        this.truthRevealed = false;
        this.typingInterval = null;
        this.friendSaved = false;
        this.symbolDeciphered = false;
    }

    playSound(soundName) {
        try {
            if (soundName === 'ding' && this.game.horrorDing) {
                this.game.horrorDing.currentTime = 0;
                this.game.horrorDing.play().catch(e => console.log('Sound playback failed:', e));
            } else if (soundName === 'horror' && this.game.horrorUp) {
                this.game.horrorUp.currentTime = 0;
                this.game.horrorUp.play().catch(e => console.log('Sound playback failed:', e));
            }
        } catch (error) {
            console.log('Sound playback error:', error);
        }
    }

    // Get correct pronouns for friend based on player gender
    getFriendPronoun(type) {
        // Check for abnormal genders
        const abnormalGenders = ['Walmart Shopping Bag', 'Attack Helicopter'];
        if (abnormalGenders.includes(this.game.gameState.playerGender)) {
            return 'it';
        }

        const isMale = this.game.gameState.playerGender === 'male';
        switch (type) {
            case 'subject': // Subject (he/she)
                return isMale ? 'he' : 'she';
            case 'object': // Object (him/her)
                return isMale ? 'him' : 'her';
            case 'possessive': // Possessive (his/her)
                return isMale ? 'his' : 'her';
            case 'pronoun': // Pronoun (he/she)
                return isMale ? 'he' : 'she';
            default:
                return isMale ? 'he' : 'she';
        }
    }

    // Get friend name based on player gender
    getFriendName() {
        const abnormalGenders = ['Walmart Shopping Bag', 'Attack Helicopter'];
        if (abnormalGenders.includes(this.game.gameState.playerGender)) {
            return Math.random() < 0.5 ? 'Woof Woof' : 'Meow Meow';
        }
        return this.game.gameState.playerGender === "male" ? "Jack" : "Anna";
    }

    // Typewriter effect for dialogue display
    showDialogue(text, choices) {
        // Use the game object's showDialogue method directly
        this.game.showDialogue(text, choices);
    }

    // Start Chapter 3
    start(startTime = null) {
        this.game.gameState.currentChapter = 'chapter3';
        // Initialize game time
        if (startTime) {
            this.updateGameTime(startTime);
        } else {
            this.updateGameTime('22:30'); // Default start time
        }
        // Add phone to inventory
        if (!this.game.gameState.inventory.includes('Phone')) {
            this.game.gameState.inventory.push('Phone');
            // Update inventory display
            this.game.updateInventoryDisplay();
        }

        // Check for badge, add automatically if missing
        if (!this.game.gameState.inventory.includes('Badge')) {
            this.game.gameState.inventory.push('Badge');
            // Update inventory display
            this.game.updateInventoryDisplay();
        }
        this.game.updateGameMap('schoolGate');
        this.plotProgress = 0;
        this.loadScene('schoolGate');
    }

    // Update game time
    updateGameTime(time) {
        this.game.gameState.gameTime = time;
        this.game.elements.currentTimeDisplay.textContent = time;
    }

    // Load scene
    loadScene(sceneName) {
        this.game.clearDialogue();

        switch (sceneName) {
            case 'schoolGate':
                this.showSchoolGateScene();
                break;
            case 'foyer':
                this.showFoyerScene();
                break;
            case 'abandonedWing':
                this.showAbandonedWingScene();
                break;
            case 'altarRoom':
                this.showAltarRoomScene();
                break;
            case 'friendRoom':
                this.showFriendRoomScene();
                break;
            case 'dormitory':
                this.showDormitoryScene();
                break;
            case 'labyrinth':
                this.showLabyrinthScene();
                break;
            default:
                this.showSchoolGateScene();
        }
    }

    // Dormitory scene
    showDormitoryScene() {
        this.game.gameState.currentScene = 'dormitory';
        this.game.updateGameMap('dormitory');
        const friendName = this.getFriendName();

        if (this.friendSaved) {
            this.showDialogue(`${friendName} paces back and forth in the dormitory, looking anxious. "What should we do next? Those things in the school are multiplying."`, [
                { text: 'Explore the teaching building together', action: () => this.loadScene('foyer') },
                { text: 'Investigate the old wing', action: () => this.loadScene('abandonedWing') }
            ]);
        } else {
            this.showDialogue(`The dormitory is empty, but you notice an open diary on ${friendName}'s bed. The last page reads: "I must go to the old wing. The truth is there."`, [
                { text: 'Go to the old wing', action: () => this.loadScene('abandonedWing') },
                { text: 'Return to the school gate', action: () => this.loadScene('schoolGate') }
            ]);
        }
    }

    // Friend's room scene
    showFriendRoomScene() {
        this.game.gameState.currentScene = 'friendRoom';
        this.game.updateGameMap('friendRoom');
        const friendName = this.getFriendName();

        if (this.friendSaved) {
            this.showDialogue(`${friendName}'s room is tidy, but there's a strange smell in the air. A photo of you two is on the desk, with the words 'Friends Forever' written on the back.`, [
                { text: `Talk to ${this.getFriendPronoun('object')}`, action: () => this.talkToFriend() },
                { text: 'Leave the room', action: () => this.enterSchool() }
            ]);
        } else {
            this.showDialogue(`This is ${friendName}'s room, but it's empty. The bed is messy, as if the owner left in a hurry. There's a diary on the desk; the last page reads: 'I saw red eyes...'`, [
                { text: 'Check the diary', action: () => this.readFriendDiary() },
                { text: 'Leave the room', action: () => this.enterSchool() }
            ]);
        }
    }

    talkToFriend() {
        const friendName = this.getFriendName();
        this.showDialogue(`${friendName} looks exhausted: "I still can't believe what happened. That shadow... it's been following me."`, [
            { text: `Comfort ${this.getFriendPronoun('object')}`, action: () => this.comfortFriend() },
            { text: 'Explore the school together', action: () => this.exploreWithFriend() }
        ]);
    }

    readFriendDiary() {
        const friendName = this.getFriendName();
        this.showDialogue(`The diary records ${friendName}'s recent experiences: "I've been having nightmares about red eyes and black shadows. Today I saw strange symbols in the old teaching building; they seemed to be summoning something..."`, [
            { text: 'Continue reading', action: () => this.continueReadingDiary() },
            { text: 'Leave the room', action: () => this.enterSchool() }
        ]);
    }

    comfortFriend() {
        const friendName = this.getFriendName();
        this.showDialogue(`${friendName} forces a smile: "Thank you, I feel better with you here."`, [
            { text: 'Leave the school together', action: () => this.leaveWithFriend() },
            { text: 'Explore the school together', action: () => this.exploreWithFriend() }
        ]);
    }

    continueReadingDiary() {
        const friendName = this.getFriendName();
        this.showDialogue(`The last few pages of the diary are torn out, leaving only one sentence: "October 13th, the altar will awaken again..."`, [
            { text: 'Leave the room', action: () => this.enterSchool() }
        ]);
    }

    // School gate scene
    showSchoolGateScene() {
        this.game.gameState.currentScene = 'schoolGate';
        this.game.updateGameMap('schoolGate');

        if (this.plotProgress === 0) {
            this.showDialogue('You rush out of the school gate only to find the streets deserted. The streetlights flicker, and shadows on the ground twist into distorted shapes. Looking back, the school\'s silhouette appears menacing in the night.', [
                { text: 'Return to the school', action: () => this.enterSchool() },
                { text: 'Check phone', action: () => this.checkPhone() }
            ]);
        } else if (this.plotProgress === 1) {
            this.showDialogue('You stand at the school gate, hesitating whether to re-enter this terrifying place. Suddenly, you hear footsteps behind you.', [
                { text: 'Turn around to look', action: () => this.seeWhoIsThere() },
                { text: 'Quickly enter the school', action: () => this.enterSchool() }
            ]);
        }
    }

    checkPhone() {
        if (this.game.gameState.inventory.includes('Phone')) {
            this.showDialogue('You take out your phone and find no signal. Photos in the gallery are distorted, with all faces blacked out. The last photo is a panorama of the school with a glowing red dot in the center.', [
                { text: 'Return to the school', action: () => this.enterSchool() },
                { text: 'Investigate the red dot location', action: () => this.investigateRedDot() }
            ]);
        } else {
            this.showDialogue('You don\'t have a phone.', [
                { text: 'Return to the school', action: () => this.enterSchool() }
            ]);
        }
    }

    seeWhoIsThere() {
        this.plotProgress = 2;
        const friendName = this.getFriendName();
        this.showDialogue(`You turn around and see ${friendName} standing behind you, face pale. ${this.getFriendPronoun('subject')} eyes have no pupils, replaced by flickering red light.
"You... you can't leave..." ${friendName}'s voice becomes hoarse, inhuman.`, [
            { text: 'What happened to you?', action: () => this.askFriendCondition() },
            { text: 'Back away', action: () => this.backAwayFromFriend() }
        ]);
    }

    enterSchool() {
        this.game.updateGameMap('foyer');
        this.showDialogue('You push the school gate open; the creaking sound is particularly piercing in the silent night. The interior looks different from before - red mist fills the corridors, and portraits on the walls have turned into skulls.', [
            { text: 'Go to the teaching building', action: () => this.loadScene('foyer') },
            { text: 'Go to the dormitory', action: () => this.loadScene('dormitory') }
        ]);
    }

    investigateRedDot() {
        this.plotProgress = 1;
        this.showDialogue('The red dot appears to be at the school\'s old teaching building, which has been abandoned for years. You recall the "Restricted Area" mark on the warehouse map in Chapter 2 was exactly the old teaching building.', [
            { text: 'Go to the old teaching building', action: () => this.loadScene('abandonedWing') },
            { text: 'Return to the school', action: () => this.enterSchool() }
        ]);
    }

    askFriendCondition() {
        const friendName = this.getFriendName();
        this.showDialogue(`${friendName} lets out a piercing laugh: "Me? I'm fine... just... I finally found a new host..."
${this.getFriendPronoun('subject')} body begins to twist, something writhing beneath the skin.`, [
            { text: `Try to wake ${this.getFriendPronoun('object')} up`, action: () => this.tryToWakeFriend() },
            { text: 'Run away', action: () => this.enterSchool() }
        ]);
    }

    backAwayFromFriend() {
        const friendName = this.getFriendName();
        this.showDialogue(`You step back, ${friendName} closing in. ${this.getFriendPronoun('subject')} nails grow long and sharp, the red light in ${this.getFriendPronoun('possessive')} eyes intensifying.`, [
            { text: 'Use badge', action: () => this.useBadgeAgainstFriend() },
            { text: 'Run away', action: () => this.enterSchool() }
        ]);
    }

    tryToWakeFriend() {
        const friendName = this.getFriendName();
        if (this.game.gameState.inventory.includes('Photo')) {
            this.showDialogue(`You show the photo ${friendName} dropped: "Remember this? We're friends!"
${friendName} suddenly freezes, the red light in ${this.getFriendPronoun('possessive')} eyes flickering: "Friends...?"
${this.getFriendPronoun('subject')} body begins to tremble, as if struggling.`, [
                { text: 'Continue waking', action: () => this.continueWakingFriend() },
                { text: `Take ${this.getFriendPronoun('object')} away`, action: () => this.leaveWithFriend() }
            ]);
        } else {
            this.showDialogue(`${friendName}'s attack doesn't stop; ${this.getFriendPronoun('subject')} seems to have completely lost ${this.getFriendPronoun('possessive')} mind.`, [
                { text: 'Use badge', action: () => this.useBadgeAgainstFriend() },
                { text: 'Run away', action: () => this.enterSchool() }
            ]);
        }
    }

    useBadgeAgainstFriend() {
        if (this.game.gameState.inventory.includes('Badge')) {
            const friendName = this.getFriendName();
            this.showDialogue(`You pull out the badge; it emits a strong light. ${friendName} screams and collapses. A black shadow floats out of ${this.getFriendPronoun('possessive')} body and disappears into the night.
${friendName} slowly opens ${this.getFriendPronoun('possessive')} eyes, back to normal: "What happened? I... I just had a nightmare."`, [
                { text: `Take ${this.getFriendPronoun('object')} away`, action: () => this.leaveWithFriend() },
                { text: 'Explore the school together', action: () => this.exploreWithFriend() }
            ]);
            this.friendSaved = true;
        } else {
            this.showDialogue(`You don't have a badge.`, [
                { text: 'Run away', action: () => this.enterSchool() }
            ]);
        }
    }

    // Foyer scene
    showFoyerScene() {
        this.game.gameState.currentScene = 'foyer';
        this.game.updateGameMap('foyer');
        this.showDialogue('A giant symbol is carved on the floor of the teaching building foyer, identical to the one you saw on the key and badge. There\'s a groove in the center of the symbol, seemingly for placing something.', [
            { text: 'Place badge', action: () => this.placeBadge() },
            { text: 'Explore the teaching building', action: () => this.exploreFoyer() },
            { text: 'Leave the foyer', action: () => this.enterSchool() }
        ]);
    }

    placeBadge() {
        if (this.game.gameState.inventory.includes('Badge')) {
            this.symbolDeciphered = true;
            this.showDialogue('You place the badge into the groove; it fits perfectly. The symbol glows brightly, the ground begins to shake. A new entrance to the underground appears on the foyer wall.', [
                { text: 'Enter the underground entrance', action: () => this.loadScene('labyrinth') },
                { text: 'Continue exploring the foyer', action: () => this.exploreFoyer() }
            ]);
        } else {
            this.showDialogue(`You don't have a badge.`, [
                { text: 'Explore the teaching building', action: () => this.exploreFoyer() }
            ]);
        }
    }

    exploreFoyer() {
        // Add ancient scroll to inventory (avoid duplicates)
        if (!this.game.gameState.inventory.includes('Ancient Scroll')) {
            this.game.gameState.inventory.push('Ancient Scroll');
            // Update inventory display
            this.game.updateInventoryDisplay();
        }
        this.showDialogue('You find an ancient scroll in the corner of the foyer. It records the school\'s history: "This school was established in 1923 on the site of an ancient altar. Every October 13th, a soul must be sacrificed to appease the altar\'s wrath."', [
            { text: 'Keep the scroll', action: () => this.keepScroll() },
            { text: 'Enter the underground entrance', action: () => this.loadScene('labyrinth') }
        ]);
    }

    // Abandoned wing scene
    showAbandonedWingScene() {
        this.game.gameState.currentScene = 'abandonedWing';
        this.game.updateGameMap('abandonedWing');
        this.showDialogue('The old teaching building is dilapidated, with severely rotten floors and cobweb-covered walls. A foul smell permeates the air.', [
            { text: 'Explore classrooms', action: () => this.exploreClassroom() },
            { text: 'Go to the rooftop', action: () => this.goToRoof() },
            { text: 'Leave the old wing', action: () => this.enterSchool() }
        ]);
    }

    exploreClassroom() {
        // Add ritual dagger to inventory (avoid duplicates)
        if (!this.game.gameState.inventory.includes('Ritual Dagger')) {
            this.game.gameState.inventory.push('Ritual Dagger');
            // Update inventory display
            this.game.updateInventoryDisplay();
        }
        this.showDialogue('The desks in the classroom are covered with strange symbols. A rusty dagger lies on the podium, stained with dark red marks. A line written in blood is on the wall: "October 13th, they will come".', [
            { text: 'Pick up the dagger', action: () => this.takeDagger() },
            { text: 'Leave the classroom', action: () => this.showAbandonedWingScene() }
        ]);
    }

    goToRoof() {
        this.showDialogue('You reach the rooftop and find a small altar. A skull with glowing green eyes rests on it.', [
            { text: 'Examine the altar', action: () => this.examineRoofAltar() },
            { text: 'Leave the rooftop', action: () => this.showAbandonedWingScene() }
        ]);
    }

    examineRoofAltar() {
        if (this.game.gameState.inventory.includes('Ancient Scroll')) {
            this.truthRevealed = true;
            this.showDialogue('You unroll the scroll and compare it to the symbols on the altar. The text on the scroll begins to glow: "The key to breaking the cycle lies in sacrificing the sacrificer, not the innocent."', [
                { text: 'Understand the meaning', action: () => this.understandScroll() },
                { text: 'Leave the rooftop', action: () => this.showAbandonedWingScene() }
            ]);
        } else {
            this.showDialogue('The symbols on the altar mean nothing to you.', [
                { text: 'Leave the rooftop', action: () => this.showAbandonedWingScene() }
            ]);
        }
    }

    // Labyrinth scene
    showLabyrinthScene() {
        this.game.gameState.currentScene = 'labyrinth';
        this.game.updateGameMap('labyrinth');
        this.showDialogue('The underground labyrinth is complex, with walls covered in symbols identical to the badge. There are three differently colored doors on the ground: red, blue, and green.', [
            { text: 'Enter red door', action: () => this.enterRedDoor() },
            { text: 'Enter blue door', action: () => this.enterBlueDoor() },
            { text: 'Enter green door', action: () => this.enterGreenDoor() }
        ]);
    }

    enterRedDoor() {
        this.showDialogue('Behind the red door is a room filled with flames. In the center is a brazier with eternal fire burning.', [
            { text: 'Touch the flame', action: () => this.touchFire() },
            { text: 'Return to labyrinth', action: () => this.showLabyrinthScene() }
        ]);
    }

    enterBlueDoor() {
        this.showDialogue('Behind the blue door is a room filled with water. A black lotus floats in a pool in the center.', [
            { text: 'Touch the lotus', action: () => this.touchLotus() },
            { text: 'Return to labyrinth', action: () => this.showLabyrinthScene() }
        ]);
    }

    enterGreenDoor() {
        this.showDialogue('Behind the green door is a room filled with plants. A giant tree stands in the center, covered with red fruits.', [
            { text: 'Pick fruit', action: () => this.pickFruit() },
            { text: 'Return to labyrinth', action: () => this.showLabyrinthScene() }
        ]);
    }

    // Altar room scene
    showAltarRoomScene() {
        this.game.gameState.currentScene = 'altarRoom';
        this.game.updateGameMap('altarRoom');
        this.showDialogue(`You arrive at a massive underground altar room. Tied to the central altar is a person - it's ${this.getFriendName()}! A figure in a black robe stands before the altar, holding a dagger.
"Finally, the time for sacrifice has come!" The robed figure lets out a hoarse laugh.`, [
            { text: 'Stop the sacrifice', action: () => this.stopSacrifice() },
            { text: 'Look for a weapon', action: () => this.findWeapon() }
        ]);
    }

    stopSacrifice() {
        if (this.game.gameState.inventory.includes('Ritual Dagger')) {
            this.showDialogue(`You charge at the robed figure, stabbing ${this.getFriendPronoun('object')} with the dagger. The figure screams and turns into a wisp of black smoke.
${this.getFriendName()} collapses to the ground, unconscious. The altar begins to crumble, the whole room shaking.`, [
                { text: `Take ${this.getFriendPronoun('object')} away`, action: () => this.escapeWithFriend() },
                { text: 'Look for an exit', action: () => this.findExit() }
            ]);
        } else {
            this.showDialogue(`You charge at the robed figure, but ${this.getFriendPronoun('subject')} simply flicks a sleeve and sends you flying.`, [
                { text: 'Look for a weapon', action: () => this.findWeapon() },
                { text: 'Use badge', action: () => this.useBadgeAgainstCultist() }
            ]);
        }
    }

    // Complete chapter
    completeChapter() {
        // Play eerie background music instead of scream
        const ambientSound = document.getElementById('horror-ambient');
        if (ambientSound) {
            ambientSound.currentTime = 0;
            ambientSound.play().catch(error => {
                console.error('Failed to play ambient sound:', error);
            });

            // Gradually lower volume after 10 seconds
            setTimeout(() => {
                if (!ambientSound.paused) {
                    let volume = 1.0;
                    const fadeInterval = setInterval(() => {
                        volume -= 0.1;
                        ambientSound.volume = volume;
                        if (volume <= 0) {
                            clearInterval(fadeInterval);
                            ambientSound.pause();
                        }
                    }, 500);
                }
            }, 10000);
        }

        // Unlock Chapter 4
        this.game.unlockChapter('chapter4');

        // Show result screen
        this.showResultScreen();
    }

    // Show result screen
    showResultScreen() {
        this.game.elements.gameScreen.classList.add('hidden');
        this.game.elements.resultScreen.classList.remove('hidden');

        // Display chapter name and completion time
        const chapterName = 'Chapter 3 - 「Eternal Night Descent」';
        this.game.elements.resultChapter.textContent = chapterName;
        this.game.elements.resultTime.textContent = this.game.gameState.gameTime;

        // Add dark ending hint
        const resultDescription = this.game.elements.resultDescription;
        if (resultDescription) {
            resultDescription.textContent = 'You thought this was the end? No, this is just the beginning. The curse continues, the cycle remains unbroken...';
            resultDescription.style.color = '#ff3333';
            resultDescription.style.fontStyle = 'italic';
        }

        // Change next chapter button to enter Chapter 4 button
        this.game.elements.nextChapterBtn.textContent = 'Enter Chapter 4';
        this.game.elements.nextChapterBtn.classList.remove('hidden');
        this.game.elements.nextChapterBtn.onclick = () => {
            this.game.startChapter('chapter4');
        };
    }

    // Helper methods below
    keepScroll() {
        this.showDialogue('You put away the scroll. This history is too dark; you must stop the impending tragedy.', [
            { text: 'Enter the underground entrance', action: () => this.loadScene('labyrinth') }
        ]);
    }

    takeDagger() {
        this.showDialogue('You pick up the dagger, feeling a chill travel from the dagger to your arm.', [
            { text: 'Leave the classroom', action: () => this.showAbandonedWingScene() }
        ]);
    }

    understandScroll() {
        this.showDialogue('You finally understand how to save the school. The one performing the sacrifice must be sacrificed, not an innocent student.', [
            { text: 'Go to the underground altar', action: () => this.loadScene('labyrinth') }
        ]);
    }

    touchFire() {
        if (this.symbolDeciphered) {
            this.artifactCollected = true;
            if (!this.game.gameState.inventory.includes('Fire Artifact')) {
                this.game.gameState.inventory.push('Fire Artifact');
                // Update inventory display
                this.game.updateInventoryDisplay();
            }
            this.playSound('ding');
            this.showDialogue('You touch the flame; it transforms into a red gem that flies into your hand. The gem bears the same symbol as the badge.', [
                { text: 'Return to labyrinth', action: () => this.showLabyrinthScene() }
            ]);
        } else {
            this.playSound('horror');
            this.showDeath('The flame burns your hand, and you scream in pain. The fire suddenly intensifies, engulfing you...');
        }
    }

    touchLotus() {
        if (this.symbolDeciphered) {
            this.artifactCollected = true;
            if (!this.game.gameState.inventory.includes('Water Artifact')) {
                this.game.gameState.inventory.push('Water Artifact');
                // Update inventory display
                this.game.updateInventoryDisplay();
            }
            this.playSound('ding');
            this.showDialogue('You touch the lotus; it transforms into a blue gem that flies into your hand. The gem bears the same symbol as the badge.', [
                { text: 'Return to labyrinth', action: () => this.showLabyrinthScene() }
            ]);
        } else {
            this.playSound('horror');
            this.showDeath('The lotus suddenly blooms, spraying black venom that corrodes you...');
        }
    }

    pickFruit() {
        if (this.symbolDeciphered) {
            this.artifactCollected = true;
            if (!this.game.gameState.inventory.includes('Life Artifact')) {
                this.game.gameState.inventory.push('Life Artifact');
                // Update inventory display
                this.game.updateInventoryDisplay();
            }
            this.playSound('ding');
            this.showDialogue('You pick the fruit; it transforms into a green gem that flies into your hand. The gem bears the same symbol as the badge.', [
                { text: 'Return to labyrinth', action: () => this.showLabyrinthScene() }
            ]);
        } else {
            this.playSound('horror');
            this.showDeath('The fruit suddenly bursts, releasing toxic gas. You struggle to breathe...');
        }
    }

    findWeapon() {
        if (this.game.gameState.inventory.includes('Ritual Dagger')) {
            this.showDialogue('You already have a dagger.', [
                { text: 'Stop the sacrifice', action: () => this.stopSacrifice() }
            ]);
        } else {
            this.showDialogue('You can\'t find any usable weapons in the room. The altar continues to crumble; the situation is critical.', [
                { text: 'Use badge', action: () => this.useBadgeAgainstCultist() },
                { text: 'Try to save friend', action: () => this.stopSacrifice() }
            ]);
        }
    }

    useBadgeAgainstCultist() {
        if (this.game.gameState.inventory.includes('Badge')) {
            this.showDialogue(`You pull out the badge; it emits a strong light. The robed figure screams and turns into a wisp of black smoke.
${this.getFriendName()} collapses to the ground, unconscious. The altar begins to crumble, the whole room shaking.`, [
                { text: `Take ${this.getFriendPronoun('object')} away`, action: () => this.escapeWithFriend() },
                { text: 'Look for an exit', action: () => this.findExit() }
            ]);
        } else {
            this.showDialogue(`You don't have a badge.`, [
                { text: 'Try to save friend', action: () => this.stopSacrifice() }
            ]);
        }
    }

    escapeWithFriend() {
        this.friendSaved = true;
        this.showDialogue(`You carry ${this.getFriendName()} on your back and find an exit before the altar completely collapses. You escape the school, but the sky remains pitch black with no sign of dawn.
${this.getFriendName()} slowly regains consciousness, eyes vacant: "Thank you... but it's not over yet..."
You look down and see the same symbol as the school badge slowly appearing on ${this.getFriendPronoun('possessive')} neck. You know the curse will never end.`, [
            { text: 'Complete Chapter 3', action: () => this.completeChapter() }
        ]);
    }

    findExit() {
        this.showDialogue(`You find an exit before the altar collapses. You escape the school, but the sky remains shrouded in darkness.
Looking back, the school's silhouette twists and distorts in the night, like a giant monster watching you. You know you haven't truly escaped, only temporarily left that hell.
And that badge still glows faintly in your pocket...`, [
            { text: 'Complete Chapter 3', action: () => this.completeChapter() }
        ]);
    }

    continueWakingFriend() {
        const friendName = this.getFriendName();
        this.showDialogue(`${friendName}'s body trembles more violently: "Friends... yes... we're friends..."
The black shadow slowly floats out of ${this.getFriendPronoun('possessive')} body and disappears into the night.
${friendName} collapses to the ground, unconscious.`, [
            { text: `Take ${this.getFriendPronoun('object')} away`, action: () => this.leaveWithFriend() },
            { text: 'Explore the school together', action: () => this.exploreWithFriend() }
        ]);
        this.friendSaved = true;
    }

    leaveWithFriend() {
        this.friendSaved = true;
        this.showDialogue(`You carry ${this.getFriendName()} on your back and leave the school. The sky remains pitch black with no sign of dawn. ${this.getFriendName()}'s body grows colder; you know something has changed forever...`, [
            { text: 'Complete Chapter 3', action: () => this.completeChapter() }
        ]);
    }

    exploreWithFriend() {
        const friendName = this.getFriendName();
        this.showDialogue(`${friendName}, though still weak, decides to explore the school with you: "We must find the truth, or more people will suffer."`, [
            { text: 'Go to the old teaching building', action: () => this.loadScene('abandonedWing') },
            { text: 'Go to the underground labyrinth', action: () => this.loadScene('labyrinth') }
        ]);
    }

    // Typewriter effect for death message
    showDeath(message) {
        this.playSound('horror');
        // Clear ongoing typing animation
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
        const typeSpeed = 70; // Typing speed, 70ms/character

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
}

// Export Chapter3 class to window object for use in main game
window.Chapter3 = Chapter3;