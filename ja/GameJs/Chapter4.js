class Chapter4 {
    constructor(game) {
        this.game = game;
        this.plotProgress = 0;
        this.escapeTimer = null;
        this.clickCount = 0;
        this.requiredClicks = 15; // 必要なクリック回数
        this.clickTimeLimit = 5000; // クリック制限時間(ミリ秒)
        this.isPuzzleActive = false;
        this.typingInterval = null;
    }

    // 第四章を開始
    start(startTime = null) {
        this.game.gameState.currentChapter = `chapter4`;
        this.plotProgress = 0;
        // ゲーム時間を初期化
        if (startTime) {
            this.updateGameTime(startTime);
        } else {
            this.updateGameTime(`23:30`); // デフォルト開始時間
        }
        // プレイヤーがバッジを持っていることを確認
        if (!this.game.gameState.inventory.includes(`バッジ`)) {
            this.game.gameState.inventory.push(`バッジ`);
            this.game.updateInventoryDisplay();
        }
        this.loadScene(`outsideSchool`);
    }

    loadScene(sceneName) {
        this.game.gameState.currentScene = sceneName;
        this.game.updateGameMap(sceneName);
        this.game.elements.gameMap.innerHTML = ``; // マップをクリア
        this.game.elements.gameActions.innerHTML = ``; // アクションボタンをクリア
        this.game.elements.dialogueChoices.innerHTML = ``; // 会話オプションをクリア

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
                this.showDialogue(`未知のシーン`, [{ text: `学校に戻る`, action: () => this.loadScene(`outsideSchool`) }]);
        }
    }

    showOutsideSchoolScene() {
        // 学校外部シーンを作成
        const sceneDescription = document.createElement(`div`);
        sceneDescription.className = `scene-description`;
        sceneDescription.innerHTML = `
            <p>あなたはついに学校から脱出したが、呪いは終わっていない。</p>
            <p>校舎外の通りは不気味な黒い霧に包まれ、街灯がちらつき、あなたの影を長く引き延ばしている。</p>
            <p>あなたはポケットを探ると、あのバッジがまだあった。かすかに光を放っている。</p>
        `;
        this.game.elements.gameMap.appendChild(sceneDescription);

        // シーン画像を追加 (リソース追加待ち)
        // const sceneImage = document.createElement(`img`);
        // sceneImage.src = `assets/img/outside-school.png`;
        // sceneImage.alt = `学校外部`;
        // sceneImage.className = `scene-image`;
        // this.game.elements.gameMap.appendChild(sceneImage);

        // 環境音效を再生
        this.playSound(`ambient`);

        if (this.plotProgress === 0) {
            this.showDialogue(`あなたは校門の前で息を切らしながら立っている。背後にある学校は黒い霧の中にぼんやりと浮かび、人を食らう怪物のようだ。`, [
                { text: `周囲を見回す`, action: () => this.examineSurroundings() },
                { text: `外部に連絡を試みる`, action: () => this.tryContactOutside() }
            ]);
        }
    }

    examineSurroundings() {
        this.plotProgress = 1;
        this.showDialogue(`通りには誰もおらず、全ての店は閉まっている。少し先の交差点に、ぼんやりとした人影が揺れ動いているようだ。`, [
            { text: `交差点に向かう`, action: () => this.walkToCrossroad() },
            { text: `その場に留まる`, action: () => this.stayInPlace() }
        ]);
    }

    tryContactOutside() {
        this.plotProgress = 2;
        if (this.game.gameState.inventory.includes(`携帯電話`)) {
            this.showDialogue(`あなたは携帯電話を取り出すが、電波が入らない。画面に突然、血のように赤い文字が現れる："逃げ場はない"。`, [
                { text: `連絡を諦める`, action: () => this.examineSurroundings() }
            ]);
        } else {
            this.showDialogue(`外部と連絡を取る手段がない。`, [
                { text: `周囲を見回す`, action: () => this.examineSurroundings() }
            ]);
        }
    }

    walkToCrossroad() {
        this.plotProgress = 3;
        const friendName = this.getFriendName();
        const pronoun = this.getFriendPronoun(`pronoun`);
        this.showDialogue(`あなたはゆっくりと交差点に向かう。その人影は次第に鮮明になり、近づくとそれが${friendName}だと気づく！しかし${pronoun}の目は虚ろで、ゆっくりとあなたに向かって歩いてくる。`, [
            { text: `${pronoun}の名前を呼ぶ`, action: () => this.callFriend() },
            { text: `振り返って逃げる`, action: () => this.runAway() }
        ]);
    }

    stayInPlace() {
        this.plotProgress = 4;
        this.showDialogue(`あなたはその場に留まり、周囲の状況を観察することにした。黒い霧はますます濃くなり、寒気を感じる。突然、背後から足音が聞こえてきた...`, [
            { text: `振り返って確認する`, action: () => this.turnAround() },
            { text: `全力で走り出す`, action: () => this.runAway() }
        ]);
    }

    callFriend() {
        this.plotProgress = 5;
        const friendName = this.getFriendName();
        const pronounObj = this.getFriendPronoun(`object`);
        const pronounSub = this.getFriendPronoun(`subject`);
        this.showDialogue(`"${friendName}！私だよ！"あなたは大声で呼びかける。しかし${pronounSub}は応えず、歩みを止めない。${pronounSub}が目の前まで来た時、${pronounSub}の首に見覚えのある印があることに気づく——学校のバッジと同じだ！`, [
            { text: `${pronounObj}を覚醒させようとする`, action: () => this.attemptToWakeFriend() },
            { text: `後ずさりして避ける`, action: () => this.backAway() }
        ]);
    }


    attemptToWakeFriend() {
        this.plotProgress = 6;
        const pronounObj = this.getFriendPronoun(`object`);
        const pronounSub = this.getFriendPronoun(`subject`);
        this.showDialogue(`あなたは手を伸ばして${pronounObj}の肩に触れる。${pronounSub}は突然あなたの手を掴み、その力は驚くほど強い。${pronounSub}の口から低い声が漏れる："私と一緒に...永遠にここに..."`, [
            { text: `振りほどく`, action: () => this.startEscapePuzzle() }
        ]);
    }

    startEscapePuzzle() {
        this.isPuzzleActive = true;
        this.clickCount = 0;
        this.game.elements.dialogueChoices.innerHTML = ``;

        const friendName = this.getFriendName();
        this.showDialogue(`${friendName}の力がますます強くなる！`, []);

        // QTEコンテナを作成
        const qteContainer = document.createElement('div');
        qteContainer.id = 'escape-qte-container';
        qteContainer.className = 'qte-container';

        const qteText = document.createElement('p');
        qteText.className = 'qte-text';
        qteText.textContent = `素早くクリックして${friendName}の手から逃れろ！クリック回数 0/${this.requiredClicks}`;
        qteContainer.appendChild(qteText);

        // QTEボタンを作成
        const qteButton = document.createElement('button');
        qteButton.id = 'escape-button';
        qteButton.className = 'big-button';
        qteButton.textContent = '💪 素早くクリックして脱出';
        qteContainer.appendChild(qteButton);

        const timerBar = document.createElement('div');
        timerBar.className = 'timer-bar';
        timerBar.style.width = '100%';
        qteContainer.appendChild(timerBar);

        // ゲームインターフェースに追加
        this.game.elements.gameActions.appendChild(qteContainer);

        // QTEパラメータ
        const requiredClicks = this.requiredClicks;
        const timeLimit = this.clickTimeLimit; // 5000ミリ秒
        const startTime = Date.now();

        // タイマーを更新
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

        // ボタンクリックイベント
        qteButton.addEventListener('click', () => {
            if (this.isPuzzleActive) {
                this.clickCount++;
                qteText.textContent = `素早くクリックして${friendName}の手から逃れろ！クリック回数 ${this.clickCount}/${requiredClicks}`;

                // 必要なクリック回数に達したら、パズル成功
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
        this.showDialogue(`あなたは${friendName}の束縛から逃れることに成功した！${pronounSub}は悲鳴を上げ、地面に倒れる。あなたは隙を見て森へ向かって走り出した。`, [
            { text: `森へ逃げる`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    escapeFailed() {
        this.isPuzzleActive = false;
        clearInterval(this.escapeTimer);
        this.game.elements.dialogueText.innerHTML = ``;

        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.game.showDeath(`${friendName}の手があなたを強く握り締め、全身に寒気が走る。眼前が暗転し、意識を失った...`);
    }

    backAway() {
        this.plotProgress = 7;
        const friendName = this.getFriendName();
        const pronoun = this.getFriendPronoun(`subject`);
        this.showDialogue(`あなたはゆっくり後退する。${friendName}は迫り続ける。突然、${pronoun}は速度を上げ、あなたに襲いかかってきた！`, [
            { text: `振り返って逃げる`, action: () => this.runAway() }
        ]);
    }

    runAway() {
        this.plotProgress = 8;
        this.showDialogue(`あなたは振り返らずに走り出した。どれだけ走ったか分からないが、ついに森の中に飛び込んだ。`, [
            { text: `進み続ける`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    turnAround() {
        this.plotProgress = 9;
        this.playSound(`horror`);
        this.showDialogue(`あなたはゆっくりと振り返り、黒いローブを着た人物が背後に立っているのを見る。その顔はフードに隠れ、赤く光る目だけが見えている。`, [
            { text: `逃げる`, action: () => this.runAway() },
            { text: `コミュニケーションを試みる`, action: () => this.tryToCommunicate() }
        ]);
    }

    tryToCommunicate() {
        this.plotProgress = 10;
        this.game.playSound(`horror`);
        this.showDialogue(`"あなたは誰？何が目的だ？"あなたは勇気を振り絞って尋ねる。黒いローブの人物は答えず、ただあなたのポケットを指さす。彼がバッジを欲しがっていることに気づく...`, [
            { text: `バッジを渡す`, action: () => this.giveBadge() },
            { text: `拒否する`, action: () => this.refuseToGiveBadge() }
        ]);
    }

    giveBadge() {
        this.plotProgress = 11;
        if (this.game.gameState.inventory.includes(`バッジ`)) {
            // バッジを削除
            this.game.gameState.inventory = this.game.gameState.inventory.filter(item => item !== `バッジ`);
            this.game.updateInventoryDisplay();

            this.showDialogue(`あなたはしぶしぶバッジを渡す。黒いローブの人物はバッジを受け取ると、身の毛もよだつ笑い声を上げる。"ゲームはまだ始まったばかりだ..."彼はそう言うと、黒い霧の中に消えた。`, [
                { text: `森に入る`, action: () => this.loadScene(`forestPath`) }
            ]);
        } else {
            this.showDialogue(`渡せるバッジがない。黒いローブの人物は怒っているようで、目がさらに赤くなった...`, [
                { text: `逃げる`, action: () => this.runAway() }
            ]);
        }
    }

    refuseToGiveBadge() {
        this.plotProgress = 12;
        this.game.playSound(`horror`);
        this.showDeath(`黒いローブの人物は怒りの叫び声を上げ、黒い霧が一瞬であなたを飲み込んだ。激しい痛みを感じ、その後何もわからなくなった...`);
    }

    showForestPathScene() {
        // 森の小道シーンを作成
        const sceneDescription = document.createElement(`div`);
        sceneDescription.className = `scene-description`;
        sceneDescription.innerHTML = `
            <p>あなたは古い森の中に走り込んだ。木々は高くそびえ立ち、枝葉は生い茂り、空をほとんど覆い隠している。</p>
            <p>月明かりが木々の隙間から差し込み、地面にまだらな影を落としている。空気には湿った土の香りが漂っている。</p>
            <p>遠くから水の流れる音や、枝が折れるような音、ささやき声のような奇妙な音が聞こえてくる。</p>
        `;
        this.game.elements.gameMap.appendChild(sceneDescription);

        // シーン画像を追加 (リソース追加待ち)
        // const sceneImage = document.createElement(`img`);
        // sceneImage.src = `assets/img/forest-path.png`;
        // sceneImage.alt = `森の小道`;
        // sceneImage.className = `scene-image`;
        // this.game.elements.gameMap.appendChild(sceneImage);

        // 墓地に関する情報を既知かチェック
        const knowsAboutCemetery = this.plotProgress >= 27; // 27は肖像画が墓地について言及した進捗

        if (knowsAboutCemetery) {
            this.showDialogue(`あなたは森の入り口に立ち、どちらの方向に進むべきか迷っている。すると、地面にはっきりとした3本の道があることに気づく：1本は奥深くへ、1本は川辺へ、そしてもう1本は遠くの墓地へと続いているようだ。`, [
                { text: `奥の道を行く`, action: () => this.goDeepIntoForest() },
                { text: `川辺に向かう`, action: () => this.goToRiver() },
                { text: `墓地へ向かう`, action: () => this.goToCemetery() }
            ]);
        } else {
            this.showDialogue(`あなたは森の入り口に立ち、どちらの方向に進むべきか迷っている。すると、地面にはっきりとした2本の道があることに気づく：1本は奥深くへ、もう1本は川辺へと続いている。`, [
                { text: `奥の道を行く`, action: () => this.goDeepIntoForest() },
                { text: `川辺に向かう`, action: () => this.goToRiver() }
            ]);
        }
    }

    // 墓地へ向かう
    goToCemetery() {
        this.plotProgress = 28;
        this.loadScene(`cemetery`);
    }

    // 墓地シーン
    showCemeteryScene() {
        // 墓地シーンを作成
        const sceneDescription = document.createElement(`div`);
        sceneDescription.className = `scene-description`;
        sceneDescription.innerHTML = `
            <p>あなたはかすかな小道を辿って、廃墟となった墓地にたどり着いた。墓石は傾き、上の文字はかすれて読めない。</p>
            <p>空気には腐敗した臭いが漂い、遠くの木ではカラスが鳴いている。</p>
            <p>墓地の中央には奇妙な祭壇があり、何か光るものが置かれているようだ。</p>
        `;
        this.game.elements.gameMap.appendChild(sceneDescription);

        // シーン画像を追加 (リソース追加待ち)
        // const sceneImage = document.createElement(`img`);
        // sceneImage.src = `assets/img/cemetery.png`;
        // sceneImage.alt = `廃墟の墓地`;
        // sceneImage.className = `scene-image`;
        // this.game.elements.gameMap.appendChild(sceneImage);

        this.playSound(`ambient`);
        this.showDialogue(`あなたは墓地の前に立ち、寒気を感じる。祭壇の光があなたを引き寄せるが、同時に不安も感じる。`, [
            { text: `祭壇に近づく`, action: () => this.approachAltar() },
            { text: `墓地を離れる`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    // 祭壇に近づく
    approachAltar() {
        this.plotProgress = 29;
        this.showDialogue(`あなたはゆっくりと祭壇に近づき、そこに黒い箱が置かれているのを見つける。箱には複雑な模様が刻まれており、学校のバッジで見たものと似ている。`, [
            { text: `箱を開ける`, action: () => this.openBox() },
            { text: `箱に触れない`, action: () => this.loadScene(`cemetery`) }
        ]);
    }

    // 箱を開けて闇の神器を入手
    openBox() {
        this.plotProgress = 30;
        this.showDialogue(`あなたは慎重に箱を開ける。中には黒い石が入っており、かすかに紫の光を放っている。これが闇の神器に違いない！`, [
            { text: `神器を拾う`, action: () => this.obtainDarkArtifact() }
        ]);
    }

    // 闇の神器を入手
    obtainDarkArtifact() {
        this.plotProgress = 31;
        if (!this.game.gameState.inventory.includes(`闇の神器`)) {
            this.game.gameState.inventory.push(`闇の神器`);
            this.game.updateInventoryDisplay();
        }
        this.showDialogue(`あなたは闇の神器を手に取ると、突然、強力な力が体内に流れ込むのを感じる。しかしその時、背後から足音が聞こえてきた...`, [
            { text: `振り返って確認する`, action: () => this.turnAroundInCemetery() }
        ]);
    }

    // 墓地で振り返って確認
    turnAroundInCemetery() {
        this.plotProgress = 32;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`horror`);
        this.showDialogue(`振り返ると、${friendName}がいた！しかし${pronounSub}の目は虚ろで、体から黒い霧が立ち込めている。${pronounSub}は一歩一歩近づき、あなたの手にある闇の神器を奪おうと手を伸ばしてくる。`, [
            { text: `神器をしっかり抱える`, action: () => this.holdArtifactTight() },
            { text: `覚醒させようとする`, action: () => this.attemptToWakeFriendInCemetery() }
        ]);
    }

    // 神器をしっかり抱える
    holdArtifactTight() {
        this.plotProgress = 33;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        // インベントリから闇の神器を削除
        const artifactIndex = this.game.gameState.inventory.indexOf(`闇の神器`);
        if (artifactIndex > -1) {
            this.game.gameState.inventory.splice(artifactIndex, 1);
            this.game.updateInventoryDisplay();
        }
        this.showDialogue(`${friendName}の力は驚くほど強く、${pronounSub}は一気にあなたの手から闇の神器を奪い取った。${pronounSub}は冷たい笑い声を上げ、学校の方へ走り去った。`, [
            { text: `追いかける`, action: () => this.chaseFriendToSchool() }
        ]);
    }

    // 墓地で友達を覚醒させようとする
    attemptToWakeFriendInCemetery() {
        this.plotProgress = 34;
        const friendName = this.getFriendName();
        const pronounObj = this.getFriendPronoun(`object`);
        const pronounSub = this.getFriendPronoun(`subject`);
        // インベントリから闇の神器を削除
        const artifactIndex = this.game.gameState.inventory.indexOf(`闇の神器`);
        if (artifactIndex > -1) {
            this.game.gameState.inventory.splice(artifactIndex, 1);
            this.game.updateInventoryDisplay();
        }
        this.showDialogue(`"${friendName}！目を覚ませ！私だよ！"あなたは大声で呼びかける。しかし${pronounSub}は聞こえていないようで、${pronounSub}はあなたの手から闇の神器を奪い取った。${pronounSub}は冷たい笑い声を上げ、学校の方へ走り去った。`, [
            { text: `追いかける`, action: () => this.chaseFriendToSchool() }
        ]);
    }

    // 友達を追いかけて学校へ
    chaseFriendToSchool() {
        this.plotProgress = 35;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`あなたはすぐに${friendName}を追いかけ、学校の方へ走り出した。${friendName}はとても速く、あなたはかろうじて${friendName}の姿を見失わない程度だ。最終的に、${friendName}は学校の后勤区域に飛び込み、視界から消えた。`, [
            { text: `后勤区域に入る`, action: () => this.showSchoolLogisticsScene() }
        ]);
    }

    goDeepIntoForest() {
        this.plotProgress = 13;
        this.showDialogue(`あなたは森の奥深くへ続く道を選んだ。木々はますます密集し、光は次第に暗くなる。周囲の気温が下がっているのを感じる...`, [
            { text: `進み続ける`, action: () => this.continueDeepIntoForest() },
            { text: `戻る`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    goToRiver() {
        this.plotProgress = 14;
        this.showDialogue(`あなたは川辺に向かって歩く。水の流れる音は次第に鮮明になり、ついに澄んだ小川のほとりにたどり着いた。川辺にはボロボロの小屋がある。`, [
            { text: `小屋に入る`, action: () => this.loadScene(`abandonedHouse`) },
            { text: `川辺で休む`, action: () => this.restByRiver() }
        ]);
    }

    continueDeepIntoForest() {
        this.plotProgress = 15;
        this.game.playSound(`horror`);
        this.showDialogue(`あなたは進み続けると、突然、前方に開けた場所が見える。その中央には古い祭壇があり、その上にはボロボロの本が置かれている。`, [
            { text: `祭壇を調べる`, action: () => this.examineAltar() },
            { text: `ここを離れる`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    restByRiver() {
        this.plotProgress = 16;
        this.showDialogue(`あなたは川辺に座り、顔を洗う。冷たい川水で気分がすっきりする。その時、水中に何か光るものがあることに気づく...`, [
            { text: `水中を調べる`, action: () => this.checkWater() },
            { text: `立ち去る`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    examineAltar() {
        this.plotProgress = 17;
        this.showDialogue(`あなたは祭壇の前に歩み寄り、そのボロボロの本を調べる。表紙には"校史秘録"と書かれている。ページをめくると、学校の暗い歴史が記されている...`, [
            { text: `読み続ける`, action: () => this.readBook() },
            { text: `本を閉じる`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    checkWater() {
        this.plotProgress = 18;
        this.showDialogue(`あなたは手を水に伸ばし、光る物体をすくい上げる。それは指輪で、バッジと同じ模様が刻まれている。`, [
            { text: `指輪を拾う`, action: () => this.takeRing() },
            { text: `水に戻す`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    readBook() {
        this.plotProgress = 19;
        this.showDialogue(`本には、学校が古い墓地の上に建てられたと記されている。墓地の悪霊を鎮めるため、学校の創設者は古代の儀式を使用したが、儀式は失敗し、より強大な悪霊を目覚めさせてしまった...`, [
            { text: `読み続ける`, action: () => this.continueReading() },
            { text: `本を閉じる`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    takeRing() {
        this.plotProgress = 20;
        if (!this.game.gameState.inventory.includes(`刻印の指輪`)) {
            this.game.gameState.inventory.push(`刻印の指輪`);
            this.game.updateInventoryDisplay();
        }
        this.showDialogue(`あなたは指輪を拾い、指にはめる。指輪は突然強く光り、力が体内に流れ込むのを感じる。`, [
            { text: `小屋に入る`, action: () => this.loadScene(`abandonedHouse`) }
        ]);
    }

    continueReading() {
        this.plotProgress = 21;
        this.showDialogue(`本にはまた、悪霊を完全に消滅させる唯一の方法は、四つの神器——炎、水、生命、闇——を見つけることだと書かれている。これら四つの神器は学校の四つの隅に隠されている...`, [
            { text: `さらに読む`, action: () => this.readMore() },
            { text: `本を閉じる`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    readMore() {
        this.plotProgress = 22;
        this.showDialogue(`...しかし闇の神器は数百年も行方不明だ。森に持ち込まれたと言う者もいれば、学校の地下に埋められたと言う者もいる...`, [
            { text: `本を閉じる`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    showAbandonedHouseScene() {
        // 廃墟の小屋シーンを作成
        const sceneDescription = document.createElement(`div`);
        sceneDescription.className = `scene-description`;
        sceneDescription.innerHTML = `
            <p>あなたは小屋に入る。中はほこりと蜘蛛の巣だらけだ。家具はすべてボロボロで、長い間誰も住んでいないようだ。</p>
            <p>壁には色あせた肖像画がかかっており、古風な服装の女性が描かれている。彼女の目は虚ろで、あなたを見つめているようだ。</p>
            <p>部屋の中央にはテーブルがあり、その上にはオイルランプと日記が置かれている。</p>
        `;
        this.game.elements.gameMap.appendChild(sceneDescription);

        // シーン画像を追加 (リソース追加待ち)
        // const sceneImage = document.createElement(`img`);
        // sceneImage.src = `assets/img/abandoned-house.png`;
        // sceneImage.alt = `廃墟の小屋`;
        // sceneImage.className = `scene-image`;
        // this.game.elements.gameMap.appendChild(sceneImage);

        this.showDialogue(`あなたは小屋の中央に立ち、何を先に調べるべきか迷っている。`, [
            { text: `日記を調べる`, action: () => this.readDiary() },
            { text: `肖像画を調べる`, action: () => this.examinePortrait() },
            { text: `立ち去る`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    readDiary() {
        this.plotProgress = 23;
        this.showDialogue(`あなたはテーブルの上の日記を手に取り、最初のページを開く。字はかすれているが、まだ読める："彼らが何をしているか知っている。彼らは生徒の血でそれを養っている..."`, [
            { text: `読み続ける`, action: () => this.continueReadingDiary() },
            { text: `日記を置く`, action: () => this.loadScene(`abandonedHouse`) }
        ]);
    }

    examinePortrait() {
        this.plotProgress = 24;
        this.showDialogue(`あなたは肖像画に近づき、注意深く観察する。画中の女性の目があなたを追っているように感じる。突然、肖像画から血が滲み出てきた...`, [
            { text: `肖像画に触れる`, action: () => this.touchPortrait() },
            { text: `後退する`, action: () => this.loadScene(`abandonedHouse`) }
        ]);
    }

    continueReadingDiary() {
        this.plotProgress = 25;
        this.showDialogue(`"あのものはますます強力になっている。私は闇の神器を見つけなければならない。さもなければすべてが手遅れになる..."日記はここで終わっており、後のページは破り取られている。`, [
            { text: `日記を置く`, action: () => this.loadScene(`abandonedHouse`) }
        ]);
    }

    touchPortrait() {
        this.plotProgress = 26;
        this.playSound(`horror`);
        this.showDialogue(`あなたが肖像画に触れると、画中の血が突然熱くなる。画中の女性の目からさらに血が流れ出し、彼女の口が動き、何かを言っているようだ...`, [
            { text: `注意深く聞く`, action: () => this.listenToPortrait() },
            { text: `肖像画から離れる`, action: () => this.loadScene(`abandonedHouse`) }
        ]);
    }

    listenToPortrait() {
        this.plotProgress = 27;
        this.showDialogue(`あなたは肖像画に近づき、かすかな声を聞く："私を助けて...闇...神器...は...墓地に..."`, [
            { text: `小屋を出る`, action: () => this.loadScene(`forestPath`) }
        ]);
    }

    // 音效を再生
    playSound(soundName) {
        try {
            if (soundName === `ding` && this.game.horrorDing) {
                this.game.horrorDing.currentTime = 0;
                this.game.horrorDing.play().catch(e => console.log(`音效再生失敗:`, e));
            } else if (soundName === `horror` && this.game.horrorUp) {
                this.game.horrorUp.currentTime = 0;
                this.game.horrorUp.play().catch(e => console.log(`音效再生失敗:`, e));
            } else if (soundName === `ambient` && this.game.ambientSound) {
                this.game.ambientSound.currentTime = 0;
                this.game.ambientSound.play().catch(e => console.log(`音效再生失敗:`, e));
            }
        } catch (error) {
            console.log(`音效再生エラー:`, error);
        }
    }

    // プレイヤーの性別に基づいて友達の正しい代名詞を取得
    getFriendPronoun(type) {
        // 異常な性別かチェック
        const abnormalGenders = [`ウォルマートの買い物袋`, `攻撃ヘリコプター`];
        if (abnormalGenders.includes(this.game.gameState.playerGender)) {
            return `それ`;
        }

        const isMale = this.game.gameState.playerGender === `male`;
        switch (type) {
            case `subject`: // 主格 (彼/彼女)
                return isMale ? `彼` : `彼女`;
            case `object`: // 目的格 (彼/彼女)
                return isMale ? `彼` : `彼女`;
            case `possessive`: // 所有格 (彼の/彼女の)
                return isMale ? `彼の` : `彼女の`;
            case `pronoun`: // 代名詞 (彼/彼女)
                return isMale ? `彼` : `彼女`;
            default:
                return isMale ? `彼` : `彼女`;
        }
    }

    // プレイヤーの性別に基づいて友達の名前を取得
    getFriendName() {
        const abnormalGenders = [`ウォルマートの買い物袋`, `攻撃ヘリコプター`];
        if (abnormalGenders.includes(this.game.gameState.playerGender)) {
            return Math.random() < 0.5 ? `ワンワン` : `ニャンニャン`;
        }
        return this.game.gameState.playerGender === "male" ? "張偉" : "李娜";
    }

    // ゲーム時間を更新
    updateGameTime(time) {
        this.game.gameState.gameTime = time;
        this.game.elements.currentTimeDisplay.textContent = time;
    }

    // タイプライター効果で会話を表示
    showDialogue(text, choices) {
        // ゲームオブジェクトのshowDialogueメソッドを直接使用
        this.game.showDialogue(text, choices);
    }

    // 学校后勤シーン
    showSchoolLogisticsScene() {
        const friendName = this.getFriendName();
        // 学校后勤シーンを作成
        const sceneDescription = document.createElement(`div`);
        sceneDescription.className = `scene-description`;
        sceneDescription.innerHTML = `
            <p>あなたは学校の后勤区域に入った。ここは薄暗く、ほこりとカビの臭いが充満している。</p>
            <p>廊下の両側には倉庫が並び、ドアには錆びた錠がかかっている。遠くから水の滴る音と${friendName}の足音が聞こえる。</p>
            <p>前方に半開きのドアがあり、その向こうからかすかな光が漏れている。</p>
        `;
        this.game.elements.gameMap.appendChild(sceneDescription);

        // シーン画像を追加 (リソース追加待ち)
        // const sceneImage = document.createElement(`img`);
        // sceneImage.src = `assets/img/school-logistics.png`;
        // sceneImage.alt = `学校后勤区域`;
        // sceneImage.className = `scene-image`;
        // this.game.elements.gameMap.appendChild(sceneImage);

        this.playSound(`horror`);
        this.showDialogue(`あなたは慎重に前進し、半開きのドアの前にたどり着く。中から低い笑い声が聞こえる。${friendName}の声だが、聞き慣れない邪悪な響きだ。`, [
            { text: `ドアを押して入る`, action: () => this.enterRoom() },
            { text: `盗み聞きする`, action: () => this.eavesdrop() }
        ]);
    }

    // 部屋に入る
    enterRoom() {
        this.plotProgress = 37;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`horror`);
        this.showDialogue(`あなたはドアを押して中に入る。部屋は暗く、蝋燭立て一つがかすかな光を放っているだけだ。${friendName}はあなたに背を向け、部屋の中央にある奇妙な模様の上に立っている。${pronounSub}は闇の神器を手にし、何かを低声で唱えている。`, [
            { text: `${friendName}の邪魔をする`, action: () => this.interruptFriend() },
            { text: `ゆっくり後退する`, action: () => this.slowlyBackAway() }
        ]);
    }

    // 盗み聞き
    eavesdrop() {
        this.plotProgress = 38;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`あなたはドアのそばに寄り、中の様子を盗み聞きする。"ついに...闇の神器...私のものだ..."${friendName}の声が聞こえる。"これがあれば、学校全体を...いや、世界全体を支配できる..."`, [
            { text: `ドアを押して入る`, action: () => this.enterRoom() },
            { text: `他の入口を探す`, action: () => this.lookForOtherEntrance() }
        ]);
    }

    // 友達の邪魔をする
    interruptFriend() {
        this.plotProgress = 39;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        const pronounObj = this.getFriendPronoun(`object`);
        this.playSound(`horror`);
        this.showDialogue(`${friendName}！やめろ！あのものは${pronounObj}の心を蝕む！`);

        setTimeout(() => {
            this.showDialogue(`ははは...ちょうど良く来たな、${this.game.gameState.playerName}。`);

            setTimeout(() => {
                this.showDialogue(`${friendName}はゆっくりと振り返り、${pronounSub}の目は不気味に赤く光り、口元には邪悪な微笑みを浮かべている。手にした闇の神器は黒い霧を放ち、${pronounSub}の腕に絡みついている。`);

                setTimeout(() => {
                    this.showDialogue(`${friendName}は闇の神器を掲げ、あなたを指す："さあ、${this.game.gameState.playerName}、闇の一部となれ！"`, [
                        { text: `${friendName}を説得しようとする`, action: () => this.attemptToConvinceFriend() },
                        { text: `神器を奪おうとする`, action: () => this.attemptToGrabArtifact() },
                        { text: `回避して武器を探す`, action: () => this.dodgeAndFindWeapon() }
                    ]);
                }, 2000);
            }, 2000);
        }, 1500);
    }

    // 友達を説得しようとする
    attemptToConvinceFriend() {
        this.plotProgress = 40;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`${friendName}！私を覚えていないのか？私たち友達だろ！あのものに操られているのはわかっている。早く目を覚ませ！`, [
            { text: `説得を続ける`, action: () => this.continueConvincing() },
            { text: `説得を諦めて奪取を試みる`, action: () => this.attemptToGrabArtifact() }
        ]);
    }

    // 説得を続ける
    continueConvincing() {
        this.plotProgress = 41;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`horror`);
        this.showDialogue(`${friendName}の表情に少し動揺が見えたが、すぐに邪悪な笑顔に戻る。"友達？それは何だ？闇の力こそが全てだ！"${pronounSub}は叫びながら、闇の神器を振りかざしてあなたに襲いかかる。`, [
            { text: `回避する`, action: () => this.dodgeAttack() },
            { text: `ブロックを試みる`, action: () => this.attemptToBlock() }
        ]);
    }

    // 神器を奪おうとする
    attemptToGrabArtifact() {
        this.plotProgress = 42;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`あなたは${friendName}に突進し、${pronounSub}の手から闇の神器を奪おうとする。${friendName}は素早く反応し、身をかわしてあなたの攻撃を避け、同時に闇の神器であなたの肩を打つ。激しい痛みを感じ、あなたは地面に倒れる。`, [
            { text: `もがきながら立ち上がる`, action: () => this.standUp() },
            { text: `死んだふりをして機会を待つ`, action: () => this.pretendToBeDead() }
        ]);
    }

    // 回避して武器を探す
    dodgeAndFindWeapon() {
        this.plotProgress = 43;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`あなたは素早く横に飛び退き、闇の神器の攻撃をかわす。周囲を見回すと、部屋の隅に錆びた鉄の棒があるのを見つける。`, [
            { text: `鉄の棒を拾って防御する`, action: () => this.takeIronRod() },
            { text: `回避を続ける`, action: () => this.continueDodging() }
        ]);
    }

    // 攻撃を回避
    dodgeAttack() {
        this.plotProgress = 44;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`あなたはタイミングよく横に飛び退き、${friendName}の攻撃をかわす。${friendName}は少し驚いたようだが、すぐに新たな攻撃を仕掛けてくる。`, [
            { text: `回避を続ける`, action: () => this.continueDodging() },
            { text: `反撃の機会を探す`, action: () => this.lookForCounterAttack() }
        ]);
    }

    // ブロックを試みる
    attemptToBlock() {
        this.plotProgress = 45;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`あなたは腕で${friendName}の攻撃をブロックしようとするが、${pronounSub}の力は想像以上に強い。闇の神器があなたの腕に当たり、痺れを感じる。`, [
            { text: `よろめきながら後退する`, action: () => this.staggerBack() },
            { text: `機会を捉えて反撃する`, action: () => this.counterAttack() }
        ]);
    }

    // もがきながら立ち上がる
    standUp() {
        this.plotProgress = 46;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`あなたは痛みに耐え、もがきながら立ち上がる。${friendName}は冷笑しながらあなたを見つめる："まだ諦めないのか？本当に頑固だな。"`, [
            { text: `再度説得を試みる`, action: () => this.attemptToConvinceFriend() },
            { text: `神器を奪う機会を探す`, action: () => this.lookForArtifactChance() }
        ]);
    }

    // 死んだふりをして機会を待つ
    pretendToBeDead() {
        this.plotProgress = 47;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`horror`);
        this.showDialogue(`あなたは息を殺し、気絶したふりをする。${friendName}はあなたのそばに来て、闇の神器であなたをつつく。あなたが"気絶"したと確認すると、${pronounSub}は振り返って部屋の奥へ歩いていく："儀式が終わったら、お前が最初の生贄だ。"`, [
            { text: `こっそり後をつける`, action: () => this.sneakFollow() },
            { text: `隙に神器を奪う`, action: () => this.stealArtifact() }
        ]);
    }

    // 鉄の棒を拾って防御する
    takeIronRod() {
        this.plotProgress = 48;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`あなたは鉄の棒を拾い、防御姿勢を取る。${friendName}はそれを見て大笑いする："そのボロ鉄の棒で？私を止められると思うのか？"`, [
            { text: `鉄の棒で攻撃を試みる`, action: () => this.attackWithRod() },
            { text: `防御を維持して機会を待つ`, action: () => this.defendAndWait() }
        ]);
    }

    // 回避を続ける
    continueDodging() {
        this.plotProgress = 49;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`あなたは${friendName}の攻撃をひたすらかわし続けるが、${friendName}の攻撃はますます速くなり、次第に体力が尽きてくる。`, [
            { text: `反撃の機会を探す`, action: () => this.lookForCounterAttack() },
            { text: `部屋から脱出しようとする`, action: () => this.attemptToEscape() }
        ]);
    }

    // 反撃の機会を探す
    lookForCounterAttack() {
        this.plotProgress = 50;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`${friendName}の攻撃に隙ができた！あなたは機会を捉え、${pronounSub}に突進し、闇の神器を奪おうとする。`, [
            { text: `全力で奪取する`, action: () => this.fullForceGrab() },
            { text: `陽動で${friendName}の注意を逸らす`, action: () => this.feintAttack() }
        ]);
    }

    // 全力で奪取する
    fullForceGrab() {
        this.plotProgress = 501;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`あなたは全身の力を振り絞り、${friendName}に猛然と飛びかかり、両手で${pronounSub}の手にある闇の神器を掴む。${friendName}は驚くが、すぐに反応し、神器を奪い合う。`, [
            { text: `奪い合いを続ける`, action: () => this.keepGrabbing() },
            { text: `足をかけて${friendName}を転ばせる`, action: () => this.tripFriend() }
        ]);
    }

    // 陽動で注意を逸らす
    feintAttack() {
        this.plotProgress = 502;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`あなたは${friendName}の頭部を攻撃するふりをして、${pronounSub}の注意を引く。${friendName}が手を上げて防御した瞬間、素早く手を伸ばして${pronounSub}の手にある闇の神器を奪おうとする。`, [
            { text: `隙に神器を奪う`, action: () => this.sneakGrabArtifact() },
            { text: `再度陽動する`, action: () => this.feintAgain() }
        ]);
    }

    // 奪い合いを続ける
    keepGrabbing() {
        this.plotProgress = 503;
        const friendName = this.getFriendName();
        this.playSound(`horrorUp`);
        this.showDialogue(`あなたと${friendName}は激しく闇の神器を奪い合う。神器は強烈な黒い光を放ち、二人の手は火傷するが、どちらも手放そうとしない。`, [
            { text: `持ちこたえる`, action: () => this.holdOn() },
            { text: `手放して後退する`, action: () => this.letGoAndBack() }
        ]);
    }

    // 足をかけて友達を転ばせる
    tripFriend() {
        this.plotProgress = 504;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`あなたは${friendName}が油断した隙に、足をかけて${friendName}を転ばせる。${friendName}はバランスを失い地面に倒れ、手から闇の神器が離れる。`, [
            { text: `神器を拾う`, action: () => this.pickUpArtifact() },
            { text: `${friendName}の状態を確認する`, action: () => this.checkFriendCondition() }
        ]);
    }

    // 再度陽動する
    feintAgain() {
        this.plotProgress = 505;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`あなたは再び${friendName}を陽動するが、${pronounSub}はすでにあなたの策略を見破っており、動じない。${friendName}は冷笑して言う："同じ手は通用しない！"`, [
            { text: `直接奪取する`, action: () => this.fullForceGrab() },
            { text: `他の機会を探す`, action: () => this.lookForOtherChance() }
        ]);
    }

    // 持ちこたえる
    holdOn() {
        this.plotProgress = 506;
        const friendName = this.getFriendName();
        this.playSound(`horrorUp`);
        this.showDialogue(`あなたは歯を食いしばり、手放さないように耐える。闇の神器の光はますます強くなり、激しい痛みを感じるが、それでも手を離さない。`, [
            { text: `持ちこたえ続ける`, action: () => this.continueHolding() },
            { text: `刻印の指輪を使う`, action: () => this.useEngravedRing() }
        ]);
    }

    // 手放して後退する
    letGoAndBack() {
        this.plotProgress = 507;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`あなたは手を離し、素早く数歩後退する。${friendName}も後退し、警戒しながらあなたを見つめる。二人とも息を切らし、一時的に戦いを止める。`, [
            { text: `${friendName}を説得しようとする`, action: () => this.attemptToConvinceFriend() },
            { text: `再度奪取の機会を探す`, action: () => this.lookForCounterAttack() }
        ]);
    }

    // 神器を拾う
    pickUpArtifact() {
        this.plotProgress = 508;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`あなたは素早く地面の闇の神器を拾う。${friendName}は立ち上がろうともがいているが、明らかに傷を負っており、すぐには立てない。`, [
            { text: `部屋を出る`, action: () => this.attemptToEscape() },
            { text: `${friendName}を助ける`, action: () => this.helpFriend() }
        ]);
    }

    // 他の機会を探す
    lookForOtherChance() {
        this.plotProgress = 509;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`あなたは一時的に後退し、神器を奪う他の機会を探す。${friendName}は神器をしっかり握り、警戒しながらあなたを見つめ、隙を与えない。`, [
            { text: `${friendName}を説得しようとする`, action: () => this.attemptToConvinceFriend() },
            { text: `環境物を使用する`, action: () => this.useEnvironmentItem() }
        ]);
    }

    // 持ちこたえ続ける
    continueHolding() {
        this.plotProgress = 510;
        const friendName = this.getFriendName();
        this.playSound(`horrorUp`);
        this.showDialogue(`あなたは持ちこたえ続け、指は闇の神器の光で火傷しているが、それでも手放さない。突然、神器が強烈な光を放ち、あなたと${friendName}を吹き飛ばす。`, [
            { text: `${friendName}の状態を確認する`, action: () => this.checkFriendCondition() },
            { text: `再度神器を奪おうとする`, action: () => this.attemptToGrabArtifact() }
        ]);
    }

    // 刻印の指輪を使う
    useEngravedRing() {
        this.plotProgress = 511;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        if (this.game.gameState.inventory.includes(`刻印の指輪`)) {
            this.showDialogue(`あなたは手にある刻印の指輪を思い出し、すぐにそれを指にはめる。指輪は柔らかな光を放ち、闇の神器の力を一部相殺する。${friendName}は影響を受けたようで、手を離す。`, [
                { text: `神器を拾う`, action: () => this.pickUpArtifact() }
            ]);
        } else {
            this.showDialogue(`あなたはポケットを探るが、刻印の指輪はない。おそらく先の混乱で失ってしまったのだろう。`, [
                { text: `持ちこたえ続ける`, action: () => this.continueHolding() },
                { text: `手放して後退する`, action: () => this.letGoAndBack() }
            ]);
        }
    }

    // 友達を助ける
    helpFriend() {
        this.plotProgress = 512;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`あなたは${friendName}のそばに行き、手を差し伸べて${friendName}を立ち上がらせようとする。${friendName}は少し躊躇するが、結局あなたの手を掴む。${friendName}は小声で言う："ありがとう...さっきは...わざとじゃなかったんだ..."`, [
            { text: `${friendName}を連れて去る`, action: () => this.leaveWithFriend() },
            { text: `神器について尋ねる`, action: () => this.askAboutArtifact() }
        ]);
    }

    // 環境物を使用する
    useEnvironmentItem() {
        this.plotProgress = 513;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`あなたは周囲を見回し、利用できる物を探す。部屋には古い家具がいくつかあるだけで、使えるものは何もない。${friendName}はあなたの意図に気づき、近づいてくる。`, [
            { text: `再度奪取を試みる`, action: () => this.fullForceGrab() },
            { text: `部屋から脱出しようとする`, action: () => this.attemptToEscape() }
        ]);
    }

    // 神器について尋ねる
    askAboutArtifact() {
        this.plotProgress = 514;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`${friendName}はため息をつき、言う："この神器は...意思があるみたいだ...ずっと私の頭の中で話しかけてきて...その力を使うように誘惑して...さっきは...ほとんど自制できなかった..."`, [
            { text: `${friendName}を連れて去る`, action: () => this.leaveWithFriend() },
            { text: `神器の処理方法について話し合う`, action: () => this.discussArtifact() }
        ]);
    }

    // 神器の処理方法について話し合う
    discussArtifact() {
        this.plotProgress = 515;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`あなたと${friendName}は闇の神器の処理方法について話し合う。${friendName}は神器を封印し、これ以上他者に危害を加えないようにすることを提案する。あなたたちはまずここを離れ、それから神器の処理方法を考えることにした。`, [
            { text: `${friendName}を連れて去る`, action: () => this.leaveWithFriend() }
        ]);
    }

    // よろめきながら後退する
    staggerBack() {
        this.plotProgress = 51;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`あなたは痺れに耐え、よろめきながら数歩後退する。${friendName}は迫り続け、${friendName}の目は狂気の光を輝かせている。`, [
            { text: `${friendName}を説得しようとする`, action: () => this.attemptToConvinceFriend() },
            { text: `反撃の機会を探す`, action: () => this.lookForCounterAttack() }
        ]);
    }

    // 機会を捉えて反撃する
    counterAttack() {
        this.plotProgress = 52;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`あなたは${friendName}の攻撃後の隙を捉え、全力で${pronounSub}の腹部を殴る。${friendName}は痛みで声を上げ、数歩後退するが、すぐに態勢を整える。`, [
            { text: `攻撃を続ける`, action: () => this.continueAttacking() },
            { text: `神器を奪おうとする`, action: () => this.attemptToGrabArtifact() }
        ]);
    }

    // 神器を奪う機会を探す
    lookForArtifactChance() {
        this.plotProgress = 53;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`horror`);
        this.showDialogue(`あなたは${friendName}の手にある闇の神器をじっと見つめ、奪う機会を探す。${pronounSub}はあなたの意図に気づいたようで、神器をより強く握りしめる。`, [
            { text: `${friendName}が油断した隙に奪う`, action: () => this.sneakGrabArtifact() },
            { text: `まず${friendName}の腕を攻撃する`, action: () => this.attackArm() }
        ]);
    }

    // こっそり後をつける
    sneakFollow() {
        this.plotProgress = 54;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`horror`);
        this.showDialogue(`あなたはこっそり${friendName}の後をつけ、部屋の奥へ進む。${pronounSub}は巨大な魔法陣の中央に立ち、長い呪文を唱え始める。闇の神器は魔法陣の上に浮かび、強烈な黒い光を放っている。`, [
            { text: `儀式が完了する前に邪魔する`, action: () => this.interruptRitual() },
            { text: `観察して弱点を探す`, action: () => this.observeWeakness() }
        ]);
    }

    // 儀式が完了する前に邪魔する
    interruptRitual() {
        this.plotProgress = 541;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`あなたは大声を上げ、${friendName}に突進し、${pronounSub}の儀式を邪魔しようとする。${friendName}は驚き、呪文が中断される。${friendName}は怒りながらあなたを見つめる："なぜ私を邪魔するんだ？！もう少しで強大な力を手に入れられたのに！"`, [
            { text: `${friendName}を説得しようとする`, action: () => this.attemptToConvinceFriend() },
            { text: `神器を奪おうとする`, action: () => this.attemptToGrabArtifact() }
        ]);
    }

    // 観察して弱点を探す
    observeWeakness() {
        this.plotProgress = 542;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`あなたは${friendName}と魔法陣を注意深く観察する。${friendName}が特定の呪文を唱えるたびに、魔法陣の光が少し弱まることに気づく。これが突破口かもしれない。`, [
            { text: `呪文が弱まった瞬間に攻撃する`, action: () => this.attackAtWeakPoint() },
            { text: `他の弱点を探す`, action: () => this.lookForOtherWeakness() }
        ]);
    }

    // 呪文が弱まった瞬間に攻撃する
    attackAtWeakPoint() {
        this.plotProgress = 543;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`あなたは${friendName}がその特定の呪文を唱えるのを待つ。魔法陣の光が弱まった瞬間、すぐに突進し、${friendName}を殴る。${pronounSub}は打撃を受け、地面に倒れる。`, [
            { text: `${friendName}の状態を確認する`, action: () => this.checkFriendCondition() },
            { text: `神器を拾う`, action: () => this.pickUpArtifact() }
        ]);
    }

    // 他の弱点を探す
    lookForOtherWeakness() {
        this.plotProgress = 544;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`あなたは部屋をさらに観察し、他の弱点を探す。部屋の隅に奇妙な模様があり、魔法陣と繋がっていることに気づく。この模様を破壊すれば、魔法陣の動作を妨げられるかもしれない。`, [
            { text: `模様を破壊する`, action: () => this.destroySymbol() },
            { text: `直接魔法陣を攻撃する`, action: () => this.attackMagicCircle() }
        ]);
    }

    // 模様を破壊する
    destroySymbol() {
        this.plotProgress = 545;
        this.playSound(`ding`);
        this.showDialogue(`あなたは部屋の隅に走り寄り、力いっぱいその模様を破壊する。模様が破壊されると、魔法陣の光は明らかに弱まった。${friendName}は悲鳴を上げ、地面に倒れる。`, [
            { text: `${friendName}の状態を確認する`, action: () => this.checkFriendCondition() }
        ]);
    }

    // 魔法陣を攻撃する
    attackMagicCircle() {
        this.plotProgress = 546;
        const friendName = this.getFriendName();
        this.playSound(`horrorUp`);
        this.showDialogue(`あなたは直接魔法陣に突進し、破壊しようとする。しかし魔法陣は突然強烈な光を放ち、あなたを吹き飛ばす。あなたは地面に強く打ちつけられ、全身に激痛が走る。${friendName}は冷笑する："身の程知らずめ！"`, [
            { text: `再度攻撃を試みる`, action: () => this.attackMagicCircleAgain() },
            { text: `一時撤退する`, action: () => this.retreatTemporarily() }
        ]);
    }

    // 再度魔法陣を攻撃する
    attackMagicCircleAgain() {
        this.plotProgress = 547;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`あなたは痛みに耐え、再び魔法陣に突進する。今度は魔法陣の弱点を見つけ、力いっぱい攻撃する。魔法陣は破壊され、大きな音を立てる。${friendName}は地面に倒れ、意識を失う。`, [
            { text: `${friendName}の状態を確認する`, action: () => this.checkFriendCondition() }
        ]);
    }

    // 一時撤退する
    retreatTemporarily() {
        this.plotProgress = 548;
        this.playSound(`horror`);
        this.showDialogue(`あなたは今が攻撃の好機ではないと判断し、一時撤退することを決める。あなたはゆっくり後退し、部屋を離れる。${friendName}は追いかけてこず、儀式に集中し続ける。`, [
            { text: `他の入口を探す`, action: () => this.lookForOtherEntrance() },
            { text: `助けを探す`, action: () => this.lookForHelp() }
        ]);
    }

    // 他の入口を探す
    lookForOtherEntrance() {
        this.plotProgress = 549;
        this.playSound(`ding`);
        this.showDialogue(`あなたは后勤区域で他の入口を探す。しばらく探した後、部屋へ通じる換気ダクトを見つける。あなたは換気ダクトに潜り、こっそり部屋に近づく。`, [
            { text: `換気ダクトから攻撃する`, action: () => this.attackFromVent() },
            { text: `こっそり部屋に入る`, action: () => this.sneakIntoRoom() }
        ]);
    }

    // 換気ダクトから攻撃する
    attackFromVent() {
        this.plotProgress = 550;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`あなたは換気ダクトから飛び降り、ちょうど${friendName}の背後に着地する。あなたは不意打ちをかけ、${friendName}は打撃を受け地面に倒れる。`, [
            { text: `${friendName}の状態を確認する`, action: () => this.checkFriendCondition() }
        ]);
    }

    // こっそり部屋に入る
    sneakIntoRoom() {
        this.plotProgress = 551;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`あなたは換気ダクトからこっそり部屋に入り、キャビネットの後ろに隠れる。${friendName}は依然として儀式に集中しており、あなたに気づかない。`, [
            { text: `儀式が完了する前に邪魔する`, action: () => this.interruptRitual() },
            { text: `観察して弱点を探す`, action: () => this.observeWeakness() }
        ]);
    }

    // 隙に神器を奪う
    stealArtifact() {
        this.plotProgress = 55;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`あなたは突然飛び起き、${friendName}に突進し、${pronounSub}の手から闇の神器を奪おうとする。${friendName}は反応が遅れ、神器はあなたの手に渡る。しかし${friendName}はすぐにあなたの手首を掴み、狂ったように神器を取り戻そうとする。`, [
            { text: `力ずくで振りほどく`, action: () => this.forceEscape() },
            { text: `神器で${friendName}を攻撃する`, action: () => this.attackWithArtifact() }
        ]);
    }

    // 力ずくで振りほどく
    forceEscape() {
        this.plotProgress = 59;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`あなたは全身の力を振り絞り、${friendName}の束縛から逃れる。${friendName}はよろめき、あなたは隙を見て後退し、${friendName}との距離を取る。`, [
            { text: `部屋から脱出しようとする`, action: () => this.attemptToEscape() },
            { text: `再度${friendName}を説得しようとする`, action: () => this.attemptToConvinceFriend() }
        ]);
    }

    // 神器で友達を攻撃する
    attackWithArtifact() {
        this.plotProgress = 60;
        const friendName = this.getFriendName();
        const pronounObj = this.getFriendPronoun(`object`);
        this.playSound(`horrorUp`);
        this.showDialogue(`あなたは闇の神器を掲げ、${friendName}に向かって振りかざす。しかし神器は突然黒い光を放ち、あなたはめまいを感じる。意識が戻った時、${friendName}が地面に倒れており、${pronounObj}の体は黒い霧に包まれている。`, [
            { text: `${friendName}の状態を確認する`, action: () => this.checkFriendCondition() },
            { text: `部屋から逃げる`, action: () => this.attemptToEscape() }
        ]);
    }

    // 鉄の棒で攻撃を試みる
    attackWithRod() {
        this.plotProgress = 56;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`あなたは鉄の棒を振り回し、${friendName}に向かって打ち下ろす。${pronounSub}は闇の神器であなたの攻撃を防ぎ、鉄の棒と神器がぶつかって耳障りな金属音を立てる。`, [
            { text: `攻撃を続ける`, action: () => this.continueAttackingWithRod() },
            { text: `隙を探す`, action: () => this.lookForWeakSpot() }
        ]);
    }

    // 防御を維持して機会を待つ
    defendAndWait() {
        this.plotProgress = 57;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`あなたは防御姿勢を維持し、${friendName}の攻撃に隙ができるのを待つ。${friendName}は絶え間なく闇の神器を振り回してあなたを攻撃し、${friendName}の息は次第に荒くなる。`, [
            { text: `反撃の機会を探す`, action: () => this.lookForCounterAttack() },
            { text: `${friendName}を説得しようとする`, action: () => this.attemptToConvinceFriend() }
        ]);
    }

    // 部屋から脱出しようとする
    attemptToEscape() {
        this.plotProgress = 58;
        const friendName = this.getFriendName();
        const pronounSub = this.getFriendPronoun(`subject`);
        this.playSound(`ding`);
        this.showDialogue(`あなたは振り返ってドアに向かって突進し、部屋から脱出しようとする。しかし${friendName}はあなたより速く、${pronounSub}は一瞬でドアの前に移動し、あなたの行く手を阻む。${friendName}は冷笑して言う："逃げると思うのか？そうはさせない！"`, [
            { text: `強行突破する`, action: () => this.forceBreakthrough() },
            { text: `引き返して再戦する`, action: () => this.fightBack() }
        ]);
    }

    // 強行突破する
    forceBreakthrough() {
        this.plotProgress = 581;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`あなたは歯を食いしばり、全力で${friendName}に突進する。${friendName}はあなたがここまで必死になるとは思わず、押し退けられる。あなたは隙を見て部屋から飛び出すが、${friendName}は後を執拗に追ってくる。`, [
            { text: `逃げ続ける`, action: () => this.continueRunning() },
            { text: `隠れる場所を探す`, action: () => this.findHidingPlace() }
        ]);
    }

    // 引き返して再戦する
    fightBack() {
        this.plotProgress = 582;
        const friendName = this.getFriendName();
        this.playSound(`horrorUp`);
        this.showDialogue(`あなたは足を止め、振り返って${friendName}に向き合う。${friendName}はそれを見て、残忍な笑みを浮かべる："良かろう、どれだけの力があるか見せてみろ！"`, [
            { text: `攻撃の機会を探す`, action: () => this.lookForCounterAttack() },
            { text: `${friendName}を説得しようとする`, action: () => this.attemptToConvinceFriend() }
        ]);
    }

    // 逃げ続ける
    continueRunning() {
        this.plotProgress = 583;
        this.playSound(`ding`);
        this.showDialogue(`あなたは必死に走り、廊下を抜け、学校の出口へ向かう。${friendName}がまだ後を追っているかはわからないが、振り返る勇気はなく、ただ前へ走り続ける。`, [
            { text: `学校から脱出する`, action: () => this.escapeSchool() }
        ]);
    }

    // 隠れる場所を探す
    findHidingPlace() {
        this.plotProgress = 584;
        this.playSound(`horror`);
        this.showDialogue(`あなたは教室に駆け込み、教壇の後ろに隠れる。${friendName}の足音が近づき、あなたは息を殺し、${friendName}に見つからないよう祈る。`, [
            { text: `${friendName}が去るのを待つ`, action: () => this.waitForFriendToLeave() },
            { text: `こっそり${friendName}を観察する`, action: () => this.sneakObserveFriend() }
        ]);
    }

    // 学校から脱出する
    escapeSchool() {
        this.plotProgress = 585;
        this.playSound(`ding`);
        this.showDialogue(`あなたはついに学校から脱出した。外の陽の光が温かく感じられ、振り返って学校を見ると、${friendName}は追いかけてきていない。あなたは今回の脱出には成功したが、${friendName}は依然として闇の中に囚われたままであることを知る。`, [
            { text: `警察に通報する`, action: () => this.callPolice() },
            { text: `学校に戻って${friendName}を救う`, action: () => this.returnToSaveFriend() }
        ]);
    }

    // 友達が去るのを待つ
    waitForFriendToLeave() {
        this.plotProgress = 586;
        this.playSound(`horror`);
        this.showDialogue(`あなたは教壇の後ろで長い間待ち、ついに${friendName}の足音が聞こえなくなった。こっそり顔を出すと、教室には誰もいない。`, [
            { text: `出口を探し続ける`, action: () => this.attemptToEscape() }
        ]);
    }

    // こっそり友達を観察する
    sneakObserveFriend() {
        this.plotProgress = 587;
        const friendName = this.getFriendName();
        this.playSound(`horrorUp`);
        this.showDialogue(`あなたはこっそり顔を出し、${friendName}の動向を観察する。${friendName}は教室の入口に立ち、入るかどうか迷っているようだ。突然、${friendName}の体が震え、目には葛藤の色が一瞬浮かぶ。`, [
            { text: `${friendName}の名前を呼ぶ`, action: () => this.callFriendName() },
            { text: `隠れ続ける`, action: () => this.waitForFriendToLeave() }
        ]);
    }

    // 友達の名前を呼ぶ
    callFriendName() {
        this.plotProgress = 588;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`あなたは小声で${friendName}の名前を呼ぶ。${friendName}はあなたの声を聞き、明らかに体が震える。${friendName}はゆっくりと振り返り、目の中の狂気は次第に消え、困惑と苦痛に変わる。`, [
            { text: `近づいて${friendName}を慰める`, action: () => this.comfortFriend() }
        ]);
    }

    // 友達を慰める
    comfortFriend() {
        this.plotProgress = 589;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`あなたはゆっくり${friendName}のそばに歩み寄り、優しく慰める。${friendName}はあなたの胸に飛び込み、声を上げて泣く："私...さっき恐ろしいことをたくさんしてしまった..."`, [
            { text: `${friendName}を連れて去る`, action: () => this.leaveWithFriend() }
        ]);
    }

    // 学校に戻って友達を救う
    returnToSaveFriend() {
        this.plotProgress = 590;
        const friendName = this.getFriendName();
        this.playSound(`horrorUp`);
        this.showDialogue(`あなたは深く息を吸い、学校へ走り戻る。${friendName}を置き去りにはできない。先ほどの部屋に戻ると、${friendName}が頭を抱えてしゃがみ込んでおり、闇の神器は跡形もなく消えている。`, [
            { text: `${friendName}に神器の行方を尋ねる`, action: () => this.askAboutArtifact() },
            { text: `${friendName}を連れて去る`, action: () => this.leaveWithFriend() }
        ]);
    }

    // 友達の状態を確認する
    checkFriendCondition() {
        this.plotProgress = 61;
        const friendName = this.getFriendName();
        const pronounObj = this.getFriendPronoun(`object`);
        this.playSound(`horror`);
        this.showDialogue(`${friendName}は地面に倒れ、${pronounObj}の呼吸はかすかだ。あなたは近づくと、${friendName}の目は正常に戻っているが、顔には依然として苦痛の表情が浮かんでいる。`, [
            { text: `${friendName}を起こす`, action: () => this.wakeFriend() },
            { text: `助けを探す`, action: () => this.lookForHelp() }
        ]);
    }

    // 友達を起こす
    wakeFriend() {
        this.plotProgress = 62;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`あなたは軽く${friendName}の体を揺さぶり、${friendName}の名前を呼ぶ。${friendName}はゆっくり目を開け、あなたを見ると、弱々しい笑みを浮かべる："${this.game.gameState.playerName}...ありがとう..."`, [
            { text: `${friendName}に何が起こったか尋ねる`, action: () => this.askFriendWhatHappened() },
            { text: `${friendName}を連れてここを去る`, action: () => this.leaveWithFriend() }
        ]);
    }

    // 友達を連れて去る
    leaveWithFriend() {
        this.plotProgress = 63;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`あなたは${friendName}を支え、ゆっくり部屋を出る。闇の神器は依然として部屋の中央で黒い光を放っているが、あなたにはそれに対処する力も残っていない。あなたたちはよろめきながら学校后勤区域を抜け、学校の廊下に戻る。`, [
            { text: `保健室へ向かう`, action: () => this.goToInfirmary() },
            { text: `警察に通報する`, action: () => this.callPolice() }
        ]);
    }

    // 助けを探す
    lookForHelp() {
        this.plotProgress = 64;
        this.playSound(`ding`);
        this.showDialogue(`あなたは部屋から飛び出し、大声で助けを求める。しかし学校全体が静まり返り、誰も応答しない。あなたは今や自分自身に頼るしかないと悟る。`, [
            { text: `部屋に戻る`, action: () => this.checkFriendCondition() }
        ]);
    }

    // 友達に何が起こったか尋ねる
    askFriendWhatHappened() {
        this.plotProgress = 65;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`${friendName}は弱々しく言う："私...あの神器に操られていた...それが...ずっと私の頭の中で話しかけて...恐ろしいことをするように仕向けて..."`, [
            { text: `${friendName}を連れてここを去る`, action: () => this.leaveWithFriend() }
        ]);
    }

    // 保健室へ向かう
    goToInfirmary() {
        this.plotProgress = 66;
        const friendName = this.getFriendName();
        this.playSound(`ding`);
        this.showDialogue(`あなたは${friendName}を支えて保健室へ行き、応急処置の薬品を見つける。あなたは${friendName}の傷の手当てをし、${friendName}の状態は幾分良くなったようだ。`, [
            { text: `少し休む`, action: () => this.restInInfirmary() }
        ]);
    }

    // 保健室で休む
    restInInfirmary() {
        this.plotProgress = 67;
        const friendName = this.getFriendName();
        this.playSound(`horror`);
        this.showDialogue(`あなたと${friendName}は保健室でしばらく休む。${friendName}の精神状態はだいぶ良くなったが、あなたたちは皆、この事件がまだ終わっていないことを知っている。闇の神器は依然として学校の中にあり、次の犠牲者を待ち構えている。`, [
            { text: `第四章を終了する`, action: () => this.completeChapter() }
        ]);
    }

    // 警察に通報する
    callPolice() {
        this.plotProgress = 68;
        this.playSound(`ding`);
        this.showDialogue(`あなたは携帯電話を取り出して警察に通報しようとするが、電波が入らない。学校全体が何らかの力に覆われ、外界と完全に隔離されているようだ。`, [
            { text: `保健室へ向かう`, action: () => this.goToInfirmary() }
        ]);
    }

    // 章を完了する
    completeChapter() {
        // これは最終章なので、次の章はありません
        // 結果画面を表示
        this.showResultScreen();

        // 結果画面を表示
        this.showResultScreen();
    }

    // 結果画面を表示
    showResultScreen() {
        this.game.elements.gameScreen.classList.add('hidden');
        this.game.elements.resultScreen.classList.remove('hidden');

        // 章の名前とクリア時間を表示
        let chapterName = '第四章-「闇の侵食」';
        this.game.elements.resultChapter.textContent = chapterName;
        this.game.elements.resultTime.textContent = this.game.gameState.gameTime;

        // 次の章ボタンを非表示にする（これは最終章）
        this.game.elements.nextChapterBtn.classList.add('hidden');
        // 章選択に戻るボタンを表示
        this.game.elements.backToChapterSelectBtn.classList.remove('hidden');
        this.game.elements.backToChapterSelectBtn.textContent = '章選択に戻る';

        // エンディングの説明を表示
        const endingDescription = document.createElement('div');
        endingDescription.className = 'ending-description';
        endingDescription.innerHTML = `
            <p>あなたは闇の神器に操られた友達の手から無事脱出し、友達の意識を回復させる手助けをしました。</p>
            <p>闇の神器は依然として存在しますが、あなたは友情の力が闇に打ち勝つことを証明しました。</p>
            <p>しかし、これは単なる始まりに過ぎません...より強大な闇の力があなたを待ち受けています...</p>
        `;

        // 結果画面にエンディングの説明を追加
        this.game.elements.resultScreen.innerHTML = '';
        this.game.elements.resultScreen.appendChild(endingDescription);
    }
}
// Chapter4クラスをwindowオブジェクトにエクスポート
window.Chapter4 = Chapter4;