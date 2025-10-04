class SchoolHorrorGame {
    constructor() {
        // まずローカルストレージのキーを定義
        const unlockedChaptersKey = 'schoolHorrorGame_unlockedChapters';

        // 最初にアンロックされた章を読み込む
        const unlockedChapters = this.loadUnlockedChapters(unlockedChaptersKey);

        // ゲーム状態
        this.gameState = {
            // アンロックされた章を保存するためのローカルストレージキー
            unlockedChaptersKey: unlockedChaptersKey,
            playerName: '',
            playerGender: '',
            currentScene: 'start',
            currentChapter: '',
            gameTime: '21:00',
            plotProgress: 0,
            inventory: [],
            hasKey: false,
            hasSeenGhost: false,
            // アンロックされた章
            unlockedChapters: unlockedChapters
        };

        // カスタム章を常にアンロックしていたコードを削除、カスタム章はロックされたまま

        // 時間更新タイマー
        this.timeUpdateInterval = null;
        // タイプライター効果タイマー
        this.typingInterval = null;
        this.mainMenuTypingInterval = null;

        // DOM要素
        this.elements = {
            startScreen: document.getElementById('start-screen'),
            chapterSelectScreen: document.getElementById('chapter-select-screen'),
            gameScreen: document.getElementById('game-screen'),
            deathScreen: document.getElementById('death-screen'),
            resultScreen: document.getElementById('result-screen'),
            playerNameInput: document.getElementById('player-name'),
            maleOption: document.getElementById('male-option'),
            femaleOption: document.getElementById('female-option'),
            startButton: document.getElementById('start-game'),
            restartButton: document.getElementById('restart-game'),
            nextChapterBtn: document.getElementById('next-chapter-btn'),
            backToChapterSelectBtn: document.getElementById('back-to-chapter-select'),
            currentTimeDisplay: document.getElementById('current-time'),
            playerNameDisplay: document.getElementById('player-name-display'),
            playerGenderDisplay: document.getElementById('player-gender-display'),
            gameMap: document.getElementById('game-map'),
            gameActions: document.getElementById('game-actions'),
            dialogueText: document.getElementById('dialogue-text'),
            dialogueChoices: document.getElementById('dialogue-choices'),
            deathMessage: document.getElementById('death-message'),
            resultChapter: document.getElementById('result-chapter'),
            resultTime: document.getElementById('result-time'),
            backToMainBtn: document.getElementById('back-to-main')
        };

        // サウンドエフェクト要素
        this.horrorDing = document.getElementById('horror-ding');
        this.horrorUp = document.getElementById('horror-up');

        // リザルト画面ボタンイベントをバインド
        this.elements.nextChapterBtn.addEventListener('click', () => this.goToNextChapter());
        this.elements.backToChapterSelectBtn.addEventListener('click', () => this.returnToChapterSelect());
        // メインメニューに戻るボタンイベントをバインド
        this.elements.backToMainBtn.addEventListener('click', () => this.backToMainScreen());

        // イベントリスナーをバインド
        this.bindEvents();
    }

    // イベントリスナーをバインド
    bindEvents() {
        // 名前入力イベント
        this.elements.playerNameInput.addEventListener('input', () => {
            this.gameState.playerName = this.elements.playerNameInput.value.trim();
            this.checkStartConditions();
        });

        // 性別選択イベント
        this.elements.maleOption.addEventListener('click', () => {
            this.gameState.playerGender = 'male';
            this.elements.maleOption.classList.add('selected');
            this.elements.femaleOption.classList.remove('selected');
            this.clearSpecialGenderSelection();
            this.checkStartConditions();
        });

        this.elements.femaleOption.addEventListener('click', () => {
            this.gameState.playerGender = 'female';
            this.elements.femaleOption.classList.add('selected');
            this.elements.maleOption.classList.remove('selected');
            this.clearSpecialGenderSelection();
            this.checkStartConditions();
        });

        // その他の性別ボタンイベント
        const moreGenderBtn = document.getElementById('more-gender');
        const genderPopup = document.getElementById('gender-popup');
        const closeGenderPopup = document.getElementById('close-gender-popup');

        if (moreGenderBtn && genderPopup) {
            moreGenderBtn.addEventListener('click', () => {
                genderPopup.classList.remove('hidden');
            });

            closeGenderPopup.addEventListener('click', () => {
                genderPopup.classList.add('hidden');
            });

            // ポップアップ外をクリックで閉じる
            genderPopup.addEventListener('click', (e) => {
                if (e.target === genderPopup) {
                    genderPopup.classList.add('hidden');
                }
            });

            // 特殊な性別選択イベント
            document.querySelectorAll('.special-gender-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.gameState.playerGender = btn.dataset.gender;
                    this.elements.maleOption.classList.remove('selected');
                    this.elements.femaleOption.classList.remove('selected');
                    this.markSpecialGenderSelection(btn.dataset.gender);
                    genderPopup.classList.add('hidden');
                    this.checkStartConditions();
                });
            });
        }

        // ゲーム開始ボタン
        this.elements.startButton.addEventListener('click', () => {
            this.elements.startScreen.classList.add('hidden');
            this.elements.chapterSelectScreen.classList.remove('hidden');
            // 章の利用可能状態を更新
            this.updateChapterAvailability();
        });

        // 再開ボタン
        this.elements.restartButton.addEventListener('click', () => this.restartGame());

        // 章選択イベント
        document.querySelectorAll('.chapter-item').forEach(item => {
            item.addEventListener('click', () => {
                const chapter = item.dataset.chapter;
                if (chapter === 'custom') {
                    // カスタム章専用プロンプト
                    this.showMainMenuDialog('この機能はまだベータテスト中で、一時的に利用できません', [
                        { text: 'OK', action: () => { } },
                        { text: '了解', action: () => this.showCustomChapterInfo() }
                    ]);
                } else if (item.classList.contains('available')) {
                    this.startGame(chapter);
                } else {
                    this.showMainMenuDialog('このレベルはまだアンロックされていません', [
                        { text: 'OK', action: () => { } }
                    ]);
                }
            });
        });
    }

    // ゲーム開始条件をチェック
    checkStartConditions() {
        if (this.gameState.playerName && this.gameState.playerGender) {
            this.elements.startButton.disabled = false;
        } else {
            this.elements.startButton.disabled = true;
        }
    }

    // 特殊な性別選択状態をクリア
    clearSpecialGenderSelection() {
        document.querySelectorAll('.special-gender-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
    }

    // 特殊な性別選択をマーク
    markSpecialGenderSelection(gender) {
        document.querySelectorAll('.special-gender-btn').forEach(btn => {
            if (btn.dataset.gender === gender) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
    }

    // ゲーム開始
    startGame(chapter, startTime = null) {
        // 現在の章を設定
        this.gameState.currentChapter = chapter;

        // プレイヤー情報表示を更新
        this.elements.playerNameDisplay.textContent = this.gameState.playerName;
        let genderDisplay = '';
        switch (this.gameState.playerGender) {
            case 'male':
                genderDisplay = '男性';
                break;
            case 'female':
                genderDisplay = '女性';
                break;
            case '沃尔玛购物袋':
                genderDisplay = 'ウォルマートの買い物袋';
                break;
            case '武装直升机':
                genderDisplay = '攻撃ヘリコプター';
                break;
            default:
                genderDisplay = this.gameState.playerGender;
        }
        this.elements.playerGenderDisplay.textContent = genderDisplay;

        // 開始時間が提供された場合、ゲーム時間を更新
        if (startTime) {
            this.updateGameTime(startTime);
        } else {
            // それ以外はデフォルト時間にリセット
            this.updateGameTime('21:00');
        }

        // 画面を切り替え
        this.elements.chapterSelectScreen.classList.add('hidden');
        this.elements.gameScreen.classList.remove('hidden');

        // 自動時間更新を開始
        this.startAutoTimeUpdate();

        // インベントリ表示を更新
        this.updateInventoryDisplay();

        // 章に基づいて最初のシーンを初期化
        if (chapter === 'prologue') {
            // プロローグデフォルトで電話をインベントリに追加
            if (this.gameState && this.gameState.inventory && !this.gameState.inventory.includes('Phone')) {
                this.gameState.inventory.push('Phone');
                // インベントリ表示を更新
                this.updateInventoryDisplay();
            }
            this.loadScene('classroom');
        } else if (chapter === 'chapter1') {
            // Chapter1開始シーンを読み込み
            if (window.Chapter1) {
                this.chapter1 = new Chapter1(this);
                this.chapter1.start();
            } else {
                this.showDialogue('チャプター1のコンテンツを読み込めません。Chapter1.jsが正しく読み込まれていることを確認してください。', [
                    { text: '章選択に戻る', action: () => this.returnToChapterSelect() }
                ]);
            }
        } else if (chapter === 'chapter2') {
            // Chapter2開始シーンを読み込み
            if (window.Chapter2) {
                this.chapter2 = new Chapter2(this);
                this.chapter2.start();
            } else {
                this.showDialogue('チャプター2のコンテンツを読み込めません。Chapter2.jsが正しく読み込まれていることを確認してください。', [
                    { text: '章選択に戻る', action: () => this.returnToChapterSelect() }
                ]);
            }
        } else if (chapter === 'chapter3') {
            // Chapter3開始シーンを読み込み
            if (window.Chapter3) {
                this.chapter3 = new Chapter3(this);
                this.chapter3.start();
            } else {
                this.showDialogue('チャプター3のコンテンツを読み込めません。Chapter3.jsが正しく読み込まれていることを確認してください。', [
                    { text: '章選択に戻る', action: () => this.returnToChapterSelect() }
                ]);
            }
        } else if (chapter === 'chapter4') {
            // Chapter4開始シーンを読み込み
            if (window.Chapter4) {
                this.chapter4 = new Chapter4(this);
                this.chapter4.start();
            } else {
                this.showDialogue('チャプター4のコンテンツを読み込めません。Chapter4.jsが正しく読み込まれていることを確認してください。', [
                    { text: '章選択に戻る', action: () => this.returnToChapterSelect() }
                ]);
            }

        } else if (chapter === 'custom') {
            // カスタム章を読み込み
            if (window.CustomChapter) {
                this.customChapter = new CustomChapter(this);
                this.customChapter.start();
            } else {
                this.showDialogue('カスタム章のコンテンツを読み込めません。CustomChapter.jsが正しく読み込まれていることを確認してください。', [
                    { text: '章選択に戻る', action: () => this.returnToChapterSelect() }
                ]);
            }
        }
    }

    // 章をアンロック
    unlockChapter(chapter) {
        if (!this.gameState.unlockedChapters.includes(chapter)) {
            this.gameState.unlockedChapters.push(chapter);
            // ローカルストレージに保存
            this.saveUnlockedChapters();
            // 章選択インターフェースを更新
            this.updateChapterAvailability();
            console.log('アンロックされた章:', chapter);
            console.log('現在のアンロックされた章リスト:', this.gameState.unlockedChapters);
        }
    }

    // 章の利用可能性を更新
    updateChapterAvailability() {
        document.querySelectorAll('.chapter-item').forEach(item => {
            const chapter = item.dataset.chapter;
            if (this.gameState.unlockedChapters.includes(chapter)) {
                item.classList.remove('locked');
                item.classList.add('available');
                const lockIcon = item.querySelector('.lock-icon');
                const chapterDesc = item.querySelector('p'); // <p>タグを説明要素として選択
                if (lockIcon) {
                    lockIcon.remove(); // ロックアイコンを完全に削除
                }
                if (chapterDesc) {
                    if (chapter === 'chapter1') {
                        chapterDesc.textContent = '学校の謎の事件を探索し、隠された秘密を明らかにする。錆びた鍵を見つけ、鏡の中の幽霊に直面し、キャンパスの背後にある真実を暴く。';
                    } else if (chapter === 'chapter2') {
                        chapterDesc.textContent = '最初の友人に出会い、学校の秘密についてさらに発見する。寮エリアを探索し、幽霊の謎を解く。';
                    } else if (chapter === 'chapter3') {
                        chapterDesc.textContent = '学校の究極の秘密を暴き、真実に直面する。地下研究所に深く入り込み、暗い儀式を止める。';
                    } else if (chapter === 'chapter4') {
                        chapterDesc.textContent = '学校から脱出した後も、呪いはあなたを追いかける。呪いを解く方法を探し、過去の影に直面する。';

                    }
                }
            }
        });
    }

    // シーンを読み込み
    loadScene(sceneName) {
        this.clearDialogue();

        switch (sceneName) {
            case 'classroom':
                this.showClassroomScene();
                break;
            case 'corridor':
                this.showCorridorScene();
                break;
            case 'library':
                this.showLibraryScene();
                break;
            case 'bathroom':
                this.showBathroomScene();
                break;
            case 'principalOffice':
                this.showPrincipalOfficeScene();
                break;
            default:
                this.showClassroomScene();
        }
    }

    // 教室シーンを表示
    showClassroomScene() {
        this.gameState.currentScene = 'classroom';
        this.updateGameMap('classroom');

        if (this.gameState.plotProgress === 0) {
            this.showDialogue(`夜の自習のベルはとっくに鳴りました、${this.gameState.playerName}、なぜまだ教室にいるのですか？`, [
                { text: '鞄をまとめて帰る', action: () => this.leaveClassroom() },
                { text: 'もう少し復習する', action: () => this.stayInClassroom() }
            ]);
        } else {
            this.showDialogue('教室は空っぽで、あなたの机だけが元の場所に残っています。', [
                { text: '教室を出る', action: () => this.goToCorridor() }
            ]);
        }
    }

    // 廊下シーンを表示
    showCorridorScene() {
        this.gameState.currentScene = 'corridor';
        this.updateGameMap('corridor');

        this.showDialogue('廊下の灯りが点滅し、後ろから足音が聞こえる...', [
            { text: '振り返って確認する', action: () => this.checkFootsteps() },
            { text: '前進し続ける', action: () => this.continueCorridor() }
        ]);
    }

    // 図書館シーンを表示
    showLibraryScene() {
        this.gameState.currentScene = 'library';
        this.updateGameMap('library');

        this.showDialogue('図書館は古い本のカビ臭い匂いで満ちており、棚の上の本が微かに揺れているようです。', [
            { text: '本棚を確認する', action: () => this.checkBookshelf() },
            { text: '図書館を出る', action: () => this.goToCorridor() }
        ]);
    }

    // トイレシーンを表示
    showBathroomScene() {
        this.gameState.currentScene = 'bathroom';
        this.updateGameMap('bathroom');

        this.showDialogue('トイレの鏡には「HELP」という文字が赤い液体で書かれています。', [
            { text: '鏡に近づく', action: () => this.approachMirror() },
            { text: 'トイレから逃げる', action: () => this.goToCorridor() }
        ]);
    }

    // 校長室シーンを表示
    showPrincipalOfficeScene() {
        this.gameState.currentScene = 'principalOffice';
        this.updateGameMap('principalOffice');

        if (this.gameState.hasKey) {
            this.showDialogue('鍵を使って校長室のドアを開けました、中は真っ暗です。', [
                { text: '明かりをつける', action: () => this.turnOnLight() },
                { text: '暗闇の中で探す', action: () => this.searchInDark() }
            ]);
        } else {
            this.showDialogue('校長室のドアはロックされています、入るには鍵を見つける必要があります。', [
                { text: '廊下に戻る', action: () => this.goToCorridor() }
            ]);
        }
    }

    // ゲームマップ表示を更新
    updateGameMap(location) {
        const locations = {
            classroom: '🏫 あなたの教室',
            corridor: '🚪 学校の廊下',
            library: '📚 図書館',
            bathroom: '🚻 トイレ',
            principalOffice: '🔑 校長室',
            staircase: '🔺 階段',
            artRoom: '🎨 美術室',
            basement: '🔻 地下室',
            deepCorridor: '🚶‍♂️ 薄暗い廊下',
            exit: '🚪 通用口',
            undergroundPassage: '🔦 地下通路',
            ironDoorArea: '🔐 鉄のドアエリア',
            slimeExit: '💧 スライム出口',
            stoneDoorChamber: '🏛️ 石のドアの間',
            redPlayground: '🔴 赤い校庭',
            undergroundAbyss: '🕳️ 地下の深淵',
            hiddenCatacombs: '⚰️ 隠された地下墓地',
            innerSanctum: '🔮 内陣',
            flowerField: '🌺 花畑空間',
            upperFloor: '🔼 上階',
            upperFloorCorridor: '🔄 上の階の廊下',
            principalsOffice: '👨‍💼 校長室',
            creatureLair: '🐉 クリーチャーの巣窟',
            lotusDimension: '🪷 蓮の次元',
            entrance: '🚪 学校の入口',
            quadrangle: '🏫 キャンパス広場',
            dormitory: '🏠 寮区域',
            canteen: '🍽️ 食堂',
            storageRoom: '🔒 倉庫',
            schoolGate: '🚪 学校の門',
            foyer: '🏫 校舎ロビー',
            abandonedWing: '🏚️ 廃校舎',
            labyrinth: '🌀 地下迷宮',
            altarRoom: '🩸 祭壇の間'
        };

        this.elements.gameMap.innerHTML = `<div class="location-name">${locations[location] || '未知の場所'}</div>
<div class="pixel-map">${this.generatePixelMap(location)}</div>`;

        // インベントリ表示を更新
        this.updateInventoryDisplay();
    }

    // インベントリ表示を更新
    updateInventoryDisplay() {
        const inventoryElement = document.getElementById('inventory-items');
        if (!inventoryElement) return;

        inventoryElement.innerHTML = '';

        if (this.gameState.inventory.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'inventory-empty';
            emptyMessage.textContent = 'インベントリは空です';
            inventoryElement.appendChild(emptyMessage);
            return;
        }

        // アイテム説明のマッピング
        const itemDescriptions = {
            'Phone': 'あなたのスマートフォン、満タンで、照明や時間確認に使用できます。',
            'Silver Glowing Key': '銀色に輝く鍵、「校長室」と刻まれています。',
            'Notebook': '古いノート、生徒の日記といくつかの奇妙な記号が記録されています。',
            'Flashlight': '暗闇で照らすことができる道具、バッテリー残量は不明。',
            'Herb': 'かすかな香りを放つ神秘的なハーブ、特別な効果があるかもしれません。',
            'Water Fear Note': '教室で見つけたメモ、そこには：「それは騒音を嫌い、水で一時的に追い払うことができる」と書かれています。',
            'Mirror Reflection Note': '校長室の引き出しで見つけた黄色くなったメモ、そこには：「鏡の反射を信じてはいけない」と書かれています。',
            'Basement Map': '手描きの地図、学校の地下構造と地下室への安全な経路が詳細に記されています。',
            'Rusty Key': 'チャプター1で手に入れた錆びた鉄の鍵、幽霊を退散させ隠しドアを開けるのに使用できます。',
            'Library Key': '「図書館」と刻まれた普通の鍵。',
            'Mysterious Key': '神秘的な記号が刻まれた青銅の鍵、学校の歴史に関連しているようです。',
            'Diary Fragment': '生徒の日記の断片、10月13日の異常な事件が記録されています。',
            'Hammer': '錆びた鉄のハンマー、柄はぼろ布で巻かれ、まだ使用痕が見られます。',
            'Restricted Area Map': '黄色くなった地図、神秘的な区域がマークされ、神秘的な注釈が付いています。',
            'Badge': '銀色の学校のバッジ、縁には鍵と同じ記号が刻まれています。',
            'Mineral Water': '未開封のミネラルウォーター、ボトルにはコンビニのラベルが貼られています。',
            'Gauze': '医療用の滅菌ガーゼ、包装は少し傷んでいます。',
            'Note': '神秘的な情報が書かれたメモ用紙。',
            'Ritual Dagger': '儀式に使用される短剣、刃は冷たくきらめいています。',
            'Ancient Scroll': '学校の歴史を記録した古代の巻物、文字は少し褪せています。',
            'Water Artifact': '水の力を内包した青い宝石、神秘的な記号が刻まれています。',
            'Life Artifact': '生命の力を内包した緑の宝石、神秘的な記号が刻まれています。',
            'Fire Artifact': '火の力を内包した赤い宝石、神秘的な記号が刻まれています。',
        };

        this.gameState.inventory.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'inventory-item';
            itemElement.title = itemDescriptions[item] || '未知のアイテム';

            // 異なるアイテムに異なるアイコンを選択
            let icon = '🎒'; // デフォルトのバックパックアイコン
            if (item === 'Phone') icon = '📱';
            else if (item === 'Rusty Key' || item === 'Silver Glowing Key' || item === 'Library Key' || item === 'Mysterious Key') icon = '🔑';
            else if (item === 'Notebook') icon = '📓';
            else if (item === 'Flashlight') icon = '🔦';
            else if (item === 'Herb') icon = '🌿';
            else if (item === 'Water Fear Note' || item === 'Mirror Reflection Note' || item === 'Diary Fragment' || item === 'Note' || item === 'Ancient Scroll') icon = '📜';
            else if (item === 'Basement Map' || item === 'Restricted Area Map') icon = '🗺️';
            else if (item === 'Hammer') icon = '🔨';
            else if (item === 'Badge') icon = '🛡️';
            else if (item === 'Mineral Water') icon = '💧';
            else if (item === 'Gauze') icon = '🩹';
            else if (item === 'Ritual Dagger') icon = '🗡️';
            else if (item === 'Water Artifact') icon = '💎🔵';
            else if (item === 'Life Artifact') icon = '💎🟢';
            else if (item === 'Fire Artifact') icon = '💎🔴';
            else if (item === 'Dark Artifact') icon = '⚫💎';
            else if (item === 'Engraved Ring') icon = '💍';

            itemElement.innerHTML = `
                <div class="inventory-item-icon">${icon}</div>
                <div class="inventory-item-name">${item}</div>
            `;

            inventoryElement.appendChild(itemElement);
        });
    }

    // アイテムを使用
    useItem(item) {
        // ここにアイテム使用ロジックを追加
        // 例えば、電話の場合、電話の内容を表示
        if (item === 'Phone') {
            // 現在の章に電話関連の機能があるかチェック
            if (this.gameState.currentChapter === 'chapter3' && window.Chapter3 && this.chapter3) {
                this.chapter3.checkPhone();
            } else {
                this.showDialogue('電話を確認しましたが、新しいメッセージは受信していません。', [
                    { text: '続ける', action: () => this.clearDialogue() }
                ]);
            }
        } else {
            this.showDialogue(`${item}を使用しましたが、何も起こりませんでした。`, [
                { text: '続ける', action: () => this.clearDialogue() }
            ]);
        }
    }

    // ピクセルスタイルのマップを生成
    generatePixelMap(location) {
        // チャプター3のシーンのピクセルマップを追加
        if (location === 'schoolGate') {
            return `■■■■■■■■■■
■   ■■■   ■
■  ■   ■  ■
■   ■■■   ■
■■■■■■■■■■`;
        } else if (location === 'foyer') {
            return `■■■■■■■■■■
■  ■     ■ ■
■  ■  ■  ■ ■
■  ■     ■ ■
■■■■■■■■■■`;
        } else if (location === 'abandonedWing') {
            return `■■■■■■■■■■
■ ▒▒▒ ▒▒▒ ■
■         ■
■ ▒▒▒ ▒▒▒ ■
■■■■■■■■■■`;
        } else if (location === 'labyrinth') {
            return `■■■■■■■■■■
■ ■ ■ ■ ■ ■
■■■■■■■■■■
■ ■ ■ ■ ■ ■
■■■■■■■■■■`;
        } else if (location === 'altarRoom') {
            return `■■■■■■■■■■
■         ■
■   ■■■   ■
■  ■   ■  ■
■■■■■■■■■■`;
        }

        switch (location) {
            case 'classroom':
                return '■■■■■■■■■■\n■         ■\n■   T     ■\n■         ■\n■   C     ■\n■         ■\n■■■■■■■■■■';
            case 'corridor':
                return '■■■■■■■■■■■■■■\n■               ■\n■   D   D   D   ■\n■               ■\n■■■■■■■■■■■■■■';
            case 'library':
                return '■■■■■■■■■■\n■BBBBBBBBB■\n■B       B■\n■BBBBBBBBB■\n■B       B■\n■BBBBBBBBB■\n■■■■■■■■■■';
            case 'bathroom':
                return '■■■■■■\n■   S   ■\n■       ■\n■   M   ■\n■■■■■■';
            case 'principalOffice':
                return '■■■■■■■■\n■   D    ■\n■        ■\n■   F    ■\n■■■■■■■■';
            case 'staircase':
                return '■■■■■\n■  ▲  ■\n■  ▲  ■\n■  ▲  ■\n■  ▼  ■\n■  ▼  ■\n■  ▼  ■\n■■■■■';
            case 'artRoom':
                return '■■■■■■■■■■\n■ P     P ■\n■         ■\n■   E     ■\n■         ■\n■ P     P ■\n■■■■■■■■■■';
            case 'basement':
                return '■■■■■■■■■■\n■   D     ■\n■         ■\n■   S     ■\n■         ■\n■   C     ■\n■■■■■■■■■■';
            case 'deepCorridor':
                return '■■■■■■■■■■■■■■■■\n■                 ■\n■                 ■\n■                 ■\n■                 ■\n■   D             ■\n■■■■■■■■■■■■■■■■';
            case 'exit':
                return '■■■■■■■■■\n■   O     ■\n■         ■\n■■■■■■■■■';
            case 'undergroundPassage':
                return '■■■■■■■■■■■\n■           ■\n■   ▒▒▒▒▒   ■\n■   ▒   ▒   ■\n■   ▒▒▒▒▒   ■\n■           ■\n■■■■■■■■■■■';
            case 'ironDoorArea':
                return '■■■■■■■■■■\n■   █     ■\n■         ■\n■   ▒     ■\n■         ■\n■   █     ■\n■■■■■■■■■■';
            case 'slimeExit':
                return '■■■■■■■■■\n■   ~     ■\n■  ~~     ■\n■   ~     ■\n■■■■■■■■■';
            case 'stoneDoorChamber':
                return '■■■■■■■■■\n■         ■\n■   ▒▒▒   ■\n■   ▒@▒   ■\n■   ▒▒▒   ■\n■         ■\n■■■■■■■■■';
            case 'redPlayground':
                return '■■■■■■■■■■■■■■\n■               ■\n■   ▲           ■\n■               ■\n■■■■■■■■■■■■■■';
            case 'undergroundAbyss':
                return '■■■■■■■■■■\n■           ■\n■           ■\n■   ▓▓▓     ■\n■           ■\n■           ■\n■■■■■■■■■■';
            case 'hiddenCatacombs':
                return '■■■■■■■■■\n■ ☠ ☠ ☠ ■\n■         ■\n■ ☠ ☠ ☠ ■\n■         ■\n■ ☠ ☠ ☠ ■\n■■■■■■■■■';
            case 'innerSanctum':
                return '■■■■■■■■■\n■   ▒     ■\n■  ▒▒▒    ■\n■   ▒     ■\n■  ▒@▒    ■\n■   ▒     ■\n■■■■■■■■■';
            case 'flowerField':
                return '■■■■■■■■■\n■ ⚘ ⚘ ⚘ ■\n■ ⚘ ⚘ ⚘ ■\n■ ⚘ ⚘ ⚘ ■\n■ ⚘ ⚘ ⚘ ■\n■ ⚘ ⚘ ⚘ ■\n■■■■■■■■■';
            case 'upperFloor':
                return '■■■■■■■■■■■■■■\n■               ■\n■   ▒   ▒   ▒   ■\n■               ■\n■■■■■■■■■■■■■■';
            case 'upperFloorCorridor':
                return '■■■■■■■■■■■■■■\n■ ▓ ▓ ▓ ▓ ▓ ▓ ■\n■               ■\n■ ▓ ▓ ▓ ▓ ▓ ▓ ■\n■■■■■■■■■■■■■■';
            case 'principalsOffice':
                return '■■■■■■■■\n■   D    ■\n■  ▓▓▓   ■\n■   F    ■\n■■■■■■■■';
            case 'creatureLair':
                return '■■■■■■■■■\n■         ■\n■   ▓     ■\n■  ▓▓▓    ■\n■   ▓     ■\n■         ■\n■■■■■■■■■';
            case 'lotusDimension':
                return '■■■■■■■■■\n■   ⚘     ■\n■  ⚘⚘⚘    ■\n■   ⚘     ■\n■  ⚘⚘⚘    ■\n■   ⚘     ■\n■■■■■■■■■';
            case 'entrance':
                return '■■■■■■■■■■\n■          ■\n■  ■■■_■■■ ■\n■          ■\n■■■■■■■■■■';
            case 'quadrangle':
                return '■■■■■■■■■■■■■■\n■                ■\n■  ■■■■■■■■■■■■ ■\n■                ■\n■■■■■■■■■■■■■■';
            case 'dormitory':
                return '■■■■■■■■■■\n■ ■■ ■■ ■■ ■\n■ ■■ ■■ ■■ ■\n■ ■■ ■■ ■■ ■\n■■■■■■■■■■';
            case 'canteen':
                return '■■■■■■■■■■\n■ ■■■■■■■■ ■\n■ ■■■■■■■■ ■\n■ ■■■■■■■■ ■\n■■■■■■■■■■';
            case 'storageRoom':
                return '■■■■■■■■■■\n■ ■■■■■■■■ ■\n■ ■■■■■■■■ ■\n■ ■■■■■■■■ ■\n■■■■■■■■■■';
            default:
                return '■■■■■■■■\n■   ?    ■\n■        ■\n■■■■■■■■';
        }
    }

    // メインメニューダイアログ関数
    showMainMenuDialog(text, choices) {
        // オーバーレイを作成
        const overlay = document.createElement('div');
        overlay.className = 'dialog-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        overlay.style.zIndex = '999';
        document.body.appendChild(overlay);

        // ダイアログコンテナを作成
        const dialogContainer = document.createElement('div');
        dialogContainer.className = 'main-menu-dialog';
        dialogContainer.style.position = 'fixed';
        dialogContainer.style.top = '50%';
        dialogContainer.style.left = '50%';
        dialogContainer.style.transform = 'translate(-50%, -50%)';
        dialogContainer.style.width = '400px';
        dialogContainer.style.backgroundColor = '#2a2a2a';
        dialogContainer.style.border = '2px solid #ff4d4d';
        dialogContainer.style.borderRadius = '8px';
        dialogContainer.style.padding = '1.5rem';
        dialogContainer.style.zIndex = '1000';
        dialogContainer.style.boxShadow = '0 0 20px rgba(0, 0, 0, 0.8)';

        // テキストエリアを作成
        const textElement = document.createElement('div');
        textElement.className = 'main-menu-dialog-text';
        textElement.style.color = '#ddd';
        textElement.style.marginBottom = '1.5rem';
        textElement.style.minHeight = '60px';
        textElement.style.fontFamily = 'mplus_hzk_12, monospace';

        // 選択肢エリアを作成
        const choicesElement = document.createElement('div');
        choicesElement.className = 'main-menu-dialog-choices';
        choicesElement.style.display = 'flex';
        choicesElement.style.flexWrap = 'wrap';
        choicesElement.style.gap = '0.5rem';

        // コンテナに追加
        dialogContainer.appendChild(textElement);
        dialogContainer.appendChild(choicesElement);

        // ドキュメントに追加
        document.body.appendChild(dialogContainer);

        // タイプライター効果
        let index = 0;
        const typeSpeed = 70; // タイピング速度、1文字あたりのミリ秒

        // 進行中のタイピングアニメーションをクリア
        if (this.mainMenuTypingInterval) {
            clearInterval(this.mainMenuTypingInterval);
        }

        // タイピングアニメーションを開始
        this.mainMenuTypingInterval = setInterval(() => {
            if (index < text.length) {
                textElement.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(this.mainMenuTypingInterval);
                // タイピング完了後に選択肢を表示
                choices.forEach(choice => {
                    const button = document.createElement('button');
                    button.className = 'choice-btn';
                    button.textContent = choice.text;
                    button.style.padding = '0.5rem 1rem';
                    button.style.backgroundColor = '#333';
                    button.style.border = '1px solid #555';
                    button.style.color = '#fff';
                    button.style.cursor = 'pointer';
                    button.style.fontSize = '0.9rem';
                    button.style.fontFamily = 'mplus_hzk_12, monospace';

                    button.addEventListener('click', () => {
                        choice.action();
                        // ダイアログとオーバーレイを削除
                        document.body.removeChild(dialogContainer);
                        document.body.removeChild(overlay);
                    });

                    choicesElement.appendChild(button);
                });
            }
        }, typeSpeed);
    }

    // タイプライター効果で会話を表示
    showDialogue(text, choices) {
        this.elements.dialogueText.textContent = '';
        this.elements.dialogueChoices.innerHTML = '';

        let index = 0;
        const typeSpeed = 70; // タイピング速度、1文字あたりのミリ秒（会話より少し遅め）

        // 進行中のタイピングアニメーションをクリア
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
        }

        // タイピングアニメーションを開始
        this.typingInterval = setInterval(() => {
            if (index < text.length) {
                this.elements.dialogueText.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(this.typingInterval);
                // タイピング完了後に選択肢を表示
                choices.forEach(choice => {
                    const button = document.createElement('button');
                    button.className = 'choice-btn';
                    button.textContent = choice.text;
                    button.addEventListener('click', choice.action);
                    this.elements.dialogueChoices.appendChild(button);
                });
            }
        }, typeSpeed);
    }

    // 会話をクリア
    clearDialogue() {
        // 進行中のタイピングアニメーションをクリア
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
            this.typingInterval = null;
        }
        this.elements.dialogueText.textContent = '';
        this.elements.dialogueChoices.innerHTML = '';
    }

    // ゲームメソッドとプロット分岐
    leaveClassroom() {
        this.gameState.plotProgress = 1;
        this.showDialogue('教室のドアに着いたとき、それがロックされていることに気づきました！どう押しても引いても開きません。', [
            { text: '窓を確認する', action: () => this.checkWindow() },
            { text: '鍵を探す', action: () => this.searchForKey() }
        ]);
    }

    stayInClassroom() {
        this.gameState.plotProgress = 2;
        this.updateGameTime('21:15');
        this.showDialogue('時間が一分一分過ぎていき、突然、教室の明かりがすべて消えた！', [
            { text: '電話を取り出して明かりにする', action: () => this.usePhoneLight() },
            { text: '机の下に隠れる', action: () => this.hideUnderDesk() }
        ]);
    }

    goToCorridor() {
        // 時間が前進するのみであることを確認、固定時間は設定しない
        this.loadScene('corridor');
    }

    approachGirl() {
        this.gameState.hasSeenGhost = true;
        this.updateGameTime('21:45');
        this.showDeath('彼女に近づくと、彼女はゆっくりと頭を振り向けた―それは顔のない顔だった！あなたは叫び声を上げて倒れた...');
    }

    fastLeaveCorridor() {
        this.updateGameTime('21:40');
        this.showDialogue('あなたは廊下を素早く走り抜け、何かが後ろから追いかけてくるのを感じた。', [
            { text: '図書館に隠れる', action: () => this.goToLibrary() },
            { text: 'トイレに突入する', action: () => this.goToBathroom() }
        ]);
    }

    checkFootsteps() {
        this.gameState.hasSeenGhost = true;
        this.updateGameTime('21:45');
        this.showDeath('振り返ると、足のない人が空中に浮かんでいるのが見え、青白い手をあなたに向けて伸ばしてきた...');
    }

    continueCorridor() {
        this.updateGameTime('21:40');
        this.showDialogue('あなたは歩調を速め、廊下の終わりには入れる3つのドアがあった。', [
            { text: '図書館', action: () => this.goToLibrary() },
            { text: 'トイレ', action: () => this.goToBathroom() },
            { text: '校長室', action: () => this.goToPrincipalOffice() }
        ]);
    }

    checkBookshelf() {
        if (!this.gameState.hasKey) {
            this.gameState.hasKey = true;
            this.showDialogue('本棚の後ろで銀色に輝く鍵を見つけた！', [
                { text: '鍵を拾う', action: () => this.takeKey() },
                { text: 'そのままにする', action: () => this.leaveKey() }
            ]);
        } else {
            this.showDialogue('棚の上の本が突然すべて落ちて、あなたは本の山の下に埋もれてしまった！', [
                { text: 'もがいて脱出する', action: () => this.escapeBookpile() }
            ]);
        }
    }

    approachMirror() {
        this.gameState.hasSeenGhost = true;
        this.updateGameTime('21:50');
        this.showDeath('鏡を見たとき、あなたの反射が不気味な笑みを浮かべ、それからゆっくりと鏡から這い出してきた...');
    }

    turnOnLight() {
        this.updateGameTime('22:00');
        this.showDialogue('明かりがつき、机の上に日記があるのが見えた。', [
            { text: '日記を読む', action: () => this.readDiary() },
            { text: '引き出しを確認する', action: () => this.checkDrawer() }
        ]);
    }

    searchInDark() {
        this.gameState.hasSeenGhost = true;
        this.updateGameTime('22:00');
        this.showDeath('あなたの手が何か冷たいものに触れ、それから耳元で声がささやくのを聞いた：「これを探しているの？」');
    }

    readDiary() {
        this.updateGameTime('22:10');
        this.showDialogue('日記には生徒の体験が記録されており、彼は3年前の今日この学校で消えた...', [
            { text: '読み続ける', action: () => this.continueReading() },
            { text: '日記を閉じる', action: () => this.closeDiary() }
        ]);
    }

    // サウンドを再生するメソッド
    playSound(soundName) {
        try {
            if (soundName === 'ding' && this.horrorDing) {
                this.horrorDing.currentTime = 0;
                this.horrorDing.play().catch(e => console.log('サウンドエフェクトの再生に失敗しました:', e));
            } else if (soundName === 'horror' && this.horrorUp) {
                this.horrorUp.currentTime = 0;
                this.horrorUp.play().catch(e => console.log('サウンドエフェクトの再生に失敗しました:', e));
            }
        } catch (error) {
            console.log('サウンドエフェクトの再生エラー:', error);
        }
    }

    // タイプライター効果で死亡メッセージを表示
    showDeath(message) {
        // 死亡サウンドエフェクトを再生
        this.playSound('horror');

        this.elements.gameScreen.classList.add('hidden');
        this.elements.deathScreen.classList.remove('hidden');
        this.elements.deathMessage.textContent = '';

        let index = 0;
        const typeSpeed = 70; // タイピング速度、1文字あたりのミリ秒（会話より少し遅め）

        // 進行中のタイピングアニメーションをクリア
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
        }

        // タイピングアニメーションを開始
        this.typingInterval = setInterval(() => {
            if (index < message.length) {
                this.elements.deathMessage.textContent += message.charAt(index);
                index++;
            } else {
                clearInterval(this.typingInterval);
            }
        }, typeSpeed);
    }

    // 章を完了
    // リザルト画面を表示
    showResultScreen() {
        this.elements.gameScreen.classList.add('hidden');
        this.elements.resultScreen.classList.remove('hidden');

        // 章名と完了時間を表示
        let chapterName = '';
        if (this.gameState.currentChapter === 'prologue') {
            chapterName = 'プロローグ-「夜の自習後」';
            // 次の章ボタンを表示
            this.elements.nextChapterBtn.classList.remove('hidden');
        } else if (this.gameState.currentChapter === 'chapter1') {
            chapterName = 'チャプター1-「最初の出会い」';
            // 次の章ボタンを表示
            this.elements.nextChapterBtn.classList.remove('hidden');
        } else if (this.gameState.currentChapter === 'chapter2') {
            chapterName = 'チャプター2-「怪異の領域へ深く」';
            // 次の章ボタンを表示
            this.elements.nextChapterBtn.classList.remove('hidden');
        } else if (this.gameState.currentChapter === 'chapter3') {
            chapterName = 'チャプター3-「運命の終わり」';
            // 次の章ボタンを表示
            this.elements.nextChapterBtn.classList.remove('hidden');
        } else if (this.gameState.currentChapter === 'chapter4') {
            chapterName = 'チャプター4-「闇の淵」';
            // 次の章ボタンを表示
            this.elements.nextChapterBtn.classList.remove('hidden');
        } else if (this.gameState.currentChapter === 'chapter4') {
            chapterName = 'チャプター4-「最終章：闇の淵」';
            // これが最終章なので、次の章ボタンを非表示
            this.elements.nextChapterBtn.classList.add('hidden');
            // 章選択に戻るボタンを表示
            this.elements.backToChapterSelectBtn.classList.remove('hidden');
        }

        this.elements.resultChapter.textContent = chapterName;
        this.elements.resultTime.textContent = this.gameState.gameTime;
    }

    // 次の章に進む
    goToNextChapter() {
        // リザルトページを非表示
        this.elements.resultScreen.classList.add('hidden');

        if (this.gameState.currentChapter === 'prologue') {
            // プロローグ終了時間を保存
            const endTime = this.gameState.gameTime;
            // 時間をチャプター1に渡す
            this.startGame('chapter1', endTime);
        } else if (this.gameState.currentChapter === 'chapter1') {
            // 時間をチャプター2に渡す
            const endTime = this.gameState.gameTime;
            this.startGame('chapter2', endTime);
        } else if (this.gameState.currentChapter === 'chapter2') {
            // 時間をチャプター3に渡す
            const endTime = this.gameState.gameTime;
            this.startGame('chapter3', endTime);
        } else if (this.gameState.currentChapter === 'chapter3') {
            // 時間をチャプター4に渡す
            const endTime = this.gameState.gameTime;
            this.startGame('chapter4', endTime);
        } else if (this.gameState.currentChapter === 'chapter4') {
            // チャプター4は最終章、章選択に戻る
            this.showChapterSelect();
        }
    }

    // 章を完了
    completeChapter() {
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

        if (this.gameState.currentChapter === 'prologue') {
            // チャプター1をアンロック
            this.unlockChapter('chapter1');
        } else if (this.gameState.currentChapter === 'chapter1') {
            // チャプター2をアンロック
            this.unlockChapter('chapter2');
        } else if (this.gameState.currentChapter === 'chapter2') {
            // チャプター3をアンロック
            this.unlockChapter('chapter3');
        } else if (this.gameState.currentChapter === 'chapter3') {
            // チャプター4をアンロック
            this.unlockChapter('chapter4');
        } else if (this.gameState.currentChapter === 'chapter4') {
            // チャプター4は最終章、新しい章はアンロックしない
            console.log('最終章を完了');
        }

        // リザルト画面を表示
        this.showResultScreen();
    }

    // 章選択に戻る
    returnToChapterSelect() {
        // 時間更新タイマーをクリア
        if (this.timeUpdateInterval) {
            clearInterval(this.timeUpdateInterval);
            this.timeUpdateInterval = null;
        }
        this.elements.gameScreen.classList.add('hidden');
        this.elements.deathScreen.classList.add('hidden');
        this.elements.resultScreen.classList.add('hidden');
        this.elements.chapterSelectScreen.classList.remove('hidden');
    }

    // 重複するrestartGameメソッド定義を削除
    // 以下のバージョンを保持、統一されたunlockedChaptersKeyを使用


    // アンロックされた章を読み込み
    loadUnlockedChapters(unlockedChaptersKey) {
        try {
            const saved = localStorage.getItem(unlockedChaptersKey);
            return saved ? JSON.parse(saved) : ['prologue'];
        } catch (e) {
            console.error('アンロックされた章の読み込みに失敗しました:', e);
            return ['prologue'];
        }
    }

    // アンロックされた章を保存
    saveUnlockedChapters() {
        try {
            localStorage.setItem(
                this.gameState.unlockedChaptersKey,
                JSON.stringify(this.gameState.unlockedChapters)
            );
        } catch (e) {
            console.error('アンロックされた章の保存に失敗しました:', e);
        }
    }

    // ゲームを再開
    restartGame() {
        // 時間更新タイマーをクリア
        if (this.timeUpdateInterval) {
            clearInterval(this.timeUpdateInterval);
            this.timeUpdateInterval = null;
        }

        // ゲーム状態をリセット、ただしアンロックされた章は保持
        const unlockedChapters = this.gameState.unlockedChapters;
        this.gameState = {
            playerName: this.gameState.playerName,
            playerGender: this.gameState.playerGender,
            currentScene: 'start',
            currentChapter: '',
            gameTime: '21:00',
            plotProgress: 0,
            inventory: [],
            hasKey: false,
            hasSeenGhost: false,
            unlockedChapters: unlockedChapters,
            unlockedChaptersKey: 'schoolHorrorGame_unlockedChapters'
        };

        // インターフェースをリセット
        this.elements.deathScreen.classList.add('hidden');
        this.elements.startScreen.classList.remove('hidden');
        this.elements.playerNameInput.value = this.gameState.playerName;
        if (this.gameState.playerGender === 'male') {
            this.elements.maleOption.classList.add('selected');
        } else {
            this.elements.femaleOption.classList.add('selected');
        }
        this.checkStartConditions();
    }

    // ゲーム時間を更新（時間が前進するのみであることを確認）
    updateGameTime(time) {
        // 現在時間と新しい時間を解析
        const currentTime = this.parseTime(this.gameState.gameTime);
        const newTime = this.parseTime(time);

        // 新しい時間が現在時間より後の場合のみ更新
        if (newTime > currentTime) {
            this.gameState.gameTime = time;
            this.elements.currentTimeDisplay.textContent = time;
        }
    }

    // 時間文字列を分に解析（比較用）
    parseTime(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    // 自動時間更新を開始（30秒ごとに更新）
    startAutoTimeUpdate() {
        // 既存のタイマーをクリア
        if (this.timeUpdateInterval) {
            clearInterval(this.timeUpdateInterval);
        }

        // 新しいタイマーを設定（30秒ごとに更新）
        this.timeUpdateInterval = setInterval(() => {
            // 現在時間を解析
            const [hours, minutes] = this.gameState.gameTime.split(':').map(Number);

            // 1分追加
            let newMinutes = minutes + 1;
            let newHours = hours;

            // 時間の繰り上げ処理
            if (newMinutes >= 60) {
                newMinutes = 0;
                newHours += 1;
            }

            // 24時間形式の処理
            if (newHours >= 24) {
                newHours = 0;
            }

            // 新しい時間をフォーマット
            const newTime = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;

            // ゲーム時間を更新
            this.updateGameTime(newTime);
        }, 30000); // 30秒
    }

    // その他のプロットメソッド...
    checkWindow() { this.showDeath('窓には鉄の棒が嵌められており、近づくと冷たい手が柵を通して伸びてきてあなたを掴んだ！'); }
    searchForKey() {
        this.showDialogue('先生の机の引き出しで錆びた鍵を見つけた！', [
            {
                text: '鍵を拾う',
                action: () => {
                    if (this.gameState?.inventory) {
                        if (!this.gameState.inventory.includes('Silver Glowing Key')) {
                            this.gameState.inventory.push('Silver Glowing Key');

                            // インベントリの内容を表示
                            this.showDialogue(
                                `銀色に輝く鍵をインベントリに追加しました。現在のインベントリ: ${this.gameState.inventory.join(', ')}`,
                                [{
                                    text: 'ドアを開けようとする',
                                    action: () => { this.tryDoorKey(); }
                                }]
                            );
                        } else {
                            this.showDialogue('銀色に輝く鍵はすでにインベントリに存在します。', [{
                                text: 'ドアを開けようとする',
                                action: () => { this.tryDoorKey(); }
                            }]);
                        }
                    } else {
                        this.showDialogue('アイテムを追加できません、インベントリが存在しません。', [{
                            text: 'ドアを開けようとする',
                            action: () => { this.tryDoorKey(); }
                        }]);
                    }
                }
            }
        ]);
    }
    usePhoneLight() { this.showDialogue('電話の画面が光り、先生の机の上にメモがあるのが見えた。', [{ text: 'メモを拾う', action: () => this.takeNote() }]); }
    hideUnderDesk() { this.showDeath('机が激しく揺れ始め、その後全体があなたの上に崩れ落ちた...'); }
    goToLibrary() { this.loadScene('library'); }
    goToBathroom() { this.loadScene('bathroom'); }
    goToPrincipalOffice() { this.loadScene('principalOffice'); }
    takeKey() {
        this.showDialogue('銀色に輝く鍵を見つけた！', [
            {
                text: 'バックパックに入れる',
                action: () => {
                    if (this.gameState && this.gameState.inventory) {
                        if (!this.gameState.inventory.includes('Silver Glowing Key')) {
                            this.gameState.inventory.push('Silver Glowing Key');
                            // インベントリの内容を表示
                            this.showDialogue(
                                `銀色に輝く鍵をインベントリに追加しました。現在のインベントリ: ${this.gameState.inventory.join(', ')}`
                            );
                            // 緊急の足音と時間制限付きQTEを追加
                            setTimeout(() => {
                                this.startKeyQTE();
                            }, 1000);
                        } else {
                            this.showDialogue('銀色に輝く鍵はすでにインベントリに存在します。', [{
                                text: '図書館を出る',
                                action: () => { this.goToCorridor(); }
                            }]);
                        }
                    } else {
                        this.showDialogue('アイテムを追加できません、インベントリが存在しません。', [{
                            text: '図書館を出る',
                            action: () => { this.goToCorridor(); }
                        }]);
                    }
                }
            }
        ]);
    }

    // 新しい時間制限付きQTEメソッド
    startKeyQTE() {
        this.showDialogue('突然、後ろから緊急の足音が聞こえる！何かが急速に近づいているようだ！', []);

        // QTEボタンを作成
        const qteContainer = document.createElement('div');
        qteContainer.id = 'key-qte-container';
        qteContainer.className = 'qte-container';

        const qteText = document.createElement('p');
        qteText.className = 'qte-text';
        qteText.textContent = '素早く鍵アイコンをクリックして校長室のドアを開けよう！';
        qteContainer.appendChild(qteText);

        const qteButton = document.createElement('button');
        qteButton.id = 'key-qte-button';
        qteButton.className = 'big-button';
        qteButton.textContent = '🔑 クイッククリック';
        qteContainer.appendChild(qteButton);

        const timerBar = document.createElement('div');
        timerBar.className = 'timer-bar';
        timerBar.style.width = '100%';
        qteContainer.appendChild(timerBar);

        // ゲームインターフェースに追加
        this.elements.gameActions.appendChild(qteContainer);

        // QTEパラメータ
        let clickCount = 0;
        const requiredClicks = 15;
        const timeLimit = 5000; // 5秒
        const startTime = Date.now();

        // タイマーを更新
        const updateTimer = () => {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, timeLimit - elapsedTime);
            const percentage = (remainingTime / timeLimit) * 100;
            timerBar.style.width = `${percentage}%`;

            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                this.elements.gameActions.removeChild(qteContainer);
                this.showDeath('足音がどんどん近づいている...時間内にドアを開けるのに失敗し、暗闇の中の何かに捕まってしまった！');
            }
        };

        const timerInterval = setInterval(updateTimer, 50);
        updateTimer();

        // ボタンクリックイベント
        qteButton.addEventListener('click', () => {
            clickCount++;
            qteText.textContent = `${clickCount}/${requiredClicks}回クリック`;

            if (clickCount >= requiredClicks) {
                clearInterval(timerInterval);
                this.elements.gameActions.removeChild(qteContainer);
                this.showDialogue('鍵がついに回った！ドアが少し開き、あなたは素早く中に滑り込みドアを閉めた。', [{
                    text: '校長室に入る',
                    action: () => { this.goToPrincipalOffice(); }
                }]);
            }
        });
    }
    leaveKey() { this.showDeath('鍵を取らないことにした、すると本棚が突然崩れ落ち、あなたはその下敷きになってしまった...'); }
    escapeBookpile() { this.showDialogue('本の山からもがいて脱出し、何かがあなたを見つめているのを感じた。', [{ text: '図書館を出る', action: () => this.goToCorridor() }]); }
    tryDoorKey() { this.showDialogue('鍵は鍵穴に入ったが、回らなかった。すると後ろから足音が聞こえてきた...', [{ text: '振り返って見る', action: () => this.seeWhoIsThere() }, { text: '開けようとし続ける', action: () => this.keepTryingKey() }]); }
    takeNote() {
        this.showDialogue('メモにはこう書かれている：「それは騒音を嫌い、水で一時的に追い払うことができる」', [
            {
                text: 'メモを保持する',
                action: () => {
                    // window.gameの代わりにthisを直接使用
                    if (this.gameState && this.gameState.inventory) {
                        if (!this.gameState.inventory.includes('Water Fear Note')) {
                            this.gameState.inventory.push('Water Fear Note');
                            // インベントリの内容を表示
                            this.showDialogue(
                                `水を恐れるメモをインベントリに追加しました。現在のインベントリ: ${this.gameState.inventory.join(', ')}`,
                                [{
                                    text: '続ける',
                                    action: () => { this.goToCorridor(); }
                                }]
                            );
                        } else {
                            this.showDialogue('水を恐れるメモはすでにインベントリに存在します。', [{
                                text: '続ける',
                                action: () => { this.goToCorridor(); }
                            }]);
                        }
                    } else {
                        this.showDialogue('アイテムを追加できません、インベントリが存在しません。', [{
                            text: '続ける',
                            action: () => { this.goToCorridor(); }
                        }]);
                    }
                }
            }
        ]);
    }
    seeWhoIsThere() { this.showDeath('後ろに立っていたのは制服を着た生徒で、彼の顔はゆっくりと溶けていた...'); }

    checkDrawer() {
        if (this.gameState && this.gameState.inventory) {
            const noteItem = 'Mirror Reflection Note';
            if (!this.gameState.inventory.includes(noteItem)) {
                this.gameState.inventory.push(noteItem);
                this.showDialogue(
                    `引き出しを開けると、中には黄色くなったメモがあった：「鏡の反射を信じてはいけない」。${noteItem}をインベントリに追加しました。現在のインベントリ: ${this.gameState.inventory.join(', ')}`,
                    [{
                        text: '引き出しを閉じる',
                        action: () => { this.goToCorridor(); }
                    }]
                );
            } else {
                this.showDialogue('引き出しを開けると、中には黄色くなったメモがあった：「鏡の反射を信じてはいけない」。あなたはすでにこのメモを持っています。', [{
                    text: '引き出しを閉じる',
                    action: () => { this.goToCorridor(); }
                }]);
            }
        } else {
            this.showDialogue('引き出しを開けると、中には黄色くなったメモがあった：「鏡の反射を信じてはいけない」', [{
                text: '引き出しを閉じる',
                action: () => { this.goToCorridor(); }
            }]);
        }
    }
    keepTryingKey() { this.showDeath('鍵穴が突然回ったが、ドアが開いた瞬間、黒い霧が押し寄せてあなたを飲み込んだ...'); }
    continueReading() { this.showDialogue('日記の最後のページにはこう書かれている：「それは交代を探している、特にこの日に学校に残る人を...」', [{ text: '出口を探す', action: () => this.findExit() }]); }
    closeDiary() { this.showDialogue('日記を閉じ、学校を出る方法を見つけることにした。', [{ text: 'オフィスを出る', action: () => this.goToCorridor() }]); }
    findExit() { this.showDialogue('日記の手がかりを辿り、学校の通用口を見つけた！', [{ text: 'ドアを開けようとする', action: () => this.trySideDoor() }]); }
    trySideDoor() { this.showDialogue('ドアはロックされていなかった！押し開けると、外の通りではなく、薄暗い廊下で、壁には地下室への標識があった。', [{ text: '廊下に入る', action: () => this.enterDeepCorridor() }]); }
    enterDeepCorridor() {
        if (this.gameState && this.gameState.inventory) {
            if (!this.gameState.inventory.includes('Basement Map')) {
                this.gameState.inventory.push('Basement Map');
                // インベントリの内容を表示
                this.showDialogue(
                    `地下室の地図を見つけ、インベントリに追加しました。現在のインベントリ: ${this.gameState.inventory.join(', ')}`,
                    [{
                        text: '地図に従って探索する',
                        action: () => { this.gameClear(); }
                    }]
                );
            } else {
                this.showDialogue('あなたはすでに地下室の地図を持っています。廊下の終わりの壁には黄色くなった地図が貼られており、学校の地下構造がマークされていた。', [{
                    text: '地図に従って探索する',
                    action: () => { this.gameClear(); }
                }]);
            }
        } else {
            this.showDialogue('廊下の終わりの壁には黄色くなった地図が貼られており、学校の地下構造がマークされていた。あなたは学校の未知の領域に深く入り込んでいることに気づいた。', [{
                text: '地図に従って探索する',
                action: () => { this.gameClear(); }
            }]);
        }
    }
    gameClear() { this.completeChapter(); }

    // メイン画面に戻る
    backToMainScreen() {
        // 章選択インターフェースを非表示
        this.elements.chapterSelectScreen.classList.add('hidden');
        // メインインターフェースを表示
        this.elements.startScreen.classList.remove('hidden');
        // 章選択関連の状態をリセット
        this.gameState.selectedChapter = null;
    }

    // カスタム章の紹介情報を表示
    showCustomChapterInfo() {
        // 画像コンテナを作成
        const infoContainer = document.createElement('div');
        infoContainer.id = 'custom-chapter-info';
        infoContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            cursor: pointer;
        `;

        // ヒントテキストを作成
        const hintText = document.createElement('div');
        hintText.textContent = '画像を閉じるにはどこかをクリック';
        hintText.style.cssText = `
            color: white;
            font-size: 18px;
            margin-bottom: 20px;
            text-align: center;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        `;

        // 画像要素を作成
        const infoImage = document.createElement('img');
        infoImage.src = 'assets/img/介绍.png';
        infoImage.style.cssText = `
            max-width: 90%;
            max-height: 80%;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        `;

        // コンテナに追加
        infoContainer.appendChild(hintText);
        infoContainer.appendChild(infoImage);
        document.body.appendChild(infoContainer);

        // どこかをクリックして閉じる
        infoContainer.addEventListener('click', () => {
            if (infoContainer.parentNode) {
                infoContainer.parentNode.removeChild(infoContainer);
            }
        });
    }
}

// ゲーム初期化
window.addEventListener('DOMContentLoaded', () => {
    const game = new SchoolHorrorGame();
});