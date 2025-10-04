class Chapter1 {
    constructor(game) {
        this.game = game;
        this.plotProgress = 0;
        this.ghostEncountered = false;
        this.keyFound = false;
        this.typingInterval = null;

        // サウンドエフェクト要素
        this.horrorDing = document.getElementById('horror-ding');
        this.horrorUp = document.getElementById('horror-up');

        // gameオブジェクトにshowInputDialogメソッドがあることを確認
        if (!this.game.showInputDialog) {
            this.game.showInputDialog = function (message, inputPlaceholder, callback) {
                const dialogueText = document.getElementById('dialogue-text');
                const dialogueChoices = document.getElementById('dialogue-choices');
                const gameActions = document.getElementById('game-actions');
                let typingInterval;

                // ダイアログをクリア
                dialogueText.innerHTML = '';
                dialogueChoices.innerHTML = '';
                gameActions.innerHTML = '';

                // タイプライター効果でメッセージを表示
                let index = 0;
                const typeSpeed = 70; // タイピング速度、ミリ秒/文字

                // 進行中のタイピングアニメーションをクリア
                if (this.typingInterval) {
                    clearInterval(this.typingInterval);
                }

                // タイピングアニメーションを開始
                this.typingInterval = setInterval(() => {
                    if (index < message.length) {
                        dialogueText.textContent += message.charAt(index);
                        index++;
                    } else {
                        clearInterval(this.typingInterval);
                        // タイピング完了後に入力要素を作成
                        createInputElements();
                    }
                }, typeSpeed);

                // 入力フィールドとボタンを作成する関数
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

                    // 確認ボタンを作成
                    const confirmBtn = document.createElement('button');
                    confirmBtn.textContent = '確認';
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

                    // Enterキーでの送信を許可
                    input.addEventListener('keypress', function (e) {
                        if (e.key === 'Enter') {
                            callback(input.value);
                            inputContainer.remove();
                        }
                    });

                    inputContainer.appendChild(input);
                    inputContainer.appendChild(confirmBtn);
                    dialogueChoices.appendChild(inputContainer);

                    // 入力フィールドに自動フォーカス
                    input.focus();
                }
            };
        }
    }

    // サウンドエフェクトを再生
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
            console.warn('サウンド再生失敗:', e);
        }
    }

    // タイプライター効果で会話を表示
    showDialogue(text, choices) {
        // ゲームオブジェクトのshowDialogueメソッドを直接使用
        this.game.showDialogue(text, choices);
    }

    // 第一章を開始
    // 第一章を開始、オプションで開始時間パラメータを受け取る
    start(startTime = null) {
        this.game.gameState.currentChapter = 'chapter1';
        // ゲーム時間を初期化
        if (startTime) {
            this.updateGameTime(startTime);
        } else {
            this.updateGameTime('21:30'); // デフォルト開始時間
        }
        this.game.updateGameMap('corridor');
        this.plotProgress = 0;
        this.loadScene('corridor');
    }

    // シーンをロード
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

    // 地下通路シーン
    showUndergroundPassageScene() {
        this.game.gameState.currentScene = 'undergroundPassage';
        this.game.updateGameMap('undergroundPassage');
        this.showDialogue('石段の先は湿った地下通路で、壁には奇妙な記号が刻まれている。遠くから水滴の音とかすかな囁きが聞こえる。', [
            { text: '先へ進む', action: () => this.deepenExploration() }
        ]);
    }

    deepenExploration() {
        this.showDialogue('通路の先に三つの分岐路が現れた。それぞれの道からは異なる臭いが漂っている——鉄錆、腐敗、消毒液。', [
            { text: '鉄錆臭の道を行く', action: () => this.chooseRustPath() },
            { text: '腐敗臭の道を行く', action: () => this.chooseDecayPath() },
            { text: '消毒液臭の道を行く', action: () => this.chooseDisinfectantPath() }
        ]);
    }

    chooseRustPath() {
        this.showDialogue('鉄錆臭の通路の壁は配管で覆われ、そのうちの一本から赤い液体が滴っている。先にはかすかに鉄の扉が見える。', [
            { text: '鉄の扉を調べる', action: () => this.examineIronDoor() }
        ]);
    }

    chooseDecayPath() {
        this.showDialogue('腐敗臭の通路の床は粘着質な黒い物質で覆われ、壁からは粘液が滲み出ている。遠くから咀嚼のような音が聞こえる。', [
            { text: '粘液を避けて進む', action: () => this.navigateSlime() }
        ]);
    }

    chooseDisinfectantPath() {
        this.showDialogue('消毒液臭の通路は異常に清潔で、両側には「実験体」の番号が記された金属製のキャビネットが並んでいる。明かりがちらついている。', [
            { text: '最も近いキャビネットを開ける', action: () => this.openExperimentCabinet() }
        ]);
    }

    examineIronDoor() {
        // 入力フォーム形式のパスワード入力を作成
        this.game.showInputDialog('鉄の扉には8桁のダイヤル式錠がかかっており、横には黄色く変色したメモが貼られている：「パスワードは最初の犠牲者の誕生日」。',
            '8桁の数字パスワードを入力',
            (input) => this.validatePassword(input));
    }

    // パスワードを検証
    validatePassword(inputPassword) {
        if (inputPassword === '19980613') {
            this.showDialogue('あなたは' + inputPassword + 'と入力した。鉄の扉は重い音を立ててゆっくりと開いた。扉の向こうにはより広い地下空間が広がっている。', [
                { text: '鉄の扉に入る', action: () => this.enterIronDoorArea() }
            ]);
        } else {
            this.showDialogue('パスワードが間違っている！鉄の扉から耳障りな警報音が鳴り響き、遠くから慌ただしい足音が近づいてくる。', [
                { text: '再入力する', action: () => this.examineIronDoor() },
                { text: '分岐路に戻る', action: () => this.deepenExploration() }
            ]);
        }
    }

    navigateSlime() {
        this.showDialogue('あなたはつま先立ちで粘液を避けようとしたが、金属缶を蹴ってしまった。その音で暗闇の中の何かが目を覚ました——光る目があなたに向かって近づいてくる。', [
            { text: '分岐路に戻る', action: () => this.deepenExploration() },
            { text: '地図を盾にする', action: () => this.useMapAsShield() }
        ]);
    }

    openExperimentCabinet() {
        this.showDialogue('キャビネットの中にはガラス容器があり、心臓に似た器官が浸かっていた。ラベルには「実験体-07、1998.06.13」と書かれている。', [
            { text: '日付を記録する', action: () => this.noteExperimentDate() }
        ]);
    }

    noteExperimentDate() {
        this.game.gameState.experimentDate = '19980613';
        this.showDialogue('あなたは日付を記録した：1998年6月13日。この日付は重要そうだ、何かのパスワードに関係しているかもしれない。', [
            { text: '探索を続ける', action: () => this.deepenExploration() }
        ]);
    }

    // 古いパスワード入力メソッド、使用されないが保持
    enterDoorPassword() {
        this.validatePassword('19980613');
    }

    useMapAsShield() {
        this.showDialogue('あなたは素早く地図を取り出して面前にかざした。地図は突然微かな光を放ち、暗闇の生物を追い払った。', [
            { text: '先へ進む', action: () => this.proceedThroughSlime() }
        ]);
    }

    enterIronDoorArea() {
        this.game.gameState.currentScene = 'ironDoorArea';
        this.game.updateGameMap('ironDoorArea');
        this.showDialogue('鉄の扉の向こうは巨大な地下实验室で、中央には光る容器が置かれ、中には人型に似た影が漂っている。', [
            { text: '容器に近づく', action: () => this.approachContainer() }
        ]);
    }

    proceedThroughSlime() {
        this.game.gameState.currentScene = 'slimeExit';
        this.game.updateGameMap('slimeExit');
        this.showDialogue('あなたは粘液区域を通り抜け、奇妙な記号が刻まれた石の扉を見つけた。記号は序章の日記にあった印と全く同じだ。', [
            { text: '扉を開けようとする', action: () => this.tryOpenStoneDoor() }
        ]);
    }

    approachContainer() {
        this.showDialogue('あなたが容器に近づくと、中の人型の影が突然目を見開き、あなたをじっと見つめる。容器の表面にひび割れが生じ始めた。', [
            { text: '後退する', action: () => this.backAwayFromContainer() },
            { text: '容器に触れる', action: () => this.touchContainer() }
        ]);
    }

    tryOpenStoneDoor() {
        if (this.game.gameState.inventory.includes('地下室の地図')) {
            this.showDialogue('あなたは地図を石の扉に押し当てた。地図は金色の光を放ち、扉の記号と共鳴する。石の扉はゆっくりと開いた。', [
                { text: '扉の中に入る', action: () => this.enterStoneDoor() }
            ]);
        } else {
            this.showDialogue('石の扉は微動だにしない。何らかの鍵や方法を見つける必要がある。', [
                { text: '分岐路に戻る', action: () => this.deepenExploration() }
            ]);
        }
    }

    backAwayFromContainer() {
        this.playSound('horror');
        this.showDialogue('あなたは素早く後退し、容器は目の前で爆発し、大量の黒い煙を放出した。煙の中から悲痛な叫び声が聞こえる。', [
            { text: '实验室から脱出する', action: () => this.escapeLab() }
        ]);
    }

    touchContainer() {
        this.showDialogue('あなたが容器に触れた瞬間、強い閃光が走った。気がつくと、あなたは学校の校庭に立っていたが、周りの全てが不気味な赤色に染まっている。', [
            { text: '赤い校庭を探索する', action: () => this.exploreRedPlayground() }
        ]);
    }

    enterStoneDoor() {
        this.game.gameState.currentScene = 'stoneDoorChamber';
        this.game.updateGameMap('stoneDoorChamber');
        this.showDialogue('扉の向こうは古びた石室で、中央には祭壇があり、その上には黒い表紙の本が置かれている。', [
            { text: '本を開く', action: () => this.openBlackBook() }
        ]);
    }

    escapeLab() {
        this.showDialogue('あなたは来た道を戻って实验室から脱出したが、出口はいつの間にか教室の扉に変わっていた。扉を押し開けると、自分が夜の自習後の教室に戻っていることに気づき、全てがまるで何事もなかったかのようだ。', [
            { text: '教室を見回す', action: () => this.returnToClassroom() }
        ]);
    }

    exploreRedPlayground() {
        this.game.gameState.currentScene = 'redPlayground';
        this.game.updateGameMap('redPlayground');
        this.showDialogue('赤い校庭は静寂に包まれ、トラックには奇妙な痕跡が残っている。校庭中央の旗竿には色あせた旗が掛かっており、そこには石の扉と同じ記号が描かれている。', [
            { text: '旗竿に向かう', action: () => this.approachFlagpole() }
        ]);
    }

    openBlackBook() {
        this.showDialogue('本を開いた瞬間、無数の黒い文字がページから飛び出し、あなたの脳裏に飛び込んできた。あなたは学校の過去、忘れ去られた魂たちを見た。', [
            { text: '読み続ける', action: () => this.continueReadingBook() }
        ]);
    }

    approachFlagpole() {
        this.game.showDialogue('あなたが旗竿に向かうと、旗は突然激しく揺れ、耳障りな騒音を発した。地面が震え始め、巨大な裂け目があなたの目の前に広がった。', [
            { text: '後退する', action: () => this.backAwayFromCrack() },
            { text: '裂け目に飛び込む', action: () => this.jumpIntoCrack() }
        ]);
    }

    continueReadingBook() {
        this.game.showDialogue('本の中の文字はあなたにこう告げた——この学校は古い祭壇の上に建てられており、バランスを保つために毎年ひとつの魂を捧げる必要がある。今年の捧げ日の儀式は、まさに今日だと。本にはまた、祭壇の位置が記されており、それは学校の地下核心区域にある。', [
            { text: '本を閉じる', action: () => this.closeBlackBook() },
            { text: '地下核心へ向かう', action: () => this.reachFinalArea() }
        ]);
    }

    backAwayFromCrack() {
        this.game.showDialogue('あなたは素早く後退し、裂け目はあなたの背後で閉じた。校庭は平穏を取り戻したが、色は依然として不気味な赤いままだ。校庭の中央に光る記号が現れたのに気づく。それはあなたが地下で見た核心区域の印と同じだ。', [
            { text: '記号に向かう', action: () => this.reachFinalArea() },
            { text: '出口を探す', action: () => this.searchForExit() }
        ]);
    }

    jumpIntoCrack() {
        this.game.gameState.currentScene = 'undergroundAbyss';
        this.game.updateGameMap('undergroundAbyss');
        this.game.showDialogue('あなたは裂け目に飛び込み、長い間落下してようやく着地した。周囲は真っ暗で、遠くから水滴の音だけが聞こえる。', [
            { text: '前方を探索する', action: () => this.exploreAbyss() }
        ]);
    }

    closeBlackBook() {
        this.game.showDialogue('あなたが本を閉じると、祭壇は震え始めた。石室の壁に新しい通路が現れた。', [
            { text: '新しい通路に入る', action: () => this.enterNewPassage() }
        ]);
    }

    searchForExit() {
        this.game.showDialogue('あなたは赤い校庭で出口を探したが、全ての校門は赤い霧で封鎖されていた。霧の中に何かが動いているようだ。あなたはふと本に書かれていた地下核心区域のことを思い出した。おそらくそこが本当の出口なのだろう。', [
            { text: '教室に戻る', action: () => this.returnToClassroom() },
            { text: '地下核心への入り口を探す', action: () => this.reachFinalArea() }
        ]);
    }

    exploreAbyss() {
        this.game.showDialogue('あなたは前方へ探索を進め、足元の地面が次第に湿り滑らかになっていく。突然、前方から低い呼吸音が聞こえてきた。', [
            { text: '進み続ける', action: () => this.faceAbyssCreature() }
        ]);
    }

    enterNewPassage() {
        this.game.gameState.currentScene = 'hiddenCatacombs';
        this.game.updateGameMap('hiddenCatacombs');
        this.game.showDialogue('新しい通路は地下墓地へと続いており、壁には奇怪な記号が刻まれている。通路の突き当たりには青銅の扉があり、光る宝石がはめ込まれている。', [
            { text: '宝石に触れる', action: () => this.touchGemstone() }
        ]);
    }

    faceAbyssCreature() {
        this.game.showDialogue('あなたが進み続けると、洞窟の隅にうずくまる巨大な黒い生物が見えた。その目は幽かな緑色に光り、あなたの存在に気づいた。', [
            { text: '意思疎通を試みる', action: () => this.communicateWithCreature() },
            { text: '逃げる', action: () => this.runFromCreature() }
        ]);
    }

    touchGemstone() {
        this.game.showDialogue('あなたが宝石に触れると、宝石はまばゆい光を放った。青銅の扉はゆっくりと開き、背後にある通路が現れた。', [
            { text: '通路に入る', action: () => this.enterBronzeDoor() }
        ]);
    }

    returnToClassroom() {
        this.game.gameState.currentScene = 'classroom';
        this.game.updateGameMap('classroom');
        this.game.showDialogue('あなたは教室に戻った。全てが正常に見え、先ほどの経験はただの夢だったかのようだ。しかし、あなたはそれが夢ではないことを知っている。', [
            { text: '再び教室を調べる', action: () => this.examineClassroomAgain() },
            { text: '教室を出る', action: () => this.leaveClassroom() }
        ]);
    }

    communicateWithCreature() {
        this.game.showDialogue('あなたは生物と意思疎通を試みた。それは低い声を発し、何かを訴えているようだった。あなたはその言語を理解できないが、その苦痛と怒りを感じ取ることができた。', [
            { text: '友好を示す', action: () => this.showFriendship() }
        ]);
    }

    runFromCreature() {
        this.game.showDialogue('あなたは振り返って逃げ出したが、生物の速度はあなたの想像をはるかに超えていた。それは簡単にあなたに追いつき、その影に包み込んだ。', [
            { text: '抵抗を諦める', action: () => this.surrenderToCreature() }
        ]);
    }

    enterBronzeDoor() {
        this.game.gameState.currentScene = 'innerSanctum';
        this.game.updateGameMap('innerSanctum');
        this.game.showDialogue('青銅の扉の向こうの通路は神聖な内陣へと続いている。中央には水池があり、その中には一輪の黒い蓮が浮かんでいる。', [
            { text: '蓮に触れる', action: () => this.touchBlackLotus() },
            { text: '内陣を探索する', action: () => this.reachFinalArea() }
        ]);
    }

    examineClassroomAgain() {
        this.game.showDialogue('あなたは再び教室を調べ、いつの間にか黒板に一行の文字が現れているのに気づいた：「出口はない、ただより深くへ」。', [
            { text: '席に座る', action: () => this.sitAtDesk() }
        ]);
    }

    leaveClassroom() {
        this.game.showDialogue('あなたは教室を出た。廊下には誰もいない。全ての教室の扉は閉ざされており、階段室の扉だけが微かに開いている。', [
            { text: '階段室へ行く', action: () => this.goToStairs() }
        ]);
    }

    showFriendship() {
        this.game.showDialogue('あなたは生物に友好を示した。それはあなたの善意を感じ取ったようで、次第に落ち着いていった。それは洞窟の奥へと向きを変え、あなたに従うよう合図した。', [
            { text: '生物に従う', action: () => this.followCreature() }
        ]);
    }

    surrenderToCreature() {
        this.game.showDialogue('あなたは抵抗を諦め、目を閉じた。しかし、想像していた痛みは訪れなかった。目を開けると、自分が教室に戻っていることに気づき、周りの全てが正常だった。', [
            { text: '現実を疑う', action: () => this.doubtReality() }
        ]);
    }

    touchBlackLotus() {
        this.game.showDialogue('あなたが黒い蓮に触れると、蓮は突然開花し、強い光を放った。光が消えると、あなたは自分が巨大な地下空間の入口に立っていることに気づいた。', [
            { text: '空間に入る', action: () => this.reachFinalArea() }
        ]);
    }

    sitAtDesk() {
        this.game.showDialogue('あなたが席に座ると、机の上に一枚のメモがあるのに気づいた。そこには「おかえりなさい、次の探索がまもなく始まります」と書かれている。', [
            { text: '待つ', action: () => this.waitForNextEvent() }
        ]);
    }

    goToStairs() {
        this.game.gameState.currentScene = 'stairs';
        this.game.updateGameMap('stairs');
        this.game.showDialogue('あなたは階段室に来た。階段は普段より長いように感じられる。階段の下は真っ暗で、上は赤い霧に包まれている。', [
            { text: '階下へ行く', action: () => this.goDownstairs() },
            { text: '階上へ行く', action: () => this.goUpstairs() }
        ]);
    }

    followCreature() {
        this.game.gameState.currentScene = 'creatureLair';
        this.game.updateGameMap('creatureLair');
        this.game.showDialogue('あなたは生物についてその巣穴へ行った。巣穴の中央には光る水晶があった。生物は頭でそっと水晶に触れ、水晶は柔らかな光を放った。', [
            { text: '水晶に触れる', action: () => this.touchCrystal() }
        ]);
    }

    doubtReality() {
        this.game.showDialogue('あなたは現実の真实性を疑い始めた。周りの全ては正常に見えるが、何かがおかしいと知っている。あなたは再び学校を探索することにした。', [
            { text: '教室を出る', action: () => this.leaveClassroom() }
        ]);
    }

    acceptAbsorption() {
        this.game.gameState.currentScene = 'lotusDimension';
        this.game.updateGameMap('lotusDimension');
        this.game.showDialogue('あなたは蓮に吸い込まれ、自分が異次元にいることに気づいた。周りは果てしない花の海で、それぞれの花は微かな光を放っている。', [
            { text: '花の海を探索する', action: () => this.exploreFlowerField() }
        ]);
    }

    waitForNextEvent() {
        this.game.showDialogue('あなたは待っていると、教室の明かりが突然数回点滅した。明かりが正常に戻ると、黒板の文字は消え、代わりに学校の各区域が記された地図が現れた。', [
            { text: '地図を見る', action: () => this.examineNewMap() }
        ]);
    }

    goUpstairs() {
        this.game.gameState.currentScene = 'upperFloor';
        this.game.updateGameMap('upperFloor');
        this.game.showDialogue('あなたは階上へ行くと、上の階の廊下が下の階とは全く異なっていることに気づいた。壁には古い肖像画が掛かっており、絵の中の人物があなたを見つめているようだ。', [
            { text: '進み続ける', action: () => this.exploreUpperFloor() }
        ]);
    }

    touchCrystal() {
        this.game.showDialogue('あなたが水晶に触れると、水晶はまばゆい光を放った。光が閃いた後、あなたは見知らぬ地下空間の入口に立っている自分に気づいた。', [
            { text: '空間に入る', action: () => this.reachFinalArea() }
        ]);
    }

    exploreFlowerField() {
        this.game.gameState.currentScene = 'flowerField';
        this.game.updateGameMap('flowerField');
        this.game.showDialogue('あなたは花の海を探索し、それぞれの花が学校にいるひとつの魂に対応していることに気づいた。それらは何かをあなたに訴えかけているようだ。', [
            { text: '魂の声に耳を傾ける', action: () => this.listenToSouls() },
            { text: '花の海を離れる', action: () => this.reachFinalArea() }
        ]);
    }

    listenToSouls() {
        this.game.showDialogue('あなたは魂の訴えに耳を傾けた。それらは学校の秘密と忘れ去られた地下核心区域についてあなたに告げた。魂たちはあなたを核心区域への入口へと導いた。', [
            { text: '核心区域に入る', action: () => this.reachFinalArea() }
        ]);
    }

    examineNewMap() {
        this.game.showDialogue('あなたは地図を見て、これまで見たことのない区域——「地下核心」が記されているのに気づいた。地図には、これがあなたがずっと探し求めていた最終区域であることが示されている。', [
            { text: '地下核心へ向かう', action: () => this.reachFinalArea() }
        ]);
    }

    exploreUpperFloor() {
        this.game.gameState.currentScene = 'upperFloorCorridor';
        this.game.updateGameMap('upperFloorCorridor');
        this.game.showDialogue('あなたが進み続けると、廊下の突き当たりに扉があるのに気づいた。扉には「校長室」と書かれた札が掛かっている。', [
            { text: '校長室に入る', action: () => this.enterPrincipalsOffice() },
            { text: '階段室に戻る', action: () => this.goToStairs() }
        ]);
    }

    enterPrincipalsOffice() {
        this.game.gameState.currentScene = 'principalsOffice';
        this.game.updateGameMap('principalsOffice');
        this.game.showDialogue('校長室はほこりに覆われており、机の上には色あせた写真があった。写真の中の人は古いスタイルの制服を着ている。壁には学校の古い地図が掛かっている。', [
            { text: '古い地図を見る', action: () => this.examineOldMap() }
        ]);
    }

    examineOldMap() {
        this.game.showDialogue('古い地図には学校の各区域が記されており、その中でも地下室区域は特に丸で囲まれ、「核心へ通ず」と注記されていた。', [
            { text: '地下室核心へ向かう', action: () => this.reachFinalArea() }
        ]);
    }

    // 廊下シーン
    showCorridorScene() {
        this.game.gameState.currentScene = 'corridor';
        this.game.updateGameMap('corridor');

        if (this.plotProgress === 0) {
            this.game.showDialogue('夜の自習後の廊下は異様に静かで、何かがあなたを見つめているような気がする。', [
                { text: '階段へ向かう', action: () => this.goToStaircase() },
                { text: '教室に戻る', action: () => this.returnToClassroom() }
            ]);
        } else if (this.plotProgress === 1) {
            this.game.showDialogue('廊下の温度が突然下がり、壁に奇妙な影が揺れ動いているのが見える。', [
                { text: '進み続ける', action: () => this.goToStaircase() },
                { text: '影を調べる', action: () => this.examineShadow() }
            ]);
        } else {
            this.game.showDialogue('廊下には不気味な笑い声が反響しており、あなたはここから早く離れなければならない。', [
                { text: '階段へ向かって走る', action: () => this.goToStaircase() }
            ]);
        }
    }

    // 階段シーン
    showStaircaseScene() {
        this.game.gameState.currentScene = 'staircase';
        this.game.updateGameMap('staircase');

        if (this.plotProgress === 1 && !this.ghostEncountered) {
            if (this.game.gameState.inventory.includes('地下室の地図')) {
                this.game.showDialogue('あなたは階段室に来て、序章で手に入れた地下室の地図を思い出し、地図の指示に従って探索することを決めた。', [
                    { text: '地図に従って階下へ行き地下室へ', action: () => this.goToBasement() },
                    { text: 'まず美術教室へ行く', action: () => this.goDownstairs() }
                ]);
            } else {
                this.game.showDialogue('あなたは階段室に来た。階段からは水滴が落ちる音がするようだが、周りには水はない。', [
                    { text: '階上へ行く', action: () => this.goUpstairs() },
                    { text: '階下へ行く', action: () => this.goDownstairs() }
                ]);
            }
        } else if (this.plotProgress === 2 && this.ghostEncountered) {
            this.game.showDialogue('あなたは美術教室から逃げ出した。幽霊の泣き叫ぶ声が背後に反響している。', [
                { text: '階下へ進み続ける', action: () => this.goToBasement() }
            ]);
        } else {
            this.game.showDialogue('階段室には腐敗臭が漂っており、あなたは長く留まりたくない。', [
                { text: '階下へ行き地下室へ', action: () => this.goToBasement() },
                { text: '廊下に戻る', action: () => this.returnToCorridor() }
            ]);
        }
    }

    // 美術教室シーン
    showArtRoomScene() {
        this.game.gameState.currentScene = 'artRoom';
        this.game.updateGameMap('artRoom');

        if (!this.ghostEncountered) {
            this.game.showDialogue('美術教室の絵は全てひっくり返されており、床には画笔と絵の具が散乱している。壁には未完成の肖像画があり、目の部分が空白になっている。', [
                { text: '肖像画を調べる', action: () => this.examinePainting() },
                { text: '教室を出る', action: () => this.returnToStaircase() }
            ]);
        } else {
            this.game.showDialogue('肖像画の目から赤い液体が流れ出し、幽霊の手がキャンバスから伸びてきた！', [
                { text: '素早く逃げる', action: () => this.escapeArtRoom() }
            ]);
        }
    }

    // 地下室シーン
    showBasementScene() {
        this.game.gameState.currentScene = 'basement';
        this.game.updateGameMap('basement');

        if (!this.keyFound) {
            this.game.showDialogue('地下室は薄暗く湿っており、隅には古い家具や雑物が積まれている。壁には錆びた鍵が掛かっている。', [
                { text: '鍵を取る', action: () => this.takeKey() },
                { text: '他の区域を探索する', action: () => this.exploreBasement() }
            ]);
        } else {
            this.game.showDialogue('あなたは奇妙な鍵を見つけた。それは何か重要な扉を開けられるようだ。', [
                { text: '階段室に戻る', action: () => this.returnToStaircase() }
            ]);
        }
    }

    // シーン遷移メソッド
    goToStaircase() {
        this.plotProgress = 1;
        this.loadScene('staircase');
    }

    returnToClassroom() {
        this.game.showDialogue('教室の扉は既に閉ざされており、中に入ることはできない。', [
            { text: '廊下に戻る', action: () => this.loadScene('corridor') }
        ]);
    }

    examineShadow() {
        this.game.showDialogue('影は突然はっきりし、制服を着た女の子の輪郭になった。彼女はゆっくりと顔を向け、あなたは彼女の目から血が流れ出ているのを見た。', [
            { text: '後退する', action: () => this.goToStaircase() },
            { text: '動かない', action: () => this.encounterGhost() }
        ]);
    }

    goUpstairs() {
        this.game.showDialogue('階上の扉は閉ざされており、通過できない。', [
            { text: '階下へ行く', action: () => this.goDownstairs() }
        ]);
    }

    goDownstairs() {
        this.plotProgress = 2;
        this.loadScene('artRoom');
    }

    examinePainting() {
        this.ghostEncountered = true;
        this.playSound('horror');
        this.game.showDialogue('あなたが肖像画に近づくと、突然絵の中の目から血が流れ出し、絵の中の女の子の口が微かに開き、耳障りな悲鳴を発した！', [
            { text: '教室から逃げる', action: () => this.escapeArtRoom() }
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
        this.showDeath('女の子の幽霊があなたに襲いかかった。あなたは骨の髓まで凍るような寒さを感じ、その後何もわからなくなった...');
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
        this.game.gameState.inventory.push('錆びた鍵');
        // インベントリ表示を更新
        this.game.updateInventoryDisplay();
        this.game.showDialogue('あなたは錆びた鍵を手に取った。それはとても古そうに見える。', [
            { text: '探索を続ける', action: () => this.exploreBasement() }
        ]);
    }

    exploreBasement() {
        if (this.keyFound) {
            if (!this.ghostEncountered) {
                this.game.showDialogue('背後から足音が聞こえ、制服を着た女の子が地下室の入口に現れた。彼女の目からは血が流れている。', [
                    { text: '逃げる', action: () => this.encounterGhost() },
                    { text: '鍵で対抗する', action: () => this.useKeyAgainstGhost() }
                ]);
            } else {
                this.game.showDialogue('あなたは地下室の奥に隠し扉を見つけた。その上には古い錠前がかかっている。あなたの鍵がちょうどそれを開けられる！', [
                    { text: '扉を開ける', action: () => this.openSecretDoor() }
                ]);
            }
        } else {
            this.game.showDialogue('地下室の奥から奇怪な音が聞こえる。近づかない方が良さそうだ。', [
                { text: '階段室に戻る', action: () => this.returnToStaircase() }
            ]);
        }
    }

    useKeyAgainstGhost() {
        this.ghostEncountered = true;
        this.playSound('ding');
        this.game.showDialogue('あなたは錆びた鍵を幽霊に向けて差し出した。鍵は微かな光を放ち、幽霊は数歩後退した。', [
            { text: '隠し扉を調べる', action: () => this.exploreBasement() }
        ]);
    }

    // 秘密の扉を開く
    openSecretDoor() {
        this.game.showDialogue('扉の向こうは下へ延びる石段で、壁からは湿った水滴が滲み出ている。地図にはこの区域は記されておらず、あなたは学校の記録にない深層構造へと足を踏み入れようとしている。', [
            { text: 'さらに下へ進む', action: () => this.loadScene('undergroundPassage') }
        ]);
    }

    // 共通エンディング区域
    reachFinalArea() {
        // ゲーム時間を更新
        this.updateGameTime('22:30');
        this.game.showDialogue('あなたは最後の扉を通り抜け、自分が巨大な地下空間にいることに気づいた。中央には光る祭壇があり、そこには地図と同じ記号が刻まれている。', [
            { text: '祭壇に近づく', action: () => this.approachFinalAltar() }
        ]);
    }

    approachFinalAltar() {
        // ゲーム時間をエンディング時間に更新
        this.updateGameTime('22:45');
        this.game.showDialogue('あなたが祭壇に近づくと、地面が震え始めた。祭壇の記号はまばゆい光を放ち、あなたは意識が次第に遠のいていくのを感じた...', [
            { text: '全てを受け入れる', action: () => this.completeChapter() }
        ]);
    }

    // 章を完了
    completeChapter() {
        // LongScreamオーディオを再生
        const longScream = document.getElementById('long-scream');
        if (longScream) {
            longScream.currentTime = 0;
            longScream.play().catch(error => {
                console.error('LongScreamオーディオ再生失敗:', error);
            });

            // 4秒後に再生を停止
            setTimeout(() => {
                if (!longScream.paused) {
                    longScream.pause();
                }
            }, 4000);
        }

        // リザルト画面を表示
        this.showResultScreen();
    }

    // タイプライター効果で死亡メッセージを表示
    showDeath(message) {
        // 進行中のタイピングアニメーションをクリア
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
            this.typingInterval = null;
        }

        // 死亡メッセージ要素を取得
        const deathMessageElement = this.game.elements.deathMessage;
        deathMessageElement.textContent = ''; // テキストをクリア

        // ゲーム画面を隠し、死亡画面を表示
        this.game.elements.gameScreen.classList.add('hidden');
        this.game.elements.deathScreen.classList.remove('hidden');

        let index = 0;
        const typeSpeed = 70; // タイピング速度、70ms/文字

        // タイピングアニメーションを開始
        this.typingInterval = setInterval(() => {
            if (index < message.length) {
                deathMessageElement.textContent += message.charAt(index);
                index++;
            } else {
                clearInterval(this.typingInterval);
                this.typingInterval = null;
                // 再開ボタンを表示
                setTimeout(() => {
                    this.game.elements.restartBtn.classList.remove('hidden');
                    this.game.elements.restartBtn.onclick = () => {
                        // ゲーム再開メソッドを呼び出す
                        this.game.returnToMainMenu();
                    };
                }, 500);
            }
        }, typeSpeed);
    }

    // ゲーム時間を更新（時間が進むのみを保証）
    updateGameTime(time) {
        // 現在時刻と新しい時刻を解析
        const currentTime = this.parseTime(this.game.gameState.gameTime || '21:30');
        const newTime = this.parseTime(time);

        // 新しい時刻が現在時刻より遅い場合のみ更新
        if (newTime > currentTime) {
            this.game.gameState.gameTime = time;
        }
    }

    // 時間文字列を分数に解析（比較用）
    parseTime(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    // リザルト画面
    showResultScreen() {
        // ゲーム画面を隠し、リザルト画面を表示
        this.game.elements.gameScreen.classList.add('hidden');
        this.game.elements.resultScreen.classList.remove('hidden');

        // 章の名前とクリア時間を表示
        const chapterName = '第一章-「初めての幽凄」';
        const gameTime = this.game.gameState.gameTime || '22:30'; // デフォルト値

        this.game.elements.resultChapter.textContent = chapterName;
        this.game.elements.resultTime.textContent = gameTime;

        // 次の章ボタンを表示
        const nextChapterBtn = this.game.elements.nextChapterBtn;
        nextChapterBtn.textContent = '第二章へ進む';
        nextChapterBtn.classList.remove('hidden');
        nextChapterBtn.onclick = () => this.game.goToNextChapter();

        // 第二章のアンロックを保証
        setTimeout(() => {
            this.game.unlockChapter('chapter2');
        }, 500);
    }

    // メインメニューに戻る
    returnToMainMenu() {
        // リザルト画面を隠す
        this.game.elements.resultScreen.classList.add('hidden');
        // 第二章のアンロックを保証
        this.game.unlockChapter('chapter2');
        // 章選択インターフェースを強制更新
        this.game.updateChapterAvailability();
        // 章選択画面を表示
        this.game.returnToChapterSelect();
    }
}

// Chapter1クラスをwindowオブジェクトにエクスポートし、メインゲームで使用可能にする
window.Chapter1 = Chapter1;