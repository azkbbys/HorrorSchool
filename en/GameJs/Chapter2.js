class Chapter2 {
    constructor(game) {
        this.game = game;
        this.plotProgress = 0;
        this.friendMet = false;
        this.friendName = '';
        this.friendGender = ''; // Friend's gender
        this.typingInterval = null;
        // Foreshadowing related states
        this.strangeSymbolFound = false;
        this.mysteriousKeyFound = false;
        this.ghostWhisperHeard = false;

        // Sound effect elements
        this.horrorDing = document.getElementById('horror-ding');
        this.horrorUp = document.getElementById('horror-up');
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

    // Get the correct pronoun based on friend's gender
    getPronoun(type) {
        // Check for abnormal genders
        const abnormalGenders = ['Walmart Shopping Bag', 'Attack Helicopter'];
        if (abnormalGenders.includes(this.game.gameState.playerGender)) {
            return 'It';
        }

        const isMale = this.friendGender === 'male';
        switch (type) {
            case 'subject': // Subject (He/She)
                return isMale ? 'He' : 'She';
            case 'object': // Object (Him/Her)
                return isMale ? 'Him' : 'Her';
            case 'possessive': // Possessive (His/Her)
                return isMale ? 'His' : 'Her';
            case 'pronoun': // Pronoun (He/She)
                return isMale ? 'He' : 'She';
            default:
                return isMale ? 'He' : 'She';
        }
    }

    // Display dialogue with typewriter effect
    showDialogue(text, choices) {
        // Directly use the game object's showDialogue method
        this.game.showDialogue(text, choices);
    }

    // Start Chapter 2
    start(startTime = null) {
        this.game.gameState.currentChapter = 'chapter2';
        // Initialize game time
        if (startTime) {
            this.updateGameTime(startTime);
        } else {
            this.updateGameTime('22:00'); // Default start time
        }
        this.game.updateGameMap('entrance');
        this.plotProgress = 0;
        this.loadScene('entrance');
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
            case 'entrance':
                this.showEntranceScene();
                break;
            case 'quadrangle':
                this.showQuadrangleScene();
                break;
            case 'dormitory':
                this.showDormitoryScene();
                break;
            case 'canteen':
                this.showCanteenScene();
                break;
            case 'storageRoom':
                this.showStorageRoomScene();
                break;
            default:
                this.showEntranceScene();
        }
    }

    // School Entrance Scene
    showEntranceScene() {
        this.game.gameState.currentScene = 'entrance';
        this.game.updateGameMap('entrance');
        this.showDialogue('You stand at the main school gate. The gate is half-open, with a rusty lock hanging on the door knocker. A yellowed notice is posted on the bulletin board next to it: "School will be closed after 21:00 due to maintenance." It\'s already 22:00.', [
            { text: 'Enter School', action: () => this.enterSchool() },
            { text: 'Check Bulletin Board', action: () => this.checkNoticeBoard() }
        ]);
    }

    enterSchool() {
        this.game.updateGameMap('quadrangle');
        this.showDialogue('You push open the school gate. The creaking sound is particularly piercing in the silent night. The campus square under the moonlight is empty, with only the rustling sound of wind blowing through fallen leaves.', [
            { text: 'Go to Dormitory Area', action: () => this.loadScene('dormitory') },
            { text: 'Go to Canteen', action: () => this.loadScene('canteen') },
            { text: 'Return to Entrance', action: () => this.loadScene('entrance') }
        ]);
    }

    checkNoticeBoard() {
        this.showDialogue('Besides the closure notice, there is also a missing person notice on the bulletin board: "Looking for missing student Li Ming, last seen: October 13th evening." Below the notice, there is a line of handwritten text: "Don\'t trust the shadows."', [
            { text: 'Enter School', action: () => this.enterSchool() },
            { text: 'Take Photo', action: () => this.takePhoto() }
        ]);
    }

    takePhoto() {
        // Automatically give the player a phone
        if (!this.game.gameState.inventory.includes('Phone')) {
            this.game.gameState.inventory.push('Phone');
            // Update inventory display
            this.game.updateInventoryDisplay();
        }
        this.showDialogue('You take a photo of the bulletin board content with your phone. In the photo, the eyes on the missing person notice seem to be staring at you.', [
            { text: 'Enter School', action: () => this.enterSchool() }
        ]);
    }

    // Dormitory Scene
    showDormitoryScene() {
        this.game.gameState.currentScene = 'dormitory';
        this.game.updateGameMap('dormitory');

        if (!this.friendMet) {
            // Check for abnormal genders
            const abnormalGenders = ['Walmart Shopping Bag', 'Attack Helicopter'];
            if (abnormalGenders.includes(this.game.gameState.playerGender)) {
                this.friendName = Math.random() < 0.5 ? 'Woof' : 'Meow';
                this.friendGender = 'abnormal';
            } else {
                const isMale = this.game.gameState.playerGender === 'male';
                this.friendGender = isMale ? 'male' : 'female';
                this.friendName = isMale ? 'Zhang Wei' : 'Li Na';
            }
            this.friendMet = true;

            let friendDescription = abnormalGenders.includes(this.game.gameState.playerGender) ? 'A strange figure' : (this.friendGender === 'male' ? 'A male student' : 'A female student');
            this.showDialogue(`The dormitory area is pitch black, with only one dorm room lit. You approach and see the door is unlocked. A familiar voice comes from inside: "${this.game.gameState.playerName}? Is that you?"\n${friendDescription} sits up from the bed. It's your classmate ${this.friendName}.`, [
                { text: 'Why are you here?', action: () => this.askFriend() },
                { text: 'It\'s too dangerous here, come with me!', action: () => this.urgeFriend() }
            ]);
        } else {
            this.showDialogue(`The dormitory is empty. ${this.friendName}'s bed is neatly made, but textbooks are spread out on the desk, as if the owner just stepped away temporarily.`, [
                { text: 'Check Desk', action: () => this.checkFriendDesk() },
                { text: 'Leave Dormitory', action: () => this.enterSchool() }
            ]);
        }
    }

    checkFriendDesk() {
        this.showDialogue(`You walk to the desk. The textbook is open to a page in "Introduction to Psychology." A passage is circled in pencil: "Fear is one of humanity's most primitive emotions, and also the most easily manipulated."
There's also a note on the desk with messy handwriting: "They are watching us. Don't trust anyone."`, [
            { text: 'Take Note', action: () => this.takeNote() },
            { text: 'Leave Dormitory', action: () => this.enterSchool() }
        ]);
    }

    takeNote() {
        // Add note to inventory
        if (!this.game.gameState.inventory.includes('Note')) {
            this.game.gameState.inventory.push('Note');
            // Update inventory display
            this.game.updateInventoryDisplay();
        }
        this.showDialogue('You put the note in your pocket. Although you don\'t know who wrote it, your intuition tells you it\'s important.', [
            { text: 'Leave Dormitory', action: () => this.enterSchool() }
        ]);
    }

    askFriend() {
        this.showDialogue(`${this.friendName} rubs ${this.getPronoun('possessive').toLowerCase()} eyes: "I... I don't know either. After evening self-study, I seemed to get lost and ended up here unconsciously. This place feels so strange. I keep feeling like someone is watching me."
${this.getPronoun('subject')} lifts the blanket, revealing a red, swollen scratch on ${this.getPronoun('possessive').toLowerCase()} ankle.`, [
            { text: 'How did you get that injury?', action: () => this.askAboutInjury() },
            { text: 'Let\'s leave here together', action: () => this.urgeFriend() }
        ]);
    }

    askAboutInjury() {
        this.showDialogue(`${this.friendName} looks down at the ankle: "I don't know... Just now in the hallway, I felt something touch me, and then it was like this. Maybe I got scratched by a nail?"
${this.getPronoun('subject')} voice grows softer, eyes filled with fear.`, [
            { text: 'We need to leave quickly', action: () => this.urgeFriend() },
            { text: 'I\'ll help you find a first aid kit', action: () => this.searchFirstAidKit() }
        ]);
    }

    urgeFriend() {
        this.showDialogue(`${this.friendName} nods: "Okay... okay. I'll get my backpack."
${this.getPronoun('subject')} quickly packs up, accidentally dropping a photo. The photo shows a group of students in front of an abandoned school building. One person's face is scribbled out.`, [
            { text: 'Pick up Photo', action: () => this.pickUpPhoto() },
            { text: 'Urge Friend to Hurry', action: () => this.leaveDormitoryWithFriend() }
        ]);
    }

    searchFirstAidKit() {
        this.showDialogue('You find a dusty first aid kit in the dormitory drawer. Inside are some expired medicines and gauze. At the bottom lies a bronze key with a strange symbol engraved on it.', [
            { text: 'Take Key', action: () => this.takeMysteriousKey() },
            { text: 'Bandage Friend', action: () => this.bandageFriend() }
        ]);
    }

    takeMysteriousKey() {
        this.mysteriousKeyFound = true;
        // Add mysterious key to inventory (avoid duplicates)
        if (!this.game.gameState.inventory.includes('Mysterious Key')) {
            this.game.gameState.inventory.push('Mysterious Key');
            // Update inventory display
            this.game.updateInventoryDisplay();
        }
        this.showDialogue('You put the key in your pocket. This key looks ancient, and the symbol seems like some kind of code.', [
            { text: 'Bandage Friend', action: () => this.bandageFriend() }
        ]);
    }

    bandageFriend() {
        this.showDialogue(`You use the gauze to bandage ${this.friendName}'s ankle. ${this.getPronoun('subject')} winces in pain but forces a smile: "Thank you. Can we leave now?"`, [
            { text: 'Leave Dormitory', action: () => this.leaveDormitoryWithFriend() }
        ]);
    }

    pickUpPhoto() {
        this.showDialogue(`You pick up the photo. The scribbled-out face looks like it was done with a marker later, the edges somewhat blurry. The back of the photo reads: "They all must die."
${this.friendName} hurriedly snatches the photo: "This... this isn't mine! I don't know how I got this thing!"`, [
            { text: `Believe ${this.getPronoun('object')}`, action: () => this.trustFriend() },
            { text: 'Press for Answers', action: () => this.questionFriend() }
        ]);
    }

    trustFriend() {
        this.showDialogue(`You pat ${this.friendName} on the shoulder: "It's okay, maybe someone put it there as a prank. Let's get out of here quickly."
${this.friendName} nods gratefully and follows you out of the dormitory.`, [
            { text: 'Go to Canteen', action: () => this.loadScene('canteen') },
            { text: 'Go to Storage Room', action: () => this.loadScene('storageRoom') }
        ]);
    }

    questionFriend() {
        this.showDialogue(`You stare into ${this.friendName}'s eyes: "What's really going on? Who is this person in the photo?"
${this.friendName}'s expression stiffens: "I really don't know! If you don't believe me, I'll go alone!"
${this.getPronoun('subject')} angrily slams the door and leaves you alone in the dormitory.`, [
            { text: 'Chase After', action: () => this.chaseFriend() },
            { text: 'Explore Alone', action: () => this.enterSchool() }
        ]);
    }

    leaveDormitoryWithFriend() {
        this.game.updateGameMap('quadrangle');
        this.showDialogue(`${this.friendName} suddenly stops: "Wait... did you hear that? Sounds like... someone crying?"`, [
            { text: 'Go Towards Crying Sound', action: () => this.followCryingSound() },
            { text: 'Quickly Leave School', action: () => this.tryEscapeSchool() }
        ]);
    }

    chaseFriend() {
        this.game.updateGameMap('quadrangle');
        this.showDialogue(`You rush outside, but ${this.friendName} has already disappeared. Under the moonlight, only your own shadow is on the ground.
A cold wind blows, and you hear faint laughter in the distance.`, [
            { text: 'Go to Canteen', action: () => this.loadScene('canteen') },
            { text: 'Go to Storage Room', action: () => this.loadScene('storageRoom') }
        ]);
    }

    followCryingSound() {
        this.game.updateGameMap('storageRoom');
        this.showDialogue('The crying sound is coming from the direction of the storage room. You cautiously approach. The storage room door is ajar, with a faint light inside.', [
            { text: 'Enter and Investigate', action: () => this.loadScene('storageRoom') },
            { text: 'Return to Square', action: () => this.enterSchool() }
        ]);
    }

    tryEscapeSchool() {
        this.showDialogue('You run to the school gate and find it locked. There is a strange symbol on the lock, identical to the one on the key you found.', [
            { text: 'Use Key to Unlock', action: () => this.useMysteriousKey() },
            { text: 'Look for Another Exit', action: () => this.enterSchool() }
        ]);
    }

    useMysteriousKey() {
        // Check both key status and inventory for redundancy
        const hasKey = this.mysteriousKeyFound || this.game.gameState.inventory.includes('Mysterious Key') || this.game.gameState.inventory.includes('Bronze Key');

        if (hasKey) {
            this.showDialogue(`You take out the key and insert it into the lock. The key fits perfectly. With a "click," the lock opens.
${this.friendName} breathes a sigh of relief: "Great! Let's go quickly!"`, [
                { text: 'Leave School', action: () => this.escapeSchool() },
                { text: 'Continue Exploring', action: () => this.enterSchool() }
            ]);
        } else {
            this.showDialogue(`${this.friendName} says anxiously: "Then what should we do? Are we trapped here?"`, [
                { text: 'Search for Key', action: () => this.searchForKey() },
                { text: 'Look for Another Exit', action: () => this.enterSchool() }
            ]);
        }
    }

    escapeSchool() {
        this.showDialogue(`You rush out of the school gate and onto the street. Looking back, the school suddenly lights up with a red glow, followed by a piercing scream.
${this.friendName} tightly grabs your arm: "Did we... did we do something wrong?"
You notice a glimmer in ${this.getPronoun('possessive').toLowerCase()} eyes that you've never seen before.`, [
            { text: 'Continue...', action: () => this.showFriendAbductionScene() }
        ]);
    }

    showFriendAbductionScene() {
        this.playSound('horror');
        this.showDialogue(`Just as you are about to leave, the glimmer in ${this.friendName}'s eyes suddenly becomes brighter.
"Wait..." ${this.getPronoun('subject')} voice begins to tremble, "I... I feel something is wrong..."

A strange thick fog suddenly rises from the ground, instantly enveloping the entire street. A low growl comes from within the fog, as if from the depths of hell.

"Help!" ${this.friendName} suddenly screams. A giant black arm reaches out from the fog, like a demon's hand from another world, grabbing ${this.getPronoun('object')}.

"No! ${this.game.gameState.playerName}! Save me—" ${this.friendName}'s scream cuts through the night sky, then abruptly stops.

The fog dissipates, leaving you alone on the street. Your friend has disappeared. Only that photo remains on the ground, the scribbled-out face seemingly smiling at you.`, [
            { text: 'End Chapter 2', action: () => this.finishChapter() }
        ]);
    }

    searchForKey() {
        this.showDialogue(`${this.friendName} suddenly says: "I remember there was a first aid kit in the dormitory. Maybe there's a key inside?"`, [
            { text: 'Return to Dormitory', action: () => this.loadScene('dormitory') },
            { text: 'Search Elsewhere', action: () => this.enterSchool() }
        ]);
    }

    // Canteen Scene
    showCanteenScene() {
        this.game.gameState.currentScene = 'canteen';
        this.game.updateGameMap('canteen');
        this.showDialogue('The canteen is in disarray. Tables and chairs are overturned, food is spilled everywhere. The clock on the wall has stopped at 21:45.', [
            { text: 'Check Kitchen', action: () => this.checkKitchen() },
            { text: 'Check Convenience Store', action: () => this.checkCanteenStore() },
            { text: 'Leave Canteen', action: () => this.enterSchool() }
        ]);
    }

    checkKitchen() {
        this.showDialogue('The kitchen faucet is dripping. A dead rat floats in the sink. A menu is posted on the wall, but the dish names have been changed with a red pen to terrifying names like "Human Meat Bun" and "Eyeball Soup."', [
            { text: 'Check Refrigerator', action: () => this.checkFridge() },
            { text: 'Leave Kitchen', action: () => this.showCanteenScene() }
        ]);
    }

    checkCanteenStore() {
        this.showDialogue('The shelves in the convenience store are empty. Only an unopened bottle of mineral water sits on a corner shelf. A note is stuck to the bottle: "Don\'t drink the water here."', [
            { text: 'Take Mineral Water', action: () => this.takeMineralWater() },
            { text: 'Leave Store', action: () => this.showCanteenScene() }
        ]);
    }

    checkFridge() {
        this.showDialogue('The refrigerator emits a foul odor. Inside are a few moldy bread loaves and a carton of expired milk. At the very bottom lies a metal box engraved with the same symbol as the key.', [
            { text: 'Try to Open Box', action: () => this.tryOpenBox() },
            { text: 'Leave Fridge', action: () => this.checkKitchen() }
        ]);
    }

    takeMineralWater() {
        // Add mineral water to inventory (avoid duplicates)
        if (!this.game.gameState.inventory.includes('Mineral Water')) {
            this.game.gameState.inventory.push('Mineral Water');
            // Update inventory display
            this.game.updateInventoryDisplay();
        }
        this.showDialogue('You put the mineral water in your bag. Although the note warns against drinking it, it\'s good to have just in case.', [
            { text: 'Leave Store', action: () => this.showCanteenScene() }
        ]);
    }

    tryOpenBox() {
        if (this.mysteriousKeyFound) {
            this.showDialogue('You use the key to open the box. Inside is a yellowed diary page. It reads: "October 13th, experiment failed. They began exhibiting abnormal behavior. Must destroy all evidence, including... the test subject."', [
                { text: 'Take Diary', action: () => this.takeDiaryPage() },
                { text: 'Leave Kitchen', action: () => this.showCanteenScene() }
            ]);
        } else {
            this.showDialogue('The box is locked. You need a key to open it.', [
                { text: 'Leave Kitchen', action: () => this.showCanteenScene() }
            ]);
        }
    }

    takeDiaryPage() {
        // Add diary page to inventory (avoid duplicates)
        if (!this.game.gameState.inventory.includes('Diary Page')) {
            this.game.gameState.inventory.push('Diary Page');
            // Update inventory display
            this.game.updateInventoryDisplay();
        }
    }

    // Display death message with typewriter effect
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
    takeDiaryPage() {
        // Add diary page to inventory (avoid duplicates)
        if (!this.game.gameState.inventory.includes('Diary Page')) {
            this.game.gameState.inventory.push('Diary Page');
            // Update inventory display
            this.game.updateInventoryDisplay();
        }
        this.showDialogue('You put away the diary page. October 13th... that\'s the same date as the missing person notice on the bulletin board.', [
            { text: 'Leave Kitchen', action: () => this.showCanteenScene() }
        ]);
    }

    // Storage Room Scene
    showStorageRoomScene() {
        this.game.gameState.currentScene = 'storageRoom';
        this.game.updateGameMap('storageRoom');
        this.showDialogue('The storage room is piled high with old desks, chairs, and miscellaneous items. In the corner is an iron cage with a rusty lock. Something seems to be moving inside the cage.', [
            { text: 'Approach Cage', action: () => this.approachCage() },
            { text: 'Check Miscellaneous Items', action: () => this.checkStorageItems() },
            { text: 'Leave Storage Room', action: () => this.enterSchool() }
        ]);
    }

    approachCage() {
        this.playSound('ding');
        this.showDialogue('You approach the iron cage. The thing inside suddenly lets out a scream. By the moonlight, you see a figure in tattered clothes huddled in the corner, green light flashing in its eyes.\n"Save... save me..." it rasps.', [
            { text: 'Try to Open Cage', action: () => this.tryOpenCage() },
            { text: 'Step Back', action: () => this.showStorageRoomScene() }
        ]);
    }

    checkStorageItems() {
        // Add hammer to inventory (avoid duplicates)
        if (!this.game.gameState.inventory.includes('Hammer')) {
            this.game.gameState.inventory.push('Hammer');
            // Update inventory display
            this.game.updateInventoryDisplay();
        }
        // Add flashlight to inventory (avoid duplicates)
        if (!this.game.gameState.inventory.includes('Flashlight')) {
            this.game.gameState.inventory.push('Flashlight');
            // Update inventory display
            this.game.updateInventoryDisplay();
        }
        this.showDialogue('You rummage through the pile of miscellaneous items and find a rusty hammer and a flashlight. The flashlight still works, but the light is weak. You put them both in your bag.\nIn a wooden box, you find an old map marking various areas of the school, including a "Restricted Area" circled in red.', [
            { text: 'Take Map', action: () => this.takeStorageMap() },
            { text: 'Continue Searching', action: () => this.searchMoreItems() }
        ]);
    }

    tryOpenCage() {
        if (this.game.gameState.inventory.includes('Hammer')) {
            this.showDialogue('You use the hammer to break the lock. The iron cage door creaks open. The figure inside suddenly lunges at you, its nails digging deep into your arm.\n"Finally... free..." it lets out a piercing laugh and disappears into the darkness.', [
                { text: 'Treat Wound', action: () => this.treatWound() },
                { text: 'Leave Storage Room', action: () => this.enterSchool() }
            ]);
        } else {
            this.showDialogue('The cage is locked. You need a tool to open it.', [
                { text: 'Look for Tool', action: () => this.checkStorageItems() },
                { text: 'Leave Storage Room', action: () => this.enterSchool() }
            ]);
        }
    }

    takeStorageMap() {
        // Add restricted area map to inventory (avoid duplicates)
        if (!this.game.gameState.inventory.includes('Restricted Area Map')) {
            this.game.gameState.inventory.push('Restricted Area Map');
            // Update inventory display
            this.game.updateInventoryDisplay();
        }
        this.showDialogue('You put away the map. Restricted Area... what could that be?', [
            { text: 'Continue Searching', action: () => this.searchMoreItems() },
            { text: 'Leave Storage Room', action: () => this.enterSchool() }
        ]);
    }

    searchMoreItems() {
        // Add badge to inventory
        if (!this.game.gameState.inventory.includes('Badge')) {
            this.game.gameState.inventory.push('Badge');
            // Update inventory display
            this.game.updateInventoryDisplay();
        }
        this.playSound('horror');
        this.showDialogue('You continue searching and find a badge in a metal box, engraved with the same symbol as the key and the box.' +
            'Suddenly, the storage room lights flicker a few times and go out. In the darkness, you hear heavy footsteps approaching you.', [
            { text: 'Use Flashlight', action: () => this.useFlashlight() },
            { text: 'Leave Quickly', action: () => this.enterSchool() }
        ]);
    }

    useFlashlight() {
        if (this.game.gameState.inventory.includes('Flashlight')) {
            this.playSound('ding');
            this.showDialogue('You turn on the flashlight. The beam illuminates a figure in a security guard uniform. His face is distorted, his eyes without pupils.\n"Don\'t move..." he says in a mechanical voice, stepping closer to you.', [
                { text: 'Attack with Hammer', action: () => this.attackWithHammer() },
                { text: 'Turn and Run', action: () => this.enterSchool() }
            ]);
        } else {
            this.showDialogue('You don\'t have a flashlight and can\'t see in the dark. The footsteps are getting closer...', [
                { text: 'Run in the Dark', action: () => this.enterSchool() }
            ]);
        }
    }

    attackWithHammer() {
        if (this.game.gameState.inventory.includes('Hammer')) {
            this.playSound('ding');
            this.showDialogue('You raise the hammer and strike the security guard. The hammer passes through his body without causing any damage.\n"Attack ineffective..." he continues to approach, his hands grabbing your neck.', [
                { text: 'Struggle', action: () => this.struggle() },
                { text: 'Use Badge', action: () => this.useBadge() }
            ]);
        } else {
            this.showDialogue('You don\'t have a hammer and cannot attack.', [
                { text: 'Turn and Run', action: () => this.enterSchool() }
            ]);
        }
    }

    useBadge() {
        if (this.game.gameState.inventory.includes('Badge')) {
            this.showDialogue('You pull out the badge. The badge suddenly emits a strong light. The security guard screams and turns into a wisp of black smoke, disappearing.\nAfter the light fades, you notice the symbol on the badge has become clearer.', [
                { text: 'Put Away Badge', action: () => this.keepBadge() },
                { text: 'Leave Storage Room', action: () => this.enterSchool() }
            ]);
        } else {
            this.showDialogue('You don\'t have a badge.', [
                { text: 'Struggle', action: () => this.struggle() }
            ]);
        }
    }

    struggle() {
        this.showDialogue(`You struggle desperately, but the security guard is too strong. You feel difficulty breathing, your vision darkening...
Just then, the storage room door bursts open. ${this.friendName} rushes in: "Let ${this.getPronoun('object')} go!"
The security guard turns to look at ${this.friendName}, releases you, and turns into black smoke, disappearing.`, [
            { text: 'Thank Friend', action: () => this.thankFriend() },
            { text: 'Leave Storage Room', action: () => this.enterSchool() }
        ]);
    }

    keepBadge() {
        this.showDialogue('You put away the badge. This badge seems to have special power and might be useful in future adventures.', [
            { text: 'Leave Storage Room', action: () => this.enterSchool() }
        ]);
    }

    thankFriend() {
        this.showDialogue(`You gasp: "Thank you... I almost..."
${this.friendName} shakes head: "Don't mention it. Let's get out of here quickly. This place is too creepy."
You notice that ${this.getPronoun('possessive').toLowerCase()} hand is holding the photo you saw earlier in the dormitory.`, [
            { text: 'Ask About Photo', action: () => this.askAboutPhotoAgain() },
            { text: 'Leave Storage Room', action: () => this.enterSchool() }
        ]);
    }

    askAboutPhotoAgain() {
        this.showDialogue(`You point to the photo in ${this.friendName}'s hand: "How do you have this photo?"
${this.friendName}'s face changes: "I... I found it in the hallway just now. Maybe the wind blew it here."
${this.getPronoun('subject')} eyes dart around, avoiding your gaze.`, [
            { text: 'Press Further', action: () => this.pressFriend() },
            { text: 'Drop the Subject', action: () => this.enterSchool() }
        ]);
    }

    pressFriend() {
        this.showDialogue(`You grab ${this.friendName}'s wrist: "Tell me the truth! What's the deal with this photo?"
${this.friendName} violently shakes off your hand: "Enough! Who do you think you are? Why should I tell you?"
${this.getPronoun('subject')} turns and runs out of the storage room, the photo falling to the ground. You pick it up and find a new line of small text next to the scribbled-out face: "You're next."`, [
            { text: 'Chase After', action: () => this.chaseFriend() },
            { text: 'Explore Alone', action: () => this.enterSchool() }
        ]);
    }

    treatWound() {
        if (this.game.gameState.inventory.includes('Mineral Water') && this.game.gameState.inventory.includes('Gauze')) {
            this.showDialogue('You use the mineral water to rinse the wound, then bandage it with the gauze. The wound is deep but doesn\'t seem to be bleeding; instead, a black liquid is seeping out.', [
                { text: 'Leave Storage Room', action: () => this.enterSchool() }
            ]);
        } else {
            this.showDialogue('You don\'t have enough items to treat the wound. The wound begins to ache faintly, as if something is wriggling under the skin.', [
                { text: 'Leave Storage Room', action: () => this.enterSchool() }
            ]);
        }
    }

    // Show result screen
    showResultScreen() {
        // Hide game screen, show result screen
        this.game.elements.gameScreen.classList.add('hidden');
        this.game.elements.resultScreen.classList.remove('hidden');

        // Display chapter name and completion time
        const chapterName = 'Chapter 2 - "Dormitory Phantom"';
        const gameTime = this.game.gameState.gameTime || '22:30'; // Default value

        this.game.elements.resultChapter.textContent = chapterName;
        this.game.elements.resultTime.textContent = gameTime;

        // Show next chapter button
        const nextChapterBtn = this.game.elements.nextChapterBtn;
        nextChapterBtn.textContent = 'Enter Chapter 3';
        nextChapterBtn.classList.remove('hidden');
        nextChapterBtn.onclick = () => this.startChapter3();
    }

    // Finish chapter
    finishChapter() {
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

        this.game.unlockChapter('chapter3');

        // Show result screen
        this.showResultScreen();
    }

    startChapter3() {
        if (window.Chapter3) {
            this.game.elements.gameScreen.classList.add('hidden');
            this.game.chapter3 = new Chapter3(this.game);
            this.game.chapter3.start('22:30');
        } else {
            this.showDialogue('Unable to load Chapter 3 content. Please ensure Chapter3.js is correctly loaded.', [
                { text: 'Return to Chapter Select', action: () => this.game.returnToChapterSelect() }
            ]);
        }
    }
}

// Export Chapter2 class to window object for use in main game
window.Chapter2 = Chapter2;