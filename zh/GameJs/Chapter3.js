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
                this.game.horrorDing.play().catch(e => console.log('音效播放失败:', e));
            } else if (soundName === 'horror' && this.game.horrorUp) {
                this.game.horrorUp.currentTime = 0;
                this.game.horrorUp.play().catch(e => console.log('音效播放失败:', e));
            }
        } catch (error) {
            console.log('音效播放错误:', error);
        }
    }

    // 根据玩家性别获取朋友的正确代词
    getFriendPronoun(type) {
        // 检查是否为非正常性别
        const abnormalGenders = ['沃尔玛购物袋', '武装直升机'];
        if (abnormalGenders.includes(this.game.gameState.playerGender)) {
            return '它';
        }

        const isMale = this.game.gameState.playerGender === 'male';
        switch (type) {
            case 'subject': // 主格 (他/她)
                return isMale ? '他' : '她';
            case 'object': // 宾格 (他/她)
                return isMale ? '他' : '她';
            case 'possessive': // 所有格 (他的/她的)
                return isMale ? '他的' : '她的';
            case 'pronoun': // 代词 (他/她)
                return isMale ? '他' : '她';
            default:
                return isMale ? '他' : '她';
        }
    }

    // 根据玩家性别获取朋友名字
    getFriendName() {
        const abnormalGenders = ['沃尔玛购物袋', '武装直升机'];
        if (abnormalGenders.includes(this.game.gameState.playerGender)) {
            return Math.random() < 0.5 ? '汪汪' : '喵喵';
        }
        return this.game.gameState.playerGender === "male" ? "张伟" : "李娜";
    }

    // 打字机效果显示对话
    showDialogue(text, choices) {
        // 直接使用游戏对象的showDialogue方法
        this.game.showDialogue(text, choices);
    }

    // 开始第三章
    start(startTime = null) {
        this.game.gameState.currentChapter = 'chapter3';
        // 初始化游戏时间
        if (startTime) {
            this.updateGameTime(startTime);
        } else {
            this.updateGameTime('22:30'); // 默认起始时间
        }
        // 添加手机到物品栏
        if (!this.game.gameState.inventory.includes('手机')) {
            this.game.gameState.inventory.push('手机');
            // 更新物品栏显示
            this.game.updateInventoryDisplay();
        }

        // 检测是否有徽章，没有则自动添加
        if (!this.game.gameState.inventory.includes('徽章')) {
            this.game.gameState.inventory.push('徽章');
            // 更新物品栏显示
            this.game.updateInventoryDisplay();
        }
        this.game.updateGameMap('schoolGate');
        this.plotProgress = 0;
        this.loadScene('schoolGate');
    }

    // 更新游戏时间
    updateGameTime(time) {
        this.game.gameState.gameTime = time;
        this.game.elements.currentTimeDisplay.textContent = time;
    }

    // 加载场景
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

    // 宿舍场景
    showDormitoryScene() {
        this.game.gameState.currentScene = 'dormitory';
        this.game.updateGameMap('dormitory');
        const friendName = this.getFriendName();

        if (this.friendSaved) {
            this.showDialogue(`${friendName}在宿舍里来回踱步，看起来很焦虑。"我们接下来该怎么办？学校里的那些东西越来越多了。"`, [
                { text: '一起探索教学楼', action: () => this.loadScene('foyer') },
                { text: '调查旧翼楼', action: () => this.loadScene('abandonedWing') }
            ]);
        } else {
            this.showDialogue(`宿舍里空无一人，但你注意到${friendName}的床上有一本打开的日记。日记的最后一页写着："我必须去旧翼楼，那里有真相。"`, [
                { text: '前往旧翼楼', action: () => this.loadScene('abandonedWing') },
                { text: '返回学校大门', action: () => this.loadScene('schoolGate') }
            ]);
        }
    }

    // 朋友房间场景
    showFriendRoomScene() {
        this.game.gameState.currentScene = 'friendRoom';
        this.game.updateGameMap('friendRoom');
        const friendName = this.getFriendName();

        if (this.friendSaved) {
            this.showDialogue(`${friendName}的房间很整洁，但空气中弥漫着一股奇怪的气味。书桌上放着一张你们的合照，照片背面写着：'永远的朋友'。`, [
                { text: `和${this.getFriendPronoun('object')}交谈`, action: () => this.talkToFriend() },
                { text: '离开房间', action: () => this.enterSchool() }
            ]);
        } else {
            this.showDialogue(`这是${friendName}的房间，但里面空无一人。床上的被子凌乱，似乎主人匆忙离开。书桌上有一本日记，最后一页写着：'我看到了红色的眼睛...'`, [
                { text: '查看日记', action: () => this.readFriendDiary() },
                { text: '离开房间', action: () => this.enterSchool() }
            ]);
        }
    }

    talkToFriend() {
        const friendName = this.getFriendName();
        this.showDialogue(`${friendName}看起来很疲惫："我还是不敢相信发生的一切。那个黑影...它一直在跟着我。"`, [
            { text: `安慰${this.getFriendPronoun('object')}`, action: () => this.comfortFriend() },
            { text: '一起探索学校', action: () => this.exploreWithFriend() }
        ]);
    }

    readFriendDiary() {
        const friendName = this.getFriendName();
        this.showDialogue(`日记里记录了${friendName}最近的遭遇："我开始做噩梦，梦见红色的眼睛和黑色的影子。今天我在旧教学楼看到了奇怪的符号，它们好像在召唤什么..."`, [
            { text: '继续查看', action: () => this.continueReadingDiary() },
            { text: '离开房间', action: () => this.enterSchool() }
        ]);
    }

    comfortFriend() {
        const friendName = this.getFriendName();
        this.showDialogue(`${friendName}勉强笑了笑："谢谢你，有你在我感觉好多了。"`, [
            { text: '一起离开学校', action: () => this.leaveWithFriend() },
            { text: '一起探索学校', action: () => this.exploreWithFriend() }
        ]);
    }

    continueReadingDiary() {
        const friendName = this.getFriendName();
        this.showDialogue(`日记的最后几页被撕毁了，只剩下一句话："10月13日，祭坛将再次苏醒..."`, [
            { text: '离开房间', action: () => this.enterSchool() }
        ]);
    }

    // 学校门口场景
    showSchoolGateScene() {
        this.game.gameState.currentScene = 'schoolGate';
        this.game.updateGameMap('schoolGate');

        if (this.plotProgress === 0) {
            this.showDialogue('你冲出校门，却发现街道上空无一人。路灯忽明忽暗，地面上的影子呈现出扭曲的形状。回头望去，学校的轮廓在夜色中显得异常狰狞。', [
                { text: '返回学校', action: () => this.enterSchool() },
                { text: '查看手机', action: () => this.checkPhone() }
            ]);
        } else if (this.plotProgress === 1) {
            this.showDialogue('你站在校门口，犹豫着是否要再次进入这个充满恐怖的地方。突然，你听到身后传来脚步声。', [
                { text: '转身查看', action: () => this.seeWhoIsThere() },
                { text: '快速进入学校', action: () => this.enterSchool() }
            ]);
        }
    }

    checkPhone() {
        if (this.game.gameState.inventory.includes('手机')) {
            this.showDialogue('你掏出手机，发现没有信号。相册里的照片变得扭曲，所有人物的脸都被涂黑了。最后一张照片是学校的全景，中央有一个发光的红点。', [
                { text: '返回学校', action: () => this.enterSchool() },
                { text: '调查红点位置', action: () => this.investigateRedDot() }
            ]);
        } else {
            this.showDialogue('你没有手机。', [
                { text: '返回学校', action: () => this.enterSchool() }
            ]);
        }
    }

    seeWhoIsThere() {
        this.plotProgress = 2;
        const friendName = this.getFriendName();
        this.showDialogue(`你转身，看到${friendName}站在你身后，脸色苍白。${this.getFriendPronoun('subject')}的眼睛里没有瞳孔，取而代之的是闪烁的红光。
"你...你不能离开..."${friendName}的声音变得沙哑，不似人声。`, [
            { text: '你怎么了？', action: () => this.askFriendCondition() },
            { text: '后退', action: () => this.backAwayFromFriend() }
        ]);
    }

    enterSchool() {
        this.game.updateGameMap('foyer');
        this.showDialogue('你推开校门，吱呀的声音在寂静的夜里格外刺耳。学校内部的景象与之前不同，走廊里弥漫着红色的雾气，墙上的画像都变成了骷髅头。', [
            { text: '前往教学楼', action: () => this.loadScene('foyer') },
            { text: '前往宿舍', action: () => this.loadScene('dormitory') }
        ]);
    }

    investigateRedDot() {
        this.plotProgress = 1;
        this.showDialogue('红点的位置似乎是学校的旧教学楼，那里已经废弃多年。你记得第二章仓库地图上的"禁区"标记正是旧教学楼。', [
            { text: '前往旧教学楼', action: () => this.loadScene('abandonedWing') },
            { text: '返回学校', action: () => this.enterSchool() }
        ]);
    }

    askFriendCondition() {
        const friendName = this.getFriendName();
        this.showDialogue(`${friendName}发出刺耳的笑声："我？我很好...只是...我终于找到了新的宿主..."
${this.getFriendPronoun('subject')}的身体开始扭曲，皮肤下似乎有什么东西在蠕动。`, [
            { text: `尝试唤醒${this.getFriendPronoun('object')}`, action: () => this.tryToWakeFriend() },
            { text: '逃跑', action: () => this.enterSchool() }
        ]);
    }

    backAwayFromFriend() {
        const friendName = this.getFriendName();
        this.showDialogue(`你后退几步，${friendName}步步紧逼。${this.getFriendPronoun('subject')}的指甲变得又长又尖，眼睛里的红光越来越亮。`, [
            { text: '使用徽章', action: () => this.useBadgeAgainstFriend() },
            { text: '逃跑', action: () => this.enterSchool() }
        ]);
    }

    tryToWakeFriend() {
        const friendName = this.getFriendName();
        if (this.game.gameState.inventory.includes('照片')) {
            this.showDialogue(`你拿出${friendName}掉落的照片："你还记得这个吗？我们是朋友啊！"
${friendName}的动作突然停住，眼睛里的红光闪烁了一下："朋友...？"
${this.getFriendPronoun('subject')}的身体开始颤抖，似乎在挣扎。`, [
                { text: '继续唤醒', action: () => this.continueWakingFriend() },
                { text: `带${this.getFriendPronoun('object')}离开`, action: () => this.leaveWithFriend() }
            ]);
        } else {
            this.showDialogue(`${friendName}的攻击没有停止，${this.getFriendPronoun('subject')}似乎完全失去了理智。`, [
                { text: '使用徽章', action: () => this.useBadgeAgainstFriend() },
                { text: '逃跑', action: () => this.enterSchool() }
            ]);
        }
    }

    useBadgeAgainstFriend() {
        if (this.game.gameState.inventory.includes('徽章')) {
            const friendName = this.getFriendName();
            this.showDialogue(`你掏出徽章，徽章发出强烈的光芒。${friendName}惨叫一声，倒在地上。一个黑色的影子从${this.getFriendPronoun('subject')}体内飘出，消失在夜色中。
${friendName}慢慢睁开眼睛，眼神恢复了正常："发生了什么事？我...我刚才好像做了一个噩梦。"`, [
                { text: `带${this.getFriendPronoun('object')}离开`, action: () => this.leaveWithFriend() },
                { text: '一起探索学校', action: () => this.exploreWithFriend() }
            ]);
            this.friendSaved = true;
        } else {
            this.showDialogue(`你没有徽章。`, [
                { text: '逃跑', action: () => this.enterSchool() }
            ]);
        }
    }

    //  foyer场景
    showFoyerScene() {
        this.game.gameState.currentScene = 'foyer';
        this.game.updateGameMap('foyer');
        this.showDialogue('教学楼大厅的地面上刻着一个巨大的符号，与你在钥匙和徽章上看到的符号相同。符号中央有一个凹槽，似乎可以放入什么东西。', [
            { text: '放入徽章', action: () => this.placeBadge() },
            { text: '探索教学楼', action: () => this.exploreFoyer() },
            { text: '离开大厅', action: () => this.enterSchool() }
        ]);
    }

    placeBadge() {
        if (this.game.gameState.inventory.includes('徽章')) {
            this.symbolDeciphered = true;
            this.showDialogue('你将徽章放入凹槽，徽章与符号完美契合。符号发出耀眼的光芒，地面开始震动。大厅的墙壁上出现了一个新的入口，通向地下。', [
                { text: '进入地下入口', action: () => this.loadScene('labyrinth') },
                { text: '继续探索大厅', action: () => this.exploreFoyer() }
            ]);
        } else {
            this.showDialogue(`你没有徽章。`, [
                { text: '探索教学楼', action: () => this.exploreFoyer() }
            ]);
        }
    }

    exploreFoyer() {
        // 添加古老卷轴到物品栏（避免重复添加）
        if (!this.game.gameState.inventory.includes('古老卷轴')) {
            this.game.gameState.inventory.push('古老卷轴');
            // 更新物品栏显示
            this.game.updateInventoryDisplay();
        }
        this.showDialogue('你在大厅的角落找到了一个古老的卷轴。卷轴上记载着学校的历史："本校建立于1923年，原址为古代祭坛。每年10月13日，需献祭一名灵魂以平息祭坛的愤怒。"', [
            { text: '收起卷轴', action: () => this.keepScroll() },
            { text: '进入地下入口', action: () => this.loadScene('labyrinth') }
        ]);
    }

    // 废弃教学楼场景
    showAbandonedWingScene() {
        this.game.gameState.currentScene = 'abandonedWing';
        this.game.updateGameMap('abandonedWing');
        this.showDialogue('旧教学楼破败不堪，走廊里的地板腐烂严重，墙壁上爬满了蜘蛛网。空气中弥漫着一股腐臭味。', [
            { text: '探索教室', action: () => this.exploreClassroom() },
            { text: '前往顶楼', action: () => this.goToRoof() },
            { text: '离开旧教学楼', action: () => this.enterSchool() }
        ]);
    }

    exploreClassroom() {
        // 添加祭祀 dagger到物品栏（避免重复添加）
        if (!this.game.gameState.inventory.includes('仪式匕首')) {
            this.game.gameState.inventory.push('仪式匕首');
            // 更新物品栏显示
            this.game.updateInventoryDisplay();
        }
        this.showDialogue('教室里的课桌上刻满了奇怪的符号。讲台上放着一把生锈的匕首，匕首上沾着暗红色的痕迹。墙壁上有一行用血写的字："10月13日，他们会来"。', [
            { text: '拿起匕首', action: () => this.takeDagger() },
            { text: '离开教室', action: () => this.showAbandonedWingScene() }
        ]);
    }

    goToRoof() {
        this.showDialogue('你来到顶楼，发现这里有一个小型祭坛。祭坛上放着一个骷髅头，眼睛里闪烁着绿光。', [
            { text: '检查祭坛', action: () => this.examineRoofAltar() },
            { text: '离开顶楼', action: () => this.showAbandonedWingScene() }
        ]);
    }

    examineRoofAltar() {
        if (this.game.gameState.inventory.includes('古老卷轴')) {
            this.truthRevealed = true;
            this.showDialogue('你展开卷轴，对照祭坛上的符号。卷轴上的文字开始发光："打破循环的关键，在于牺牲祭祀者，而非无辜者。"', [
                { text: '理解含义', action: () => this.understandScroll() },
                { text: '离开顶楼', action: () => this.showAbandonedWingScene() }
            ]);
        } else {
            this.showDialogue('祭坛上的符号对你来说毫无意义。', [
                { text: '离开顶楼', action: () => this.showAbandonedWingScene() }
            ]);
        }
    }

    // 迷宫场景
    showLabyrinthScene() {
        this.game.gameState.currentScene = 'labyrinth';
        this.game.updateGameMap('labyrinth');
        this.showDialogue('地下迷宫错综复杂，墙壁上刻满了与徽章相同的符号。地面上有三个不同颜色的门：红色、蓝色和绿色。', [
            { text: '进红色门', action: () => this.enterRedDoor() },
            { text: '进蓝色门', action: () => this.enterBlueDoor() },
            { text: '进绿色门', action: () => this.enterGreenDoor() }
        ]);
    }

    enterRedDoor() {
        this.showDialogue('红色门后是一个充满火焰的房间。房间中央有一个火盆，里面燃烧着永恒的火焰。', [
            { text: '触摸火焰', action: () => this.touchFire() },
            { text: '返回迷宫', action: () => this.showLabyrinthScene() }
        ]);
    }

    enterBlueDoor() {
        this.showDialogue('蓝色门后是一个充满水的房间。房间中央有一个水池，里面漂浮着一朵黑色的莲花。', [
            { text: '触摸莲花', action: () => this.touchLotus() },
            { text: '返回迷宫', action: () => this.showLabyrinthScene() }
        ]);
    }

    enterGreenDoor() {
        this.showDialogue('绿色门后是一个充满植物的房间。房间中央有一棵巨大的树，树上结满了红色的果实。', [
            { text: '摘果实', action: () => this.pickFruit() },
            { text: '返回迷宫', action: () => this.showLabyrinthScene() }
        ]);
    }

    // 祭坛房间场景
    showAltarRoomScene() {
        this.game.gameState.currentScene = 'altarRoom';
        this.game.updateGameMap('altarRoom');
        this.showDialogue(`你来到一个巨大的地下祭坛房间。中央的祭坛上绑着一个人，正是${this.game.gameState.playerGender === "male" ? "张伟" : "李娜"}！一个穿着黑色长袍的人站在祭坛前，手里拿着一把匕首。
"终于到了献祭的时刻！"黑袍人发出沙哑的笑声。`, [
            { text: '阻止献祭', action: () => this.stopSacrifice() },
            { text: '寻找武器', action: () => this.findWeapon() }
        ]);
    }

    stopSacrifice() {
        if (this.game.gameState.inventory.includes('仪式匕首')) {
            this.showDialogue(`你冲向黑袍人，用匕首刺向${this.game.gameState.playerGender === "male" ? "他" : "她"}。黑袍人惨叫一声，化作一缕黑烟。
${this.game.gameState.playerGender === "male" ? "张伟" : "李娜"}倒在地上，昏迷不醒。祭坛开始崩塌，整个房间摇摇欲坠。`, [
                { text: `带${this.getFriendPronoun('object')}离开`, action: () => this.escapeWithFriend() },
                { text: '寻找出口', action: () => this.findExit() }
            ]);
        } else {
            this.showDialogue(`你冲向黑袍人，但${this.game.gameState.playerGender === "male" ? "他" : "她"}轻轻一挥袖，你就被弹飞了出去。`, [
                { text: '寻找武器', action: () => this.findWeapon() },
                { text: '使用徽章', action: () => this.useBadgeAgainstCultist() }
            ]);
        }
    }

    // 完成章节
    completeChapter() {
        // 播放诡异的背景音乐，而非尖叫
        const ambientSound = document.getElementById('horror-ambient');
        if (ambientSound) {
            ambientSound.currentTime = 0;
            ambientSound.play().catch(error => {
                console.error('播放环境音效失败:', error);
            });

            // 10秒后逐渐降低音量
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

        // 解锁第四章
        this.game.unlockChapter('chapter4');

        // 显示结算画面
        this.showResultScreen();
    }

    // 显示结算画面
    showResultScreen() {
        this.game.elements.gameScreen.classList.add('hidden');
        this.game.elements.resultScreen.classList.remove('hidden');

        // 显示章节名称和通关时间
        const chapterName = '第三章-「永夜沉沦」';
        this.game.elements.resultChapter.textContent = chapterName;
        this.game.elements.resultTime.textContent = this.game.gameState.gameTime;

        // 添加黑暗结局提示
        const resultDescription = this.game.elements.resultDescription;
        if (resultDescription) {
            resultDescription.textContent = '你以为这就是结束？不，这只是开始。诅咒仍在继续，循环从未打破...';
            resultDescription.style.color = '#ff3333';
            resultDescription.style.fontStyle = 'italic';
        }

        // 修改下一章按钮为进入第四章按钮
        this.game.elements.nextChapterBtn.textContent = '进入第四章';
        this.game.elements.nextChapterBtn.classList.remove('hidden');
        this.game.elements.nextChapterBtn.onclick = () => {
            this.game.startChapter('chapter4');
        };
    }

    // 以下是辅助方法
    keepScroll() {
        this.showDialogue('你收起卷轴。这段历史太过黑暗，你必须阻止即将发生的悲剧。', [
            { text: '进入地下入口', action: () => this.loadScene('labyrinth') }
        ]);
    }

    takeDagger() {
        this.showDialogue('你拿起匕首，感觉有一股寒意从匕首传到你的手臂。', [
            { text: '离开教室', action: () => this.showAbandonedWingScene() }
        ]);
    }

    understandScroll() {
        this.showDialogue('你终于明白了解救学校的方法。必须牺牲那个进行献祭的人，而不是无辜的学生。', [
            { text: '前往地下祭坛', action: () => this.loadScene('labyrinth') }
        ]);
    }

    touchFire() {
        if (this.symbolDeciphered) {
            this.artifactCollected = true;
            if (!this.game.gameState.inventory.includes('火焰 artifact')) {
                this.game.gameState.inventory.push('火焰 artifact');
                // 更新物品栏显示
                this.game.updateInventoryDisplay();
            }
            this.playSound('ding');
            this.showDialogue('你触摸火焰，火焰化作一个红色的宝石，飞到你的手中。宝石上刻着与徽章相同的符号。', [
                { text: '返回迷宫', action: () => this.showLabyrinthScene() }
            ]);
        } else {
            this.playSound('horror');
            this.showDeath('火焰烧伤了你的手，你痛得尖叫起来。火势突然变大，将你吞噬...');
        }
    }

    touchLotus() {
        if (this.symbolDeciphered) {
            this.artifactCollected = true;
            if (!this.game.gameState.inventory.includes('水之 artifact')) {
                this.game.gameState.inventory.push('水之 artifact');
                // 更新物品栏显示
                this.game.updateInventoryDisplay();
            }
            this.playSound('ding');
            this.showDialogue('你触摸莲花，莲花化作一个蓝色的宝石，飞到你的手中。宝石上刻着与徽章相同的符号。', [
                { text: '返回迷宫', action: () => this.showLabyrinthScene() }
            ]);
        } else {
            this.playSound('horror');
            this.showDeath('莲花突然绽放，喷出黑色的毒液，将你腐蚀...');
        }
    }

    pickFruit() {
        if (this.symbolDeciphered) {
            this.artifactCollected = true;
            if (!this.game.gameState.inventory.includes('生命 artifact')) {
                this.game.gameState.inventory.push('生命 artifact');
                // 更新物品栏显示
                this.game.updateInventoryDisplay();
            }
            this.playSound('ding');
            this.showDialogue('你摘下果实，果实化作一个绿色的宝石，飞到你的手中。宝石上刻着与徽章相同的符号。', [
                { text: '返回迷宫', action: () => this.showLabyrinthScene() }
            ]);
        } else {
            this.playSound('horror');
            this.showDeath('果实突然炸开，释放出有毒的气体，你呼吸困难...');
        }
    }

    findWeapon() {
        if (this.game.gameState.inventory.includes('仪式匕首')) {
            this.showDialogue('你已经有一把匕首了。', [
                { text: '阻止献祭', action: () => this.stopSacrifice() }
            ]);
        } else {
            this.showDialogue('你在房间里找不到任何可用的武器。祭坛继续崩塌，情况危急。', [
                { text: '使用徽章', action: () => this.useBadgeAgainstCultist() },
                { text: '尝试救朋友', action: () => this.stopSacrifice() }
            ]);
        }
    }

    useBadgeAgainstCultist() {
        if (this.game.gameState.inventory.includes('徽章')) {
            this.showDialogue(`你掏出徽章，徽章发出强烈的光芒。黑袍人惨叫一声，化作一缕黑烟。
${this.game.gameState.playerGender === "male" ? "张伟" : "李娜"}倒在地上，昏迷不醒。祭坛开始崩塌，整个房间摇摇欲坠。`, [
                { text: `带${this.getFriendPronoun('object')}离开`, action: () => this.escapeWithFriend() },
                { text: '寻找出口', action: () => this.findExit() }
            ]);
        } else {
            this.showDialogue(`你没有徽章。`, [
                { text: '尝试救朋友', action: () => this.stopSacrifice() }
            ]);
        }
    }

    escapeWithFriend() {
        this.friendSaved = true;
        this.showDialogue(`你背起${this.game.gameState.playerGender === "male" ? "张伟" : "李娜"}，在祭坛崩塌前找到了出口。你们逃出学校，但天空依然一片漆黑，没有丝毫黎明的迹象。
${this.game.gameState.playerGender === "male" ? "张伟" : "李娜"}慢慢苏醒过来，眼神空洞："谢谢你...但一切还没有结束..."
你低头看去，发现${this.game.gameState.playerGender === "male" ? "他" : "她"}的脖子上，正慢慢浮现出与学校徽章相同的符号。你知道，诅咒永远不会结束。`, [
            { text: '完成第三章', action: () => this.completeChapter() }
        ]);
    }

    findExit() {
        this.showDialogue(`你在祭坛崩塌前找到了出口。你逃出学校，但天空依然被黑暗笼罩。
你回头望去，学校的轮廓在夜色中扭曲变形，仿佛一只巨大的怪物正在注视着你。你知道，你并没有真正逃脱，只是暂时离开了那个地狱。
而那枚徽章，还在你的口袋里散发着微弱的光芒...`, [
            { text: '完成第三章', action: () => this.completeChapter() }
        ]);
    }

    continueWakingFriend() {
        const friendName = this.game.gameState.playerGender === "male" ? "张伟" : "李娜";
        this.showDialogue(`${friendName}的身体颤抖得更厉害了："朋友...对...我们是朋友..."
黑色的影子从${this.game.gameState.playerGender === "male" ? "他" : "她"}体内慢慢飘出，消失在夜色中。
${friendName}倒在地上，昏迷不醒。`, [
            { text: `带${this.getFriendPronoun('object')}离开`, action: () => this.leaveWithFriend() },
            { text: '一起探索学校', action: () => this.exploreWithFriend() }
        ]);
        this.friendSaved = true;
    }

    leaveWithFriend() {
        this.friendSaved = true;
        this.showDialogue(`你背起${this.game.gameState.playerGender === "male" ? "张伟" : "李娜"}，离开了学校。天空依然一片漆黑，没有丝毫黎明的迹象。${this.game.gameState.playerGender === "male" ? "张伟" : "李娜"}的身体越来越冷，你知道，有些东西已经永远改变了...`, [
            { text: '完成第三章', action: () => this.completeChapter() }
        ]);
    }

    exploreWithFriend() {
        const friendName = this.game.gameState.playerGender === 'male' ? '张伟' : '李娜';
        this.showDialogue(`${friendName}虽然还有些虚弱，但还是决定和你一起探索学校："我们必须找出真相，否则还会有更多人受害。"`, [
            { text: '前往旧教学楼', action: () => this.loadScene('abandonedWing') },
            { text: '前往地下迷宫', action: () => this.loadScene('labyrinth') }
        ]);
    }

    // 打字机效果显示死亡信息
    showDeath(message) {
        this.playSound('horror');
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
}

// 导出Chapter3类到window对象，以便在主游戏中使用
window.Chapter3 = Chapter3;