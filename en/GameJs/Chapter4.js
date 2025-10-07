class Chapter4 {
    constructor(game) {
        this.game = game;
        this.plotProgress = 0;
        this.escapeTimer = null;
        this.clickCount = 0;
        this.requiredClicks = 15; // Required number of clicks
        this.clickTimeLimit = 5000; // Click time limit (milliseconds)
        this.isPuzzleActive = false;
        this.typingInterval = null;
    }

    // Start Chapter 4
    start(startTime = null) {
        this.game.gameState.currentChapter = `chapter4`;
        this.plotProgress = 0;
        // Initialize game time
        if (startTime) {
            this.updateGameTime(startTime);
        } else {
            this.updateGameTime(`23:30`); // Default start time
        }
        // Ensure the player has the badge
        if (!this.game.gameState.inventory.includes(`Badge`)) {
            this.game.gameState.inventory.push(`Badge`);
            this.game.updateInventoryDisplay();
        }
        this.loadScene(`outsideSchool`);
    }

    loadScene(sceneName) {
        this.game.gameState.currentScene = sceneName;
        this.game.updateGameMap(sceneName);
        this.game.elements.gameMap.innerHTML = ``; // Clear map
        this.game.elements.gameActions.innerHTML = ``; // Clear action buttons
        this.game.elements.dialogueChoices.innerHTML = ``; // Clear dialogue choices

        switch (sceneName) {
            case `outsideSchool`:
                this.showOutsideSchoolScene();
                break;
            case `forestPath`:
                this.showForestPathScene();
                break;
            case `abandonedHouse`:
                this.showAbandonedHouseScene();
                break;
            case `cemetery`:
                this.showCemeteryScene();
                break;
            case `schoolLogistics`:
                this.showSchoolLogisticsScene();
                break;
            default:
                this.showDialogue(`Unknown Scene`, [{ text: `Return to School`, action: () => this.loadScene(`outsideSchool`) }]);
        }
    }

    showOutsideSchoolScene() {
        // Create outside school scene
        const sceneDescription = document.createElement(`div`);
        sceneDescription.className = `scene-description`;
        sceneDescription.innerHTML = `
            <p>You finally escaped the school, but the curse hasn't ended.</p>
            <p>The streets outside the campus are shrouded in an eerie black mist, streetlights flickering erratically, stretching your shadow long.</p>
            <p>You feel your pocket; the badge is still there, emitting a faint glow.</p>
        `;
        this.game.elements.gameMap.appendChild(sceneDescription);

        // Add scene image (resources pending)
        // const sceneImage = document.createElement(`img`);
        // sceneImage.src = `assets/img/outside-school.png`;
        // sceneImage.alt = `Outside School`;
        // sceneImage.className = `scene-image`;
        // this.game.elements.gameMap.appendChild(sceneImage);

        // Play ambient sound effect
        this.playSound(`ambient`);

        if (this.plotProgress === 0) {
            this.showDialogue(`You stand at the school gate, gasping for breath. The school behind you looms in the black mist like a monster waiting to devour its prey.`, [
                { text: `Look Around`, action: () => this.examineSurroundings() },
                { text: `Try to Contact Outside`, action: () => this.tryContactOutside() }
            ]);
        }
    }

    examineSurroundings() {
        this.plotProgress = 1;
        this.showDialogue(`The streets are empty, all shops are closed. At the crossroads not far away, a blurry figure seems to be moving.`, [
            { text: `Walk to the Crossroads`, action: () => this.walkToCrossroad() },
            { text: `Stay Put`, action: () => this.stayInPlace() }
        ]);
    }

    tryContactOutside() {
        this.plotProgress = 2;
        if (this.game.gameState.inventory.includes(`Phone`)) {
            this.showDialogue(`You take out your phone, finding no signal. Suddenly, a line of blood-red text appears on the screen: "Nowhere to escape."`, [
                { text: `Give Up Contacting`, action: () => this.examineSurroundings() }
            ]);
        } else {
            this.showDialogue(`You have no means to contact the outside world.`, [
                { text: `Look Around`, action: () => this.examineSurroundings() }
            ]);
        }
    }

    walkToCrossroad() {
        this.plotProgress = 3;
        const friendName = this.getFriendName();
        const pronoun = this.getFriendPronoun(`pronoun`);
        this.showDialogue(`You slowly walk towards the crossroads, the figure becoming clearer. As you approach, you recognize the figure - it's ${friendName}! But ${pronoun} eyes are hollow, and ${pronoun} is slowly walking towards you.`, [
            { text: `Call ${pronoun}`, action: () => this.callFriend() },
            { text: `Turn and Run`, action: () => this.runAway() }
        ]);
    }

    stayInPlace() {
        this.plotProgress = 4;
        this.showDialogue(`You decide to stay put and observe the surroundings. The black mist thickens, and you feel a chill. Suddenly, you hear footsteps behind you...`, [
            { text: `Turn Around`, action: () => this.turnAround() },
            { text: `Run for Your Life`, action: () => this.runAway() }
        ]);
    }

    callFriend() {
        this.plotProgress = 5;
        const friendName = this.getFriendName();
        const pronounObj = this.getFriendPronoun(`object`);
        const pronounSub = this.getFriendPronoun(`subject`);
        this.showDialogue(`"${friendName}! It's me!" you call out loudly. But ${pronounSub} doesn't respond, continuing to walk towards you. When ${pronounSub} reaches you, you notice a familiar symbol on ${pronounSub} neck - the same as the one on the school badge!`, [
            { text: `Try to Wake ${pronounObj}`, action: () => this.attemptToWakeFriend() },
            { text: `Back Away`, action: () => this.backAway() }
        ]);
    }


    attemptToWakeFriend() {
        this.plotProgress = 6;
        const pronounObj = this.getFriendPronoun(`object`);
        const pronounSub = this.getFriendPronoun(`subject`);
        this.showDialogue(`You reach out to touch ${pronounObj} shoulder, but ${pronounSub} suddenly grabs your hand with terrifying strength. ${pronounSub} mouth emits a low voice: "Stay with me... forever..."`, [
            { text: `Break Free`, action: () => this.startEscapePuzzle() }
        ]);
    }

    startEscapePuzzle() {
        this.isPuzzleActive = true;
        this.clickCount = 0;
        this.game.elements.dialogueChoices.innerHTML = ``;

        const friendName = this.getFriendName();
        this.showDialogue(`${friendName}'s grip is getting stronger!`, []);

        // Create QTE container
        const qteContainer = document.createElement('div');
        qteContainer.id = 'escape-qte-container';
        qteContainer.className = 'qte-container';

        const qteText = document.createElement('p');
        qteText.className = 'qte-text';
        qteText.textContent = `Quickly click to break free from ${friendName}'s hand! Clicked 0/${this.requiredClicks} times`;
        qteContainer.appendChild(qteText);

        // Create QTE button
        const qteButton = document.createElement('button');
        qteButton.id = 'escape-button';
        qteButton.className = 'big-button';
        qteButton.textContent = '💪 Quick Click to Break Free';
        qteContainer.appendChild(qteButton);

        const timerBar = document.createElement('div');
        timerBar.className = 'timer-bar';
        timerBar.style.width = '100%';
        qteContainer.appendChild(timerBar);

        // Add to game interface
        this.game.elements.gameActions.appendChild(qteContainer);

        // QTE parameters
        const requiredClicks = this.requiredClicks;
        const timeLimit = this.clickTimeLimit; // 5000 milliseconds
        const startTime = Date.now();

        // Update timer
        const updateTimer = () => {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, timeLimit - elapsedTime);
            const percentage = (remainingTime / timeLimit) * 100;
            timerBar.style.width = `${percentage}%`;

            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                this.game.elements.gameActions.removeChild(qteContainer);
                this.escapeFailed();
            }
        };

        const timerInterval = setInterval(updateTimer, 50);
        updateTimer();

        // Button click event
        qteButton.addEventListener('click', () => {
            if (this.isPuzzleActive) {
                this.clickCount++;
                qteText.textContent = `Quickly click to break free from ${friendName}'s hand! Clicked ${this.clickCount}/${requiredClicks} times`;

                // If required clicks reached, puzzle success
                if (this.clickCount >= requiredClicks) {
                    clearInterval(timerInterval);
                    this.game.elements.gameActions.removeChild(qteContainer);
                    this.escapeSuccess();
                }
            }
        });
    }

    escapeSuccess() {
        this.isPuzzleActive = false;
        clearInterval(this.escapeTimer);
        this.game.elements.dialogueText.innerHTML = ``;

        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.showDialogue(`You successfully broke free from ${friendName}'s grasp! ${pronounSub} lets out a scream and falls to the ground. You seize the chance to run towards the forest.`, [
            { text: `Flee to the Forest`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    escapeFailed() {
        this.isPuzzleActive = false;
        clearInterval(this.escapeTimer);
        this.game.elements.dialogueText.innerHTML = ``;

        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.game.showDeath(`${friendName}'s hand grips you tightly, a chill spreading through your body. Everything goes black, and you lose consciousness...`);
    }

    backAway() {
        this.plotProgress = 7;
        const friendName = this.getFriendName();
        const pronoun = this.getFriendPronoun(`subject`);
        this.showDialogue(`You slowly back away, ${friendName} continues to approach. Suddenly, ${pronoun} speeds up and lunges at you!`, [
            { text: `Turn and Run`, action: () => this.runAway() }
        ]);
    }

    runAway() {
        this.plotProgress = 8;
        this.showDialogue(`You turn and run, not daring to look back. You don't know how long you've been running until you dash into a forest.`, [
            { text: `Continue Forward`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    turnAround() {
        this.plotProgress = 9;
        this.playSound(`horror`);
        this.showDialogue(`You slowly turn around and see a figure in a black robe standing behind you. His face is hidden by the hood, only a pair of red-glowing eyes are visible.`, [
            { text: `Run Away`, action: () => this.runAway() },
            { text: `Try to Communicate`, action: () => this.tryToCommunicate() }
        ]);
    }

    tryToCommunicate() {
        this.plotProgress = 10;
        this.game.playSound(`horror`);
        this.showDialogue(`"Who are you? What do you want?" you ask bravely. The robed man doesn't answer, just points at your pocket. You realize he wants the badge...`, [
            { text: `Hand Over the Badge`, action: () => this.giveBadge() },
            { text: `Refuse`, action: () => this.refuseToGiveBadge() }
        ]);
    }

    giveBadge() {
        this.plotProgress = 11;
        if (this.game.gameState.inventory.includes(`Badge`)) {
            // Remove badge
            this.game.gameState.inventory = this.game.gameState.inventory.filter(item => item !== `Badge`);
            this.game.updateInventoryDisplay();

            this.showDialogue(`Reluctantly, you hand over the badge. The robed man takes it and lets out a bone-chilling laugh. "The game has just begun..." he says before disappearing into the black mist.`, [
                { text: `Enter the Forest`, action: () => this.loadScene(`forestPath`) }
            ]);
        } else {
            this.showDialogue(`You have no badge to give. The robed man seems angry, his eyes growing redder...`, [
                { text: `Run Away`, action: () => this.runAway() }
            ]);
        }
    }

    refuseToGiveBadge() {
        this.plotProgress = 12;
        this.game.playSound(`horror`);
        this.showDeath(`The robed man lets out a roar, the black mist instantly engulfing you. You feel excruciating pain, then know nothing more...`);
    }

    showForestPathScene() {
        // Create forest path scene
        const sceneDescription = document.createElement(`div`);
        sceneDescription.className = `scene-description`;
        sceneDescription.innerHTML = `
            <p>You run into an ancient forest, trees tall and straight, branches and leaves so dense they almost block the sky.</p>
            <p>Moonlight filters through the gaps in the leaves, creating dappled patterns on the ground. The air is filled with the smell of damp earth.</p>
            <p>You hear the sound of flowing water in the distance, and some strange noises, like breaking branches, or whispers.</p>
        `;
        this.game.elements.gameMap.appendChild(sceneDescription);

        // Add scene image (resources pending)
        // const sceneImage = document.createElement(`img`);
        // sceneImage.src = `assets/img/forest-path.png`;
        // sceneImage.alt = `Forest Path`;
        // sceneImage.className = `scene-image`;
        // this.game.elements.gameMap.appendChild(sceneImage);

        // Check if already know about cemetery
        const knowsAboutCemetery = this.plotProgress >= 27; // 27 is the progress after hearing about cemetery from portrait

        if (knowsAboutCemetery) {
            this.showDialogue(`You stand at the forest entrance, unsure which way to go. You notice three distinct paths on the ground: one leading deep inside, one seemingly towards a river, and one faintly leading to a distant cemetery.`, [
                { text: `Take the Deep Path`, action: () => this.goDeepIntoForest() },
                { text: `Go to the River`, action: () => this.goToRiver() },
                { text: `Go to the Cemetery`, action: () => this.goToCemetery() }
            ]);
        } else {
            this.showDialogue(`You stand at the forest entrance, unsure which way to go. You notice two distinct paths on the ground: one leading deep inside, the other seemingly towards a river.`, [
                { text: `Take the Deep Path`, action: () => this.goDeepIntoForest() },
                { text: `Go to the River`, action: () => this.goToRiver() }
            ]);
        }
    }

    // Go to Cemetery
    goToCemetery() {
        this.plotProgress = 28;
        this.loadScene(`cemetery`);
    }

    // Cemetery Scene
    showCemeteryScene() {
        // Create cemetery scene
        const sceneDescription = document.createElement(`div`);
        sceneDescription.className = `scene-description`;
        sceneDescription.innerHTML = `
            <p>You follow the faint path to an abandoned cemetery. Tombstones are tilted, inscriptions faded and illegible.</p>
            <p>The air carries a foul, rotting smell. Crows caw on distant trees.</p>
            <p>In the center of the cemetery is a strange altar, something glowing seems to be placed on it.</p>
        `;
        this.game.elements.gameMap.appendChild(sceneDescription);

        // Add scene image (resources pending)
        // const sceneImage = document.createElement(`img`);
        // sceneImage.src = `assets/img/cemetery.png`;
        // sceneImage.alt = `Abandoned Cemetery`;
        // sceneImage.className = `scene-image`;
        // this.game.elements.gameMap.appendChild(sceneImage);

        this.playSound(`ambient`);
        this.showDialogue(`You stand before the cemetery, feeling a chill. The glow from the altar draws you, but you also feel a sense of unease.`, [
            { text: `Approach the Altar`, action: () => this.approachAltar() },
            { text: `Leave the Cemetery`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    // Approach Altar
    approachAltar() {
        this.plotProgress = 29;
        this.showDialogue(`You slowly approach the altar and find a black box on it. The box is carved with intricate symbols, somewhat similar to those on the school badge.`, [
            { text: `Open the Box`, action: () => this.openBox() },
            { text: `Don't Touch the Box`, action: () => this.loadScene(`cemetery`) }
        ]);
    }

    // Open Box to get Dark Artifact
    openBox() {
        this.plotProgress = 30;
        this.showDialogue(`You carefully open the box. Inside lies a black stone emitting a faint purple glow. This must be the Dark Artifact!`, [
            { text: `Take the Artifact`, action: () => this.obtainDarkArtifact() }
        ]);
    }

    // Obtain Dark Artifact
    obtainDarkArtifact() {
        this.plotProgress = 31;
        if (!this.game.gameState.inventory.includes(`Dark Artifact`)) {
            this.game.gameState.inventory.push(`Dark Artifact`);
            this.game.updateInventoryDisplay();
        }
        this.showDialogue(`You pick up the Dark Artifact, suddenly feeling a powerful force surge into your body. But at that moment, you hear footsteps behind you...`, [
            { text: `Turn Around`, action: () => this.turnAroundInCemetery() }
        ]);
    }

    // Turn Around in Cemetery
    turnAroundInCemetery() {
        this.plotProgress = 32;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`horror`);
        this.showDialogue(`You turn around and see ${friendName}! But ${pronounSub} eyes are hollow, black mist emanating from ${pronounSub} body. ${pronounSub} walks towards you step by step, reaching out to snatch the Dark Artifact from your hand.`, [
            { text: `Hold Artifact Tight`, action: () => this.holdArtifactTight() },
            { text: `Try to Wake ${pronounSub}`, action: () => this.attemptToWakeFriendInCemetery() }
        ]);
    }

    // Hold Artifact Tight
    holdArtifactTight() {
        this.plotProgress = 33;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        // Remove Dark Artifact from inventory
        const artifactIndex = this.game.gameState.inventory.indexOf(`Dark Artifact`);
        if (artifactIndex > -1) {
            this.game.gameState.inventory.splice(artifactIndex, 1);
            this.game.updateInventoryDisplay();
        }
        this.showDialogue(`${friendName}'s strength is terrifying, ${pronounSub} grabs the Dark Artifact from your hand and snatches it away. ${pronounSub} lets out a cold laugh and runs towards the school.`, [
            { text: `Chase`, action: () => this.chaseFriendToSchool() }
        ]);
    }

    // Attempt to Wake Friend in Cemetery
    attemptToWakeFriendInCemetery() {
        this.plotProgress = 34;
        const friendName = this.getFriendName();
        const pronounObj = this.getFriendPronoun(`object`);
        const pronounSub = this.getFriendPronoun(`subject`);
        // Remove Dark Artifact from inventory
        const artifactIndex = this.game.gameState.inventory.indexOf(`Dark Artifact`);
        if (artifactIndex > -1) {
            this.game.gameState.inventory.splice(artifactIndex, 1);
            this.game.updateInventoryDisplay();
        }
        this.showDialogue(`"${friendName}! Wake up! It's me!" you shout. But ${pronounSub} doesn't seem to hear, ${pronounSub} grabs the Dark Artifact from your hand and snatches it away. ${pronounSub} lets out a cold laugh and runs towards the school.`, [
            { text: `Chase`, action: () => this.chaseFriendToSchool() }
        ]);
    }

    // Chase Friend to School
    chaseFriendToSchool() {
        this.plotProgress = 35;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`You immediately chase ${friendName}, running towards the school. ${friendName} runs fast, you can barely keep up. Finally, ${friendName} dashes into the school logistics area and disappears from your sight.`, [
            { text: `Enter Logistics Area`, action: () => this.showSchoolLogisticsScene() }
        ]);
    }

    goDeepIntoForest() {
        this.plotProgress = 13;
        this.showDialogue(`You choose the path deep into the forest. The trees grow denser, the light dimmer. You feel the temperature dropping around you...`, [
            { text: `Continue Forward`, action: () => this.continueDeepIntoForest() },
            { text: `Go Back`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    goToRiver() {
        this.plotProgress = 14;
        this.showDialogue(`You head towards the river. The sound of flowing water grows clearer, and you finally reach a clear stream. Beside the stream stands a dilapidated cabin.`, [
            { text: `Enter the Cabin`, action: () => this.loadScene(`abandonedHouse`) },
            { text: `Rest by the River`, action: () => this.restByRiver() }
        ]);
    }

    continueDeepIntoForest() {
        this.plotProgress = 15;
        this.game.playSound(`horror`);
        this.showDialogue(`You continue forward and suddenly see a clearing ahead. In the clearing stands an ancient altar with a tattered book on it.`, [
            { text: `Examine the Altar`, action: () => this.examineAltar() },
            { text: `Leave This Place`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    restByRiver() {
        this.plotProgress = 16;
        this.showDialogue(`You sit by the river, washing your face. The cold stream water refreshes you. Then you notice something glinting in the water...`, [
            { text: `Check the Water`, action: () => this.checkWater() },
            { text: `Leave`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    examineAltar() {
        this.plotProgress = 17;
        this.showDialogue(`You approach the altar and examine the tattered book. The cover reads "Secret School History". You open it and find records of the school's dark history...`, [
            { text: `Continue Reading`, action: () => this.readBook() },
            { text: `Close the Book`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    checkWater() {
        this.plotProgress = 18;
        this.showDialogue(`You reach into the water and pull out a glittering object. It's a ring, engraved with the same symbol as the badge.`, [
            { text: `Take the Ring`, action: () => this.takeRing() },
            { text: `Put It Back`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    readBook() {
        this.plotProgress = 19;
        this.showDialogue(`The book records that the school was built on an ancient cemetery. To suppress the evil spirits in the cemetery, the school's founders used an ancient ritual, but it failed and awakened an even more powerful evil spirit...`, [
            { text: `Continue Reading`, action: () => this.continueReading() },
            { text: `Close the Book`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    takeRing() {
        this.plotProgress = 20;
        if (!this.game.gameState.inventory.includes(`Engraved Ring`)) {
            this.game.gameState.inventory.push(`Engraved Ring`);
            this.game.updateInventoryDisplay();
        }
        this.showDialogue(`You pick up the ring and put it on. The ring suddenly emits a strong light, and you feel a power surge into your body.`, [
            { text: `Enter the Cabin`, action: () => this.loadScene(`abandonedHouse`) }
        ]);
    }

    continueReading() {
        this.plotProgress = 21;
        this.showDialogue(`The book also mentions that the only way to completely destroy the evil spirit is to find four artifacts: Fire, Water, Life, and Darkness. These four artifacts are hidden in four corners of the school...`, [
            { text: `Continue Reading`, action: () => this.readMore() },
            { text: `Close the Book`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    readMore() {
        this.plotProgress = 22;
        this.showDialogue(`...But the Dark Artifact has been missing for hundreds of years. Some say it was taken into the forest, others say it was buried under the school...`, [
            { text: `Close the Book`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    showAbandonedHouseScene() {
        // Create abandoned cabin scene
        const sceneDescription = document.createElement(`div`);
        sceneDescription.className = `scene-description`;
        sceneDescription.innerHTML = `
            <p>You enter the cabin, filled with dust and cobwebs. The furniture is old and worn, seemingly uninhabited for a long time.</p>
            <p>A faded portrait hangs on the wall, depicting a woman in ancient attire, her eyes hollow as if watching you.</p>
            <p>In the center of the room is a table with an oil lamp and a diary on it.</p>
        `;
        this.game.elements.gameMap.appendChild(sceneDescription);

        // Add scene image (resources pending)
        // const sceneImage = document.createElement(`img`);
        // sceneImage.src = `assets/img/abandoned-house.png`;
        // sceneImage.alt = `Abandoned Cabin`;
        // sceneImage.className = `scene-image`;
        // this.game.elements.gameMap.appendChild(sceneImage);

        this.showDialogue(`You stand in the center of the cabin, unsure what to examine first.`, [
            { text: `Read the Diary`, action: () => this.readDiary() },
            { text: `Examine the Portrait`, action: () => this.examinePortrait() },
            { text: `Leave`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    readDiary() {
        this.plotProgress = 23;
        this.showDialogue(`You pick up the diary on the table and open the first page. The handwriting is somewhat faded but still legible: "I know what they're doing. They use students' blood to feed that thing..."`, [
            { text: `Continue Reading`, action: () => this.continueReadingDiary() },
            { text: `Put Down the Diary`, action: () => this.loadScene(`abandonedHouse`) }
        ]);
    }

    examinePortrait() {
        this.plotProgress = 24;
        this.showDialogue(`You approach the portrait for a closer look. The woman's eyes seem to follow you. Suddenly, the portrait starts oozing blood...`, [
            { text: `Touch the Portrait`, action: () => this.touchPortrait() },
            { text: `Back Away`, action: () => this.loadScene(`abandonedHouse`) }
        ]);
    }

    continueReadingDiary() {
        this.plotProgress = 25;
        this.showDialogue(`"That thing is growing stronger. I must find the Dark Artifact, or it will be too late..." The diary ends here, the subsequent pages torn out.`, [
            { text: `Put Down the Diary`, action: () => this.loadScene(`abandonedHouse`) }
        ]);
    }

    touchPortrait() {
        this.plotProgress = 26;
        this.playSound(`horror`);
        this.showDialogue(`You touch the portrait, the blood on it suddenly becomes scalding hot. More blood flows from the woman's eyes, her mouth starts moving as if saying something...`, [
            { text: `Listen Carefully`, action: () => this.listenToPortrait() },
            { text: `Move Away from Portrait`, action: () => this.loadScene(`abandonedHouse`) }
        ]);
    }

    listenToPortrait() {
        this.plotProgress = 27;
        this.showDialogue(`You lean closer to the portrait and hear a faint voice: "Save me... Dark... Artifact... in... cemetery..."`, [
            { text: `Leave the Cabin`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    // Play Sound Effect
    playSound(soundName) {
        try {
            if (soundName === `ding` && this.game.horrorDing) {
                this.game.horrorDing.currentTime = 0;
                this.game.horrorDing.play().catch(e => console.log(`Sound effect failed to play:`, e));
            } else if (soundName === `horror` && this.game.horrorUp) {
                this.game.horrorUp.currentTime = 0;
                this.game.horrorUp.play().catch(e => console.log(`Sound effect failed to play:`, e));
            } else if (soundName === `ambient` && this.game.ambientSound) {
                this.game.ambientSound.currentTime = 0;
                this.game.ambientSound.play().catch(e => console.log(`Sound effect failed to play:`, e));
            }
        } catch (error) {
            console.log(`Sound effect play error:`, error);
        }
    }

    // Get correct pronoun for friend based on player gender
    getFriendPronoun(type) {
        // Check for abnormal genders
        const abnormalGenders = [`Walmart Shopping Bag`, `Attack Helicopter`];
        if (abnormalGenders.includes(this.game.gameState.playerGender)) {
            return `It`;
        }

        const isMale = this.game.gameState.playerGender === `male`;
        switch (type) {
            case `subject`: // Nominative (He/She)
                return isMale ? `He` : `She`;
            case `object`: // Accusative (Him/Her)
                return isMale ? `Him` : `Her`;
            case `possessive`: // Possessive (His/Her)
                return isMale ? `His` : `Her`;
            case `pronoun`: // Pronoun (He/She)
                return isMale ? `He` : `She`;
            default:
                return isMale ? `He` : `She`;
        }
    }

    // Get friend name based on player gender
    getFriendName() {
        const abnormalGenders = [`Walmart Shopping Bag`, `Attack Helicopter`];
        if (abnormalGenders.includes(this.game.gameState.playerGender)) {
            return Math.random() < 0.5 ? `Woof Woof` : `Meow Meow`;
        }
        return this.game.gameState.playerGender === "male" ? "Jack" : "Anna";
    }

    // Update game time
    updateGameTime(time) {
        this.game.gameState.gameTime = time;
        this.game.elements.currentTimeDisplay.textContent = time;
    }

    // Typewriter effect to show dialogue
    showDialogue(text, choices) {
        // Directly use the game object's showDialogue method
        this.game.showDialogue(text, choices);
    }

    // School Logistics Scene
    showSchoolLogisticsScene() {
        const friendName = this.getFriendName();
        // Create school logistics scene
        const sceneDescription = document.createElement(`div`);
        sceneDescription.className = `scene-description`;
        sceneDescription.innerHTML = `
            <p>You enter the school logistics area, dimly lit, filled with dust and mildew smell.</p>
            <p>Warehouses line both sides of the corridor, doors hung with rusty locks. Dripping water sounds in the distance, along with ${friendName}'s footsteps.</p>
            <p>You see a half-open door ahead, faint light seeping through.</p>
        `;
        this.game.elements.gameMap.appendChild(sceneDescription);

        // Add scene image (resources pending)
        // const sceneImage = document.createElement(`img`);
        // sceneImage.src = `assets/img/school-logistics.png`;
        // sceneImage.alt = `School Logistics Area`;
        // sceneImage.className = `scene-image`;
        // this.game.elements.gameMap.appendChild(sceneImage);

        this.playSound(`horror`);
        this.showDialogue(`You cautiously move forward, reaching the half-open door. You hear low laughter inside, ${friendName}'s voice, but it sounds strange, evil.`, [
            { text: `Push Door Open`, action: () => this.enterRoom() },
            { text: `Eavesdrop`, action: () => this.eavesdrop() }
        ]);
    }

    // Enter Room
    enterRoom() {
        this.plotProgress = 37;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`horror`);
        this.showDialogue(`You push the door open and enter. The room is dark, only a candlestick emitting faint light. ${friendName} stands with ${pronounSub} back to you, in the center of the room on a strange symbol. ${pronounSub} holds the Dark Artifact, muttering something low.`, [
            { text: `Interrupt ${friendName}`, action: () => this.interruptFriend() },
            { text: `Slowly Back Away`, action: () => this.slowlyBackAway() }
        ]);
    }

    // Eavesdrop
    eavesdrop() {
        this.plotProgress = 38;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`You lean by the door, eavesdropping. "Finally... the Dark Artifact... is mine..." ${friendName}'s voice comes through, "With it, I can control the entire school... no, the whole world..."`, [
            { text: `Push Door Open`, action: () => this.enterRoom() },
            { text: `Look for Another Entrance`, action: () => this.lookForOtherEntrance() }
        ]);
    }

    // Interrupt Friend
    interruptFriend() {
        this.plotProgress = 39;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        const pronounObj = this.getFriendPronoun(`object`);
        this.playSound(`horror`);
        this.showDialogue(`${friendName}! Stop! That thing will corrupt ${pronounObj} mind!`);

        setTimeout(() => {
            this.showDialogue(`Hahaha... Just in time, ${this.game.gameState.playerName}.`);

            setTimeout(() => {
                this.showDialogue(`${friendName} slowly turns around, ${pronounSub} eyes glowing with eerie red light, a sinister smile curling ${pronounSub} lips. The Dark Artifact in ${pronounSub} hand emits black mist, coiling around ${pronounSub} arm.`);

                setTimeout(() => {
                    this.showDialogue(`${friendName} raises the Dark Artifact, pointing at you: "Now, ${this.game.gameState.playerName}, become part of the darkness!"`, [
                        { text: `Try to Persuade ${friendName}`, action: () => this.attemptToConvinceFriend() },
                        { text: `Try to Snatch the Artifact`, action: () => this.attemptToGrabArtifact() },
                        { text: `Dodge and Look for Weapon`, action: () => this.dodgeAndFindWeapon() }
                    ]);
                }, 2000);
            }, 2000);
        }, 1500);
    }

    // Attempt to Convince Friend
    attemptToConvinceFriend() {
        this.plotProgress = 40;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`${friendName}! Don't you remember me? We're friends! I know you're controlled by that thing, wake up!`, [
            { text: `Continue Persuading`, action: () => this.continueConvincing() },
            { text: `Give Up Persuading, Try to Snatch`, action: () => this.attemptToGrabArtifact() }
        ]);
    }

    // Continue Persuading
    continueConvincing() {
        this.plotProgress = 41;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`horror`);
        this.showDialogue(`${friendName}'s expression seems to waver for a moment, but is soon replaced by a sinister smile. "Friends? What's that? The power of darkness is everything!" ${pronounSub} shouts, swinging the Dark Artifact at you.`, [
            { text: `Dodge`, action: () => this.dodgeAttack() },
            { text: `Try to Block`, action: () => this.attemptToBlock() }
        ]);
    }

    // Attempt to Grab Artifact
    attemptToGrabArtifact() {
        this.plotProgress = 42;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`You charge at ${friendName}, trying to snatch the Dark Artifact from ${pronounSub} hand. ${friendName} reacts quickly, sidestepping your attack, and hits your shoulder with the Dark Artifact. You feel intense pain and fall to the ground.`, [
            { text: `Struggle to Stand`, action: () => this.standUp() },
            { text: `Play Dead and Wait for Opportunity`, action: () => this.pretendToBeDead() }
        ]);
    }

    // Dodge and Find Weapon
    dodgeAndFindWeapon() {
        this.plotProgress = 43;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`You quickly dodge to the side, the Dark Artifact's attack grazing your clothes. You look around and find a rusty iron rod in the corner.`, [
            { text: `Pick Up Iron Rod for Defense`, action: () => this.takeIronRod() },
            { text: `Continue Dodging`, action: () => this.continueDodging() }
        ]);
    }

    // Dodge Attack
    dodgeAttack() {
        this.plotProgress = 44;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`You dodge just in time, ${friendName}'s attack misses. ${friendName} seems surprised but soon launches another attack.`, [
            { text: `Continue Dodging`, action: () => this.continueDodging() },
            { text: `Look for Counterattack Opportunity`, action: () => this.lookForCounterAttack() }
        ]);
    }

    // Attempt to Block
    attemptToBlock() {
        this.plotProgress = 45;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`You try to block ${friendName}'s attack with your arm, but ${pronounSub} strength is beyond your imagination. The Dark Artifact hits your arm, you feel numbness.`, [
            { text: `Stagger Back`, action: () => this.staggerBack() },
            { text: `Seize Opportunity to Counterattack`, action: () => this.counterAttack() }
        ]);
    }

    // Struggle to Stand
    standUp() {
        this.plotProgress = 46;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`Enduring the pain, you struggle to stand. ${friendName} sneers at you: "Still not giving up? So stubborn."`, [
            { text: `Try to Persuade Again`, action: () => this.attemptToConvinceFriend() },
            { text: `Look for Chance to Snatch Artifact`, action: () => this.lookForArtifactChance() }
        ]);
    }

    // Play Dead and Wait for Opportunity
    pretendToBeDead() {
        this.plotProgress = 47;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`horror`);
        this.showDialogue(`You hold your breath, pretending to be unconscious. ${friendName} approaches you, poking you with the Dark Artifact. After confirming you're "unconscious", ${pronounSub} turns and walks deeper into the room, muttering: "When I complete the ritual, you'll be the first sacrifice."`, [
            { text: `Sneak Follow`, action: () => this.sneakFollow() },
            { text: `Seize Chance to Snatch Artifact`, action: () => this.stealArtifact() }
        ]);
    }

    // Pick Up Iron Rod for Defense
    takeIronRod() {
        this.plotProgress = 48;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`You pick up the iron rod, assuming a defensive stance. ${friendName} sees this and laughs: "With that rusty rod? You think you can stop me?"`, [
            { text: `Try to Attack with Rod`, action: () => this.attackWithRod() },
            { text: `Maintain Defense and Wait for Opportunity`, action: () => this.defendAndWait() }
        ]);
    }

    // Continue Dodging
    continueDodging() {
        this.plotProgress = 49;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`You keep dodging ${friendName}'s attacks, but ${friendName}'s attacks get faster, you're gradually running out of stamina.`, [
            { text: `Look for Counterattack Opportunity`, action: () => this.lookForCounterAttack() },
            { text: `Try to Escape the Room`, action: () => this.attemptToEscape() }
        ]);
    }

    // Look for Counterattack Opportunity
    lookForCounterAttack() {
        this.plotProgress = 50;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`${friendName}'s attack reveals an opening! You seize the chance, charge at ${pronounSub}, trying to take the Dark Artifact.`, [
            { text: `Grab with Full Force`, action: () => this.fullForceGrab() },
            { text: `Feint to Distract ${friendName}`, action: () => this.feintAttack() }
        ]);
    }

    // Grab with Full Force
    fullForceGrab() {
        this.plotProgress = 501;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`You use all your strength, lunging at ${friendName}, both hands grabbing the Dark Artifact in ${pronounSub} hand. ${friendName} is startled but quickly reacts, struggling with you for the artifact.`, [
            { text: `Keep Grabbing`, action: () => this.keepGrabbing() },
            { text: `Trip ${friendName}`, action: () => this.tripFriend() }
        ]);
    }

    // Feint to Distract
    feintAttack() {
        this.plotProgress = 502;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`You pretend to attack ${friendName}'s head, distracting ${pronounSub}. When ${friendName} raises ${pronounSub} arm to defend, you quickly reach to snatch the Dark Artifact from ${pronounSub} hand.`, [
            { text: `Seize Chance to Snatch`, action: () => this.sneakGrabArtifact() },
            { text: `Feint Again`, action: () => this.feintAgain() }
        ]);
    }

    // Keep Grabbing
    keepGrabbing() {
        this.plotProgress = 503;
        const friendName = this.getFriendName();
        this.playSound(`horrorUp`);
        this.showDialogue(`You and ${friendName} struggle fiercely over the Dark Artifact. The artifact emits intense black light, both your hands are burned, but neither lets go.`, [
            { text: `Hold On`, action: () => this.holdOn() },
            { text: `Let Go and Back Away`, action: () => this.letGoAndBack() }
        ]);
    }

    // Trip Friend
    tripFriend() {
        this.plotProgress = 504;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`You take ${friendName} by surprise, tripping ${friendName}. ${friendName} loses balance, falls to the ground, the Dark Artifact slipping from ${friendName} hand.`, [
            { text: `Pick Up Artifact`, action: () => this.pickUpArtifact() },
            { text: `Check ${friendName}'s Condition`, action: () => this.checkFriendCondition() }
        ]);
    }

    // Feint Again
    feintAgain() {
        this.plotProgress = 505;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`You feint attack ${friendName} again, but ${pronounSub} sees through your trick, unmoved. ${friendName} sneers: "The same trick won't work on me!"`, [
            { text: `Grab Directly`, action: () => this.fullForceGrab() },
            { text: `Look for Other Opportunities`, action: () => this.lookForOtherChance() }
        ]);
    }

    // Hold On
    holdOn() {
        this.plotProgress = 506;
        const friendName = this.getFriendName();
        this.playSound(`horrorUp`);
        this.showDialogue(`You grit your teeth, refusing to let go. The Dark Artifact's light grows stronger, you feel intense pain, but still don't release your grip.`, [
            { text: `Continue Holding`, action: () => this.continueHolding() },
            { text: `Use Engraved Ring`, action: () => this.useEngravedRing() }
        ]);
    }

    // Let Go and Back Away
    letGoAndBack() {
        this.plotProgress = 507;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`You let go, quickly stepping back. ${friendName} also backs away, watching you warily. Both of you are panting, the fight temporarily halts.`, [
            { text: `Try to Persuade ${friendName}`, action: () => this.attemptToConvinceFriend() },
            { text: `Look for Chance to Snatch Again`, action: () => this.lookForCounterAttack() }
        ]);
    }

    // Pick Up Artifact
    pickUpArtifact() {
        this.plotProgress = 508;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`You quickly pick up the Dark Artifact from the ground. ${friendName} struggles to get up, but clearly injured, can't rise immediately.`, [
            { text: `Leave the Room`, action: () => this.attemptToEscape() },
            { text: `Help ${friendName}`, action: () => this.helpFriend() }
        ]);
    }

    // Look for Other Opportunities
    lookForOtherChance() {
        this.plotProgress = 509;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`You temporarily back off, looking for other chances to snatch the artifact. ${friendName} grips the artifact tightly, watching you warily, giving no opening.`, [
            { text: `Try to Persuade ${friendName}`, action: () => this.attemptToConvinceFriend() },
            { text: `Use Environmental Items`, action: () => this.useEnvironmentItem() }
        ]);
    }

    // Continue Holding
    continueHolding() {
        this.plotProgress = 510;
        const friendName = this.getFriendName();
        this.playSound(`horrorUp`);
        this.showDialogue(`You keep holding on, your fingers burned by the Dark Artifact's light, but you still refuse to let go. Suddenly, the artifact emits a strong light, blasting both you and ${friendName} away.`, [
            { text: `Check ${friendName}'s Condition`, action: () => this.checkFriendCondition() },
            { text: `Try to Snatch Artifact Again`, action: () => this.attemptToGrabArtifact() }
        ]);
    }

    // Use Engraved Ring
    useEngravedRing() {
        this.plotProgress = 511;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        if (this.game.gameState.inventory.includes(`Engraved Ring`)) {
            this.showDialogue(`You remember the Engraved Ring on your hand, immediately put it on your finger. The ring emits a soft light, countering some of the Dark Artifact's power. ${friendName} seems affected, lets go.`, [
                { text: `Pick Up Artifact`, action: () => this.pickUpArtifact() }
            ]);
        } else {
            this.showDialogue(`You check your pocket, the Engraved Ring isn't there. Maybe lost in the chaos earlier.`, [
                { text: `Continue Holding`, action: () => this.continueHolding() },
                { text: `Let Go and Back Away`, action: () => this.letGoAndBack() }
            ]);
        }
    }

    // Help Friend
    helpFriend() {
        this.plotProgress = 512;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`You walk to ${friendName}'s side, reaching out to help ${friendName} up. ${friendName} hesitates, then finally takes your hand. ${friendName} says softly: "Thank you... I... didn't mean to..."`, [
            { text: `Take ${friendName} Away`, action: () => this.leaveWithFriend() },
            { text: `Ask About the Artifact`, action: () => this.askAboutArtifact() }
        ]);
    }

    // Use Environmental Items
    useEnvironmentItem() {
        this.plotProgress = 513;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`You look around for usable items. Besides some old furniture, there's nothing useful in the room. ${friendName} notices your intention, approaches you.`, [
            { text: `Try to Snatch Again`, action: () => this.fullForceGrab() },
            { text: `Try to Escape the Room`, action: () => this.attemptToEscape() }
        ]);
    }

    // Ask About the Artifact
    askAboutArtifact() {
        this.plotProgress = 514;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`${friendName} sighs, says: "This artifact... it seems to have its own consciousness... it kept talking in my mind... tempting me to use its power... I... almost lost control..."`, [
            { text: `Take ${friendName} Away`, action: () => this.leaveWithFriend() },
            { text: `Discuss How to Handle the Artifact`, action: () => this.discussArtifact() }
        ]);
    }

    // Discuss How to Handle the Artifact
    discussArtifact() {
        this.plotProgress = 515;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`You and ${friendName} discuss how to handle the Dark Artifact. ${friendName} suggests sealing the artifact to prevent it from harming others. You decide to leave first, then find a way to deal with the artifact.`, [
            { text: `Take ${friendName} Away`, action: () => this.leaveWithFriend() }
        ]);
    }

    // Stagger Back
    staggerBack() {
        this.plotProgress = 51;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`Enduring the numbness, you stagger back a few steps. ${friendName} presses forward, ${friendName}'s eyes gleaming with madness.`, [
            { text: `Try to Persuade ${friendName}`, action: () => this.attemptToConvinceFriend() },
            { text: `Look for Counterattack Opportunity`, action: () => this.lookForCounterAttack() }
        ]);
    }

    // Seize Opportunity to Counterattack
    counterAttack() {
        this.plotProgress = 52;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`You seize the gap after ${friendName}'s attack, punch ${pronounSub} abdomen with full force. ${friendName} cries out in pain, steps back, but soon stabilizes.`, [
            { text: `Continue Attacking`, action: () => this.continueAttacking() },
            { text: `Try to Snatch Artifact`, action: () => this.attemptToGrabArtifact() }
        ]);
    }

    // Look for Chance to Snatch Artifact
    lookForArtifactChance() {
        this.plotProgress = 53;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`horror`);
        this.showDialogue(`You stare intently at the Dark Artifact in ${friendName}'s hand, looking for a chance to snatch it. ${pronounSub} seems to notice your intention, grips the artifact tighter.`, [
            { text: `Snatch When ${friendName} is Distracted`, action: () => this.sneakGrabArtifact() },
            { text: `Attack ${friendName}'s Arm First`, action: () => this.attackArm() }
        ]);
    }

    // Sneak Follow
    sneakFollow() {
        this.plotProgress = 54;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`horror`);
        this.showDialogue(`You sneak after ${friendName}, entering deeper into the room. ${pronounSub} stands in the center of a large magic circle, starting to chant a lengthy spell. The Dark Artifact floats above the magic circle, emitting intense black light.`, [
            { text: `Interrupt Before Ritual Completes`, action: () => this.interruptRitual() },
            { text: `Observe for Weakness`, action: () => this.observeWeakness() }
        ]);
    }

    // Interrupt Before Ritual Completes
    interruptRitual() {
        this.plotProgress = 541;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`You shout, charging at ${friendName}, trying to interrupt ${pronounSub} ritual. ${friendName} is startled, the spell interrupted. ${friendName} looks at you angrily: "Why are you stopping me?! I was about to gain great power!"`, [
            { text: `Try to Persuade ${friendName}`, action: () => this.attemptToConvinceFriend() },
            { text: `Try to Snatch Artifact`, action: () => this.attemptToGrabArtifact() }
        ]);
    }

    // Observe for Weakness
    observeWeakness() {
        this.plotProgress = 542;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`You carefully observe ${friendName} and the magic circle. You notice whenever ${friendName} chants a specific spell, the magic circle's light weakens slightly. This might be a breakthrough.`, [
            { text: `Attack at Weak Point`, action: () => this.attackAtWeakPoint() },
            { text: `Look for Other Weaknesses`, action: () => this.lookForOtherWeakness() }
        ]);
    }

    // Attack at Weak Point
    attackAtWeakPoint() {
        this.plotProgress = 543;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`You wait for ${friendName} to chant that specific spell. When the magic circle's light weakens, you immediately charge, punch ${friendName}. ${pronounSub} is hit, falls to the ground.`, [
            { text: `Check ${friendName}'s Condition`, action: () => this.checkFriendCondition() },
            { text: `Pick Up Artifact`, action: () => this.pickUpArtifact() }
        ]);
    }

    // Look for Other Weaknesses
    lookForOtherWeakness() {
        this.plotProgress = 544;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`You continue observing the room, looking for other weaknesses. You find a strange symbol in the corner, seemingly connected to the magic circle. Destroying this symbol might disrupt the magic circle.`, [
            { text: `Destroy Symbol`, action: () => this.destroySymbol() },
            { text: `Directly Attack Magic Circle`, action: () => this.attackMagicCircle() }
        ]);
    }

    // Destroy Symbol
    destroySymbol() {
        this.plotProgress = 545;
        this.playSound(`ding`);
        this.showDialogue(`You run to the room corner, forcefully destroy the symbol. After the symbol is destroyed, the magic circle's light noticeably weakens. ${friendName} lets out a scream, falls to the ground.`, [
            { text: `Check ${friendName}'s Condition`, action: () => this.checkFriendCondition() }
        ]);
    }

    // Directly Attack Magic Circle
    attackMagicCircle() {
        this.plotProgress = 546;
        const friendName = this.getFriendName();
        this.playSound(`horrorUp`);
        this.showDialogue(`You charge directly at the magic circle, trying to destroy it. But the magic circle suddenly bursts with intense light, blasting you away. You fall heavily to the ground, feeling intense pain all over. ${friendName} sneers: "Overestimating yourself!"`, [
            { text: `Try Attacking Again`, action: () => this.attackMagicCircleAgain() },
            { text: `Temporarily Retreat`, action: () => this.retreatTemporarily() }
        ]);
    }

    // Attack Magic Circle Again
    attackMagicCircleAgain() {
        this.plotProgress = 547;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`Enduring the pain, you charge at the magic circle again. This time, you find the weak point of the magic circle, attack forcefully. The magic circle is destroyed, a loud bang. ${friendName} falls to the ground, unconscious.`, [
            { text: `Check ${friendName}'s Condition`, action: () => this.checkFriendCondition() }
        ]);
    }

    // Temporarily Retreat
    retreatTemporarily() {
        this.plotProgress = 548;
        this.playSound(`horror`);
        this.showDialogue(`You realize it's not the right time to attack, decide to temporarily retreat. You slowly back away, leave the room. ${friendName} doesn't chase, continues focusing on the ritual.`, [
            { text: `Look for Other Entrance`, action: () => this.lookForOtherEntrance() },
            { text: `Look for Help`, action: () => this.lookForHelp() }
        ]);
    }

    // Look for Other Entrance
    lookForOtherEntrance() {
        this.plotProgress = 549;
        this.playSound(`ding`);
        this.showDialogue(`You search for another entrance in the logistics area. After some searching, you find a ventilation shaft leading to the room. You crawl into the ventilation shaft, quietly approaching the room.`, [
            { text: `Attack from Ventilation Shaft`, action: () => this.attackFromVent() },
            { text: `Sneak into Room`, action: () => this.sneakIntoRoom() }
        ]);
    }

    // Attack from Ventilation Shaft
    attackFromVent() {
        this.plotProgress = 550;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`You jump down from the ventilation shaft, landing right behind ${friendName}. You attack ${friendName} by surprise, ${friendName} is hit, falls to the ground.`, [
            { text: `Check ${friendName}'s Condition`, action: () => this.checkFriendCondition() }
        ]);
    }

    // Sneak into Room
    sneakIntoRoom() {
        this.plotProgress = 551;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`You quietly enter the room from the ventilation shaft, hide behind a cabinet. ${friendName} is still focused on the ritual, hasn't noticed you.`, [
            { text: `Interrupt Before Ritual Completes`, action: () => this.interruptRitual() },
            { text: `Observe for Weakness`, action: () => this.observeWeakness() }
        ]);
    }

    // Seize Chance to Snatch Artifact
    stealArtifact() {
        this.plotProgress = 55;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`You suddenly spring up, charge at ${friendName}, trying to snatch the Dark Artifact from ${pronounSub} hand. ${friendName} reacts too late, the artifact is snatched by you. But ${friendName} immediately grabs your wrist, frantically trying to take back the artifact.`, [
            { text: `Forcefully Break Free`, action: () => this.forceEscape() },
            { text: `Attack ${friendName} with Artifact`, action: () => this.attackWithArtifact() }
        ]);
    }

    // Forcefully Break Free
    forceEscape() {
        this.plotProgress = 59;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`You use all your strength, break free from ${friendName}'s restraint. ${friendName} staggers, you seize the chance to back away, creating distance from ${friendName}.`, [
            { text: `Try to Escape the Room`, action: () => this.attemptToEscape() },
            { text: `Try to Persuade ${friendName} Again`, action: () => this.attemptToConvinceFriend() }
        ]);
    }

    // Attack Friend with Artifact
    attackWithArtifact() {
        this.plotProgress = 60;
        const friendName = this.getFriendName();
        const pronounObj = this.getFriendPronoun(`object`);
        this.playSound(`horrorUp`);
        this.showDialogue(`You raise the Dark Artifact, swing at ${friendName}. But the artifact suddenly emits a black light, you feel dizzy. When you regain consciousness, find ${friendName} on the ground, ${pronounObj} body shrouded in black mist.`, [
            { text: `Check ${friendName}'s Condition`, action: () => this.checkFriendCondition() },
            { text: `Flee the Room`, action: () => this.attemptToEscape() }
        ]);
    }

    // Try to Attack with Rod
    attackWithRod() {
        this.plotProgress = 56;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`You swing the iron rod, smashing at ${friendName}. ${pronounSub} blocks your attack with the Dark Artifact, the rod and artifact collide, emitting a sharp metallic sound.`, [
            { text: `Continue Attacking`, action: () => this.continueAttackingWithRod() },
            { text: `Look for Opening`, action: () => this.lookForWeakSpot() }
        ]);
    }

    // Maintain Defense and Wait for Opportunity
    defendAndWait() {
        this.plotProgress = 57;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`You maintain a defensive stance, waiting for an opening in ${friendName}'s attack. ${friendName} keeps swinging the Dark Artifact at you, ${friendName}'s breathing grows more rapid.`, [
            { text: `Look for Counterattack Opportunity`, action: () => this.lookForCounterAttack() },
            { text: `Try to Persuade ${friendName}`, action: () => this.attemptToConvinceFriend() }
        ]);
    }

    // Try to Escape the Room
    attemptToEscape() {
        this.plotProgress = 58;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`You turn and charge towards the door, trying to escape the room. But ${friendName} is faster, ${pronounSub} instantly moves to the door, blocking your way. ${friendName} sneers: "Trying to run? Not so easy!"`, [
            { text: `Force Breakthrough`, action: () => this.forceBreakthrough() },
            { text: `Turn and Fight`, action: () => this.fightBack() }
        ]);
    }

    // Force Breakthrough
    forceBreakthrough() {
        this.plotProgress = 581;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`You grit your teeth, charge at ${friendName} with full force. ${friendName} doesn't expect you to be so desperate, is pushed back by you. You seize the chance to rush out of the room, but ${friendName} chases closely behind.`, [
            { text: `Keep Running`, action: () => this.continueRunning() },
            { text: `Find Hiding Place`, action: () => this.findHidingPlace() }
        ]);
    }

    // Turn and Fight
    fightBack() {
        this.plotProgress = 582;
        const friendName = this.getFriendName();
        this.playSound(`horrorUp`);
        this.showDialogue(`You stop, turn to face ${friendName}. ${friendName} sees this, shows a cruel smile: "Good, let me see what you're capable of!"`, [
            { text: `Look for Attack Opportunity`, action: () => this.lookForCounterAttack() },
            { text: `Try to Persuade ${friendName}`, action: () => this.attemptToConvinceFriend() }
        ]);
    }

    // Keep Running
    continueRunning() {
        this.plotProgress = 583;
        this.playSound(`ding`);
        this.showDialogue(`You run desperately, through the corridor, towards the school exit. You don't know if ${friendName} is still chasing, but you dare not look back, can only keep running forward.`, [
            { text: `Escape School`, action: () => this.escapeSchool() }
        ]);
    }

    // Find Hiding Place
    findHidingPlace() {
        this.plotProgress = 584;
        this.playSound(`horror`);
        this.showDialogue(`You run into a classroom, hide behind the teacher's desk. ${friendName}'s footsteps get closer, you hold your breath, praying ${friendName} won't find you.`, [
            { text: `Wait for ${friendName} to Leave`, action: () => this.waitForFriendToLeave() },
            { text: `Secretly Observe ${friendName}`, action: () => this.sneakObserveFriend() }
        ]);
    }

    // Escape School
    escapeSchool() {
        this.plotProgress = 585;
        this.playSound(`ding`);
        this.showDialogue(`You finally run out of the school. The outside sunlight feels warm, you look back at the school, find ${friendName} didn't chase out. You know, this time you escaped successfully, but ${friendName} is still trapped in darkness.`, [
            { text: `Call Police for Help`, action: () => this.callPolice() },
            { text: `Return to School to Save ${friendName}`, action: () => this.returnToSaveFriend() }
        ]);
    }

    // Wait for Friend to Leave
    waitForFriendToLeave() {
        this.plotProgress = 586;
        this.playSound(`horror`);
        this.showDialogue(`You wait behind the desk for a long time, finally can't hear ${friendName}'s footsteps. You cautiously peek out, find the classroom empty.`, [
            { text: `Continue Looking for Exit`, action: () => this.attemptToEscape() }
        ]);
    }

    // Secretly Observe Friend
    sneakObserveFriend() {
        this.plotProgress = 587;
        const friendName = this.getFriendName();
        this.playSound(`horrorUp`);
        this.showDialogue(`You cautiously peek, observe ${friendName}'s movements. ${friendName} stands at the classroom door, seems hesitant to enter. Suddenly, ${friendName}'s body trembles, a struggling glint flashes in ${friendName}'s eyes.`, [
            { text: `Try Calling ${friendName}'s Name`, action: () => this.callFriendName() },
            { text: `Continue Hiding`, action: () => this.waitForFriendToLeave() }
        ]);
    }

    // Call Friend's Name
    callFriendName() {
        this.plotProgress = 588;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`You softly call ${friendName}'s name. ${friendName} hears your voice, body visibly shudders. ${friendName} slowly turns around, the madness in ${friendName}'s eyes gradually fades, replaced by confusion and pain.`, [
            { text: `Approach to Comfort ${friendName}`, action: () => this.comfortFriend() }
        ]);
    }

    // Comfort Friend
    comfortFriend() {
        this.plotProgress = 589;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`You slowly walk to ${friendName}'s side, gently comfort ${friendName}. ${friendName} throws herself into your arms, sobbing: "I... I think I did many terrible things..."`, [
            { text: `Take ${friendName} Away`, action: () => this.leaveWithFriend() }
        ]);
    }

    // Return to School to Save Friend
    returnToSaveFriend() {
        this.plotProgress = 590;
        const friendName = this.getFriendName();
        this.playSound(`horrorUp`);
        this.showDialogue(`You take a deep breath, turn and run back to the school. You can't just abandon ${friendName}. When you return to the previous room, find ${friendName} squatting on the ground holding ${friendName} head, the Dark Artifact has disappeared.`, [
            { text: `Ask ${friendName} About Artifact's Whereabouts`, action: () => this.askAboutArtifact() },
            { text: `Take ${friendName} Away`, action: () => this.leaveWithFriend() }
        ]);
    }

    // Check Friend's Condition
    checkFriendCondition() {
        this.plotProgress = 61;
        const friendName = this.getFriendName();
        const pronounObj = this.getFriendPronoun(`object`);
        this.playSound(`horror`);
        this.showDialogue(`${friendName} lies on the ground, ${pronounObj} breathing weak. You approach, find ${friendName}'s eyes have returned to normal, but ${friendName} face still shows pain.`, [
            { text: `Wake ${friendName}`, action: () => this.wakeFriend() },
            { text: `Look for Help`, action: () => this.lookForHelp() }
        ]);
    }

    // Wake Friend
    wakeFriend() {
        this.plotProgress = 62;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`You gently shake ${friendName}'s body, call ${friendName}'s name. ${friendName} slowly opens eyes, sees you, shows a weak smile: "${this.game.gameState.playerName}... Thank you..."`, [
            { text: `Ask ${friendName} What Happened`, action: () => this.askFriendWhatHappened() },
            { text: `Take ${friendName} Away from Here`, action: () => this.leaveWithFriend() }
        ]);
    }

    // Take Friend Away
    leaveWithFriend() {
        this.plotProgress = 63;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`You support ${friendName}, slowly walk out of the room. The Dark Artifact still emits black light in the center of the room, but you have no strength to deal with it anymore. You stumble out of the school logistics area, back to the school corridor.`, [
            { text: `Go to Infirmary`, action: () => this.goToInfirmary() },
            { text: `Call Police`, action: () => this.callPolice() }
        ]);
    }

    // Look for Help
    lookForHelp() {
        this.plotProgress = 64;
        this.playSound(`ding`);
        this.showDialogue(`You run out of the room, shout for help. But the whole school is quiet, no one responds. You realize you can only rely on yourself now.`, [
            { text: `Return to Room`, action: () => this.checkFriendCondition() }
        ]);
    }

    // Ask Friend What Happened
    askFriendWhatHappened() {
        this.plotProgress = 65;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`${friendName} says weakly: "I... I was controlled by that artifact... It... It kept talking in my mind... Making me do terrible things..."`, [
            { text: `Take ${friendName} Away from Here`, action: () => this.leaveWithFriend() }
        ]);
    }

    // Go to Infirmary
    goToInfirmary() {
        this.plotProgress = 66;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`You support ${friendName} to the infirmary, find some emergency medical supplies. You help ${friendName} treat the wounds, ${friendName}'s condition seems improved.`, [
            { text: `Rest a While`, action: () => this.restInInfirmary() }
        ]);
    }

    // Rest in Infirmary
    restInInfirmary() {
        this.plotProgress = 67;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`You and ${friendName} rest in the infirmary for a while. ${friendName}'s mental state is much better, but you both know this incident is far from over. The Dark Artifact is still in the school, waiting for the next victim.`, [
            { text: `End Chapter 4`, action: () => this.completeChapter() }
        ]);
    }

    // Call Police
    callPolice() {
        this.plotProgress = 68;
        this.playSound(`ding`);
        this.showDialogue(`You take out your phone to call the police, but find no signal. The whole school seems enveloped by some force, completely isolated from the outside world.`, [
            { text: `Go to Infirmary`, action: () => this.goToInfirmary() }
        ]);
    }

    // Complete Chapter
    completeChapter() {
        // This is the final chapter, no next chapter
        // Show ending screen
        this.showResultScreen();

        // Show ending screen
        this.showResultScreen();
    }

    // Show Result Screen
    showResultScreen() {
        this.game.elements.gameScreen.classList.add('hidden');
        this.game.elements.resultScreen.classList.remove('hidden');

        // Show chapter name and clear time
        let chapterName = 'Chapter 4 - 「Darkness Erosion」';
        this.game.elements.resultChapter.textContent = chapterName;
        this.game.elements.resultTime.textContent = this.game.gameState.gameTime;

        // Hide next chapter button, this is the final chapter
        this.game.elements.nextChapterBtn.classList.add('hidden');
        // Show return to chapter selection button
        this.game.elements.backToChapterSelectBtn.classList.remove('hidden');
        this.game.elements.backToChapterSelectBtn.textContent = 'Back to Chapter Select';

        // Show ending description
        const endingDescription = document.createElement('div');
        endingDescription.className = 'ending-description';
        endingDescription.innerHTML = `
            <p>You successfully escaped from your friend controlled by the Dark Artifact and helped your friend regain consciousness.</p>
            <p>Although the Dark Artifact still exists, you've proven that the power of friendship can overcome darkness.</p>
            <p>However, this is just the beginning... More powerful dark forces await you...</p>
        `;

        // Add ending description to result screen
        this.game.elements.resultScreen.innerHTML = '';
        this.game.elements.resultScreen.appendChild(endingDescription);
    }
}
// Export Chapter4 class to window object
window.Chapter4 = Chapter4;