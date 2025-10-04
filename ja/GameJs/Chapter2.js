class Chapter2 {
    constructor(game) {
        this.game = game;
        this.plotProgress = 0;
        this.friendMet = false;
        this.friendName = '';
        this.friendGender = ''; // 友達の性別
        this.typingInterval = null;
        // 伏線関連の状態
        this.strangeSymbolFound = false;
        this.mysteriousKeyFound = false;
        this.ghostWhisperHeard = false;

        // サウンドエフェクト要素
        this.horrorDing = document.getElementById('horror-ding');
        this.horrorUp = document.getElementById('horror-up');
    }

    // サウンドを再生
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
            console.warn('サウンド再生に失敗しました:', e);
        }
    }

    // 友達の性別に基づいて正しい代名詞を取得
    getPronoun(type) {
        // 異常な性別かどうかをチェック
        const abnormalGenders = ['ウォルマートの買い物袋', '攻撃ヘリコプター'];
        if (abnormalGenders.includes(this.game.gameState.playerGender)) {
            return 'それ';
        }

        const isMale = this.friendGender === 'male';
        switch (type) {
            case 'subject': // 主格 (彼/彼女)
                return isMale ? '彼' : '彼女';
            case 'object': // 目的格 (彼/彼女)
                return isMale ? '彼' : '彼女';
            case 'possessive': // 所有格 (彼の/彼女の)
                return isMale ? '彼の' : '彼女の';
            case 'pronoun': // 代名詞 (彼/彼女)
                return isMale ? '彼' : '彼女';
            default:
                return isMale ? '彼' : '彼女';
        }
    }

    // タイプライター効果で会話を表示
    showDialogue(text, choices) {
        // ゲームオブジェクトのshowDialogueメソッドを直接使用
        this.game.showDialogue(text, choices);
    }

    // 第2章を開始
    start(startTime = null) {
        this.game.gameState.currentChapter = 'chapter2';
        // ゲーム時間を初期化
        if (startTime) {
            this.updateGameTime(startTime);
        } else {
            this.updateGameTime('22:00'); // デフォルト開始時間
        }
        this.game.updateGameMap('entrance');
        this.plotProgress = 0;
        this.loadScene('entrance');
    }

    // ゲーム時間を更新
    updateGameTime(time) {
        this.game.gameState.gameTime = time;
        this.game.elements.currentTimeDisplay.textContent = time;
    }

    // シーンを読み込み
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

    // 学校入口シーン
    showEntranceScene() {
        this.game.gameState.currentScene = 'entrance';
        this.game.updateGameMap('entrance');
        this.showDialogue('あなたは学校の正門に立っている。扉は半開きで、ドアノッカーには錆びた鍵がかかっている。隣の掲示板には黄色く変色した通知が貼られている：「メンテナンスのため、学校は21:00以降閉鎖されます」。今はもう22:00だ。', [
            { text: '学校に入る', action: () => this.enterSchool() },
            { text: '掲示板を確認', action: () => this.checkNoticeBoard() }
        ]);
    }

    enterSchool() {
        this.game.updateGameMap('quadrangle');
        this.showDialogue('あなたは校門を押し開ける。きしむ音が静かな夜に鋭く響く。月明かりの下、校庭には誰もおらず、風が落ち葉をさらさらと鳴らす音だけが聞こえる。', [
            { text: '寮区域へ向かう', action: () => this.loadScene('dormitory') },
            { text: '食堂へ向かう', action: () => this.loadScene('canteen') },
            { text: '入口に戻る', action: () => this.loadScene('entrance') }
        ]);
    }

    checkNoticeBoard() {
        this.showDialogue('掲示板には閉鎖通知の他に、一張の人物探索掲示が貼られている：「行方不明学生李明を探す、最後に確認された時刻：10月13日夜」。掲示の下には手書きの小さな文字が：「影を信じるな」。', [
            { text: '学校に入る', action: () => this.enterSchool() },
            { text: '写真に記録', action: () => this.takePhoto() }
        ]);
    }

    takePhoto() {
        // 自動的にプレイヤーに携帯電話を与える
        if (!this.game.gameState.inventory.includes('携帯電話')) {
            this.game.gameState.inventory.push('携帯電話');
            // インベントリ表示を更新
            this.game.updateInventoryDisplay();
        }
        this.showDialogue('あなたは携帯電話で掲示板の内容を撮影した。写真には、人物探索掲示の目があなたを見つめているように映っている。', [
            { text: '学校に入る', action: () => this.enterSchool() }
        ]);
    }

    // 寮シーン
    showDormitoryScene() {
        this.game.gameState.currentScene = 'dormitory';
        this.game.updateGameMap('dormitory');

        if (!this.friendMet) {
            // 異常な性別かどうかをチェック
            const abnormalGenders = ['ウォルマートの買い物袋', '攻撃ヘリコプター'];
            if (abnormalGenders.includes(this.game.gameState.playerGender)) {
                this.friendName = Math.random() < 0.5 ? 'ワンワン' : 'ニャンニャン';
                this.friendGender = 'abnormal';
            } else {
                const isMale = this.game.gameState.playerGender === 'male';
                this.friendGender = isMale ? 'male' : 'female';
                this.friendName = isMale ? '張偉' : '李娜';
            }
            this.friendMet = true;

            let friendDescription = abnormalGenders.includes(this.game.gameState.playerGender) ? '奇妙な人影' : (this.friendGender === 'male' ? '男子生徒' : '女子生徒');
            this.showDialogue(`寮区域は真っ暗で、一つの部屋だけが灯りを灯している。近づいてみると、ドアには鍵がかかっていない。中から聞き覚えのある声がする：「${this.game.gameState.playerName}？あなたですか？」\n${friendDescription}がベッドから起き上がった。あなたのクラスメート、${this.friendName}だ。`, [
                { text: 'どうしてここに？', action: () => this.askFriend() },
                { text: 'ここは危険だ、早く一緒に逃げよう！', action: () => this.urgeFriend() }
            ]);
        } else {
            this.showDialogue(`寮の中には誰もいない。${this.friendName}のベッドはきちんと整頓されているが、机の上には教科書が開かれたままで、持ち主が一時的に離れただけのようだ。`, [
                { text: '机を調べる', action: () => this.checkFriendDesk() },
                { text: '寮を出る', action: () => this.enterSchool() }
            ]);
        }
    }

    checkFriendDesk() {
        this.showDialogue(`あなたは机の前に歩み寄る。教科書は『心理学入門』のあるページで開かれている。そこには鉛筆で一部が丸で囲まれている：「恐怖は人類の最も原始的な感情の一つであり、最も操作されやすい感情でもある。」
机の上には一枚の付箋があり、走り書きされている：「彼らは私たちを監視している。誰も信じるな。」`, [
            { text: '付箋をしまう', action: () => this.takeNote() },
            { text: '寮を出る', action: () => this.enterSchool() }
        ]);
    }

    takeNote() {
        // 付箋をインベントリに追加
        if (!this.game.gameState.inventory.includes('付箋')) {
            this.game.gameState.inventory.push('付箋');
            // インベントリ表示を更新
            this.game.updateInventoryDisplay();
        }
        this.showDialogue('あなたは付箋をポケットにしまった。誰が書いたものかはわからないが、直感がこれは重要だと言っている。', [
            { text: '寮を出る', action: () => this.enterSchool() }
        ]);
    }

    askFriend() {
        this.showDialogue(`${this.friendName}は目をこすった：「私…私もわからない。夜の自習の後、道に迷ってしまったみたいで、いつの間にかここに来てた。ここはすごく変な感じがする。誰かに見られている気がしてならない。」
${this.getPronoun('subject')}は布団をめくり、足首にある赤く腫れた引っかき傷を見せた。`, [
            { text: 'その傷はどうしたの？', action: () => this.askAboutInjury() },
            { text: '一緒にここを離れよう', action: () => this.urgeFriend() }
        ]);
    }

    askAboutInjury() {
        this.showDialogue(`${this.friendName}はうつむいて足首を見た：「わからない…さっき廊下で、何かが私に触れた気がして、気づいたらこうなってた。釘に引っかかったのかも？」
${this.getPronoun('subject')}の声は次第に小さくなり、目には恐怖が満ちている。`, [
            { text: '早くここを離れないと', action: () => this.urgeFriend() },
            { text: '救急箱を探してあげる', action: () => this.searchFirstAidKit() }
        ]);
    }

    urgeFriend() {
        this.showDialogue(`${this.friendName}はうなずいた：「わ…わかった。カバンを持ってくる。」
${this.getPronoun('subject')}は急いで荷物をまとめ、無意識に写真を一枚落とした。写真には、廃墟の校舎の前で撮影した学生たちの集合写真が写っており、うち一人の顔が塗りつぶされている。`, [
            { text: '写真を拾う', action: () => this.pickUpPhoto() },
            { text: '友達を急かす', action: () => this.leaveDormitoryWithFriend() }
        ]);
    }

    searchFirstAidKit() {
        this.showDialogue('あなたは寮の引き出しで埃をかぶった救急箱を見つけた。開けると、期限切れの薬品と包帯が入っている。一番下には銅の鍵が押し込まれており、奇妙な記号が刻まれている。', [
            { text: '鍵を持っていく', action: () => this.takeMysteriousKey() },
            { text: '友達の手当てをする', action: () => this.bandageFriend() }
        ]);
    }

    takeMysteriousKey() {
        this.mysteriousKeyFound = true;
        // 神秘的な鍵をインベントリに追加（重複追加を避ける）
        if (!this.game.gameState.inventory.includes('神秘的な鍵')) {
            this.game.gameState.inventory.push('神秘的な鍵');
            // インベントリ表示を更新
            this.game.updateInventoryDisplay();
        }
        this.showDialogue('あなたは鍵をポケットに入れた。この鍵はとても古びて見え、記号は何かの暗号のようだ。', [
            { text: '友達の手当てをする', action: () => this.bandageFriend() }
        ]);
    }

    bandageFriend() {
        this.showDialogue(`あなたは包帯で${this.friendName}の足首を包帯で巻いた。${this.getPronoun('subject')}は痛みで顔をしかめたが、無理に笑みを浮かべた：「ありがとう。今、出発できる？」`, [
            { text: '寮を出る', action: () => this.leaveDormitoryWithFriend() }
        ]);
    }

    pickUpPhoto() {
        this.showDialogue(`あなたは写真を拾い上げた。塗りつぶされた顔は後からマーカーで塗ったように見え、縁は少しぼやけている。写真の裏には「奴らは皆死ぬべきだ」と書かれている。\n${this.friendName}は慌てて写真を取り返した：「こ…これは私のじゃない！こんなものがどうしてここにあるのかわからない！」`, [
            { text: `${this.getPronoun('object')}を信じる`, action: () => this.trustFriend() },
            { text: 'とことん問い詰める', action: () => this.questionFriend() }
        ]);
    }

    trustFriend() {
        this.showDialogue(`あなたは${this.friendName}の肩をポンと叩いた：「大丈夫、誰かの悪戯だろう。早く逃げよう。」\n${this.friendName}は感謝の眼差しでうなずき、あなたについて寮を出た。`, [
            { text: '食堂へ向かう', action: () => this.loadScene('canteen') },
            { text: '倉庫へ向かう', action: () => this.loadScene('storageRoom') }
        ]);
    }

    questionFriend() {
        this.showDialogue(`あなたは${this.friendName}の目をじっと見つめた：「これ、いったいどういうことなの？写真に写っているのは誰？」
${this.friendName}の表情が硬直した：「本当に知らないってば！私を信じないなら、一人で行く！」
${this.getPronoun('subject')}は怒ってドアをバタンと閉め、あなたを一人寮に残した。`, [
            { text: '追いかける', action: () => this.chaseFriend() },
            { text: '一人で探索する', action: () => this.enterSchool() }
        ]);
    }

    leaveDormitoryWithFriend() {
        this.game.updateGameMap('quadrangle');
        this.showDialogue(`${this.friendName}は突然足を止めた：「ちょっと待って…何か音が聞こえない？泣いているような…？」`, [
            { text: '泣き声の発生源へ向かう', action: () => this.followCryingSound() },
            { text: '急いで学校を離れる', action: () => this.tryEscapeSchool() }
        ]);
    }

    chaseFriend() {
        this.game.updateGameMap('quadrangle');
        this.showDialogue(`あなたは外に飛び出したが、${this.friendName}の姿はもうなかった。月明かりの下、地面にはあなた自身の影だけが映っている。\n冷たい風が吹き抜け、遠くからかすかな笑い声が聞こえてきた。`, [
            { text: '食堂へ向かう', action: () => this.loadScene('canteen') },
            { text: '倉庫へ向かう', action: () => this.loadScene('storageRoom') }
        ]);
    }

    followCryingSound() {
        this.game.updateGameMap('storageRoom');
        this.showDialogue('泣き声は倉庫の方から聞こえてくる。あなたたちは慎重に近づき、倉庫の扉は少し開いており、中から微かな光が漏れている。', [
            { text: '中に入って確認する', action: () => this.loadScene('storageRoom') },
            { text: '広場に戻る', action: () => this.enterSchool() }
        ]);
    }

    tryEscapeSchool() {
        this.showDialogue('あなたたちは校門まで走ったが、門は既に閉ざされていた。鍵には奇妙な記号が付いており、あなたが拾った鍵の記号と全く同じだ。', [
            { text: '鍵で開ける', action: () => this.useMysteriousKey() },
            { text: '他の出口を探す', action: () => this.enterSchool() }
        ]);
    }

    useMysteriousKey() {
        // 鍵の状態とインベントリを同時にチェックし、フォールトトレランスを高める
        const hasKey = this.mysteriousKeyFound || this.game.gameState.inventory.includes('神秘的な鍵') || this.game.gameState.inventory.includes('銅の鍵');

        if (hasKey) {
            this.showDialogue(`あなたは鍵を取り出し、鍵穴に差し込む。鍵と錠前は完璧に合致する。「カチッ」という音とともに、鍵が開いた。\n${this.friendName}は安堵の息をついた：「よかった！早く行こう！」`, [
                { text: '学校を離れる', action: () => this.escapeSchool() },
                { text: '探索を続ける', action: () => this.enterSchool() }
            ]);
        } else {
            this.showDialogue(`${this.friendName}は焦って言った：「どうしよう？ここに閉じ込められちゃったの？」`, [
                { text: '鍵を探す', action: () => this.searchForKey() },
                { text: '他の出口を探す', action: () => this.enterSchool() }
            ]);
        }
    }

    escapeSchool() {
        this.showDialogue(`あなたたちは校門を飛び出し、大通りまで走った。振り返ると、学校の中が突然赤い光に包まれ、その後、耳を裂くような悲鳴が聞こえた。
${this.friendName}はあなたの腕を強く握った：「私たち…何か間違ったことをしたのかな？」
あなたは${this.getPronoun('possessive')}瞳に、今まで見たことのない光がきらめいているのに気づいた。`, [
            { text: '続く...', action: () => this.showFriendAbductionScene() }
        ]);
    }

    showFriendAbductionScene() {
        this.playSound('horror');
        this.showDialogue(`あなたたちが去ろうとしたその時、${this.friendName}の瞳の光が突然さらに強く輝いた。
「待って…」${this.getPronoun('subject')}の声は震え始めた、「何か…何かおかしい気がする…」

不気味な霧が突然地面から湧き上がり、瞬く間に通り全体を包み込んだ。霧の中からは、地獄の底から来たような低いうなり声が聞こえる。

「助けて！」${this.friendName}は突然叫んだ。霧の中から巨大な黒い腕が伸び、異世界から来た悪魔の手のように、${this.getPronoun('object')}を掴んだ。

「やめて！${this.game.gameState.playerName}！助けて――」${this.friendName}の悲鳴が夜空を切り裂き、そして突然止んだ。

霧が晴れた。通りにはあなた一人だけが残されていた。友達は消え、地面にはあの写真が残され、塗りつぶされた顔があなたに向かって微笑んでいるように見えた。`, [
            { text: '第2章を終了', action: () => this.finishChapter() }
        ]);
    }

    searchForKey() {
        this.showDialogue(`${this.friendName}は突然言った：「寮に救急箱があったのを覚えてる。多分、中に鍵があるかも？」`, [
            { text: '寮に戻る', action: () => this.loadScene('dormitory') },
            { text: '他の場所を探す', action: () => this.enterSchool() }
        ]);
    }

    // 食堂シーン
    showCanteenScene() {
        this.game.gameState.currentScene = 'canteen';
        this.game.updateGameMap('canteen');
        this.showDialogue('食堂は散乱しており、机と椅子はひっくり返り、食べ物が床に散らばっている。壁の時計は21:45で止まっている。', [
            { text: '厨房を調べる', action: () => this.checkKitchen() },
            { text: '売店を調べる', action: () => this.checkCanteenStore() },
            { text: '食堂を出る', action: () => this.enterSchool() }
        ]);
    }

    checkKitchen() {
        this.showDialogue('厨房の蛇口からは水が滴り落ち、流しには死んだネズミが浮いている。壁にはメニューが貼られており、料理名が赤ペンで「人肉チャーシューパン」「眼球スープ」などの怖い名前に書き換えられている。', [
            { text: '冷蔵庫を調べる', action: () => this.checkFridge() },
            { text: '厨房を出る', action: () => this.showCanteenScene() }
        ]);
    }

    checkCanteenStore() {
        this.showDialogue('売店の棚は空っぽで、隅の棚に未開封のミネラルウォーターが一本置かれているだけだ。ボトルには一枚の付箋が貼られている：「ここの水は飲むな」。', [
            { text: 'ミネラルウォーターを取る', action: () => this.takeMineralWater() },
            { text: '売店を出る', action: () => this.showCanteenScene() }
        ]);
    }

    checkFridge() {
        this.showDialogue('冷蔵庫からは嫌な臭いがする。中にはカビの生えたパン数個と期限切れの牛乳が入っている。一番下には金属の箱が置かれており、鍵と同じ記号が刻まれている。', [
            { text: '箱を開けようとする', action: () => this.tryOpenBox() },
            { text: '冷蔵庫を閉じる', action: () => this.checkKitchen() }
        ]);
    }

    takeMineralWater() {
        // ミネラルウォーターをインベントリに追加（重複追加を避ける）
        if (!this.game.gameState.inventory.includes('ミネラルウォーター')) {
            this.game.gameState.inventory.push('ミネラルウォーター');
            // インベントリ表示を更新
            this.game.updateInventoryDisplay();
        }
        this.showDialogue('あなたはミネラルウォーターをカバンに入れた。付箋には飲むなと書いてあるが、万が一に備えて持っておくのは悪くない。', [
            { text: '売店を出る', action: () => this.showCanteenScene() }
        ]);
    }

    tryOpenBox() {
        if (this.mysteriousKeyFound) {
            this.showDialogue('あなたは鍵を使って箱を開ける。中には黄色く変色した日記のページが一枚入っている。そこにはこう書かれている：「10月13日、実験失敗。彼らは異常行動を示し始めた。全ての証拠を破棄しなければならない、実験体も含めて。」', [
                { text: '日記をしまう', action: () => this.takeDiaryPage() },
                { text: '厨房を出る', action: () => this.showCanteenScene() }
            ]);
        } else {
            this.showDialogue('箱は鍵がかかっている。開けるには鍵が必要だ。', [
                { text: '厨房を出る', action: () => this.showCanteenScene() }
            ]);
        }
    }

    takeDiaryPage() {
        // 日記の断片をインベントリに追加（重複追加を避ける）
        if (!this.game.gameState.inventory.includes('日記の断片')) {
            this.game.gameState.inventory.push('日記の断片');
            // インベントリ表示を更新
            this.game.updateInventoryDisplay();
        }
    }

    // タイプライター効果で死亡メッセージを表示
    showDeath(message) {
        this.playSound('horror');
        // 進行中のタイプアニメーションをクリア
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
            this.typingInterval = null;
        }

        // 死亡メッセージ要素を取得
        const deathMessageElement = this.game.elements.deathMessage;
        deathMessageElement.textContent = ''; // テキストを空にする

        // ゲーム画面を隠し、死亡画面を表示
        this.game.elements.gameScreen.classList.add('hidden');
        this.game.elements.deathScreen.classList.remove('hidden');

        let index = 0;
        const typeSpeed = 70; // タイピング速度、70ms/文字

        // タイプアニメーションを開始
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
                        // ゲームのリスタートメソッドを呼び出す
                        this.game.returnToMainMenu();
                    };
                }, 500);
            }
        }, typeSpeed);
    }
    takeDiaryPage() {
        // 日記の断片をインベントリに追加（重複追加を避ける）
        if (!this.game.gameState.inventory.includes('日記の断片')) {
            this.game.gameState.inventory.push('日記の断片');
            // インベントリ表示を更新
            this.game.updateInventoryDisplay();
        }
        this.showDialogue('あなたは日記のページをしまった。10月13日…これは掲示板の人物探索掲示の日付と同じだ。', [
            { text: '厨房を出る', action: () => this.showCanteenScene() }
        ]);
    }

    // 倉庫シーン
    showStorageRoomScene() {
        this.game.gameState.currentScene = 'storageRoom';
        this.game.updateGameMap('storageRoom');
        this.showDialogue('倉庫には古い机や椅子、様々な雑貨が積み上げられている。隅には鉄の檻があり、錆びた鍵がかかっている。檻の中では何かが動いているようだ。', [
            { text: '鉄の檻に近づく', action: () => this.approachCage() },
            { text: '雑貨を調べる', action: () => this.checkStorageItems() },
            { text: '倉庫を出る', action: () => this.enterSchool() }
        ]);
    }

    approachCage() {
        this.playSound('ding');
        this.showDialogue('あなたが鉄の檻に近づくと、中のものが突然悲鳴を上げた。月明かりを借りて、あなたはぼろぼろの服を着た人影が隅に縮こまっているのを見る。その目は緑色に光っている。\n「助…助けて…」それはしわがれた声を発した。', [
            { text: '檻を開けようとする', action: () => this.tryOpenCage() },
            { text: '後退する', action: () => this.showStorageRoomScene() }
        ]);
    }

    checkStorageItems() {
        // ハンマーをインベントリに追加（重複追加を避ける）
        if (!this.game.gameState.inventory.includes('ハンマー')) {
            this.game.gameState.inventory.push('ハンマー');
            // インベントリ表示を更新
            this.game.updateInventoryDisplay();
        }
        // 懐中電灯をインベントリに追加（重複追加を避ける）
        if (!this.game.gameState.inventory.includes('懐中電灯')) {
            this.game.gameState.inventory.push('懐中電灯');
            // インベントリ表示を更新
            this.game.updateInventoryDisplay();
        }
        this.showDialogue('あなたは雑貨の山を探し、錆びたハンマーと懐中電灯を見つけた。懐中電灯はまだ点くが、光は弱い。あなたはそれらを全てカバンに入れた。\n木箱の中では、古い地図を見つけた。学校の各区域が記されており、赤ペンで丸で囲まれた「立入禁止区域」も含まれている。', [
            { text: '地図を持っていく', action: () => this.takeStorageMap() },
            { text: 'さらに探す', action: () => this.searchMoreItems() }
        ]);
    }

    tryOpenCage() {
        if (this.game.gameState.inventory.includes('ハンマー')) {
            this.showDialogue('あなたはハンマーで錠前を壊し、鉄の檻の扉が「ギイイ」と音を立てて開いた。中の人影が突然あなたに飛びかかり、爪があなたの腕に深く食い込んだ。\n「やっと…自由だ…」それは耳障りな笑い声をあげ、暗闇の中に消えた。', [
                { text: '傷の手当てをする', action: () => this.treatWound() },
                { text: '倉庫を出る', action: () => this.enterSchool() }
            ]);
        } else {
            this.showDialogue('檻は鍵がかかっている。開けるには工具が必要だ。', [
                { text: '工具を探す', action: () => this.checkStorageItems() },
                { text: '倉庫を出る', action: () => this.enterSchool() }
            ]);
        }
    }

    takeStorageMap() {
        // 立入禁止区域の地図をインベントリに追加（重複追加を避ける）
        if (!this.game.gameState.inventory.includes('立入禁止区域の地図')) {
            this.game.gameState.inventory.push('立入禁止区域の地図');
            // インベントリ表示を更新
            this.game.updateInventoryDisplay();
        }
        this.showDialogue('あなたは地図をしまった。立入禁止区域…いったいどんな場所なんだろう？', [
            { text: 'さらに探す', action: () => this.searchMoreItems() },
            { text: '倉庫を出る', action: () => this.enterSchool() }
        ]);
    }

    searchMoreItems() {
        // バッジをインベントリに追加
        if (!this.game.gameState.inventory.includes('バッジ')) {
            this.game.gameState.inventory.push('バッジ');
            // インベントリ表示を更新
            this.game.updateInventoryDisplay();
        }
        this.playSound('horror');
        this.showDialogue('あなたはさらに探し続け、鉄の箱の中にバッジを見つけた。そこには鍵や箱と同じ記号が刻まれている。' +
            '突然、倉庫の灯りが数回点滅し、消えた。暗闇の中で、重い足音があなたに近づいてくる。', [
            { text: '懐中電灯で照らす', action: () => this.useFlashlight() },
            { text: '急いで去る', action: () => this.enterSchool() }
        ]);
    }

    useFlashlight() {
        if (this.game.gameState.inventory.includes('懐中電灯')) {
            this.playSound('ding');
            this.showDialogue('あなたは懐中電灯をつける。光線は警備員制服を着た人影を照らし出す。その顔は歪み、瞳には瞳孔がない。\n「動くな…」彼は機械的な声を発し、一歩一歩あなたに近づいてくる。', [
                { text: 'ハンマーで攻撃する', action: () => this.attackWithHammer() },
                { text: '向きを変えて逃げる', action: () => this.enterSchool() }
            ]);
        } else {
            this.showDialogue('あなたは懐中電灯を持っておらず、暗闇では物が見えない。足音がますます近づいてくる…', [
                { text: '暗闇の中で逃げる', action: () => this.enterSchool() }
            ]);
        }
    }

    attackWithHammer() {
        if (this.game.gameState.inventory.includes('ハンマー')) {
            this.playSound('ding');
            this.showDialogue('あなたはハンマーを振りかぶり警備員に叩きつけるが、ハンマーは彼の体をすり抜け、何のダメージも与えられない。\n「攻撃無効…」彼は迫り続け、両手であなたの首を絞める。', [
                { text: 'もがく', action: () => this.struggle() },
                { text: 'バッジを使う', action: () => this.useBadge() }
            ]);
        } else {
            this.showDialogue('あなたはハンマーを持っておらず、攻撃できない。', [
                { text: '向きを変えて逃げる', action: () => this.enterSchool() }
            ]);
        }
    }

    useBadge() {
        if (this.game.gameState.inventory.includes('バッジ')) {
            this.showDialogue('あなたはバッジを取り出す。バッジは突然強烈な光を放ち、警備員は悲鳴をあげ、一筋の黒い煙となって消えた。\n光が去った後、バッジの記号がよりはっきりしていることに気づく。', [
                { text: 'バッジをしまう', action: () => this.keepBadge() },
                { text: '倉庫を出る', action: () => this.enterSchool() }
            ]);
        } else {
            this.showDialogue('あなたはバッジを持っていない。', [
                { text: 'もがく', action: () => this.struggle() }
            ]);
        }
    }

    struggle() {
        this.showDialogue(`あなたは必死にもがくが、警備員の力は強すぎる。呼吸が苦しくなり、目の前が暗くなる…
その時、倉庫の扉が蹴破られ、${this.friendName}が飛び込んできた：「${this.getPronoun('object')}を離せ！」
警備員は${this.friendName}の方を見て、手を離し、黒い煙となって消えた。`, [
            { text: '友達に感謝する', action: () => this.thankFriend() },
            { text: '倉庫を出る', action: () => this.enterSchool() }
        ]);
    }

    keepBadge() {
        this.showDialogue('あなたはバッジをしまった。このバッジには特別な力があるようで、今後の冒険で役に立つかもしれない。', [
            { text: '倉庫を出る', action: () => this.enterSchool() }
        ]);
    }

    thankFriend() {
        this.showDialogue(`あなたは息を切らしながら言った：「ありがとう…さっきはもう少しで…」
${this.friendName}は首を振った：「もういい、早くここを離れよう。この場所はあまりにも不気味だ。」
あなたは${this.getPronoun('possessive')}手に、さっき寮で見たあの写真を持っているのに気づく。`, [
            { text: '写真について尋ねる', action: () => this.askAboutPhotoAgain() },
            { text: '倉庫を出る', action: () => this.enterSchool() }
        ]);
    }

    askAboutPhotoAgain() {
        this.showDialogue(`あなたは${this.friendName}の持っている写真を指さした：「どうしてこの写真を持っているの？」
${this.friendName}の顔色が変わった：「私…私、さっき廊下で拾ったの。風で飛ばされてきたのかも。」
${this.getPronoun('subject')}の目は泳ぎ、あなたを直視しようとしない。`, [
            { text: '追及を続ける', action: () => this.pressFriend() },
            { text: 'これ以上追及しない', action: () => this.enterSchool() }
        ]);
    }

    pressFriend() {
        this.showDialogue(`あなたは${this.friendName}の手首をつかんだ：「真実を教えて！この写真は一体どういうことなの？」
${this.friendName}はあなたの手を激しく振りほどいた：「もうたくさん！あなたは何様のつもり？私に干渉する権利なんてない！」
${this.getPronoun('subject')}は向きを変えて倉庫から走り去り、写真は地面に落ちた。あなたは写真を拾い上げると、塗りつぶされた顔の横に一行の小さな文字が追加されているのに気づく：「次はあなたの番」。`, [
            { text: '追いかける', action: () => this.chaseFriend() },
            { text: '一人で探索する', action: () => this.enterSchool() }
        ]);
    }

    treatWound() {
        if (this.game.gameState.inventory.includes('ミネラルウォーター') && this.game.gameState.inventory.includes('包帯')) {
            this.showDialogue('あなたはミネラルウォーターで傷口を洗い流し、包帯で巻いた。傷は深いが、血は流れておらず、代わりに黒い液体が滲み出ている。', [
                { text: '倉庫を出る', action: () => this.enterSchool() }
            ]);
        } else {
            this.showDialogue('あなたは傷を処理するのに十分なアイテムを持っていない。傷口がうずき始め、皮膚の下で何かが動いているように感じる。', [
                { text: '倉庫を出る', action: () => this.enterSchool() }
            ]);
        }
    }

    // リザルト画面を表示
    showResultScreen() {
        // ゲーム画面を隠し、リザルト画面を表示
        this.game.elements.gameScreen.classList.add('hidden');
        this.game.elements.resultScreen.classList.remove('hidden');

        // チャプター名とクリア時間を表示
        const chapterName = '第2章-「寮の幽霊」';
        const gameTime = this.game.gameState.gameTime || '22:30'; // デフォルト値

        this.game.elements.resultChapter.textContent = chapterName;
        this.game.elements.resultTime.textContent = gameTime;

        // 次の章ボタンを表示
        const nextChapterBtn = this.game.elements.nextChapterBtn;
        nextChapterBtn.textContent = '第3章へ進む';
        nextChapterBtn.classList.remove('hidden');
        nextChapterBtn.onclick = () => this.startChapter3();
    }

    // チャプターを完了
    finishChapter() {
        // LongScreamオーディオを再生
        const longScream = document.getElementById('long-scream');
        if (longScream) {
            longScream.currentTime = 0;
            longScream.play().catch(error => {
                console.error('LongScreamオーディオの再生に失敗しました:', error);
            });

            // 4秒後に再生を停止
            setTimeout(() => {
                if (!longScream.paused) {
                    longScream.pause();
                }
            }, 4000);
        }

        this.game.unlockChapter('chapter3');

        // リザルト画面を表示
        this.showResultScreen();
    }

    startChapter3() {
        if (window.Chapter3) {
            this.game.elements.gameScreen.classList.add('hidden');
            this.game.chapter3 = new Chapter3(this.game);
            this.game.chapter3.start('22:30');
        } else {
            this.showDialogue('第3章のコンテンツを読み込めません。Chapter3.jsが正しく読み込まれていることを確認してください。', [
                { text: 'チャプター選択に戻る', action: () => this.game.returnToChapterSelect() }
            ]);
        }
    }
}

// Chapter2クラスをwindowオブジェクトにエクスポートし、メインゲームで使用できるようにする
window.Chapter2 = Chapter2;