class Chapter4 {
    constructor(game) {
        this.game = game;
        this.plotProgress = 0;
        this.escapeTimer = null;
        this.clickCount = 0;
        this.requiredClicks = 15; // 需要点击的次数
        this.clickTimeLimit = 5000; // 点击时间限制(毫秒)
        this.isPuzzleActive = false;
        this.typingInterval = null;
    }

    // 开始第四章
    start(startTime = null) {
        this.game.gameState.currentChapter = `chapter4`;
        this.plotProgress = 0;
        // 初始化游戏时间
        if (startTime) {
            this.updateGameTime(startTime);
        } else {
            this.updateGameTime(`23:30`); // 默认起始时间
        }
        // 确保玩家有徽章
        if (!this.game.gameState.inventory.includes(`徽章`)) {
            this.game.gameState.inventory.push(`徽章`);
            this.game.updateInventoryDisplay();
        }
        this.loadScene(`outsideSchool`);
    }

    loadScene(sceneName) {
        this.game.gameState.currentScene = sceneName;
        this.game.updateGameMap(sceneName);
        this.game.elements.gameMap.innerHTML = ``; // 清空地图
        this.game.elements.gameActions.innerHTML = ``; // 清空动作按钮
        this.game.elements.dialogueChoices.innerHTML = ``; // 清空对话选项

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
                this.showDialogue(`未知场景`, [{ text: `返回学校`, action: () => this.loadScene(`outsideSchool`) }]);
        }
    }

    showOutsideSchoolScene() {
        // 创建学校外部场景
        const sceneDescription = document.createElement(`div`);
        sceneDescription.className = `scene-description`;
        sceneDescription.innerHTML = `
            <p>你终于逃出了学校，但诅咒并没有结束。</p>
            <p>校园外的街道笼罩在一片诡异的黑雾中，路灯闪烁不定，将你的影子拉得很长。</p>
            <p>你摸了摸口袋，那枚徽章还在，散发着微弱的光芒。</p>
        `;
        this.game.elements.gameMap.appendChild(sceneDescription);

        // 添加场景图片 (待添加资源)
        // const sceneImage = document.createElement(`img`);
        // sceneImage.src = `assets/img/outside-school.png`;
        // sceneImage.alt = `学校外部`;
        // sceneImage.className = `scene-image`;
        // this.game.elements.gameMap.appendChild(sceneImage);

        // 播放环境音效
        this.playSound(`ambient`);

        if (this.plotProgress === 0) {
            this.showDialogue(`你站在学校门口，大口喘着气。身后的学校在黑雾中若隐若现，仿佛一只择人而噬的怪物。`, [
                { text: `查看周围`, action: () => this.examineSurroundings() },
                { text: `尝试联系外界`, action: () => this.tryContactOutside() }
            ]);
        }
    }

    examineSurroundings() {
        this.plotProgress = 1;
        this.showDialogue(`街道上空无一人，所有的店铺都关门了。不远处的十字路口，似乎有一个模糊的身影在晃动。`, [
            { text: `走向十字路口`, action: () => this.walkToCrossroad() },
            { text: `留在原地`, action: () => this.stayInPlace() }
        ]);
    }

    tryContactOutside() {
        this.plotProgress = 2;
        if (this.game.gameState.inventory.includes(`手机`)) {
            this.showDialogue(`你掏出手机，发现没有信号。屏幕上突然出现一行血红色的字："无处可逃"。`, [
                { text: `放弃联系`, action: () => this.examineSurroundings() }
            ]);
        } else {
            this.showDialogue(`你没有可以联系外界的工具。`, [
                { text: `查看周围`, action: () => this.examineSurroundings() }
            ]);
        }
    }

    walkToCrossroad() {
        this.plotProgress = 3;
        const friendName = this.getFriendName();
        const pronoun = this.getFriendPronoun(`pronoun`);
        this.showDialogue(`你慢慢走向十字路口，那个身影越来越清晰。当你走近时，你认出了那个身影——是${friendName}！但${pronoun}的眼睛是空洞的，正缓缓向你走来。`, [
            { text: `呼唤${pronoun}`, action: () => this.callFriend() },
            { text: `转身逃跑`, action: () => this.runAway() }
        ]);
    }

    stayInPlace() {
        this.plotProgress = 4;
        this.showDialogue(`你决定留在原地，观察周围的情况。黑雾越来越浓，你感到一阵寒意。突然，你听到身后传来脚步声...`, [
            { text: `转身查看`, action: () => this.turnAround() },
            { text: `撒腿就跑`, action: () => this.runAway() }
        ]);
    }

    callFriend() {
        this.plotProgress = 5;
        const friendName = this.getFriendName();
        const pronounObj = this.getFriendPronoun(`object`);
        const pronounSub = this.getFriendPronoun(`subject`);
        this.showDialogue(`"${friendName}！是我啊！"你大声呼唤着。但${pronounSub}没有回应，继续向你走来。当${pronounSub}走到你面前时，你发现${pronounSub}的脖子上有一个熟悉的符号——和学校徽章上的一样！`, [
            { text: `尝试唤醒${pronounObj}`, action: () => this.attemptToWakeFriend() },
            { text: `后退躲避`, action: () => this.backAway() }
        ]);
    }


    attemptToWakeFriend() {
        this.plotProgress = 6;
        const pronounObj = this.getFriendPronoun(`object`);
        const pronounSub = this.getFriendPronoun(`subject`);
        this.showDialogue(`你伸手去碰${pronounObj}的肩膀，${pronounSub}突然抓住你的手，力气大得惊人。${pronounSub}的嘴里发出低沉的声音："和我一起...永远留在这里..."`, [
            { text: `挣脱`, action: () => this.startEscapePuzzle() }
        ]);
    }

    startEscapePuzzle() {
        this.isPuzzleActive = true;
        this.clickCount = 0;
        this.game.elements.dialogueChoices.innerHTML = ``;

        const friendName = this.getFriendName();
        this.showDialogue(`${friendName}的力气越来越大！`, []);

        // 创建QTE容器
        const qteContainer = document.createElement('div');
        qteContainer.id = 'escape-qte-container';
        qteContainer.className = 'qte-container';

        const qteText = document.createElement('p');
        qteText.className = 'qte-text';
        qteText.textContent = `快速点击挣脱${friendName}的手！已点击 0/${this.requiredClicks} 次`;
        qteContainer.appendChild(qteText);

        // 创建QTE按钮
        const qteButton = document.createElement('button');
        qteButton.id = 'escape-button';
        qteButton.className = 'big-button';
        qteButton.textContent = '💪 快速点击挣脱';
        qteContainer.appendChild(qteButton);

        const timerBar = document.createElement('div');
        timerBar.className = 'timer-bar';
        timerBar.style.width = '100%';
        qteContainer.appendChild(timerBar);

        // 添加到游戏界面
        this.game.elements.gameActions.appendChild(qteContainer);

        // QTE参数
        const requiredClicks = this.requiredClicks;
        const timeLimit = this.clickTimeLimit; // 5000毫秒
        const startTime = Date.now();

        // 更新计时器
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

        // 按钮点击事件
        qteButton.addEventListener('click', () => {
            if (this.isPuzzleActive) {
                this.clickCount++;
                qteText.textContent = `快速点击挣脱${friendName}的手！已点击 ${this.clickCount}/${requiredClicks} 次`;

                // 如果达到所需点击次数，解谜成功
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
        this.showDialogue(`你成功挣脱了${friendName}的束缚！${pronounSub}发出一声尖叫，倒在地上。你趁机转身向森林跑去。`, [
            { text: `逃往森林`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    escapeFailed() {
        this.isPuzzleActive = false;
        clearInterval(this.escapeTimer);
        this.game.elements.dialogueText.innerHTML = ``;

        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.game.showDeath(`${friendName}的手紧紧抓住你，你感到一股寒意传遍全身。眼前一黑，你失去了意识...`);
    }

    backAway() {
        this.plotProgress = 7;
        const friendName = this.getFriendName();
        const pronoun = this.getFriendPronoun(`subject`);
        this.showDialogue(`你慢慢后退，${friendName}继续向你逼近。突然，${pronoun}加快了速度，朝你扑来！`, [
            { text: `转身逃跑`, action: () => this.runAway() }
        ]);
    }

    runAway() {
        this.plotProgress = 8;
        this.showDialogue(`你转身就跑，不敢回头。你不知道跑了多久，直到你冲进了一片森林。`, [
            { text: `继续前进`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    turnAround() {
        this.plotProgress = 9;
        this.playSound(`horror`);
        this.showDialogue(`你缓缓转身，看到一个穿着黑袍的人站在你身后。他的脸被兜帽遮住，只露出一双闪着红光的眼睛。`, [
            { text: `逃跑`, action: () => this.runAway() },
            { text: `尝试沟通`, action: () => this.tryToCommunicate() }
        ]);
    }

    tryToCommunicate() {
        this.plotProgress = 10;
        this.game.playSound(`horror`);
        this.showDialogue(`"你是谁？想干什么？"你壮着胆子问道。黑袍人没有回答，只是伸出手，指向你的口袋。你意识到他想要徽章...`, [
            { text: `交出徽章`, action: () => this.giveBadge() },
            { text: `拒绝`, action: () => this.refuseToGiveBadge() }
        ]);
    }

    giveBadge() {
        this.plotProgress = 11;
        if (this.game.gameState.inventory.includes(`徽章`)) {
            // 移除徽章
            this.game.gameState.inventory = this.game.gameState.inventory.filter(item => item !== `徽章`);
            this.game.updateInventoryDisplay();

            this.showDialogue(`你不情愿地交出徽章。黑袍人接过徽章，发出一阵令人毛骨悚然的笑声。"游戏才刚刚开始..."他说完，消失在黑雾中。`, [
                { text: `进入森林`, action: () => this.loadScene(`forestPath`) }
            ]);
        } else {
            this.showDialogue(`你没有徽章可以交出。黑袍人似乎很生气，他的眼睛变得更红了...`, [
                { text: `逃跑`, action: () => this.runAway() }
            ]);
        }
    }

    refuseToGiveBadge() {
        this.plotProgress = 12;
        this.game.playSound(`horror`);
        this.showDeath(`黑袍人发出一声怒吼，黑雾瞬间将你吞噬。你感到一阵剧痛，然后什么都不知道了...`);
    }

    showForestPathScene() {
        // 创建森林路径场景
        const sceneDescription = document.createElement(`div`);
        sceneDescription.className = `scene-description`;
        sceneDescription.innerHTML = `
            <p>你跑进了一片古老的森林，树木高大挺拔，枝叶茂密，几乎遮住了天空。</p>
            <p>月光透过树叶的缝隙洒在地上，形成斑驳的光影。空气中弥漫着潮湿的泥土气息。</p>
            <p>你听到远处传来流水的声音，还有一些奇怪的声音，像是树枝断裂的声音，又像是低语。</p>
        `;
        this.game.elements.gameMap.appendChild(sceneDescription);

        // 添加场景图片 (待添加资源)
        // const sceneImage = document.createElement(`img`);
        // sceneImage.src = `assets/img/forest-path.png`;
        // sceneImage.alt = `森林路径`;
        // sceneImage.className = `scene-image`;
        // this.game.elements.gameMap.appendChild(sceneImage);

        // 检查是否已了解墓地相关信息
        const knowsAboutCemetery = this.plotProgress >= 27; // 27是听画像提到墓地的进度

        if (knowsAboutCemetery) {
            this.showDialogue(`你站在森林的入口，不知道该往哪个方向走。这时，你注意到地上有三条明显的路径：一条通向深处，一条似乎通向河边，还有一条隐约通向远处的墓地。`, [
                { text: `走深处的路`, action: () => this.goDeepIntoForest() },
                { text: `走向河边`, action: () => this.goToRiver() },
                { text: `前往墓地`, action: () => this.goToCemetery() }
            ]);
        } else {
            this.showDialogue(`你站在森林的入口，不知道该往哪个方向走。这时，你注意到地上有两条明显的路径：一条通向深处，另一条似乎通向河边。`, [
                { text: `走深处的路`, action: () => this.goDeepIntoForest() },
                { text: `走向河边`, action: () => this.goToRiver() }
            ]);
        }
    }

    // 前往墓地
    goToCemetery() {
        this.plotProgress = 28;
        this.loadScene(`cemetery`);
    }

    // 墓地场景
    showCemeteryScene() {
        // 创建墓地场景
        const sceneDescription = document.createElement(`div`);
        sceneDescription.className = `scene-description`;
        sceneDescription.innerHTML = `
            <p>你沿着隐约的小路来到了一片废弃的墓地。墓碑东倒西歪，上面的字迹已经模糊不清。</p>
            <p>空气中弥漫着一股腐臭的气味，乌鸦在远处的树上呱呱叫着。</p>
            <p>墓地中央有一个奇怪的祭坛，上面似乎放着什么东西在发光。</p>
        `;
        this.game.elements.gameMap.appendChild(sceneDescription);

        // 添加场景图片 (待添加资源)
        // const sceneImage = document.createElement(`img`);
        // sceneImage.src = `assets/img/cemetery.png`;
        // sceneImage.alt = `废弃墓地`;
        // sceneImage.className = `scene-image`;
        // this.game.elements.gameMap.appendChild(sceneImage);

        this.playSound(`ambient`);
        this.showDialogue(`你站在墓地前，感到一阵寒意。祭坛上的光芒吸引着你，但你也感到一丝不安。`, [
            { text: `走向祭坛`, action: () => this.approachAltar() },
            { text: `离开墓地`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    // 靠近祭坛
    approachAltar() {
        this.plotProgress = 29;
        this.showDialogue(`你慢慢走向祭坛，发现上面放着一个黑色的盒子。盒子上刻着复杂的符号，和你在学校徽章上看到的有些相似。`, [
            { text: `打开盒子`, action: () => this.openBox() },
            { text: `不碰盒子`, action: () => this.loadScene(`cemetery`) }
        ]);
    }

    // 打开盒子获取黑暗神器
    openBox() {
        this.plotProgress = 30;
        this.showDialogue(`你小心翼翼地打开盒子，里面放着一块黑色的石头，散发着微弱的紫光。这一定就是黑暗神器！`, [
            { text: `拿起神器`, action: () => this.obtainDarkArtifact() }
        ]);
    }

    // 获取黑暗神器
    obtainDarkArtifact() {
        this.plotProgress = 31;
        if (!this.game.gameState.inventory.includes(`黑暗神器`)) {
            this.game.gameState.inventory.push(`黑暗神器`);
            this.game.updateInventoryDisplay();
        }
        this.showDialogue(`你拿起黑暗神器，突然感到一股强大的力量涌入体内。但就在这时，你听到身后传来脚步声...`, [
            { text: `转身查看`, action: () => this.turnAroundInCemetery() }
        ]);
    }

    // 在墓地转身查看
    turnAroundInCemetery() {
        this.plotProgress = 32;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`horror`);
        this.showDialogue(`你转身一看，是${friendName}！但${pronounSub}的眼睛是空洞的，身上散发着黑色的雾气。${pronounSub}一步步向你走来，伸出手想要夺走你手中的黑暗神器。`, [
            { text: `抱紧神器`, action: () => this.holdArtifactTight() },
            { text: `试图唤醒`, action: () => this.attemptToWakeFriendInCemetery() }
        ]);
    }

    // 抱紧神器
    holdArtifactTight() {
        this.plotProgress = 33;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        // 从背包中移除黑暗神器
        const artifactIndex = this.game.gameState.inventory.indexOf(`黑暗神器`);
        if (artifactIndex > -1) {
            this.game.gameState.inventory.splice(artifactIndex, 1);
            this.game.updateInventoryDisplay();
        }
        this.showDialogue(`${friendName}的力气大得惊人，${pronounSub}一把抓住你手中的黑暗神器，将它抢走。${pronounSub}发出一阵冷笑，转身向学校的方向跑去。`, [
            { text: `追赶`, action: () => this.chaseFriendToSchool() }
        ]);
    }

    // 尝试在墓地唤醒朋友
    attemptToWakeFriendInCemetery() {
        this.plotProgress = 34;
        const friendName = this.getFriendName();
        const pronounObj = this.getFriendPronoun(`object`);
        const pronounSub = this.getFriendPronoun(`subject`);
        // 从背包中移除黑暗神器
        const artifactIndex = this.game.gameState.inventory.indexOf(`黑暗神器`);
        if (artifactIndex > -1) {
            this.game.gameState.inventory.splice(artifactIndex, 1);
            this.game.updateInventoryDisplay();
        }
        this.showDialogue(`"${friendName}！醒醒！是我啊！"你大声呼唤着。但${pronounSub}似乎没有听到，${pronounSub}一把抓住你手中的黑暗神器，将它抢走。${pronounSub}发出一阵冷笑，转身向学校的方向跑去。`, [
            { text: `追赶`, action: () => this.chaseFriendToSchool() }
        ]);
    }

    // 追赶朋友到学校
    chaseFriendToSchool() {
        this.plotProgress = 35;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`你立刻追赶${friendName}，向学校方向跑去。${friendName}跑得很快，你只能勉强跟上${friendName}的身影。最终，${friendName}冲进了学校的后勤区域，消失在你的视野中。`, [
            { text: `进入后勤区域`, action: () => this.showSchoolLogisticsScene() }
        ]);
    }

    goDeepIntoForest() {
        this.plotProgress = 13;
        this.showDialogue(`你选择了深入森林的路径。树木越来越密集，光线越来越暗。你感到周围的气温正在下降...`, [
            { text: `继续前进`, action: () => this.continueDeepIntoForest() },
            { text: `返回`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    goToRiver() {
        this.plotProgress = 14;
        this.showDialogue(`你走向河边。流水声越来越清晰，最后你来到了一条清澈的小溪边。溪边有一间破旧的小木屋。`, [
            { text: `进入小木屋`, action: () => this.loadScene(`abandonedHouse`) },
            { text: `在河边休息`, action: () => this.restByRiver() }
        ]);
    }

    continueDeepIntoForest() {
        this.plotProgress = 15;
        this.game.playSound(`horror`);
        this.showDialogue(`你继续前进，突然，你看到前面有一片空地。空地上有一个古老的祭坛，上面放着一本破旧的书。`, [
            { text: `查看祭坛`, action: () => this.examineAltar() },
            { text: `离开这里`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    restByRiver() {
        this.plotProgress = 16;
        this.showDialogue(`你在河边坐下，洗了把脸。冰凉的溪水让你精神一振。这时，你注意到水中有什么东西在闪闪发光...`, [
            { text: `查看水中`, action: () => this.checkWater() },
            { text: `离开`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    examineAltar() {
        this.plotProgress = 17;
        this.showDialogue(`你走到祭坛前，查看那本破旧的书。书的封面写着"校史秘录"四个字。你翻开书，发现里面记载着学校的黑暗历史...`, [
            { text: `继续阅读`, action: () => this.readBook() },
            { text: `合上书本`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    checkWater() {
        this.plotProgress = 18;
        this.showDialogue(`你伸手到水中，捞出一个闪闪发光的物体。是一枚戒指，上面刻着和徽章相同的符号。`, [
            { text: `拿起戒指`, action: () => this.takeRing() },
            { text: `放回水中`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    readBook() {
        this.plotProgress = 19;
        this.showDialogue(`书中记载，学校建于一个古老的墓地之上。为了镇压墓地中的邪灵，学校的创始人使用了一种古老的仪式，但仪式失败了，反而唤醒了更强大的邪灵...`, [
            { text: `继续阅读`, action: () => this.continueReading() },
            { text: `合上书本`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    takeRing() {
        this.plotProgress = 20;
        if (!this.game.gameState.inventory.includes(`刻痕戒指`)) {
            this.game.gameState.inventory.push(`刻痕戒指`);
            this.game.updateInventoryDisplay();
        }
        this.showDialogue(`你拿起戒指，戴在手上。戒指突然发出一阵强光，你感到一股力量涌入体内。`, [
            { text: `进入小木屋`, action: () => this.loadScene(`abandonedHouse`) }
        ]);
    }

    continueReading() {
        this.plotProgress = 21;
        this.showDialogue(`书中还提到，唯一能彻底消灭邪灵的方法是找到四件神器：火焰、水、生命和黑暗。这四件神器分别藏在学校的四个角落...`, [
            { text: `继续阅读`, action: () => this.readMore() },
            { text: `合上书本`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    readMore() {
        this.plotProgress = 22;
        this.showDialogue(`...但黑暗神器已经失踪了几百年。有人说它被带到了森林里，也有人说它被埋在了学校的地下...`, [
            { text: `合上书本`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    showAbandonedHouseScene() {
        // 创建废弃小木屋场景
        const sceneDescription = document.createElement(`div`);
        sceneDescription.className = `scene-description`;
        sceneDescription.innerHTML = `
            <p>你走进小木屋，里面布满了灰尘和蜘蛛网。家具都很破旧，似乎已经很久没有人住了。</p>
            <p>墙上挂着一幅褪色的画像，画中是一个穿着古装的女人，她的眼睛空洞洞的，仿佛在注视着你。</p>
            <p>屋子中央有一张桌子，上面放着一盏油灯和一本日记。</p>
        `;
        this.game.elements.gameMap.appendChild(sceneDescription);

        // 添加场景图片 (待添加资源)
        // const sceneImage = document.createElement(`img`);
        // sceneImage.src = `assets/img/abandoned-house.png`;
        // sceneImage.alt = `废弃小木屋`;
        // sceneImage.className = `scene-image`;
        // this.game.elements.gameMap.appendChild(sceneImage);

        this.showDialogue(`你站在小木屋中央，不知道该先查看什么。`, [
            { text: `查看日记`, action: () => this.readDiary() },
            { text: `查看画像`, action: () => this.examinePortrait() },
            { text: `离开`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    readDiary() {
        this.plotProgress = 23;
        this.showDialogue(`你拿起桌上的日记，翻开第一页。字迹已经有些模糊，但仍能辨认："我知道他们在做什么。他们用学生的血来喂养那个东西..."`, [
            { text: `继续阅读`, action: () => this.continueReadingDiary() },
            { text: `放下日记`, action: () => this.loadScene(`abandonedHouse`) }
        ]);
    }

    examinePortrait() {
        this.plotProgress = 24;
        this.showDialogue(`你走近画像，仔细观察。画中女人的眼睛似乎在跟着你移动。突然，画像开始渗出鲜血...`, [
            { text: `触摸画像`, action: () => this.touchPortrait() },
            { text: `后退`, action: () => this.loadScene(`abandonedHouse`) }
        ]);
    }

    continueReadingDiary() {
        this.plotProgress = 25;
        this.showDialogue(`"那个东西越来越强大了。我必须找到黑暗神器，否则一切都晚了..."日记到这里就结束了，后面的 pages 都被撕毁了。`, [
            { text: `放下日记`, action: () => this.loadScene(`abandonedHouse`) }
        ]);
    }

    touchPortrait() {
        this.plotProgress = 26;
        this.playSound(`horror`);
        this.showDialogue(`你触摸画像，画像上的鲜血突然变得滚烫。画中女人的眼睛里流出更多的血，她的嘴开始动，似乎在说着什么...`, [
            { text: `仔细倾听`, action: () => this.listenToPortrait() },
            { text: `远离画像`, action: () => this.loadScene(`abandonedHouse`) }
        ]);
    }

    listenToPortrait() {
        this.plotProgress = 27;
        this.showDialogue(`你凑近画像，听到一个微弱的声音："救我...黑暗...神器...在...墓地..."`, [
            { text: `离开小木屋`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    // 播放音效
    playSound(soundName) {
        try {
            if (soundName === `ding` && this.game.horrorDing) {
                this.game.horrorDing.currentTime = 0;
                this.game.horrorDing.play().catch(e => console.log(`音效播放失败:`, e));
            } else if (soundName === `horror` && this.game.horrorUp) {
                this.game.horrorUp.currentTime = 0;
                this.game.horrorUp.play().catch(e => console.log(`音效播放失败:`, e));
            } else if (soundName === `ambient` && this.game.ambientSound) {
                this.game.ambientSound.currentTime = 0;
                this.game.ambientSound.play().catch(e => console.log(`音效播放失败:`, e));
            }
        } catch (error) {
            console.log(`音效播放错误:`, error);
        }
    }

    // 根据玩家性别获取朋友的正确代词
    getFriendPronoun(type) {
        // 检查是否为非正常性别
        const abnormalGenders = [`沃尔玛购物袋`, `武装直升机`];
        if (abnormalGenders.includes(this.game.gameState.playerGender)) {
            return `它`;
        }

        const isMale = this.game.gameState.playerGender === `male`;
        switch (type) {
            case `subject`: // 主格 (他/她)
                return isMale ? `他` : `她`;
            case `object`: // 宾格 (他/她)
                return isMale ? `他` : `她`;
            case `possessive`: // 所有格 (他的/她的)
                return isMale ? `他的` : `她的`;
            case `pronoun`: // 代词 (他/她)
                return isMale ? `他` : `她`;
            default:
                return isMale ? `他` : `她`;
        }
    }

    // 根据玩家性别获取朋友名字
    getFriendName() {
        const abnormalGenders = [`沃尔玛购物袋`, `武装直升机`];
        if (abnormalGenders.includes(this.game.gameState.playerGender)) {
            return Math.random() < 0.5 ? `汪汪` : `喵喵`;
        }
        return this.game.gameState.playerGender === "male" ? "张伟" : "李娜";
    }

    // 更新游戏时间
    updateGameTime(time) {
        this.game.gameState.gameTime = time;
        this.game.elements.currentTimeDisplay.textContent = time;
    }

    // 打字机效果显示对话
    showDialogue(text, choices) {
        // 直接使用游戏对象的showDialogue方法
        this.game.showDialogue(text, choices);
    }

    // 学校后勤场景
    showSchoolLogisticsScene() {
        const friendName = this.getFriendName();
        // 创建学校后勤场景
        const sceneDescription = document.createElement(`div`);
        sceneDescription.className = `scene-description`;
        sceneDescription.innerHTML = `
            <p>你进入了学校的后勤区域，这里光线昏暗，充满了灰尘和霉味。</p>
            <p>走廊两边是一间间仓库，门上挂着生锈的锁。远处传来滴水的声音，还有${friendName}的脚步声。</p>
            <p>你看到前方有一扇半开的门，里面透出微弱的光线。</p>
        `;
        this.game.elements.gameMap.appendChild(sceneDescription);

        // 添加场景图片 (待添加资源)
        // const sceneImage = document.createElement(`img`);
        // sceneImage.src = `assets/img/school-logistics.png`;
        // sceneImage.alt = `学校后勤区域`;
        // sceneImage.className = `scene-image`;
        // this.game.elements.gameMap.appendChild(sceneImage);

        this.playSound(`horror`);
        this.showDialogue(`你小心翼翼地向前走，来到那扇半开的门前。你听到里面传来低低的笑声，是${friendName}的声音，但听起来很陌生，很邪恶。`, [
            { text: `推门进去`, action: () => this.enterRoom() },
            { text: `偷听`, action: () => this.eavesdrop() }
        ]);
    }

    // 进入房间
    enterRoom() {
        this.plotProgress = 37;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`horror`);
        this.showDialogue(`你推开门走了进去。房间里很暗，只有一个烛台发出微弱的光芒。${friendName}背对着你，站在房间中央的一个奇怪的符号上。${pronounSub}手中拿着黑暗神器，正在低声念诵着什么。`, [
            { text: `打断${friendName}`, action: () => this.interruptFriend() },
            { text: `慢慢后退`, action: () => this.slowlyBackAway() }
        ]);
    }

    // 偷听
    eavesdrop() {
        this.plotProgress = 38;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`你凑到门边，偷听里面的动静。"终于...黑暗神器...属于我了..."${friendName}的声音传来，"有了它，我可以控制整个学校...不，整个世界..."`, [
            { text: `推门进去`, action: () => this.enterRoom() },
            { text: `寻找其他入口`, action: () => this.lookForOtherEntrance() }
        ]);
    }

    // 打断朋友
    interruptFriend() {
        this.plotProgress = 39;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        const pronounObj = this.getFriendPronoun(`object`);
        this.playSound(`horror`);
        this.showDialogue(`${friendName}！住手！那东西会腐蚀${pronounObj}的心灵！`);

        setTimeout(() => {
            this.showDialogue(`哈哈哈...来得正好，${this.game.gameState.playerName}。`);

            setTimeout(() => {
                this.showDialogue(`${friendName}缓缓转过身，${pronounSub}的眼睛闪烁着诡异的红光，嘴角勾起一抹邪恶的微笑。手中的黑暗神器散发着黑色的雾气，缠绕着${pronounSub}的手臂。`);

                setTimeout(() => {
                    this.showDialogue(`${friendName}举起黑暗神器，指向你："现在，${this.game.gameState.playerName}，成为黑暗的一部分吧！"`, [
                        { text: `尝试说服${friendName}`, action: () => this.attemptToConvinceFriend() },
                        { text: `尝试抢夺神器`, action: () => this.attemptToGrabArtifact() },
                        { text: `闪避并寻找武器`, action: () => this.dodgeAndFindWeapon() }
                    ]);
                }, 2000);
            }, 2000);
        }, 1500);
    }

    // 尝试说服朋友
    attemptToConvinceFriend() {
        this.plotProgress = 40;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`${friendName}！你不记得我了吗？我们是朋友啊！我知道你被那东西控制了，快醒醒！`, [
            { text: `继续劝说`, action: () => this.continueConvincing() },
            { text: `放弃劝说，尝试抢夺`, action: () => this.attemptToGrabArtifact() }
        ]);
    }

    // 继续劝说
    continueConvincing() {
        this.plotProgress = 41;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`horror`);
        this.showDialogue(`${friendName}的表情似乎有了一丝动摇，但很快又被邪恶的笑容取代。"朋友？那是什么？黑暗的力量才是一切！"${pronounSub}大喊着，挥动黑暗神器向你袭来。`, [
            { text: `闪避`, action: () => this.dodgeAttack() },
            { text: `尝试格挡`, action: () => this.attemptToBlock() }
        ]);
    }

    // 尝试抢夺神器
    attemptToGrabArtifact() {
        this.plotProgress = 42;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`你冲向${friendName}，试图抢夺${pronounSub}手中的黑暗神器。${friendName}反应迅速，侧身避开你的攻击，同时用黑暗神器击中了你的肩膀。你感到一阵剧痛，摔倒在地。`, [
            { text: `挣扎着站起来`, action: () => this.standUp() },
            { text: `装死等待机会`, action: () => this.pretendToBeDead() }
        ]);
    }

    // 闪避并寻找武器
    dodgeAndFindWeapon() {
        this.plotProgress = 43;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`你迅速向旁边闪避，黑暗神器的攻击擦过你的衣角。你环顾四周，发现墙角有一根生锈的铁棍。`, [
            { text: `拿起铁棍防御`, action: () => this.takeIronRod() },
            { text: `继续闪避`, action: () => this.continueDodging() }
        ]);
    }

    // 闪避攻击
    dodgeAttack() {
        this.plotProgress = 44;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`你及时向旁边闪避，${friendName}的攻击落空。${friendName}似乎有些惊讶，但很快又发动了新一轮攻击。`, [
            { text: `继续闪避`, action: () => this.continueDodging() },
            { text: `寻找机会反击`, action: () => this.lookForCounterAttack() }
        ]);
    }

    // 尝试格挡
    attemptToBlock() {
        this.plotProgress = 45;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`你试图用手臂格挡${friendName}的攻击，但${pronounSub}的力量远超你的想象。黑暗神器击中了你的手臂，你感到一阵麻痹。`, [
            { text: `挣扎着退后`, action: () => this.staggerBack() },
            { text: `抓住机会反击`, action: () => this.counterAttack() }
        ]);
    }

    // 挣扎着站起来
    standUp() {
        this.plotProgress = 46;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`你强忍着疼痛，挣扎着站了起来。${friendName}冷笑着看着你："还不肯放弃吗？真是固执。"`, [
            { text: `再次尝试说服`, action: () => this.attemptToConvinceFriend() },
            { text: `寻找机会抢夺神器`, action: () => this.lookForArtifactChance() }
        ]);
    }

    // 装死等待机会
    pretendToBeDead() {
        this.plotProgress = 47;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`horror`);
        this.showDialogue(`你屏住呼吸，假装昏死过去。${friendName}走到你身边，用黑暗神器戳了戳你。确认你"昏迷"后，${pronounSub}转身走向房间深处，嘴里念叨着："等我完成仪式，你就是第一个祭品。"`, [
            { text: `悄悄跟上去`, action: () => this.sneakFollow() },
            { text: `趁机抢夺神器`, action: () => this.stealArtifact() }
        ]);
    }

    // 拿起铁棍防御
    takeIronRod() {
        this.plotProgress = 48;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`你拿起铁棍，摆出防御姿势。${friendName}见状，大笑道："就凭那根破铁棍？也想阻止我？"`, [
            { text: `尝试用铁棍攻击`, action: () => this.attackWithRod() },
            { text: `保持防御寻找机会`, action: () => this.defendAndWait() }
        ]);
    }

    // 继续闪避
    continueDodging() {
        this.plotProgress = 49;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`你不断闪避${friendName}的攻击，但${friendName}的攻击越来越快，你渐渐体力不支。`, [
            { text: `寻找机会反击`, action: () => this.lookForCounterAttack() },
            { text: `尝试逃出房间`, action: () => this.attemptToEscape() }
        ]);
    }

    // 寻找机会反击
    lookForCounterAttack() {
        this.plotProgress = 50;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`${friendName}的攻击出现了一个破绽！你抓住机会，冲向${pronounSub}，试图夺下黑暗神器。`, [
            { text: `全力抢夺`, action: () => this.fullForceGrab() },
            { text: `佯攻骗${friendName}分心`, action: () => this.feintAttack() }
        ]);
    }

    // 全力抢夺
    fullForceGrab() {
        this.plotProgress = 501;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`你使出全身力气，猛地扑向${friendName}，双手抓住${pronounSub}手中的黑暗神器。${friendName}吃了一惊，但很快反应过来，与你争夺神器。`, [
            { text: `继续用力争夺`, action: () => this.keepGrabbing() },
            { text: `用脚绊${friendName}`, action: () => this.tripFriend() }
        ]);
    }

    // 佯攻骗分心
    feintAttack() {
        this.plotProgress = 502;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`你假装要攻击${friendName}的头部，吸引${pronounSub}的注意力。当${friendName}抬手防御时，你迅速伸手去抢夺${pronounSub}手中的黑暗神器。`, [
            { text: `趁机抢夺`, action: () => this.sneakGrabArtifact() },
            { text: `再次佯攻`, action: () => this.feintAgain() }
        ]);
    }

    // 继续用力争夺
    keepGrabbing() {
        this.plotProgress = 503;
        const friendName = this.getFriendName();
        this.playSound(`horrorUp`);
        this.showDialogue(`你和${friendName}激烈地争夺黑暗神器。神器散发出强烈的黑色光芒，你们的手都被灼伤了，但谁也不肯放手。`, [
            { text: `坚持下去`, action: () => this.holdOn() },
            { text: `放手并后退`, action: () => this.letGoAndBack() }
        ]);
    }

    // 用脚绊朋友
    tripFriend() {
        this.plotProgress = 504;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`你趁${friendName}不注意，用脚绊了${friendName}一下。${friendName}失去平衡，摔倒在地，手中的黑暗神器也脱手而出。`, [
            { text: `捡起神器`, action: () => this.pickUpArtifact() },
            { text: `查看${friendName}的情况`, action: () => this.checkFriendCondition() }
        ]);
    }

    // 再次佯攻
    feintAgain() {
        this.plotProgress = 505;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`你再次佯攻${friendName}，但${pronounSub}已经识破了你的计策，不为所动。${friendName}冷笑着说："同样的把戏对我没用！"`, [
            { text: `直接抢夺`, action: () => this.fullForceGrab() },
            { text: `寻找其他机会`, action: () => this.lookForOtherChance() }
        ]);
    }

    // 坚持下去
    holdOn() {
        this.plotProgress = 506;
        const friendName = this.getFriendName();
        this.playSound(`horrorUp`);
        this.showDialogue(`你咬紧牙关，坚持不肯放手。黑暗神器的光芒越来越强，你感到一阵剧烈的疼痛，但你仍然没有松开手。`, [
            { text: `继续坚持`, action: () => this.continueHolding() },
            { text: `使用刻痕戒指`, action: () => this.useEngravedRing() }
        ]);
    }

    // 放手并后退
    letGoAndBack() {
        this.plotProgress = 507;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`你松开手，迅速后退几步。${friendName}也向后退去，警惕地看着你。你们都气喘吁吁，暂时停止了争斗。`, [
            { text: `尝试说服${friendName}`, action: () => this.attemptToConvinceFriend() },
            { text: `寻找机会再次抢夺`, action: () => this.lookForCounterAttack() }
        ]);
    }

    // 捡起神器
    pickUpArtifact() {
        this.plotProgress = 508;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`你迅速捡起地上的黑暗神器。${friendName}挣扎着想要站起来，但显然受了伤，一时无法起身。`, [
            { text: `离开房间`, action: () => this.attemptToEscape() },
            { text: `帮助${friendName}`, action: () => this.helpFriend() }
        ]);
    }

    // 寻找其他机会
    lookForOtherChance() {
        this.plotProgress = 509;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`你暂时退后，寻找其他抢夺神器的机会。${friendName}紧紧握着神器，警惕地看着你，不给你任何可乘之机。`, [
            { text: `尝试说服${friendName}`, action: () => this.attemptToConvinceFriend() },
            { text: `使用环境物品`, action: () => this.useEnvironmentItem() }
        ]);
    }

    // 继续坚持
    continueHolding() {
        this.plotProgress = 510;
        const friendName = this.getFriendName();
        this.playSound(`horrorUp`);
        this.showDialogue(`你继续坚持，手指已经被黑暗神器的光芒灼伤，但你仍然不肯放手。突然，神器发出一阵强烈的光芒，将你和${friendName}都震飞了出去。`, [
            { text: `查看${friendName}的情况`, action: () => this.checkFriendCondition() },
            { text: `再次尝试抢夺神器`, action: () => this.attemptToGrabArtifact() }
        ]);
    }

    // 使用刻痕戒指
    useEngravedRing() {
        this.plotProgress = 511;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        if (this.game.gameState.inventory.includes(`刻痕戒指`)) {
            this.showDialogue(`你想起手上的刻痕戒指，立刻将它戴在手指上。戒指发出一阵柔和的光芒，抵消了黑暗神器的部分力量。${friendName}似乎受到了影响，松开了手。`, [
                { text: `捡起神器`, action: () => this.pickUpArtifact() }
            ]);
        } else {
            this.showDialogue(`你摸了摸口袋，发现刻痕戒指并不在身上。可能是之前在混乱中丢失了。`, [
                { text: `继续坚持`, action: () => this.continueHolding() },
                { text: `放手并后退`, action: () => this.letGoAndBack() }
            ]);
        }
    }

    // 帮助朋友
    helpFriend() {
        this.plotProgress = 512;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`你走到${friendName}身边，伸手想要帮助${friendName}站起来。${friendName}犹豫了一下，最终还是抓住了你的手。${friendName}轻声说："谢谢你...我刚才...不是故意的..."`, [
            { text: `带${friendName}离开`, action: () => this.leaveWithFriend() },
            { text: `询问神器的事`, action: () => this.askAboutArtifact() }
        ]);
    }

    // 使用环境物品
    useEnvironmentItem() {
        this.plotProgress = 513;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`你环顾四周，寻找可以利用的物品。房间里除了一些旧家具外，没有什么可用的东西。${friendName}察觉到你的意图，向你逼近过来。`, [
            { text: `再次尝试抢夺`, action: () => this.fullForceGrab() },
            { text: `尝试逃出房间`, action: () => this.attemptToEscape() }
        ]);
    }

    // 询问神器的事
    askAboutArtifact() {
        this.plotProgress = 514;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`${friendName}叹了口气，说："这个神器...它好像有自己的意识...它一直在我脑海里说话...诱惑我使用它的力量...我刚才...几乎失去了控制..."`, [
            { text: `带${friendName}离开`, action: () => this.leaveWithFriend() },
            { text: `讨论如何处理神器`, action: () => this.discussArtifact() }
        ]);
    }

    // 讨论如何处理神器
    discussArtifact() {
        this.plotProgress = 515;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`你和${friendName}讨论如何处理黑暗神器。${friendName}建议将神器封印起来，防止它继续危害他人。你们决定先离开这里，再想办法处理神器。`, [
            { text: `带${friendName}离开`, action: () => this.leaveWithFriend() }
        ]);
    }

    // 挣扎着退后
    staggerBack() {
        this.plotProgress = 51;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`你强忍着麻痹感，挣扎着退后几步。${friendName}步步紧逼，${friendName}的眼中闪烁着疯狂的光芒。`, [
            { text: `尝试说服${friendName}`, action: () => this.attemptToConvinceFriend() },
            { text: `寻找机会反击`, action: () => this.lookForCounterAttack() }
        ]);
    }

    // 抓住机会反击
    counterAttack() {
        this.plotProgress = 52;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`你抓住${friendName}攻击后的空隙，全力一拳打向${pronounSub}的腹部。${friendName}痛呼一声，后退几步，但很快又稳住了身形。`, [
            { text: `继续攻击`, action: () => this.continueAttacking() },
            { text: `尝试抢夺神器`, action: () => this.attemptToGrabArtifact() }
        ]);
    }

    // 寻找机会抢夺神器
    lookForArtifactChance() {
        this.plotProgress = 53;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`horror`);
        this.showDialogue(`你紧盯着${friendName}手中的黑暗神器，寻找抢夺的机会。${pronounSub}似乎察觉了你的意图，将神器握得更紧了。`, [
            { text: `趁${friendName}不注意抢夺`, action: () => this.sneakGrabArtifact() },
            { text: `先攻击${friendName}的手臂`, action: () => this.attackArm() }
        ]);
    }

    // 悄悄跟上去
    sneakFollow() {
        this.plotProgress = 54;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`horror`);
        this.showDialogue(`你悄悄跟在${friendName}身后，走进房间深处。${pronounSub}站在一个巨大的魔法阵中央，开始念诵冗长的咒语。黑暗神器悬浮在魔法阵上方，散发出强烈的黑色光芒。`, [
            { text: `在仪式完成前打断`, action: () => this.interruptRitual() },
            { text: `观察寻找弱点`, action: () => this.observeWeakness() }
        ]);
    }

    // 在仪式完成前打断
    interruptRitual() {
        this.plotProgress = 541;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`你大喊一声，冲向${friendName}，试图打断${pronounSub}的仪式。${friendName}被你吓了一跳，咒语被打断。${friendName}愤怒地看着你："你为什么要阻止我？！我马上就能获得强大的力量了！"`, [
            { text: `尝试说服${friendName}`, action: () => this.attemptToConvinceFriend() },
            { text: `尝试抢夺神器`, action: () => this.attemptToGrabArtifact() }
        ]);
    }

    // 观察寻找弱点
    observeWeakness() {
        this.plotProgress = 542;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`你仔细观察${friendName}和魔法阵。你发现每当${friendName}念诵到某个特定的咒语时，魔法阵的光芒就会减弱一些。这可能是一个突破口。`, [
            { text: `在咒语减弱时攻击`, action: () => this.attackAtWeakPoint() },
            { text: `寻找其他弱点`, action: () => this.lookForOtherWeakness() }
        ]);
    }

    // 在咒语减弱时攻击
    attackAtWeakPoint() {
        this.plotProgress = 543;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`你等待着${friendName}念诵到那个特定的咒语。当魔法阵的光芒减弱时，你立刻冲过去，一拳打向${friendName}。${pronounSub}被你击中，倒在地上。`, [
            { text: `查看${friendName}的情况`, action: () => this.checkFriendCondition() },
            { text: `捡起神器`, action: () => this.pickUpArtifact() }
        ]);
    }

    // 寻找其他弱点
    lookForOtherWeakness() {
        this.plotProgress = 544;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`你继续观察房间，寻找其他弱点。你发现房间的角落里有一个奇怪的符号，似乎与魔法阵相连。破坏这个符号可能会干扰魔法阵的运行。`, [
            { text: `破坏符号`, action: () => this.destroySymbol() },
            { text: `直接攻击魔法阵`, action: () => this.attackMagicCircle() }
        ]);
    }

    // 破坏符号
    destroySymbol() {
        this.plotProgress = 545;
        this.playSound(`ding`);
        this.showDialogue(`你跑到房间角落，用力破坏那个符号。符号被破坏后，魔法阵的光芒明显减弱了。${friendName}发出一声惨叫，倒在地上。`, [
            { text: `查看${friendName}的情况`, action: () => this.checkFriendCondition() }
        ]);
    }

    // 攻击魔法阵
    attackMagicCircle() {
        this.plotProgress = 546;
        const friendName = this.getFriendName();
        this.playSound(`horrorUp`);
        this.showDialogue(`你直接冲向魔法阵，试图破坏它。但魔法阵突然爆发出强烈的光芒，将你弹飞出去。你重重地摔在地上，感觉全身剧痛。${friendName}冷笑一声："不自量力！"`, [
            { text: `尝试再次攻击`, action: () => this.attackMagicCircleAgain() },
            { text: `暂时撤退`, action: () => this.retreatTemporarily() }
        ]);
    }

    // 再次攻击魔法阵
    attackMagicCircleAgain() {
        this.plotProgress = 547;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`你强忍着疼痛，再次冲向魔法阵。这一次，你找到了魔法阵的薄弱点，用力攻击。魔法阵被破坏，发出一声巨响。${friendName}倒在地上，昏迷不醒。`, [
            { text: `查看${friendName}的情况`, action: () => this.checkFriendCondition() }
        ]);
    }

    // 暂时撤退
    retreatTemporarily() {
        this.plotProgress = 548;
        this.playSound(`horror`);
        this.showDialogue(`你意识到现在不是攻击的好时机，决定暂时撤退。你慢慢后退，离开了房间。${friendName}没有追击，而是继续专注于仪式。`, [
            { text: `寻找其他入口`, action: () => this.lookForOtherEntrance() },
            { text: `寻找帮助`, action: () => this.lookForHelp() }
        ]);
    }

    // 寻找其他入口
    lookForOtherEntrance() {
        this.plotProgress = 549;
        this.playSound(`ding`);
        this.showDialogue(`你在后勤区域寻找其他入口。经过一番搜索，你发现了一个通往房间的通风管道。你爬进通风管道，悄悄接近房间。`, [
            { text: `从通风管道攻击`, action: () => this.attackFromVent() },
            { text: `悄悄进入房间`, action: () => this.sneakIntoRoom() }
        ]);
    }

    // 从通风管道攻击
    attackFromVent() {
        this.plotProgress = 550;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`你从通风管道跳下来，正好落在${friendName}身后。你出其不意地攻击${friendName}，${friendName}被你击中，倒在地上。`, [
            { text: `查看${friendName}的情况`, action: () => this.checkFriendCondition() }
        ]);
    }

    // 悄悄进入房间
    sneakIntoRoom() {
        this.plotProgress = 551;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`你悄悄从通风管道进入房间，躲在一个柜子后面。${friendName}仍然专注于仪式，没有发现你。`, [
            { text: `在仪式完成前打断`, action: () => this.interruptRitual() },
            { text: `观察寻找弱点`, action: () => this.observeWeakness() }
        ]);
    }

    // 趁机抢夺神器
    stealArtifact() {
        this.plotProgress = 55;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`你突然暴起，冲向${friendName}，试图抢夺${pronounSub}手中的黑暗神器。${friendName}反应不及，神器被你抢到手。但${friendName}立刻抓住你的手腕，疯狂地想要夺回神器。`, [
            { text: `用力挣脱`, action: () => this.forceEscape() },
            { text: `用神器攻击${friendName}`, action: () => this.attackWithArtifact() }
        ]);
    }

    // 用力挣脱
    forceEscape() {
        this.plotProgress = 59;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`你用尽全身力气，挣脱了${friendName}的束缚。${friendName}踉跄了一下，你趁机向后退去，与${friendName}拉开距离。`, [
            { text: `尝试逃出房间`, action: () => this.attemptToEscape() },
            { text: `再次尝试说服${friendName}`, action: () => this.attemptToConvinceFriend() }
        ]);
    }

    // 用神器攻击朋友
    attackWithArtifact() {
        this.plotProgress = 60;
        const friendName = this.getFriendName();
        const pronounObj = this.getFriendPronoun(`object`);
        this.playSound(`horrorUp`);
        this.showDialogue(`你举起黑暗神器，向${friendName}挥去。但神器突然发出一阵黑色的光芒，你感到一阵眩晕。当你恢复意识时，发现${friendName}倒在地上，${pronounObj}的身上笼罩着黑色的雾气。`, [
            { text: `查看${friendName}的情况`, action: () => this.checkFriendCondition() },
            { text: `逃离房间`, action: () => this.attemptToEscape() }
        ]);
    }

    // 尝试用铁棍攻击
    attackWithRod() {
        this.plotProgress = 56;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`你挥动铁棍，向${friendName}砸去。${pronounSub}用黑暗神器挡住了你的攻击，铁棍与神器相撞，发出刺耳的金属声。`, [
            { text: `继续攻击`, action: () => this.continueAttackingWithRod() },
            { text: `寻找破绽`, action: () => this.lookForWeakSpot() }
        ]);
    }

    // 保持防御寻找机会
    defendAndWait() {
        this.plotProgress = 57;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`你保持防御姿势，等待${friendName}的攻击出现破绽。${friendName}不断挥动黑暗神器攻击你，${friendName}的呼吸越来越急促。`, [
            { text: `寻找机会反击`, action: () => this.lookForCounterAttack() },
            { text: `尝试说服${friendName}`, action: () => this.attemptToConvinceFriend() }
        ]);
    }

    // 尝试逃出房间
    attemptToEscape() {
        this.plotProgress = 58;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`你转身冲向门口，试图逃出房间。但${friendName}比你更快，${pronounSub}瞬间移动到门口，挡住了你的去路。${friendName}冷笑着说："想跑？没那么容易！"`, [
            { text: `强行突破`, action: () => this.forceBreakthrough() },
            { text: `回头再战`, action: () => this.fightBack() }
        ]);
    }

    // 强行突破
    forceBreakthrough() {
        this.plotProgress = 581;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`你咬紧牙关，全力向${friendName}冲去。${friendName}没想到你会这么拼命，被你撞得向后退去。你趁机冲出了房间，但${friendName}在后面紧追不舍。`, [
            { text: `继续逃跑`, action: () => this.continueRunning() },
            { text: `找地方躲藏`, action: () => this.findHidingPlace() }
        ]);
    }

    // 回头再战
    fightBack() {
        this.plotProgress = 582;
        const friendName = this.getFriendName();
        this.playSound(`horrorUp`);
        this.showDialogue(`你停下脚步，转身面对${friendName}。${friendName}见状，露出了残忍的笑容："很好，我倒要看看你有多大本事！"`, [
            { text: `寻找机会攻击`, action: () => this.lookForCounterAttack() },
            { text: `尝试说服${friendName}`, action: () => this.attemptToConvinceFriend() }
        ]);
    }

    // 继续逃跑
    continueRunning() {
        this.plotProgress = 583;
        this.playSound(`ding`);
        this.showDialogue(`你拼命奔跑，穿过走廊，跑向学校的出口。你不知道${friendName}是否还在后面追赶，但你不敢回头，只能继续向前跑。`, [
            { text: `逃出学校`, action: () => this.escapeSchool() }
        ]);
    }

    // 找地方躲藏
    findHidingPlace() {
        this.plotProgress = 584;
        this.playSound(`horror`);
        this.showDialogue(`你跑进一个教室，躲在讲台后面。${friendName}的脚步声越来越近，你屏住呼吸，祈祷${friendName}不要发现你。`, [
            { text: `等待${friendName}离开`, action: () => this.waitForFriendToLeave() },
            { text: `偷偷观察${friendName}`, action: () => this.sneakObserveFriend() }
        ]);
    }

    // 逃出学校
    escapeSchool() {
        this.plotProgress = 585;
        this.playSound(`ding`);
        this.showDialogue(`你终于跑出了学校。外面的阳光让你感到一阵温暖，你回头看向学校，发现${friendName}并没有追出来。你知道，这次你成功逃脱了，但${friendName}仍然被困在黑暗中。`, [
            { text: `报警求助`, action: () => this.callPolice() },
            { text: `返回学校救${friendName}`, action: () => this.returnToSaveFriend() }
        ]);
    }

    // 等待朋友离开
    waitForFriendToLeave() {
        this.plotProgress = 586;
        this.playSound(`horror`);
        this.showDialogue(`你在讲台后面等了很久，终于听不到${friendName}的脚步声了。你悄悄探出头，发现教室里空无一人。`, [
            { text: `继续寻找出口`, action: () => this.attemptToEscape() }
        ]);
    }

    // 偷偷观察朋友
    sneakObserveFriend() {
        this.plotProgress = 587;
        const friendName = this.getFriendName();
        this.playSound(`horrorUp`);
        this.showDialogue(`你悄悄探出头，观察${friendName}的动向。${friendName}站在教室门口，似乎在犹豫要不要进来。突然，${friendName}的身体颤抖了一下，眼睛里闪过一丝挣扎的神色。`, [
            { text: `尝试呼唤${friendName}`, action: () => this.callFriendName() },
            { text: `继续躲藏`, action: () => this.waitForFriendToLeave() }
        ]);
    }

    // 呼唤朋友名字
    callFriendName() {
        this.plotProgress = 588;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`你轻声呼唤${friendName}的名字。${friendName}听到你的声音，身体明显一震。${friendName}缓缓转过身，眼睛里的疯狂之色逐渐消退，取而代之的是迷茫和痛苦。`, [
            { text: `上前安慰${friendName}`, action: () => this.comfortFriend() }
        ]);
    }

    // 安慰朋友
    comfortFriend() {
        this.plotProgress = 589;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`你慢慢走到${friendName}身边，轻声安慰${friendName}。${friendName}扑进你的怀里，失声痛哭："我...我刚才好像做了很多可怕的事情..."`, [
            { text: `带${friendName}离开`, action: () => this.leaveWithFriend() }
        ]);
    }

    // 返回学校救朋友
    returnToSaveFriend() {
        this.plotProgress = 590;
        const friendName = this.getFriendName();
        this.playSound(`horrorUp`);
        this.showDialogue(`你深吸一口气，转身跑回学校。你不能就这样丢下${friendName}不管。当你回到刚才的房间时，发现${friendName}正抱着头蹲在地上，黑暗神器已经不见了踪影。`, [
            { text: `询问${friendName}神器的下落`, action: () => this.askAboutArtifact() },
            { text: `带${friendName}离开`, action: () => this.leaveWithFriend() }
        ]);
    }

    // 查看朋友情况
    checkFriendCondition() {
        this.plotProgress = 61;
        const friendName = this.getFriendName();
        const pronounObj = this.getFriendPronoun(`object`);
        this.playSound(`horror`);
        this.showDialogue(`${friendName}倒在地上，${pronounObj}的呼吸微弱。你走上前去，发现${friendName}的眼睛已经恢复了正常，但脸上仍然带着痛苦的表情。`, [
            { text: `唤醒${friendName}`, action: () => this.wakeFriend() },
            { text: `寻找帮助`, action: () => this.lookForHelp() }
        ]);
    }

    // 唤醒朋友
    wakeFriend() {
        this.plotProgress = 62;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`你轻轻摇晃${friendName}的身体，呼喊${friendName}的名字。${friendName}缓缓睁开眼睛，看到你后，露出了虚弱的笑容："${this.game.gameState.playerName}...谢谢你..."`, [
            { text: `询问${friendName}发生了什么`, action: () => this.askFriendWhatHappened() },
            { text: `带${friendName}离开这里`, action: () => this.leaveWithFriend() }
        ]);
    }

    // 带朋友离开
    leaveWithFriend() {
        this.plotProgress = 63;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`你搀扶着${friendName}，慢慢走出房间。黑暗神器仍然在房间中央散发着黑色的光芒，但你已经没有力气再去管它了。你们跌跌撞撞地走出学校后勤区域，回到了学校的走廊。`, [
            { text: `前往医务室`, action: () => this.goToInfirmary() },
            { text: `报警`, action: () => this.callPolice() }
        ]);
    }

    // 寻找帮助
    lookForHelp() {
        this.plotProgress = 64;
        this.playSound(`ding`);
        this.showDialogue(`你跑出房间，大声呼喊救命。但整个学校静悄悄的，没有任何人回应。你意识到现在只能靠自己了。`, [
            { text: `返回房间`, action: () => this.checkFriendCondition() }
        ]);
    }

    // 询问朋友发生了什么
    askFriendWhatHappened() {
        this.plotProgress = 65;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`${friendName}虚弱地说："我...我被那个神器控制了...它...它一直在我脑海里说话...让我做一些可怕的事情..."`, [
            { text: `带${friendName}离开这里`, action: () => this.leaveWithFriend() }
        ]);
    }

    // 前往医务室
    goToInfirmary() {
        this.plotProgress = 66;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`你搀扶着${friendName}来到医务室，找到了一些应急药品。你帮${friendName}处理了伤口，${friendName}的情况看起来有所好转。`, [
            { text: `休息一会儿`, action: () => this.restInInfirmary() }
        ]);
    }

    // 在医务室休息
    restInInfirmary() {
        this.plotProgress = 67;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`你和${friendName}在医务室休息了一会儿。${friendName}的精神状态好了很多，但你们都知道，这次的事件远远没有结束。黑暗神器仍然在学校里，等待着下一个受害者。`, [
            { text: `结束第四章`, action: () => this.completeChapter() }
        ]);
    }

    // 报警
    callPolice() {
        this.plotProgress = 68;
        this.playSound(`ding`);
        this.showDialogue(`你拿出手机报警，但发现手机没有信号。整个学校似乎被某种力量笼罩，与外界完全隔绝。`, [
            { text: `前往医务室`, action: () => this.goToInfirmary() }
        ]);
    }

    // 完成章节
    completeChapter() {
        // 这是最终章，没有下一章
        // 显示结局画面
        this.showResultScreen();

        // 显示结局画面
        this.showResultScreen();
    }

    // 显示结局画面
    showResultScreen() {
        this.game.elements.gameScreen.classList.add('hidden');
        this.game.elements.resultScreen.classList.remove('hidden');

        // 显示章节名称和通关时间
        let chapterName = '第四章-「黑暗侵蚀」';
        this.game.elements.resultChapter.textContent = chapterName;
        this.game.elements.resultTime.textContent = this.game.gameState.gameTime;

        // 隐藏下一章按钮，这是最终章
        this.game.elements.nextChapterBtn.classList.add('hidden');
        // 显示返回章节选择按钮
        this.game.elements.backToChapterSelectBtn.classList.remove('hidden');
        this.game.elements.backToChapterSelectBtn.textContent = '返回章节选择';

        // 显示结局描述
        const endingDescription = document.createElement('div');
        endingDescription.className = 'ending-description';
        endingDescription.innerHTML = `
            <p>你成功从被黑暗神器控制的朋友手中逃脱，并帮助朋友恢复了意识。</p>
            <p>虽然黑暗神器仍然存在，但你已经证明了友情的力量能够战胜黑暗。</p>
            <p>然而，这仅仅是开始...更强大的黑暗力量正在等待着你...</p>
        `;

        // 添加结局描述到结算屏幕
        this.game.elements.resultScreen.innerHTML = '';
        this.game.elements.resultScreen.appendChild(endingDescription);
    }
}
// 导出Chapter4类到window对象
window.Chapter4 = Chapter4;