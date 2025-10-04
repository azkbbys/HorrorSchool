class Chapter1 {
    constructor(game) {
        this.game = game;
        this.plotProgress = 0;
        this.ghostEncountered = false;
        this.keyFound = false;
        this.typingInterval = null;

        // 音效元素
        this.horrorDing = document.getElementById('horror-ding');
        this.horrorUp = document.getElementById('horror-up');

        // 确保game对象有showInputDialog方法
        if (!this.game.showInputDialog) {
            this.game.showInputDialog = function (message, inputPlaceholder, callback) {
                const dialogueText = document.getElementById('dialogue-text');
                const dialogueChoices = document.getElementById('dialogue-choices');
                const gameActions = document.getElementById('game-actions');
                let typingInterval;

                // 清空对话框
                dialogueText.innerHTML = '';
                dialogueChoices.innerHTML = '';
                gameActions.innerHTML = '';

                // 打字机效果显示消息
                let index = 0;
                const typeSpeed = 70; // 打字速度，毫秒/字符

                // 清除任何正在进行的打字动画
                if (this.typingInterval) {
                    clearInterval(this.typingInterval);
                }

                // 开始打字动画
                this.typingInterval = setInterval(() => {
                    if (index < message.length) {
                        dialogueText.textContent += message.charAt(index);
                        index++;
                    } else {
                        clearInterval(this.typingInterval);
                        // 打字完成后创建输入框
                        createInputElements();
                    }
                }, typeSpeed);

                // 创建输入框和按钮的函数
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

                    // 创建确认按钮
                    const confirmBtn = document.createElement('button');
                    confirmBtn.textContent = '确认';
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

                    // 允许按Enter键提交
                    input.addEventListener('keypress', function (e) {
                        if (e.key === 'Enter') {
                            callback(input.value);
                            inputContainer.remove();
                        }
                    });

                    inputContainer.appendChild(input);
                    inputContainer.appendChild(confirmBtn);
                    dialogueChoices.appendChild(inputContainer);

                    // 自动聚焦输入框
                    input.focus();
                }
            };
        }
    }

    // 播放音效
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
            console.warn('音效播放失败:', e);
        }
    }

    // 打字机效果显示对话
    showDialogue(text, choices) {
        // 直接使用游戏对象的showDialogue方法
        this.game.showDialogue(text, choices);
    }

    // 开始第一章
    // 开始第一章，接受可选的起始时间参数
    start(startTime = null) {
        this.game.gameState.currentChapter = 'chapter1';
        // 初始化游戏时间
        if (startTime) {
            this.updateGameTime(startTime);
        } else {
            this.updateGameTime('21:30'); // 默认起始时间
        }
        this.game.updateGameMap('corridor');
        this.plotProgress = 0;
        this.loadScene('corridor');
    }

    // 加载场景
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

    // 地下通道场景
    showUndergroundPassageScene() {
        this.game.gameState.currentScene = 'undergroundPassage';
        this.game.updateGameMap('undergroundPassage');
        this.showDialogue('石阶尽头是条潮湿的地下通道，墙壁上刻着奇怪的符号。远处传来水滴声和隐约的低语。', [
            { text: '继续前进', action: () => this.deepenExploration() }
        ]);
    }

    deepenExploration() {
        this.showDialogue('通道前方出现三个岔路口，每个路口都散发着不同的气味——铁锈、腐烂和消毒水。', [
            { text: '走铁锈味路口', action: () => this.chooseRustPath() },
            { text: '走腐烂味路口', action: () => this.chooseDecayPath() },
            { text: '走消毒水味路口', action: () => this.chooseDisinfectantPath() }
        ]);
    }

    chooseRustPath() {
        this.showDialogue('铁锈味的通道墙壁上布满管道，其中一根正在滴着红色液体。尽头隐约可见一扇铁门。', [
            { text: '检查铁门', action: () => this.examineIronDoor() }
        ]);
    }

    chooseDecayPath() {
        this.showDialogue('腐烂味的通道地面覆盖着粘稠的黑色物质，墙壁渗出粘液。远处传来类似咀嚼的声音。', [
            { text: '绕过粘液前进', action: () => this.navigateSlime() }
        ]);
    }

    chooseDisinfectantPath() {
        this.showDialogue('消毒水味的通道异常干净，两侧排列着标有"实验体"编号的金属柜。灯光忽明忽暗。', [
            { text: '打开最近的柜子', action: () => this.openExperimentCabinet() }
        ]);
    }

    examineIronDoor() {
        // 创建输入框形式的密码输入
        this.game.showInputDialog('铁门上有个八位数密码锁，旁边贴着泛黄的纸条："密码是第一个牺牲者的生日"。',
            '请输入八位数字密码',
            (input) => this.validatePassword(input));
    }

    // 验证密码
    validatePassword(inputPassword) {
        if (inputPassword === '19980613') {
            this.showDialogue('你输入了' + inputPassword + '，铁门发出沉重的响声，缓缓打开。门后是一个更大的地下空间。', [
                { text: '进入铁门', action: () => this.enterIronDoorArea() }
            ]);
        } else {
            this.showDialogue('密码错误！铁门发出刺耳的警报声，远处传来急促的脚步声。', [
                { text: '重新输入', action: () => this.examineIronDoor() },
                { text: '退回岔路口', action: () => this.deepenExploration() }
            ]);
        }
    }

    navigateSlime() {
        this.showDialogue('你踮脚绕过粘液，却踢到一个金属罐。声音惊动了黑暗中的东西——一双发光的眼睛正朝你靠近。', [
            { text: '退回岔路口', action: () => this.deepenExploration() },
            { text: '拿出地图防御', action: () => this.useMapAsShield() }
        ]);
    }

    openExperimentCabinet() {
        this.showDialogue('柜子里是个玻璃容器，浸泡着类似心脏的器官，标签写着："实验体-07，1998.06.13"。', [
            { text: '记录日期', action: () => this.noteExperimentDate() }
        ]);
    }

    noteExperimentDate() {
        this.game.gameState.experimentDate = '19980613';
        this.showDialogue('你记下了日期：1998年6月13日。这个日期似乎很重要，可能和什么密码有关。', [
            { text: '继续探索', action: () => this.deepenExploration() }
        ]);
    }

    // 旧的密码输入方法，保留但不再使用
    enterDoorPassword() {
        this.validatePassword('19980613');
    }

    useMapAsShield() {
        this.showDialogue('你迅速拿出地图挡在面前，地图突然发出微弱的光芒，逼退了黑暗中的生物。', [
            { text: '继续前进', action: () => this.proceedThroughSlime() }
        ]);
    }

    enterIronDoorArea() {
        this.game.gameState.currentScene = 'ironDoorArea';
        this.game.updateGameMap('ironDoorArea');
        this.showDialogue('铁门后是一个巨大的地下实验室，中央摆放着一个发光的容器，里面漂浮着类似人形的影子。', [
            { text: '接近容器', action: () => this.approachContainer() }
        ]);
    }

    proceedThroughSlime() {
        this.game.gameState.currentScene = 'slimeExit';
        this.game.updateGameMap('slimeExit');
        this.showDialogue('你穿过粘液区，发现一扇刻有奇怪符号的石门。符号与序章日记中的标记一模一样。', [
            { text: '尝试开门', action: () => this.tryOpenStoneDoor() }
        ]);
    }

    approachContainer() {
        this.showDialogue('你靠近容器，里面的人形影子突然睁开眼睛，死死盯着你。容器表面开始出现裂纹。', [
            { text: '后退', action: () => this.backAwayFromContainer() },
            { text: '触摸容器', action: () => this.touchContainer() }
        ]);
    }

    tryOpenStoneDoor() {
        if (this.game.gameState.inventory.includes('地下室地图')) {
            this.showDialogue('你将地图按在石门上，地图发出金色光芒，与石门上的符号产生共鸣。石门缓缓打开。', [
                { text: '进入门内', action: () => this.enterStoneDoor() }
            ]);
        } else {
            this.showDialogue('石门纹丝不动。你需要找到某种钥匙或方法来打开它。', [
                { text: '返回岔路口', action: () => this.deepenExploration() }
            ]);
        }
    }

    backAwayFromContainer() {
        this.playSound('horror');
        this.showDialogue('你迅速后退，容器在你面前爆炸，释放出大量黑色烟雾。烟雾中传来凄厉的尖叫。', [
            { text: '逃离实验室', action: () => this.escapeLab() }
        ]);
    }

    touchContainer() {
        this.showDialogue('你触摸容器的瞬间，一道强光闪过。你发现自己站在学校的操场上，但周围的一切都呈现出诡异的红色。', [
            { text: '探索红色操场', action: () => this.exploreRedPlayground() }
        ]);
    }

    enterStoneDoor() {
        this.game.gameState.currentScene = 'stoneDoorChamber';
        this.game.updateGameMap('stoneDoorChamber');
        this.showDialogue('门后是一个古老的石室，中央有一个祭坛，上面放着一本黑色封面的书。', [
            { text: '打开书本', action: () => this.openBlackBook() }
        ]);
    }

    escapeLab() {
        this.showDialogue('你沿着来路逃离实验室，却发现出口不知何时变成了教室的门。当你推开门，发现自己回到了晚自习后的教室，一切仿佛从未发生过。', [
            { text: '查看教室', action: () => this.returnToClassroom() }
        ]);
    }

    exploreRedPlayground() {
        this.game.gameState.currentScene = 'redPlayground';
        this.game.updateGameMap('redPlayground');
        this.showDialogue('红色的操场寂静无声，跑道上残留着奇怪的痕迹。操场中央的旗杆上挂着一面褪色的旗帜，上面画着与石门相同的符号。', [
            { text: '走向旗杆', action: () => this.approachFlagpole() }
        ]);
    }

    openBlackBook() {
        this.showDialogue('书本打开的瞬间，无数黑色的文字从书页中飞出，钻入你的脑海。你看到了学校的过去，看到了那些被遗忘的灵魂。', [
            { text: '继续阅读', action: () => this.continueReadingBook() }
        ]);
    }

    approachFlagpole() {
        this.game.showDialogue('你走向旗杆，旗帜突然剧烈摇晃，发出刺耳的噪音。地面开始震动，一个巨大的裂缝在你面前张开。', [
            { text: '后退', action: () => this.backAwayFromCrack() },
            { text: '跳进裂缝', action: () => this.jumpIntoCrack() }
        ]);
    }

    continueReadingBook() {
        this.game.showDialogue('书本中的文字告诉你，这所学校建立在一个古老的祭坛上，每年都需要献祭一个灵魂才能维持平衡。今年的献祭日期，正是今天。书上还标记了祭坛的位置，就在学校的地下核心区域。', [
            { text: '合上书本', action: () => this.closeBlackBook() },
            { text: '前往地下核心', action: () => this.reachFinalArea() }
        ]);
    }

    backAwayFromCrack() {
        this.game.showDialogue('你迅速后退，裂缝在你身后闭合。操场恢复了平静，但颜色依然是诡异的红色。你注意到操场中央出现了一个发光的符号，与你在地下见过的核心区域标记相同。', [
            { text: '走向符号', action: () => this.reachFinalArea() },
            { text: '寻找出口', action: () => this.searchForExit() }
        ]);
    }

    jumpIntoCrack() {
        this.game.gameState.currentScene = 'undergroundAbyss';
        this.game.updateGameMap('undergroundAbyss');
        this.game.showDialogue('你跳进裂缝，坠落了很久才着地。周围一片漆黑，只能听到远处传来的滴水声。', [
            { text: '向前探索', action: () => this.exploreAbyss() }
        ]);
    }

    closeBlackBook() {
        this.game.showDialogue('你合上书本，祭坛开始震动。石室的墙壁上出现了新的通道。', [
            { text: '进入新通道', action: () => this.enterNewPassage() }
        ]);
    }

    searchForExit() {
        this.game.showDialogue('你在红色操场寻找出口，发现所有的校门都被红色的雾气封锁。雾气中似乎有什么东西在移动。你突然想起书上提到的地下核心区域，或许那才是真正的出口。', [
            { text: '返回教室', action: () => this.returnToClassroom() },
            { text: '寻找地下核心入口', action: () => this.reachFinalArea() }
        ]);
    }

    exploreAbyss() {
        this.game.showDialogue('你向前探索，脚下的地面变得越来越湿滑。突然，你听到了前方传来低沉的呼吸声。', [
            { text: '继续前进', action: () => this.faceAbyssCreature() }
        ]);
    }

    enterNewPassage() {
        this.game.gameState.currentScene = 'hiddenCatacombs';
        this.game.updateGameMap('hiddenCatacombs');
        this.game.showDialogue('新通道通向一处地下墓穴，墙壁上刻满了奇怪的符号。通道的尽头有一扇青铜门，上面镶嵌着一块发光的宝石。', [
            { text: '触摸宝石', action: () => this.touchGemstone() }
        ]);
    }

    faceAbyssCreature() {
        this.game.showDialogue('你继续前进，看到一个巨大的黑色生物蜷缩在洞穴的角落。它的眼睛发出幽绿的光芒，注意到了你的存在。', [
            { text: '尝试沟通', action: () => this.communicateWithCreature() },
            { text: '转身逃跑', action: () => this.runFromCreature() }
        ]);
    }

    touchGemstone() {
        this.game.showDialogue('你触摸宝石，宝石发出刺眼的光芒。青铜门缓缓打开，露出后面的通道。', [
            { text: '进入通道', action: () => this.enterBronzeDoor() }
        ]);
    }

    returnToClassroom() {
        this.game.gameState.currentScene = 'classroom';
        this.game.updateGameMap('classroom');
        this.game.showDialogue('你回到了教室，一切看起来都很正常，仿佛刚才的经历只是一场梦。但你知道那不是梦。', [
            { text: '再次检查教室', action: () => this.examineClassroomAgain() },
            { text: '离开教室', action: () => this.leaveClassroom() }
        ]);
    }

    communicateWithCreature() {
        this.game.showDialogue('你尝试与生物沟通，它发出低沉的声音，似乎在诉说着什么。你听不懂它的语言，但能感受到它的痛苦和愤怒。', [
            { text: '表示友好', action: () => this.showFriendship() }
        ]);
    }

    runFromCreature() {
        this.game.showDialogue('你转身逃跑，但生物的速度远超你的想象。它轻易地追上了你，将你笼罩在它的阴影之下。', [
            { text: '放弃抵抗', action: () => this.surrenderToCreature() }
        ]);
    }

    enterBronzeDoor() {
        this.game.gameState.currentScene = 'innerSanctum';
        this.game.updateGameMap('innerSanctum');
        this.game.showDialogue('青铜门后的通道通向一个神圣的内殿。中央有一个水池，水池中漂浮着一朵黑色的莲花。', [
            { text: '触摸莲花', action: () => this.touchBlackLotus() },
            { text: '探索内殿', action: () => this.reachFinalArea() }
        ]);
    }

    examineClassroomAgain() {
        this.game.showDialogue('你再次检查教室，发现黑板上不知何时出现了一行字："没有出口，只有更深入"。', [
            { text: '坐回座位', action: () => this.sitAtDesk() }
        ]);
    }

    leaveClassroom() {
        this.game.showDialogue('你离开教室，走廊里空无一人。所有的教室门都紧闭着，只有楼梯间的门微微敞开。', [
            { text: '去楼梯间', action: () => this.goToStairs() }
        ]);
    }

    showFriendship() {
        this.game.showDialogue('你向生物表示友好，它似乎感受到了你的善意，逐渐平静下来。它转身走向洞穴深处，示意你跟随它。', [
            { text: '跟随生物', action: () => this.followCreature() }
        ]);
    }

    surrenderToCreature() {
        this.game.showDialogue('你放弃抵抗，闭上了眼睛。但想象中的疼痛并没有到来。当你睁开眼睛，发现自己回到了教室，周围的一切都很正常。', [
            { text: '怀疑现实', action: () => this.doubtReality() }
        ]);
    }

    touchBlackLotus() {
        this.game.showDialogue('你触摸黑色莲花，莲花突然绽放，散发出强烈的光芒。光芒消散后，你发现自己站在一个巨大的地下空间入口。', [
            { text: '进入空间', action: () => this.reachFinalArea() }
        ]);
    }

    sitAtDesk() {
        this.game.showDialogue('你坐回座位，发现桌子上有一张纸条，上面写着："欢迎回来，下一次探索即将开始"。', [
            { text: '等待', action: () => this.waitForNextEvent() }
        ]);
    }

    goToStairs() {
        this.game.gameState.currentScene = 'stairs';
        this.game.updateGameMap('stairs');
        this.game.showDialogue('你来到楼梯间，楼梯似乎比平时更长。楼梯下方一片漆黑，上方则被红色的雾气笼罩。', [
            { text: '下楼', action: () => this.goDownstairs() },
            { text: '上楼', action: () => this.goUpstairs() }
        ]);
    }

    followCreature() {
        this.game.gameState.currentScene = 'creatureLair';
        this.game.updateGameMap('creatureLair');
        this.game.showDialogue('你跟随生物来到它的巢穴，巢穴中央有一个发光的水晶。生物用头轻触水晶，水晶发出柔和的光芒。', [
            { text: '触摸水晶', action: () => this.touchCrystal() }
        ]);
    }

    doubtReality() {
        this.game.showDialogue('你开始怀疑现实的真实性。周围的一切看起来都很正常，但你知道有些事情不对劲。你决定再次探索学校。', [
            { text: '离开教室', action: () => this.leaveClassroom() }
        ]);
    }

    acceptAbsorption() {
        this.game.gameState.currentScene = 'lotusDimension';
        this.game.updateGameMap('lotusDimension');
        this.game.showDialogue('你被吸入莲花中，发现自己身处一个奇异的维度。周围是无尽的花海，每一朵花都散发着微弱的光芒。', [
            { text: '探索花海', action: () => this.exploreFlowerField() }
        ]);
    }

    waitForNextEvent() {
        this.game.showDialogue('你等待着，教室的灯光突然闪烁了几下。当灯光恢复正常时，黑板上的字消失了，取而代之的是一张地图，标记着学校的各个区域。', [
            { text: '查看地图', action: () => this.examineNewMap() }
        ]);
    }

    goUpstairs() {
        this.game.gameState.currentScene = 'upperFloor';
        this.game.updateGameMap('upperFloor');
        this.game.showDialogue('你上楼，发现楼上的走廊与楼下的截然不同。墙壁上挂着古老的画像，画像中的人物似乎在盯着你看。', [
            { text: '继续前进', action: () => this.exploreUpperFloor() }
        ]);
    }

    touchCrystal() {
        this.game.showDialogue('你触摸水晶，水晶发出耀眼的光芒。光芒闪过，你发现自己身处一个陌生的地下空间入口。', [
            { text: '进入空间', action: () => this.reachFinalArea() }
        ]);
    }

    exploreFlowerField() {
        this.game.gameState.currentScene = 'flowerField';
        this.game.updateGameMap('flowerField');
        this.game.showDialogue('你在花海中探索，发现每一朵花都对应着学校里的一个灵魂。它们似乎在向你诉说着什么。', [
            { text: '倾听灵魂', action: () => this.listenToSouls() },
            { text: '离开花海', action: () => this.reachFinalArea() }
        ]);
    }

    listenToSouls() {
        this.game.showDialogue('你倾听灵魂的诉说，它们告诉你学校的秘密和一个被遗忘的地下核心区域。灵魂们引导你找到了通往核心区域的入口。', [
            { text: '进入核心区域', action: () => this.reachFinalArea() }
        ]);
    }

    examineNewMap() {
        this.game.showDialogue('你查看地图，发现地图上标记了一个你从未见过的区域——"地下核心"。地图上显示，这就是你一直在寻找的最终区域。', [
            { text: '前往地下核心', action: () => this.reachFinalArea() }
        ]);
    }

    exploreUpperFloor() {
        this.game.gameState.currentScene = 'upperFloorCorridor';
        this.game.updateGameMap('upperFloorCorridor');
        this.game.showDialogue('你继续前进，发现走廊的尽头有一扇门，门上挂着一个牌子，写着"校长室"。', [
            { text: '进入校长室', action: () => this.enterPrincipalsOffice() },
            { text: '返回楼梯间', action: () => this.goToStairs() }
        ]);
    }

    enterPrincipalsOffice() {
        this.game.gameState.currentScene = 'principalsOffice';
        this.game.updateGameMap('principalsOffice');
        this.game.showDialogue('校长办公室里布满灰尘，办公桌上有一张泛黄的照片，照片上的人穿着旧式校服。墙上挂着一幅学校的老地图。', [
            { text: '查看老地图', action: () => this.examineOldMap() }
        ]);
    }

    examineOldMap() {
        this.game.showDialogue('老地图上标记着学校的各个区域，其中地下室区域被特别圈了出来，并标注着"通往核心"。', [
            { text: '前往地下室核心', action: () => this.reachFinalArea() }
        ]);
    }

    // 走廊场景
    showCorridorScene() {
        this.game.gameState.currentScene = 'corridor';
        this.game.updateGameMap('corridor');

        if (this.plotProgress === 0) {
            this.game.showDialogue('晚自习后的走廊异常安静，你总感觉有什么东西在盯着你。', [
                { text: '走向楼梯', action: () => this.goToStaircase() },
                { text: '返回教室', action: () => this.returnToClassroom() }
            ]);
        } else if (this.plotProgress === 1) {
            this.game.showDialogue('走廊里的温度突然下降，你看到墙上有奇怪的影子在晃动。', [
                { text: '继续前进', action: () => this.goToStaircase() },
                { text: '查看影子', action: () => this.examineShadow() }
            ]);
        } else {
            this.game.showDialogue('走廊里回荡着诡异的笑声，你必须尽快离开这里。', [
                { text: '冲向楼梯', action: () => this.goToStaircase() }
            ]);
        }
    }

    // 楼梯场景
    showStaircaseScene() {
        this.game.gameState.currentScene = 'staircase';
        this.game.updateGameMap('staircase');

        if (this.plotProgress === 1 && !this.ghostEncountered) {
            if (this.game.gameState.inventory.includes('地下室地图')) {
                this.game.showDialogue('你来到楼梯间，想起序章得到的地下室地图，决定按地图指示探索。', [
                    { text: '按地图下楼去地下室', action: () => this.goToBasement() },
                    { text: '先去美术教室', action: () => this.goDownstairs() }
                ]);
            } else {
                this.game.showDialogue('你来到楼梯间，楼梯上似乎有水滴落的声音，但周围并没有水。', [
                    { text: '上楼', action: () => this.goUpstairs() },
                    { text: '下楼', action: () => this.goDownstairs() }
                ]);
            }
        } else if (this.plotProgress === 2 && this.ghostEncountered) {
            this.game.showDialogue('你逃离了艺术教室，鬼魂的哭喊声在身后回荡。', [
                { text: '继续下楼', action: () => this.goToBasement() }
            ]);
        } else {
            this.game.showDialogue('楼梯间弥漫着一股腐臭味，你不敢久留。', [
                { text: '下楼去地下室', action: () => this.goToBasement() },
                { text: '返回走廊', action: () => this.returnToCorridor() }
            ]);
        }
    }

    // 美术教室场景
    showArtRoomScene() {
        this.game.gameState.currentScene = 'artRoom';
        this.game.updateGameMap('artRoom');

        if (!this.ghostEncountered) {
            this.game.showDialogue('美术教室里的画都被翻了出来，地上散落着画笔和颜料。墙上有一幅未完成的肖像画，眼睛的位置是空的。', [
                { text: '查看肖像画', action: () => this.examinePainting() },
                { text: '离开教室', action: () => this.returnToStaircase() }
            ]);
        } else {
            this.game.showDialogue('肖像画的眼睛里流出了红色的液体，鬼魂的手从画布中伸了出来！', [
                { text: '快速逃离', action: () => this.escapeArtRoom() }
            ]);
        }
    }

    // 地下室场景
    showBasementScene() {
        this.game.gameState.currentScene = 'basement';
        this.game.updateGameMap('basement');

        if (!this.keyFound) {
            this.game.showDialogue('地下室阴暗潮湿，角落里堆放着旧家具和杂物。墙上挂着一把生锈的钥匙。', [
                { text: '拿起钥匙', action: () => this.takeKey() },
                { text: '探索其他区域', action: () => this.exploreBasement() }
            ]);
        } else {
            this.game.showDialogue('你找到了一把奇怪的钥匙，它似乎能打开什么重要的门。', [
                { text: '返回楼梯间', action: () => this.returnToStaircase() }
            ]);
        }
    }

    // 场景转换方法
    goToStaircase() {
        this.plotProgress = 1;
        this.loadScene('staircase');
    }

    returnToClassroom() {
        this.game.showDialogue('教室的门已经锁上了，你无法进去。', [
            { text: '返回走廊', action: () => this.loadScene('corridor') }
        ]);
    }

    examineShadow() {
        this.game.showDialogue('影子突然变得清晰，是一个穿着校服的女孩的轮廓。她慢慢转过脸，你看到她的眼睛里流出了血。', [
            { text: '后退', action: () => this.goToStaircase() },
            { text: '保持不动', action: () => this.encounterGhost() }
        ]);
    }

    goUpstairs() {
        this.game.showDialogue('楼上的门被锁住了，你无法通过。', [
            { text: '下楼', action: () => this.goDownstairs() }
        ]);
    }

    goDownstairs() {
        this.plotProgress = 2;
        this.loadScene('artRoom');
    }

    examinePainting() {
        this.ghostEncountered = true;
        this.playSound('horror');
        this.game.showDialogue('你走近肖像画，突然画中的眼睛开始流血，画中女孩的嘴微微张开，发出了刺耳的尖叫！', [
            { text: '逃离教室', action: () => this.escapeArtRoom() }
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
        this.showDeath('女孩的鬼魂扑向了你，你感到一阵刺骨的寒冷，然后什么都不知道了...');
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
        this.game.gameState.inventory.push('生锈的钥匙');
        // 更新物品栏显示
        this.game.updateInventoryDisplay();
        this.game.showDialogue('你拿起了生锈的钥匙，它看起来很古老。', [
            { text: '继续探索', action: () => this.exploreBasement() }
        ]);
    }

    exploreBasement() {
        if (this.keyFound) {
            if (!this.ghostEncountered) {
                this.game.showDialogue('你听到身后传来脚步声，一个穿着校服的女孩出现在地下室入口，她的眼睛流着血。', [
                    { text: '逃跑', action: () => this.encounterGhost() },
                    { text: '用钥匙对抗', action: () => this.useKeyAgainstGhost() }
                ]);
            } else {
                this.game.showDialogue('你在地下室深处发现了一个隐藏的门，上面有一个古老的锁。你的钥匙正好能打开它！', [
                    { text: '打开门', action: () => this.openSecretDoor() }
                ]);
            }
        } else {
            this.game.showDialogue('地下室深处传来奇怪的声音，你觉得最好不要靠近。', [
                { text: '返回楼梯间', action: () => this.returnToStaircase() }
            ]);
        }
    }

    useKeyAgainstGhost() {
        this.ghostEncountered = true;
        this.playSound('ding');
        this.game.showDialogue('你用生锈的钥匙指向鬼魂，钥匙发出微弱的光芒，鬼魂后退了几步。', [
            { text: '检查隐藏门', action: () => this.exploreBasement() }
        ]);
    }

    // 打开秘密门
    openSecretDoor() {
        this.game.showDialogue('门后是一段向下延伸的石阶，墙壁渗出潮湿的水珠。地图上没有标记这个区域，你正进入学校从未被记载的深层结构。', [
            { text: '继续下行', action: () => this.loadScene('undergroundPassage') }
        ]);
    }

    // 共同结局区域
    reachFinalArea() {
        // 更新游戏时间
        this.updateGameTime('22:30');
        this.game.showDialogue('你穿过最后一道门，发现自己身处一个巨大的地下空间。中央有一个发光的祭坛，上面刻着与地图相同的符号。', [
            { text: '靠近祭坛', action: () => this.approachFinalAltar() }
        ]);
    }

    approachFinalAltar() {
        // 更新游戏时间到结局时间
        this.updateGameTime('22:45');
        this.game.showDialogue('当你靠近祭坛，地面开始震动。祭坛上的符号发出刺眼的光芒，你感到意识逐渐模糊...', [
            { text: '接受一切', action: () => this.completeChapter() }
        ]);
    }

    // 完成章节
    completeChapter() {
        // 播放LongScream音频
        const longScream = document.getElementById('long-scream');
        if (longScream) {
            longScream.currentTime = 0;
            longScream.play().catch(error => {
                console.error('播放LongScream音频失败:', error);
            });

            // 4秒后停止播放
            setTimeout(() => {
                if (!longScream.paused) {
                    longScream.pause();
                }
            }, 4000);
        }

        // 显示结算画面
        this.showResultScreen();
    }

    // 打字机效果显示死亡信息
    showDeath(message) {
        // 清除正在进行的打字动画
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
            this.typingInterval = null;
        }

        // 获取死亡信息元素
        const deathMessageElement = this.game.elements.deathMessage;
        deathMessageElement.textContent = ''; // 清空文本

        // 隐藏游戏屏幕并显示死亡屏幕
        this.game.elements.gameScreen.classList.add('hidden');
        this.game.elements.deathScreen.classList.remove('hidden');

        let index = 0;
        const typeSpeed = 70; // 打字速度，70ms/字符

        // 开始打字动画
        this.typingInterval = setInterval(() => {
            if (index < message.length) {
                deathMessageElement.textContent += message.charAt(index);
                index++;
            } else {
                clearInterval(this.typingInterval);
                this.typingInterval = null;
                // 显示重新开始按钮
                setTimeout(() => {
                    this.game.elements.restartBtn.classList.remove('hidden');
                    this.game.elements.restartBtn.onclick = () => {
                        // 调用游戏重启方法
                        this.game.returnToMainMenu();
                    };
                }, 500);
            }
        }, typeSpeed);
    }

    // 更新游戏时间（确保时间只能前进）
    updateGameTime(time) {
        // 解析当前时间和新时间
        const currentTime = this.parseTime(this.game.gameState.gameTime || '21:30');
        const newTime = this.parseTime(time);

        // 只有当新时间晚于当前时间时才更新
        if (newTime > currentTime) {
            this.game.gameState.gameTime = time;
        }
    }

    // 解析时间字符串为分钟数（用于比较）
    parseTime(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    // 结算画面
    showResultScreen() {
        // 隐藏游戏屏幕，显示结果屏幕
        this.game.elements.gameScreen.classList.add('hidden');
        this.game.elements.resultScreen.classList.remove('hidden');

        // 显示章节名称和通关时间
        const chapterName = '第一章-「初见幽凄」';
        const gameTime = this.game.gameState.gameTime || '22:30'; // 默认值

        this.game.elements.resultChapter.textContent = chapterName;
        this.game.elements.resultTime.textContent = gameTime;

        // 显示下一章按钮
        const nextChapterBtn = this.game.elements.nextChapterBtn;
        nextChapterBtn.textContent = '进入第二章';
        nextChapterBtn.classList.remove('hidden');
        nextChapterBtn.onclick = () => this.game.goToNextChapter();

        // 确保解锁第二章
        setTimeout(() => {
            this.game.unlockChapter('chapter2');
        }, 500);
    }

    // 返回主页
    returnToMainMenu() {
        // 隐藏结果屏幕
        this.game.elements.resultScreen.classList.add('hidden');
        // 确保解锁第二章
        this.game.unlockChapter('chapter2');
        // 强制更新章节选择界面
        this.game.updateChapterAvailability();
        // 显示章节选择屏幕
        this.game.returnToChapterSelect();
    }
}

// 导出Chapter1类到window对象，以便在主游戏中使用
window.Chapter1 = Chapter1;