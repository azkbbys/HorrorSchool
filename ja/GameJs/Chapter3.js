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
                this.game.horrorDing.play().catch(e => console.log('音效再生失敗:', e));
            } else if (soundName === 'horror' && this.game.horrorUp) {
                this.game.horrorUp.currentTime = 0;
                this.game.horrorUp.play().catch(e => console.log('音效再生失敗:', e));
            }
        } catch (error) {
            console.log('音效再生エラー:', error);
        }
    }

    // 根据玩家性别获取朋友的正确代词
    getFriendPronoun(type) {
        // 检查是否为非正常性别
        const abnormalGenders = ['ウォルマートの買い物袋', '攻撃ヘリコプター'];
        if (abnormalGenders.includes(this.game.gameState.playerGender)) {
            return 'それ';
        }

        const isMale = this.game.gameState.playerGender === 'male';
        switch (type) {
            case 'subject': // 主格 (彼/彼女)
                return isMale ? '彼' : '彼女';
            case 'object': // 宾格 (彼/彼女)
                return isMale ? '彼' : '彼女';
            case 'possessive': // 所有格 (彼の/彼女の)
                return isMale ? '彼の' : '彼女の';
            case 'pronoun': // 代词 (彼/彼女)
                return isMale ? '彼' : '彼女';
            default:
                return isMale ? '彼' : '彼女';
        }
    }

    // 根据玩家性别获取朋友名字
    getFriendName() {
        const abnormalGenders = ['ウォルマートの買い物袋', '攻撃ヘリコプター'];
        if (abnormalGenders.includes(this.game.gameState.playerGender)) {
            return Math.random() < 0.5 ? 'ワンワン' : 'ニャンニャン';
        }
        return this.game.gameState.playerGender === "male" ? "佐藤韦" : "中村娜";
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
        if (!this.game.gameState.inventory.includes('携帯電話')) {
            this.game.gameState.inventory.push('携帯電話');
            // 更新物品栏显示
            this.game.updateInventoryDisplay();
        }

        // 检测是否有徽章，没有则自动添加
        if (!this.game.gameState.inventory.includes('バッジ')) {
            this.game.gameState.inventory.push('バッジ');
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
            this.showDialogue(`${friendName}が寮の部屋で行ったり来たりしていて、とても焦っているようだ。「次はどうすればいい？学校の中のあの連中がどんどん増えている。」`, [
                { text: '一緒に校舎を探索する', action: () => this.loadScene('foyer') },
                { text: '旧校舎を調査する', action: () => this.loadScene('abandonedWing') }
            ]);
        } else {
            this.showDialogue(`寮には誰もいないが、${friendName}のベッドの上に開かれた日記があるのに気づく。日記の最後のページには「私は旧校舎に行かなければならない。そこに真実がある。」と書かれている。`, [
                { text: '旧校舎へ向かう', action: () => this.loadScene('abandonedWing') },
                { text: '学校の正門に戻る', action: () => this.loadScene('schoolGate') }
            ]);
        }
    }

    // 朋友房间场景
    showFriendRoomScene() {
        this.game.gameState.currentScene = 'friendRoom';
        this.game.updateGameMap('friendRoom');
        const friendName = this.getFriendName();

        if (this.friendSaved) {
            this.showDialogue(`${friendName}の部屋はきれいだが、空気中に奇妙な匂いが漂っている。机の上にはあなたたちの写真があり、裏には「永遠の友達」と書かれている。`, [
                { text: `${this.getFriendPronoun('object')}と話す`, action: () => this.talkToFriend() },
                { text: '部屋を出る', action: () => this.enterSchool() }
            ]);
        } else {
            this.showDialogue(`ここは${friendName}の部屋だが、中には誰もいない。ベッドの掛け布団は乱れており、持ち主が急いで去ったようだ。机の上には日記があり、最後のページには「赤い目を見た…」と書かれている。`, [
                { text: '日記を見る', action: () => this.readFriendDiary() },
                { text: '部屋を出る', action: () => this.enterSchool() }
            ]);
        }
    }

    talkToFriend() {
        const friendName = this.getFriendName();
        this.showDialogue(`${friendName}はとても疲れているようだ：「まだ起こったことを信じられない。あの黒い影…ずっと私を追いかけている。」`, [
            { text: `${this.getFriendPronoun('object')}を慰める`, action: () => this.comfortFriend() },
            { text: '一緒に学校を探索する', action: () => this.exploreWithFriend() }
        ]);
    }

    readFriendDiary() {
        const friendName = this.getFriendName();
        this.showDialogue(`日記には${friendName}の最近の遭遇が記録されている：「悪夢を見始めた、赤い目と黒い影の夢を。今日、旧校舎で奇妙な記号を見た、それらは何かを呼び出しているようだ…」`, [
            { text: '引き続き見る', action: () => this.continueReadingDiary() },
            { text: '部屋を出る', action: () => this.enterSchool() }
        ]);
    }

    comfortFriend() {
        const friendName = this.getFriendName();
        this.showDialogue(`${friendName}は無理に笑った：「ありがとう、あなたがいてくれて気分がだいぶ良くなった。」`, [
            { text: '一緒に学校を離れる', action: () => this.leaveWithFriend() },
            { text: '一緒に学校を探索する', action: () => this.exploreWithFriend() }
        ]);
    }

    continueReadingDiary() {
        const friendName = this.getFriendName();
        this.showDialogue(`日記の最後の数ページは破り取られており、一文だけが残っている：「10月13日、祭壇は再び目覚める…」`, [
            { text: '部屋を出る', action: () => this.enterSchool() }
        ]);
    }

    // 学校门口场景
    showSchoolGateScene() {
        this.game.gameState.currentScene = 'schoolGate';
        this.game.updateGameMap('schoolGate');

        if (this.plotProgress === 0) {
            this.showDialogue('あなたは校門を飛び出したが、通りには誰もいないことに気づく。街灯が明滅し、地面の影は歪んだ形をしている。振り返ると、学校の輪郭が夜の闇の中で異常に凶悪に見える。', [
                { text: '学校に戻る', action: () => this.enterSchool() },
                { text: '携帯電話を確認する', action: () => this.checkPhone() }
            ]);
        } else if (this.plotProgress === 1) {
            this.showDialogue('あなたは校門の前に立ち、再びこの恐怖に満ちた場所に入るかどうか躊躇っている。突然、背後から足音が聞こえる。', [
                { text: '振り返って確認する', action: () => this.seeWhoIsThere() },
                { text: '素早く学校に入る', action: () => this.enterSchool() }
            ]);
        }
    }

    checkPhone() {
        if (this.game.gameState.inventory.includes('携帯電話')) {
            this.showDialogue('携帯電話を取り出すと、電波が入っていない。アルバムの写真は歪み、すべての人物の顔が黒く塗りつぶされている。最後の写真は学校の全景で、中央に光る赤い点がある。', [
                { text: '学校に戻る', action: () => this.enterSchool() },
                { text: '赤い点の位置を調査する', action: () => this.investigateRedDot() }
            ]);
        } else {
            this.showDialogue('携帯電話を持っていません。', [
                { text: '学校に戻る', action: () => this.enterSchool() }
            ]);
        }
    }

    seeWhoIsThere() {
        this.plotProgress = 2;
        const friendName = this.getFriendName();
        this.showDialogue(`振り返ると、${friendName}があなたの後ろに立ち、顔色が青ざめている。${this.getFriendPronoun('subject')}の目には瞳孔がなく、代わりに点滅する赤い光がある。
「あなた…逃げられない…」${friendName}の声はかすれ、人間の声とは思えない。`, [
            { text: 'どうしたの？', action: () => this.askFriendCondition() },
            { text: '後退する', action: () => this.backAwayFromFriend() }
        ]);
    }

    enterSchool() {
        this.game.updateGameMap('foyer');
        this.showDialogue('校門を押し開けると、きしむ音が静かな夜に特に耳障りだ。学校内部の光景は以前とは異なり、廊下には赤い霧が漂い、壁の肖像画はすべて髑髏に変わっている。', [
            { text: '校舎へ向かう', action: () => this.loadScene('foyer') },
            { text: '寮へ向かう', action: () => this.loadScene('dormitory') }
        ]);
    }

    investigateRedDot() {
        this.plotProgress = 1;
        this.showDialogue('赤い点の位置は学校の旧校舎のようだ。そこは何年も前に廃墟となった。第2章の倉庫の地図にある「立入禁止区域」のマークがまさに旧校舎だったことを覚えている。', [
            { text: '旧校舎へ向かう', action: () => this.loadScene('abandonedWing') },
            { text: '学校に戻る', action: () => this.enterSchool() }
        ]);
    }

    askFriendCondition() {
        const friendName = this.getFriendName();
        this.showDialogue(`${friendName}は甲高い笑い声をあげる：「私？私はとてもいい…ただ…ついに新しい宿主を見つけた…」
${this.getFriendPronoun('subject')}の体は歪み始め、皮膚の下に何かが這っているようだ。`, [
            { text: `${this.getFriendPronoun('object')}を起こそうとする`, action: () => this.tryToWakeFriend() },
            { text: '逃げる', action: () => this.enterSchool() }
        ]);
    }

    backAwayFromFriend() {
        const friendName = this.getFriendName();
        this.showDialogue(`あなたが数歩後退すると、${friendName}は迫りくる。${this.getFriendPronoun('subject')}の爪は長く尖り、目の中の赤い光はますます明るくなる。`, [
            { text: 'バッジを使う', action: () => this.useBadgeAgainstFriend() },
            { text: '逃げる', action: () => this.enterSchool() }
        ]);
    }

    tryToWakeFriend() {
        const friendName = this.getFriendName();
        if (this.game.gameState.inventory.includes('写真')) {
            this.showDialogue(`あなたは${friendName}が落とした写真を取り出す：「これを覚えている？私たちは友達だよ！」
${friendName}の動きが突然止まり、目の中の赤い光が一瞬点滅する：「友達…？」
${this.getFriendPronoun('subject')}の体は震え始め、もがいているようだ。`, [
                { text: '引き続き起こす', action: () => this.continueWakingFriend() },
                { text: `${this.getFriendPronoun('object')}を連れて離れる`, action: () => this.leaveWithFriend() }
            ]);
        } else {
            this.showDialogue(`${friendName}の攻撃は止まらず、${this.getFriendPronoun('subject')}は完全に正気を失ったようだ。`, [
                { text: 'バッジを使う', action: () => this.useBadgeAgainstFriend() },
                { text: '逃げる', action: () => this.enterSchool() }
            ]);
        }
    }

    useBadgeAgainstFriend() {
        if (this.game.gameState.inventory.includes('バッジ')) {
            const friendName = this.getFriendName();
            this.showDialogue(`バッジを取り出すと、バッジは強い光を放つ。${friendName}は悲鳴をあげ、地面に倒れる。黒い影が${this.getFriendPronoun('subject')}の体内から漂い出て、夜の闇に消える。
${friendName}はゆっくりと目を開け、目つきは正常に戻った：「何が起こったの？私…さっき悪夢を見たみたい…」`, [
                { text: `${this.getFriendPronoun('object')}を連れて離れる`, action: () => this.leaveWithFriend() },
                { text: '一緒に学校を探索する', action: () => this.exploreWithFriend() }
            ]);
            this.friendSaved = true;
        } else {
            this.showDialogue(`バッジを持っていません。`, [
                { text: '逃げる', action: () => this.enterSchool() }
            ]);
        }
    }

    //  foyer场景
    showFoyerScene() {
        this.game.gameState.currentScene = 'foyer';
        this.game.updateGameMap('foyer');
        this.showDialogue('校舎のホールの地面には巨大な記号が刻まれており、鍵とバッジで見た記号と同じだ。記号の中央にはくぼみがあり、何かを入れられそうだ。', [
            { text: 'バッジを入れる', action: () => this.placeBadge() },
            { text: '校舎を探索する', action: () => this.exploreFoyer() },
            { text: 'ホールを出る', action: () => this.enterSchool() }
        ]);
    }

    placeBadge() {
        if (this.game.gameState.inventory.includes('バッジ')) {
            this.symbolDeciphered = true;
            this.showDialogue('バッジをくぼみに入れると、バッジと記号は完璧に合う。記号はまばゆい光を放ち、地面が震え始める。ホールの壁に新しい入口が現れ、地下へと通じている。', [
                { text: '地下の入口に入る', action: () => this.loadScene('labyrinth') },
                { text: '引き続きホールを探索する', action: () => this.exploreFoyer() }
            ]);
        } else {
            this.showDialogue(`バッジを持っていません。`, [
                { text: '校舎を探索する', action: () => this.exploreFoyer() }
            ]);
        }
    }

    exploreFoyer() {
        // 添加古老卷轴到物品栏（避免重复添加）
        if (!this.game.gameState.inventory.includes('古い巻物')) {
            this.game.gameState.inventory.push('古い巻物');
            // 更新物品栏显示
            this.game.updateInventoryDisplay();
        }
        this.showDialogue('ホールの隅で古い巻物を見つけた。巻物には学校の歴史が記されている：「本校は1923年に設立され、旧址は古代の祭壇である。毎年10月13日、祭壇の怒りを鎮めるために一人の魂を捧げなければならない。」', [
            { text: '巻物をしまう', action: () => this.keepScroll() },
            { text: '地下の入口に入る', action: () => this.loadScene('labyrinth') }
        ]);
    }

    // 废弃教学楼场景
    showAbandonedWingScene() {
        this.game.gameState.currentScene = 'abandonedWing';
        this.game.updateGameMap('abandonedWing');
        this.showDialogue('旧校舎は荒れ果てており、廊下の床はひどく腐食し、壁には蜘蛛の巣が張り巡らされている。空気中には腐敗した臭いが漂っている。', [
            { text: '教室を探索する', action: () => this.exploreClassroom() },
            { text: '屋上へ向かう', action: () => this.goToRoof() },
            { text: '旧校舎を離れる', action: () => this.enterSchool() }
        ]);
    }

    exploreClassroom() {
        // 添加祭祀 dagger到物品栏（避免重复添加）
        if (!this.game.gameState.inventory.includes('儀式の短剣')) {
            this.game.gameState.inventory.push('儀式の短剣');
            // 更新物品栏显示
            this.game.updateInventoryDisplay();
        }
        this.showDialogue('教室の机には奇妙な記号が刻まれている。教壇には錆びた短剣が置かれており、短剣には暗赤色の痕がついている。壁には血で書かれた一行の文字がある：「10月13日、彼らが来る」。', [
            { text: '短剣を拾う', action: () => this.takeDagger() },
            { text: '教室を出る', action: () => this.showAbandonedWingScene() }
        ]);
    }

    goToRoof() {
        this.showDialogue('屋上に来ると、ここに小さな祭壇があることに気づく。祭壇の上には髑髏が置かれており、目には緑色の光が点滅している。', [
            { text: '祭壇を調べる', action: () => this.examineRoofAltar() },
            { text: '屋上を離れる', action: () => this.showAbandonedWingScene() }
        ]);
    }

    examineRoofAltar() {
        if (this.game.gameState.inventory.includes('古い巻物')) {
            this.truthRevealed = true;
            this.showDialogue('巻物を広げ、祭壇の上の記号と照らし合わせる。巻物の文字が輝き始める：「循環を断ち切る鍵は、無実の者ではなく、生贄を捧げる者を犠牲にすることにある。」', [
                { text: '意味を理解する', action: () => this.understandScroll() },
                { text: '屋上を離れる', action: () => this.showAbandonedWingScene() }
            ]);
        } else {
            this.showDialogue('祭壇の上の記号はあなたにとって何の意味もない。', [
                { text: '屋上を離れる', action: () => this.showAbandonedWingScene() }
            ]);
        }
    }

    // 迷宫场景
    showLabyrinthScene() {
        this.game.gameState.currentScene = 'labyrinth';
        this.game.updateGameMap('labyrinth');
        this.showDialogue('地下迷路は複雑で、壁にはバッジと同じ記号が刻まれている。地面には赤、青、緑の三つの異なる色のドアがある。', [
            { text: '赤いドアに入る', action: () => this.enterRedDoor() },
            { text: '青いドアに入る', action: () => this.enterBlueDoor() },
            { text: '緑のドアに入る', action: () => this.enterGreenDoor() }
        ]);
    }

    enterRedDoor() {
        this.showDialogue('赤いドアの後ろは炎に満ちた部屋だ。部屋の中央には火鉢があり、中には永遠の炎が燃えている。', [
            { text: '炎に触れる', action: () => this.touchFire() },
            { text: '迷路に戻る', action: () => this.showLabyrinthScene() }
        ]);
    }

    enterBlueDoor() {
        this.showDialogue('青いドアの後ろは水に満ちた部屋だ。部屋の中央には水池があり、中には黒い蓮の花が浮かんでいる。', [
            { text: '蓮の花に触れる', action: () => this.touchLotus() },
            { text: '迷路に戻る', action: () => this.showLabyrinthScene() }
        ]);
    }

    enterGreenDoor() {
        this.showDialogue('緑のドアの後ろは植物に満ちた部屋だ。部屋の中央には巨大な木があり、木には赤い実がたわわに実っている。', [
            { text: '実をもぐ', action: () => this.pickFruit() },
            { text: '迷路に戻る', action: () => this.showLabyrinthScene() }
        ]);
    }

    // 祭坛房间场景
    showAltarRoomScene() {
        this.game.gameState.currentScene = 'altarRoom';
        this.game.updateGameMap('altarRoom');
        this.showDialogue(`あなたは巨大な地下祭壇の部屋に来た。中央の祭壇には一人の人間が縛り付けられており、まさに${this.game.gameState.playerGender === "male" ? "佐藤韦" : "中村娜"}だ！黒いローブを着た人物が祭壇の前に立ち、手には短剣を持っている。
「ついに生贄を捧げる時が来た！」黒ローブの人物はしわがれた笑い声をあげる。`, [
            { text: '生贄を阻止する', action: () => this.stopSacrifice() },
            { text: '武器を探す', action: () => this.findWeapon() }
        ]);
    }

    stopSacrifice() {
        if (this.game.gameState.inventory.includes('儀式の短剣')) {
            this.showDialogue(`あなたは黒ローブの人物に突進し、短剣で${this.game.gameState.playerGender === "male" ? "彼" : "彼女"}を刺す。黒ローブの人物は悲鳴をあげ、一筋の黒い煙と化す。
${this.game.gameState.playerGender === "male" ? "佐藤韦" : "中村娜"}は地面に倒れ、意識を失う。祭壇は崩壊し始め、部屋全体が崩れ落ちそうになる。`, [
                { text: `${this.getFriendPronoun('object')}を連れて逃げる`, action: () => this.escapeWithFriend() },
                { text: '出口を探す', action: () => this.findExit() }
            ]);
        } else {
            this.showDialogue(`あなたは黒ローブの人物に突進するが、${this.game.gameState.playerGender === "male" ? "彼" : "彼女"}はそっと袖を振るうだけで、あなたは弾き飛ばされる。`, [
                { text: '武器を探す', action: () => this.findWeapon() },
                { text: 'バッジを使う', action: () => this.useBadgeAgainstCultist() }
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
                console.error('環境音再生失敗:', error);
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
        const chapterName = '第三章-「永夜の沈黙」';
        this.game.elements.resultChapter.textContent = chapterName;
        this.game.elements.resultTime.textContent = this.game.gameState.gameTime;

        // 添加黑暗结局提示
        const resultDescription = this.game.elements.resultDescription;
        if (resultDescription) {
            resultDescription.textContent = 'これで終わりだと思う？いいえ、これは始まりに過ぎない。呪いはまだ続き、循環は決して断ち切られない…';
            resultDescription.style.color = '#ff3333';
            resultDescription.style.fontStyle = 'italic';
        }

        // 修改下一章按钮为进入第四章按钮
        this.game.elements.nextChapterBtn.textContent = '第四章へ進む';
        this.game.elements.nextChapterBtn.classList.remove('hidden');
        this.game.elements.nextChapterBtn.onclick = () => {
            this.game.startChapter('chapter4');
        };
    }

    // 以下是辅助方法
    keepScroll() {
        this.showDialogue('巻物をしまう。この歴史はあまりにも暗すぎる、あなたはこれから起こる悲劇を阻止しなければならない。', [
            { text: '地下の入口に入る', action: () => this.loadScene('labyrinth') }
        ]);
    }

    takeDagger() {
        this.showDialogue('短剣を拾うと、短剣から腕へと寒気が伝わってくるのを感じる。', [
            { text: '教室を出る', action: () => this.showAbandonedWingScene() }
        ]);
    }

    understandScroll() {
        this.showDialogue('あなたはついに学校を救う方法を理解した。無実の学生ではなく、生贄を捧げる者を犠牲にしなければならない。', [
            { text: '地下祭壇へ向かう', action: () => this.loadScene('labyrinth') }
        ]);
    }

    touchFire() {
        if (this.symbolDeciphered) {
            this.artifactCollected = true;
            if (!this.game.gameState.inventory.includes('炎のアーティファクト')) {
                this.game.gameState.inventory.push('炎のアーティファクト');
                // 更新物品栏显示
                this.game.updateInventoryDisplay();
            }
            this.playSound('ding');
            this.showDialogue('炎に触れると、炎は赤い宝石に変わり、あなたの手に飛んでくる。宝石にはバッジと同じ記号が刻まれている。', [
                { text: '迷路に戻る', action: () => this.showLabyrinthScene() }
            ]);
        } else {
            this.playSound('horror');
            this.showDeath('炎があなたの手を焼き、あなたは痛さで悲鳴をあげる。火勢が突然強まり、あなたを飲み込む…');
        }
    }

    touchLotus() {
        if (this.symbolDeciphered) {
            this.artifactCollected = true;
            if (!this.game.gameState.inventory.includes('水のアーティファクト')) {
                this.game.gameState.inventory.push('水のアーティファクト');
                // 更新物品栏显示
                this.game.updateInventoryDisplay();
            }
            this.playSound('ding');
            this.showDialogue('蓮の花に触れると、蓮の花は青い宝石に変わり、あなたの手に飛んでくる。宝石にはバッジと同じ記号が刻まれている。', [
                { text: '迷路に戻る', action: () => this.showLabyrinthScene() }
            ]);
        } else {
            this.playSound('horror');
            this.showDeath('蓮の花が突然咲き、黒い毒液を噴出し、あなたを腐食させる…');
        }
    }

    pickFruit() {
        if (this.symbolDeciphered) {
            this.artifactCollected = true;
            if (!this.game.gameState.inventory.includes('生命のアーティファクト')) {
                this.game.gameState.inventory.push('生命のアーティファクト');
                // 更新物品栏显示
                this.game.updateInventoryDisplay();
            }
            this.playSound('ding');
            this.showDialogue('実をもぐと、実は緑の宝石に変わり、あなたの手に飛んでくる。宝石にはバッジと同じ記号が刻まれている。', [
                { text: '迷路に戻る', action: () => this.showLabyrinthScene() }
            ]);
        } else {
            this.playSound('horror');
            this.showDeath('実が突然破裂し、有毒なガスを放出し、あなたは呼吸困難になる…');
        }
    }

    findWeapon() {
        if (this.game.gameState.inventory.includes('儀式の短剣')) {
            this.showDialogue('すでに短剣を持っています。', [
                { text: '生贄を阻止する', action: () => this.stopSacrifice() }
            ]);
        } else {
            this.showDialogue('部屋の中には使える武器は何もない。祭壇は崩壊を続け、状況は危急だ。', [
                { text: 'バッジを使う', action: () => this.useBadgeAgainstCultist() },
                { text: '友達を救おうとする', action: () => this.stopSacrifice() }
            ]);
        }
    }

    useBadgeAgainstCultist() {
        if (this.game.gameState.inventory.includes('バッジ')) {
            this.showDialogue(`バッジを取り出すと、バッジは強い光を放つ。黒ローブの人物は悲鳴をあげ、一筋の黒い煙と化す。
${this.game.gameState.playerGender === "male" ? "佐藤韦" : "中村娜"}は地面に倒れ、意識を失う。祭壇は崩壊し始め、部屋全体が崩れ落ちそうになる。`, [
                { text: `${this.getFriendPronoun('object')}を連れて逃げる`, action: () => this.escapeWithFriend() },
                { text: '出口を探す', action: () => this.findExit() }
            ]);
        } else {
            this.showDialogue(`バッジを持っていません。`, [
                { text: '友達を救おうとする', action: () => this.stopSacrifice() }
            ]);
        }
    }

    escapeWithFriend() {
        this.friendSaved = true;
        this.showDialogue(`あなたは${this.game.gameState.playerGender === "male" ? "佐藤韦" : "中村娜"}を背負い、祭壇が崩壊する前に出口を見つける。あなたたちは学校から逃げ出すが、空は依然として真っ暗で、黎明の兆しはまったくない。
${this.game.gameState.playerGender === "male" ? "佐藤韦" : "中村娜"}はゆっくりと目を覚ますが、目は虚ろだ：「ありがとう…しかしすべてはまだ終わっていない…」
うつむくと、${this.game.gameState.playerGender === "male" ? "彼" : "彼女"}の首に、学校のバッジと同じ記号が浮かび上がっているのがわかる。あなたは呪いが永遠に終わらないことを知っている。`, [
            { text: '第三章を完了する', action: () => this.completeChapter() }
        ]);
    }

    findExit() {
        this.showDialogue(`あなたは祭壇が崩壊する前に出口を見つける。学校から逃げ出すが、空は依然として暗闇に覆われている。
振り返ると、学校の輪郭が夜の闇の中で歪み変形し、巨大な怪物があなたを見つめているようだ。あなたは自分が本当に逃げ出したわけではなく、ただ一時的にあの地獄から離れただけだとわかる。
そしてあのバッジは、まだあなたのポケットの中でかすかに光を放っている…`, [
            { text: '第三章を完了する', action: () => this.completeChapter() }
        ]);
    }

    continueWakingFriend() {
        const friendName = this.game.gameState.playerGender === "male" ? "佐藤韦" : "中村娜";
        this.showDialogue(`${friendName}の体はさらに激しく震える：「友達…そうだ…私たちは友達だ…」
黒い影が${this.game.gameState.playerGender === "male" ? "彼" : "彼女"}の体内からゆっくりと漂い出て、夜の闇に消える。
${friendName}は地面に倒れ、意識を失う。`, [
            { text: `${this.getFriendPronoun('object')}を連れて離れる`, action: () => this.leaveWithFriend() },
            { text: '一緒に学校を探索する', action: () => this.exploreWithFriend() }
        ]);
        this.friendSaved = true;
    }

    leaveWithFriend() {
        this.friendSaved = true;
        this.showDialogue(`あなたは${this.game.gameState.playerGender === "male" ? "佐藤韦" : "中村娜"}を背負い、学校を離れる。空は依然として真っ暗で、黎明の兆しはまったくない。${this.game.gameState.playerGender === "male" ? "佐藤韦" : "中村娜"}の体はどんどん冷たくなり、あなたは、あるものは永遠に変わってしまったことを知る…`, [
            { text: '第三章を完了する', action: () => this.completeChapter() }
        ]);
    }

    exploreWithFriend() {
        const friendName = this.game.gameState.playerGender === 'male' ? '佐藤韦' : '中村娜';
        this.showDialogue(`${friendName}はまだ少し弱っているが、それでもあなたと一緒に学校を探索することを決める：「真実を見つけ出さなければならない、さもなければさらに多くの人が被害に遭う。」`, [
            { text: '旧校舎へ向かう', action: () => this.loadScene('abandonedWing') },
            { text: '地下迷路へ向かう', action: () => this.loadScene('labyrinth') }
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