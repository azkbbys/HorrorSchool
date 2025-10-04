class SchoolHorrorGame {
    constructor() {
        // 先定义本地存储键
        const unlockedChaptersKey = 'schoolHorrorGame_unlockedChapters';

        // 先加载已解锁章节
        const unlockedChapters = this.loadUnlockedChapters(unlockedChaptersKey);

        // 游戏状态
        this.gameState = {
            // 存储已解锁章节的本地存储键
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
            // 已解锁章节
            unlockedChapters: unlockedChapters
        };

        // 移除了自制章节始终解锁的代码，现在自制章节将保持未解锁状态

        // 时间更新定时器
        this.timeUpdateInterval = null;
        // 打字机效果定时器
        this.typingInterval = null;
        this.mainMenuTypingInterval = null;

        // DOM元素
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

        // 音效元素
        this.horrorDing = document.getElementById('horror-ding');
        this.horrorUp = document.getElementById('horror-up');

        // 绑定结算画面按钮事件
        this.elements.nextChapterBtn.addEventListener('click', () => this.goToNextChapter());
        this.elements.backToChapterSelectBtn.addEventListener('click', () => this.returnToChapterSelect());
        // 绑定返回主界面按钮事件
        this.elements.backToMainBtn.addEventListener('click', () => this.backToMainScreen());

        // 绑定事件监听
        this.bindEvents();
    }

    // 绑定事件监听
    bindEvents() {
        // 名字输入事件
        this.elements.playerNameInput.addEventListener('input', () => {
            this.gameState.playerName = this.elements.playerNameInput.value.trim();
            this.checkStartConditions();
        });

        // 性别选择事件
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

        // 更多性别按钮事件
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

            // 点击弹窗外部关闭
            genderPopup.addEventListener('click', (e) => {
                if (e.target === genderPopup) {
                    genderPopup.classList.add('hidden');
                }
            });

            // 特殊性别选择事件
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

        // 开始游戏按钮
        this.elements.startButton.addEventListener('click', () => {
            this.elements.startScreen.classList.add('hidden');
            this.elements.chapterSelectScreen.classList.remove('hidden');
            // 更新章节可用性状态
            this.updateChapterAvailability();
        });

        // 重新开始按钮
        this.elements.restartButton.addEventListener('click', () => this.restartGame());

        // 章节选择事件
        document.querySelectorAll('.chapter-item').forEach(item => {
            item.addEventListener('click', () => {
                const chapter = item.dataset.chapter;
                if (chapter === 'custom') {
                    // 自制章节特定提示
                    this.showMainMenuDialog('该功能还在内测中，暂不可用', [
                        { text: '确定', action: () => { } },
                        { text: '了解', action: () => this.showCustomChapterInfo() }
                    ]);
                } else if (item.classList.contains('available')) {
                    this.startGame(chapter);
                } else {
                    this.showMainMenuDialog('你还没有解锁该关卡', [
                        { text: '确定', action: () => { } }
                    ]);
                }
            });
        });
    }

    // 检查开始游戏条件
    checkStartConditions() {
        if (this.gameState.playerName && this.gameState.playerGender) {
            this.elements.startButton.disabled = false;
        } else {
            this.elements.startButton.disabled = true;
        }
    }

    // 清除特殊性别选择状态
    clearSpecialGenderSelection() {
        document.querySelectorAll('.special-gender-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
    }

    // 标记特殊性别选择
    markSpecialGenderSelection(gender) {
        document.querySelectorAll('.special-gender-btn').forEach(btn => {
            if (btn.dataset.gender === gender) {
                btn.classList.add('selected');
            } else {
                btn.classList.remove('selected');
            }
        });
    }

    // 开始游戏
    startGame(chapter, startTime = null) {
        // 设置当前章节
        this.gameState.currentChapter = chapter;

        // 更新玩家信息显示
        this.elements.playerNameDisplay.textContent = this.gameState.playerName;
        let genderDisplay = '';
        switch (this.gameState.playerGender) {
            case 'male':
                genderDisplay = '男';
                break;
            case 'female':
                genderDisplay = '女';
                break;
            case '沃尔玛购物袋':
                genderDisplay = '沃尔玛购物袋';
                break;
            case '武装直升机':
                genderDisplay = '武装直升机';
                break;
            default:
                genderDisplay = this.gameState.playerGender;
        }
        this.elements.playerGenderDisplay.textContent = genderDisplay;

        // 如果提供了起始时间，则更新游戏时间
        if (startTime) {
            this.updateGameTime(startTime);
        } else {
            // 否则重置为默认时间
            this.updateGameTime('21:00');
        }

        // 切换屏幕
        this.elements.chapterSelectScreen.classList.add('hidden');
        this.elements.gameScreen.classList.remove('hidden');

        // 启动自动时间更新
        this.startAutoTimeUpdate();

        // 更新物品栏显示
        this.updateInventoryDisplay();

        // 根据章节初始化第一个场景
        if (chapter === 'prologue') {
            // 序章默认添加手机到物品栏
            if (this.gameState && this.gameState.inventory && !this.gameState.inventory.includes('手机')) {
                this.gameState.inventory.push('手机');
                // 更新物品栏显示
                this.updateInventoryDisplay();
            }
            this.loadScene('classroom');
        } else if (chapter === 'chapter1') {
            // 加载Chapter1的起始场景
            if (window.Chapter1) {
                this.chapter1 = new Chapter1(this);
                this.chapter1.start();
            } else {
                this.showDialogue('无法加载第一章内容，请确保Chapter1.js已正确加载。', [
                    { text: '返回章节选择', action: () => this.returnToChapterSelect() }
                ]);
            }
        } else if (chapter === 'chapter2') {
            // 加载Chapter2的起始场景
            if (window.Chapter2) {
                this.chapter2 = new Chapter2(this);
                this.chapter2.start();
            } else {
                this.showDialogue('无法加载第二章内容，请确保Chapter2.js已正确加载。', [
                    { text: '返回章节选择', action: () => this.returnToChapterSelect() }
                ]);
            }
        } else if (chapter === 'chapter3') {
            // 加载Chapter3的起始场景
            if (window.Chapter3) {
                this.chapter3 = new Chapter3(this);
                this.chapter3.start();
            } else {
                this.showDialogue('无法加载第三章内容，请确保Chapter3.js已正确加载。', [
                    { text: '返回章节选择', action: () => this.returnToChapterSelect() }
                ]);
            }
        } else if (chapter === 'chapter4') {
            // 加载Chapter4的起始场景
            if (window.Chapter4) {
                this.chapter4 = new Chapter4(this);
                this.chapter4.start();
            } else {
                this.showDialogue('无法加载第四章内容，请确保Chapter4.js已正确加载。', [
                    { text: '返回章节选择', action: () => this.returnToChapterSelect() }
                ]);
            }

        } else if (chapter === 'custom') {
            // 加载自制章节
            if (window.CustomChapter) {
                this.customChapter = new CustomChapter(this);
                this.customChapter.start();
            } else {
                this.showDialogue('无法加载自制章节内容，请确保CustomChapter.js已正确加载。', [
                    { text: '返回章节选择', action: () => this.returnToChapterSelect() }
                ]);
            }
        }
    }

    // 解锁章节
    unlockChapter(chapter) {
        if (!this.gameState.unlockedChapters.includes(chapter)) {
            this.gameState.unlockedChapters.push(chapter);
            // 保存到本地存储
            this.saveUnlockedChapters();
            // 更新章节选择界面
            this.updateChapterAvailability();
            console.log('已解锁章节:', chapter);
            console.log('当前已解锁章节列表:', this.gameState.unlockedChapters);
        }
    }

    // 更新章节可用性
    updateChapterAvailability() {
        document.querySelectorAll('.chapter-item').forEach(item => {
            const chapter = item.dataset.chapter;
            if (this.gameState.unlockedChapters.includes(chapter)) {
                item.classList.remove('locked');
                item.classList.add('available');
                const lockIcon = item.querySelector('.lock-icon');
                const chapterDesc = item.querySelector('p'); // 选择<p>标签作为描述元素
                if (lockIcon) {
                    lockIcon.remove(); // 完全移除锁图标
                }
                if (chapterDesc) {
                    if (chapter === 'chapter1') {
                        chapterDesc.textContent = '探索学校的神秘事件，解开隐藏的秘密。找到生锈的钥匙，面对镜中的幽魂，揭露校园背后的真相。';
                    } else if (chapter === 'chapter2') {
                        chapterDesc.textContent = '遇见第一位朋友，发现更多关于学校的秘密。探索宿舍区，解开鬼影之谜。';
                    } else if (chapter === 'chapter3') {
                        chapterDesc.textContent = '揭开学校的最终秘密，直面真相。深入地下实验室，阻止黑暗仪式。';
                    } else if (chapter === 'chapter4') {
                        chapterDesc.textContent = '逃离学校后，诅咒依然追随着你。寻找解除诅咒的方法，面对过去的阴影。';

                    }
                }
            }
        });
    }

    // 加载场景
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

    // 显示教室场景
    showClassroomScene() {
        this.gameState.currentScene = 'classroom';
        this.updateGameMap('classroom');

        if (this.gameState.plotProgress === 0) {
            this.showDialogue(`晚自习结束的铃声已经响过很久了，${this.gameState.playerName}，你为什么还留在教室里？`, [
                { text: '收拾书包回家', action: () => this.leaveClassroom() },
                { text: '再复习一会儿', action: () => this.stayInClassroom() }
            ]);
        } else {
            this.showDialogue('教室里空荡荡的，只有你的课桌还留在原地。', [
                { text: '离开教室', action: () => this.goToCorridor() }
            ]);
        }
    }

    // 显示走廊场景
    showCorridorScene() {
        this.gameState.currentScene = 'corridor';
        this.updateGameMap('corridor');

        this.showDialogue('走廊的灯光忽明忽暗，你听到身后传来脚步声...', [
            { text: '回头查看', action: () => this.checkFootsteps() },
            { text: '继续前进', action: () => this.continueCorridor() }
        ]);
    }

    // 显示图书馆场景
    showLibraryScene() {
        this.gameState.currentScene = 'library';
        this.updateGameMap('library');

        this.showDialogue('图书馆里弥漫着旧书的霉味，书架上的书好像在微微晃动。', [
            { text: '查看书架', action: () => this.checkBookshelf() },
            { text: '离开图书馆', action: () => this.goToCorridor() }
        ]);
    }

    // 显示卫生间场景
    showBathroomScene() {
        this.gameState.currentScene = 'bathroom';
        this.updateGameMap('bathroom');

        this.showDialogue('卫生间的镜子上用红色的液体写着"救命"两个字。', [
            { text: '靠近镜子', action: () => this.approachMirror() },
            { text: '逃离卫生间', action: () => this.goToCorridor() }
        ]);
    }

    // 显示校长办公室场景
    showPrincipalOfficeScene() {
        this.gameState.currentScene = 'principalOffice';
        this.updateGameMap('principalOffice');

        if (this.gameState.hasKey) {
            this.showDialogue('你用钥匙打开了校长办公室的门，里面一片漆黑。', [
                { text: '打开灯', action: () => this.turnOnLight() },
                { text: '在黑暗中摸索', action: () => this.searchInDark() }
            ]);
        } else {
            this.showDialogue('校长办公室的门锁着，你需要找到钥匙才能进去。', [
                { text: '返回走廊', action: () => this.goToCorridor() }
            ]);
        }
    }

    // 更新游戏地图显示
    updateGameMap(location) {
        const locations = {
            classroom: '🏫 你的教室',
            corridor: '🚪 学校走廊',
            library: '📚 图书馆',
            bathroom: '🚻 卫生间',
            principalOffice: '🔑 校长办公室',
            staircase: '🔺 楼梯间',
            artRoom: '🎨 美术教室',
            basement: '🔻 地下室',
            deepCorridor: '🚶‍♂️ 昏暗走廊',
            exit: '🚪 侧门出口',
            undergroundPassage: '🔦 地下通道',
            ironDoorArea: '🔐 铁门区域',
            slimeExit: '💧 粘液出口',
            stoneDoorChamber: '🏛️ 石门密室',
            redPlayground: '🔴 红色操场',
            undergroundAbyss: '🕳️ 地下深渊',
            hiddenCatacombs: '⚰️ 隐藏墓穴',
            innerSanctum: '🔮 内殿',
            flowerField: '🌺 花海空间',
            upperFloor: '🔼 上层走廊',
            upperFloorCorridor: '🔄 楼上走廊',
            principalsOffice: '👨‍💼 校长办公室',
            creatureLair: '🐉 生物巢穴',
            lotusDimension: '🪷 莲花维度',
            entrance: '🚪 学校入口',
            quadrangle: '🏫 校园广场',
            dormitory: '🏠 宿舍区',
            canteen: '🍽️ 食堂',
            storageRoom: '🔒 仓库',
            schoolGate: '🚪 学校大门',
            foyer: '🏫 教学楼大厅',
            abandonedWing: '🏚️ 废弃教学楼',
            labyrinth: '🌀 地下迷宫',
            altarRoom: '🩸 祭坛房间'
        };

        this.elements.gameMap.innerHTML = `<div class="location-name">${locations[location] || '未知地点'}</div>
<div class="pixel-map">${this.generatePixelMap(location)}</div>`;

        // 更新物品栏显示
        this.updateInventoryDisplay();
    }

    // 更新物品栏显示
    updateInventoryDisplay() {
        const inventoryElement = document.getElementById('inventory-items');
        if (!inventoryElement) return;

        inventoryElement.innerHTML = '';

        if (this.gameState.inventory.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'inventory-empty';
            emptyMessage.textContent = '物品栏为空';
            inventoryElement.appendChild(emptyMessage);
            return;
        }

        // 物品简介映射
        const itemDescriptions = {
            '手机': '你的智能手机，电量充足，可以用来照明和查看时间。',
            '发银光的钥匙': '一把发银光的钥匙，刻有"校长办公室"的字样。',
            '笔记本': '一本旧笔记本，上面记录着学生的日记和一些奇怪的符号。',
            '手电筒': '可以在黑暗中照明的工具，电池电量未知。',
            '药草': '一种神秘的药草，散发着淡淡的香气，可能有特殊功效。',
            '怕水纸条': '一张从教室找到的纸条，上面写着："它不喜欢噪音，用水可以暂时驱赶它"。',
            '镜子倒影纸条': '一张从校长办公室抽屉找到的泛黄纸条，上面写着："不要相信镜子里的倒影"。',
            '地下室地图': '一张手绘的地图，详细标记着学校地下结构和通往地下室的安全路径。',
            '生锈的钥匙': '一把生锈的铁钥匙，在第一章获得，可以用来驱散鬼怪和打开隐藏门。',
            '图书馆钥匙': '一把普通的钥匙，刻有"图书馆"的字样。',
            '神秘钥匙': '刻有神秘符号的铜钥匙，似乎与学校历史有关。',
            '日记残页': '残缺的学生日记，记录着10月13日的异常事件。',
            '锤子': '生锈的铁锤，握柄缠着破布，仍有使用痕迹。',
            '禁区地图': '标记着神秘区域的泛黄地图，带有神秘标注。',
            '徽章': '银质校徽，边缘刻着与钥匙相同的符号。',
            '矿泉水': '未开封的矿泉水，瓶身有便利店标签。',
            '纱布': '医用灭菌纱布，包装略有破损。',
            '便签': '一张写着神秘信息的便签纸。',
            '仪式匕首': '一把用于仪式的匕首，刀刃闪着寒光。',
            '古老卷轴': '记载着学校历史的古老卷轴，上面的文字已经有些模糊。',
            '水之 artifact': '蓝色的宝石，蕴含着水的力量，刻着神秘符号。',
            '生命 artifact': '绿色的宝石，蕴含着生命的力量，刻着神秘符号。',
            '火焰 artifact': '红色的宝石，蕴含着火焰的力量，刻着神秘符号。',
        };

        this.gameState.inventory.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'inventory-item';
            itemElement.title = itemDescriptions[item] || '未知物品';

            // 为不同物品选择不同的图标
            let icon = '🎒'; // 默认背包图标
            if (item === '手机') icon = '📱';
            else if (item === '生锈的钥匙' || item === '发银光的钥匙' || item === '图书馆钥匙' || item === '神秘钥匙') icon = '🔑';
            else if (item === '笔记本') icon = '📓';
            else if (item === '手电筒') icon = '🔦';
            else if (item === '药草') icon = '🌿';
            else if (item === '怕水纸条' || item === '镜子倒影纸条' || item === '日记残页' || item === '便签' || item === '古老卷轴') icon = '📜';
            else if (item === '地下室地图' || item === '禁区地图') icon = '🗺️';
            else if (item === '锤子') icon = '🔨';
            else if (item === '徽章') icon = '🛡️';
            else if (item === '矿泉水') icon = '💧';
            else if (item === '纱布') icon = '🩹';
            else if (item === '仪式匕首') icon = '🗡️';
            else if (item === '水之 artifact') icon = '💎🔵';
            else if (item === '生命 artifact') icon = '💎🟢';
            else if (item === '火焰 artifact') icon = '💎🔴';
            else if (item === '黑暗神器') icon = '⚫💎';
            else if (item === '刻痕戒指') icon = '💍';

            itemElement.innerHTML = `
                <div class="inventory-item-icon">${icon}</div>
                <div class="inventory-item-name">${item}</div>
            `;

            inventoryElement.appendChild(itemElement);
        });
    }

    // 使用物品
    useItem(item) {
        // 这里可以添加使用物品的逻辑
        // 例如，如果是手机，可以显示查看手机的内容
        if (item === '手机') {
            // 检查当前章节是否有手机相关功能
            if (this.gameState.currentChapter === 'chapter3' && window.Chapter3 && this.chapter3) {
                this.chapter3.checkPhone();
            } else {
                this.showDialogue('你查看了手机，但没有收到新消息。', [
                    { text: '继续', action: () => this.clearDialogue() }
                ]);
            }
        } else {
            this.showDialogue(`你使用了${item}，但没有发生任何事情。`, [
                { text: '继续', action: () => this.clearDialogue() }
            ]);
        }
    }

    // 生成像素风格地图
    generatePixelMap(location) {
        // 为第三章场景添加像素地图
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

    // 主菜单弹窗函数
    showMainMenuDialog(text, choices) {
        // 创建背景层
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

        // 创建弹窗容器
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

        // 创建文本区域
        const textElement = document.createElement('div');
        textElement.className = 'main-menu-dialog-text';
        textElement.style.color = '#ddd';
        textElement.style.marginBottom = '1.5rem';
        textElement.style.minHeight = '60px';
        textElement.style.fontFamily = 'mplus_hzk_12, monospace';

        // 创建选项区域
        const choicesElement = document.createElement('div');
        choicesElement.className = 'main-menu-dialog-choices';
        choicesElement.style.display = 'flex';
        choicesElement.style.flexWrap = 'wrap';
        choicesElement.style.gap = '0.5rem';

        // 添加到容器
        dialogContainer.appendChild(textElement);
        dialogContainer.appendChild(choicesElement);

        // 添加到文档
        document.body.appendChild(dialogContainer);

        // 打字机效果
        let index = 0;
        const typeSpeed = 70; // 打字速度，毫秒/字符

        // 清除任何正在进行的打字动画
        if (this.mainMenuTypingInterval) {
            clearInterval(this.mainMenuTypingInterval);
        }

        // 开始打字动画
        this.mainMenuTypingInterval = setInterval(() => {
            if (index < text.length) {
                textElement.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(this.mainMenuTypingInterval);
                // 打字完成后显示选项
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
                        // 移除弹窗和背景层
                        document.body.removeChild(dialogContainer);
                        document.body.removeChild(overlay);
                    });

                    choicesElement.appendChild(button);
                });
            }
        }, typeSpeed);
    }

    // 打字机效果显示对话
    showDialogue(text, choices) {
        this.elements.dialogueText.textContent = '';
        this.elements.dialogueChoices.innerHTML = '';

        let index = 0;
        const typeSpeed = 70; // 打字速度，毫秒/字符（稍微调慢）

        // 清除任何正在进行的打字动画
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
        }

        // 开始打字动画
        this.typingInterval = setInterval(() => {
            if (index < text.length) {
                this.elements.dialogueText.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(this.typingInterval);
                // 打字完成后显示选项
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

    // 清除对话
    clearDialogue() {
        // 清除任何正在进行的打字动画
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
            this.typingInterval = null;
        }
        this.elements.dialogueText.textContent = '';
        this.elements.dialogueChoices.innerHTML = '';
    }

    // 游戏方法和剧情分支
    leaveClassroom() {
        this.gameState.plotProgress = 1;
        this.showDialogue('当你走到教室门口时，发现门锁住了！无论怎么推拉都打不开。', [
            { text: '检查窗户', action: () => this.checkWindow() },
            { text: '寻找钥匙', action: () => this.searchForKey() }
        ]);
    }

    stayInClassroom() {
        this.gameState.plotProgress = 2;
        this.updateGameTime('21:15');
        this.showDialogue('时间一分一秒过去，突然，教室的灯全部熄灭了！', [
            { text: '拿出手机照明', action: () => this.usePhoneLight() },
            { text: '躲到桌子底下', action: () => this.hideUnderDesk() }
        ]);
    }

    goToCorridor() {
        // 确保时间只能前进，不设置固定时间
        this.loadScene('corridor');
    }

    approachGirl() {
        this.gameState.hasSeenGhost = true;
        this.updateGameTime('21:45');
        this.showDeath('当你靠近她时，她缓缓转过头——那是一张没有脸的脸！你尖叫着倒下...');
    }

    fastLeaveCorridor() {
        this.updateGameTime('21:40');
        this.showDialogue('你快速跑过走廊，感觉有什么东西在后面追赶你。', [
            { text: '躲进图书馆', action: () => this.goToLibrary() },
            { text: '冲进卫生间', action: () => this.goToBathroom() }
        ]);
    }

    checkFootsteps() {
        this.gameState.hasSeenGhost = true;
        this.updateGameTime('21:45');
        this.showDeath('你转过身，看到一个没有腿的人漂浮在半空中，正伸出苍白的手抓向你...');
    }

    continueCorridor() {
        this.updateGameTime('21:40');
        this.showDialogue('你加快脚步，走廊尽头有三个门可以进入。', [
            { text: '图书馆', action: () => this.goToLibrary() },
            { text: '卫生间', action: () => this.goToBathroom() },
            { text: '校长办公室', action: () => this.goToPrincipalOffice() }
        ]);
    }

    checkBookshelf() {
        if (!this.gameState.hasKey) {
            this.gameState.hasKey = true;
            this.showDialogue('你在书架后面发现了一把闪着银光的钥匙！', [
                { text: '拿起钥匙', action: () => this.takeKey() },
                { text: '放回原处', action: () => this.leaveKey() }
            ]);
        } else {
            this.showDialogue('书架上的书突然全部掉了下来，把你埋在了书堆里！', [
                { text: '挣扎出来', action: () => this.escapeBookpile() }
            ]);
        }
    }

    approachMirror() {
        this.gameState.hasSeenGhost = true;
        this.updateGameTime('21:50');
        this.showDeath('当你看向镜子时，镜中的你露出了诡异的笑容，然后慢慢爬出了镜子...');
    }

    turnOnLight() {
        this.updateGameTime('22:00');
        this.showDialogue('灯光亮起，你看到办公桌上有一本日记。', [
            { text: '阅读日记', action: () => this.readDiary() },
            { text: '检查抽屉', action: () => this.checkDrawer() }
        ]);
    }

    searchInDark() {
        this.gameState.hasSeenGhost = true;
        this.updateGameTime('22:00');
        this.showDeath('你的手摸到了一个冰冷的东西，然后听到一个声音在你耳边说："你在找这个吗？"');
    }

    readDiary() {
        this.updateGameTime('22:10');
        this.showDialogue('日记里记录着一个学生的遭遇，他在三年前的今天消失在了这所学校...', [
            { text: '继续阅读', action: () => this.continueReading() },
            { text: '合上日记', action: () => this.closeDiary() }
        ]);
    }

    // 播放音效方法
    playSound(soundName) {
        try {
            if (soundName === 'ding' && this.horrorDing) {
                this.horrorDing.currentTime = 0;
                this.horrorDing.play().catch(e => console.log('音效播放失败:', e));
            } else if (soundName === 'horror' && this.horrorUp) {
                this.horrorUp.currentTime = 0;
                this.horrorUp.play().catch(e => console.log('音效播放失败:', e));
            }
        } catch (error) {
            console.log('音效播放错误:', error);
        }
    }

    // 打字机效果显示死亡消息
    showDeath(message) {
        // 播放死亡音效
        this.playSound('horror');

        this.elements.gameScreen.classList.add('hidden');
        this.elements.deathScreen.classList.remove('hidden');
        this.elements.deathMessage.textContent = '';

        let index = 0;
        const typeSpeed = 70; // 打字速度，毫秒/字符（比对话稍慢）

        // 清除任何正在进行的打字动画
        if (this.typingInterval) {
            clearInterval(this.typingInterval);
        }

        // 开始打字动画
        this.typingInterval = setInterval(() => {
            if (index < message.length) {
                this.elements.deathMessage.textContent += message.charAt(index);
                index++;
            } else {
                clearInterval(this.typingInterval);
            }
        }, typeSpeed);
    }

    // 完成章节
    // 显示结算画面
    showResultScreen() {
        this.elements.gameScreen.classList.add('hidden');
        this.elements.resultScreen.classList.remove('hidden');

        // 显示章节名称和通关时间
        let chapterName = '';
        if (this.gameState.currentChapter === 'prologue') {
            chapterName = '序章-「晚自习后」';
            // 显示下一章按钮
            this.elements.nextChapterBtn.classList.remove('hidden');
        } else if (this.gameState.currentChapter === 'chapter1') {
            chapterName = '第一章-「初见幽凄」';
            // 显示下一章按钮
            this.elements.nextChapterBtn.classList.remove('hidden');
        } else if (this.gameState.currentChapter === 'chapter2') {
            chapterName = '第二章-「深入诡域」';
            // 显示下一章按钮
            this.elements.nextChapterBtn.classList.remove('hidden');
        } else if (this.gameState.currentChapter === 'chapter3') {
            chapterName = '第三章-「宿命终结」';
            // 显示下一章按钮
            this.elements.nextChapterBtn.classList.remove('hidden');
        } else if (this.gameState.currentChapter === 'chapter4') {
            chapterName = '第四章-「黑暗边缘」';
            // 显示下一章按钮
            this.elements.nextChapterBtn.classList.remove('hidden');
        } else if (this.gameState.currentChapter === 'chapter4') {
            chapterName = '第四章-「最终章：黑暗边缘」';
            // 这是最终章，隐藏下一章按钮
            this.elements.nextChapterBtn.classList.add('hidden');
            // 显示返回章节选择按钮
            this.elements.backToChapterSelectBtn.classList.remove('hidden');
        }

        this.elements.resultChapter.textContent = chapterName;
        this.elements.resultTime.textContent = this.gameState.gameTime;
    }

    // 进入下一章
    goToNextChapter() {
        // 隐藏结算页面
        this.elements.resultScreen.classList.add('hidden');

        if (this.gameState.currentChapter === 'prologue') {
            // 保存序章的结束时间
            const endTime = this.gameState.gameTime;
            // 传递时间到第一章
            this.startGame('chapter1', endTime);
        } else if (this.gameState.currentChapter === 'chapter1') {
            // 传递时间到第二章
            const endTime = this.gameState.gameTime;
            this.startGame('chapter2', endTime);
        } else if (this.gameState.currentChapter === 'chapter2') {
            // 传递时间到第三章
            const endTime = this.gameState.gameTime;
            this.startGame('chapter3', endTime);
        } else if (this.gameState.currentChapter === 'chapter3') {
            // 传递时间到第四章
            const endTime = this.gameState.gameTime;
            this.startGame('chapter4', endTime);
        } else if (this.gameState.currentChapter === 'chapter4') {
            // 第四章是最终章，返回章节选择界面
            this.showChapterSelect();
        }
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

        if (this.gameState.currentChapter === 'prologue') {
            // 解锁第一章
            this.unlockChapter('chapter1');
        } else if (this.gameState.currentChapter === 'chapter1') {
            // 解锁第二章
            this.unlockChapter('chapter2');
        } else if (this.gameState.currentChapter === 'chapter2') {
            // 解锁第三章
            this.unlockChapter('chapter3');
        } else if (this.gameState.currentChapter === 'chapter3') {
            // 解锁第四章
            this.unlockChapter('chapter4');
        } else if (this.gameState.currentChapter === 'chapter4') {
            // 第四章是最终章，不解锁新章节
            console.log('已完成最终章');
        }

        // 显示结算画面
        this.showResultScreen();
    }

    // 返回章节选择
    returnToChapterSelect() {
        // 清除时间更新定时器
        if (this.timeUpdateInterval) {
            clearInterval(this.timeUpdateInterval);
            this.timeUpdateInterval = null;
        }
        this.elements.gameScreen.classList.add('hidden');
        this.elements.deathScreen.classList.add('hidden');
        this.elements.resultScreen.classList.add('hidden');
        this.elements.chapterSelectScreen.classList.remove('hidden');
    }

    // 已删除重复的restartGame方法定义
    // 保留下面的版本，使用统一的unlockedChaptersKey


    // 加载已解锁章节
    loadUnlockedChapters(unlockedChaptersKey) {
        try {
            const saved = localStorage.getItem(unlockedChaptersKey);
            return saved ? JSON.parse(saved) : ['prologue'];
        } catch (e) {
            console.error('Failed to load unlocked chapters:', e);
            return ['prologue'];
        }
    }

    // 保存已解锁章节
    saveUnlockedChapters() {
        try {
            localStorage.setItem(
                this.gameState.unlockedChaptersKey,
                JSON.stringify(this.gameState.unlockedChapters)
            );
        } catch (e) {
            console.error('Failed to save unlocked chapters:', e);
        }
    }

    // 重启游戏
    restartGame() {
        // 清除时间更新定时器
        if (this.timeUpdateInterval) {
            clearInterval(this.timeUpdateInterval);
            this.timeUpdateInterval = null;
        }

        // 重置游戏状态，但保留已解锁章节
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

        // 重置界面
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

    // 更新游戏时间（确保时间只能前进）
    updateGameTime(time) {
        // 解析当前时间和新时间
        const currentTime = this.parseTime(this.gameState.gameTime);
        const newTime = this.parseTime(time);

        // 只有当新时间晚于当前时间时才更新
        if (newTime > currentTime) {
            this.gameState.gameTime = time;
            this.elements.currentTimeDisplay.textContent = time;
        }
    }

    // 解析时间字符串为分钟数（用于比较）
    parseTime(timeStr) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    }

    // 启动自动时间更新（每30秒更新一次）
    startAutoTimeUpdate() {
        // 清除任何现有的定时器
        if (this.timeUpdateInterval) {
            clearInterval(this.timeUpdateInterval);
        }

        // 设置新的定时器（30秒更新一次）
        this.timeUpdateInterval = setInterval(() => {
            // 解析当前时间
            const [hours, minutes] = this.gameState.gameTime.split(':').map(Number);

            // 增加1分钟
            let newMinutes = minutes + 1;
            let newHours = hours;

            // 处理小时进位
            if (newMinutes >= 60) {
                newMinutes = 0;
                newHours += 1;
            }

            // 处理24小时制
            if (newHours >= 24) {
                newHours = 0;
            }

            // 格式化新时间
            const newTime = `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`;

            // 更新游戏时间
            this.updateGameTime(newTime);
        }, 30000); // 30秒
    }

    // 更多剧情方法...
    checkWindow() { this.showDeath('窗户被铁条封死了，当你靠近时，一只冰冷的手从铁条间伸了出来抓住了你！'); }
    searchForKey() {
        this.showDialogue('你在讲台抽屉里找到了一把生锈的钥匙！', [
            {
                text: '拿起钥匙',
                action: () => {
                    if (this.gameState?.inventory) {
                        if (!this.gameState.inventory.includes('发银光的钥匙')) {
                            this.gameState.inventory.push('发银光的钥匙');

                            // 显示物品栏内容
                            this.showDialogue(
                                `已将发银光的钥匙添加到物品栏。当前物品栏：${this.gameState.inventory.join(', ')}`,
                                [{
                                    text: '尝试开门',
                                    action: () => { this.tryDoorKey(); }
                                }]
                            );
                        } else {
                            this.showDialogue('发银光的钥匙已存在于物品栏。', [{
                                text: '尝试开门',
                                action: () => { this.tryDoorKey(); }
                            }]);
                        }
                    } else {
                        this.showDialogue('无法添加物品，物品栏不存在。', [{
                            text: '尝试开门',
                            action: () => { this.tryDoorKey(); }
                        }]);
                    }
                }
            }
        ]);
    }
    usePhoneLight() { this.showDialogue('手机屏幕亮起，你看到讲台上有一张纸条。', [{ text: '拿起纸条', action: () => this.takeNote() }]); }
    hideUnderDesk() { this.showDeath('桌子开始剧烈摇晃，然后整个压了下来...'); }
    goToLibrary() { this.loadScene('library'); }
    goToBathroom() { this.loadScene('bathroom'); }
    goToPrincipalOffice() { this.loadScene('principalOffice'); }
    takeKey() {
        this.showDialogue('你发现了一把闪着银光的钥匙！', [
            {
                text: '放进背包',
                action: () => {
                    if (this.gameState && this.gameState.inventory) {
                        if (!this.gameState.inventory.includes('发银光的钥匙')) {
                            this.gameState.inventory.push('发银光的钥匙');
                            // 显示物品栏内容
                            this.showDialogue(
                                `已将发银光的钥匙添加到物品栏。当前物品栏：${this.gameState.inventory.join(', ')}`
                            );
                            // 增加急促脚步声和限时QTE
                            setTimeout(() => {
                                this.startKeyQTE();
                            }, 1000);
                        } else {
                            this.showDialogue('发银光的钥匙已存在于物品栏。', [{
                                text: '离开图书馆',
                                action: () => { this.goToCorridor(); }
                            }]);
                        }
                    } else {
                        this.showDialogue('无法添加物品，物品栏不存在。', [{
                            text: '离开图书馆',
                            action: () => { this.goToCorridor(); }
                        }]);
                    }
                }
            }
        ]);
    }

    // 新增限时QTE方法
    startKeyQTE() {
        this.showDialogue('突然，你听到身后传来急促的脚步声！像是有什么东西正快速向你逼近！', []);

        // 创建QTE按钮
        const qteContainer = document.createElement('div');
        qteContainer.id = 'key-qte-container';
        qteContainer.className = 'qte-container';

        const qteText = document.createElement('p');
        qteText.className = 'qte-text';
        qteText.textContent = '快速点击钥匙图标，尝试打开校长办公室的门！';
        qteContainer.appendChild(qteText);

        const qteButton = document.createElement('button');
        qteButton.id = 'key-qte-button';
        qteButton.className = 'big-button';
        qteButton.textContent = '🔑 快速点击';
        qteContainer.appendChild(qteButton);

        const timerBar = document.createElement('div');
        timerBar.className = 'timer-bar';
        timerBar.style.width = '100%';
        qteContainer.appendChild(timerBar);

        // 添加到游戏界面
        this.elements.gameActions.appendChild(qteContainer);

        // QTE参数
        let clickCount = 0;
        const requiredClicks = 15;
        const timeLimit = 5000; // 5秒
        const startTime = Date.now();

        // 更新计时器
        const updateTimer = () => {
            const elapsedTime = Date.now() - startTime;
            const remainingTime = Math.max(0, timeLimit - elapsedTime);
            const percentage = (remainingTime / timeLimit) * 100;
            timerBar.style.width = `${percentage}%`;

            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                this.elements.gameActions.removeChild(qteContainer);
                this.showDeath('脚步声越来越近...你没能及时打开门，被黑暗中的东西抓住了！');
            }
        };

        const timerInterval = setInterval(updateTimer, 50);
        updateTimer();

        // 按钮点击事件
        qteButton.addEventListener('click', () => {
            clickCount++;
            qteText.textContent = `已点击 ${clickCount}/${requiredClicks} 次`;

            if (clickCount >= requiredClicks) {
                clearInterval(timerInterval);
                this.elements.gameActions.removeChild(qteContainer);
                this.showDialogue('钥匙终于转动了！门开了一条缝，你迅速挤了进去并关上门。', [{
                    text: '进入校长办公室',
                    action: () => { this.goToPrincipalOffice(); }
                }]);
            }
        });
    }
    leaveKey() { this.showDeath('你决定不拿钥匙，这时书架突然倒塌，把你压在了下面...'); }
    escapeBookpile() { this.showDialogue('你挣扎着从书堆里爬出来，感觉有什么东西在盯着你。', [{ text: '离开图书馆', action: () => this.goToCorridor() }]); }
    tryDoorKey() { this.showDialogue('钥匙插进锁孔，但转不动。这时你听到身后传来脚步声...', [{ text: '转身查看', action: () => this.seeWhoIsThere() }, { text: '继续尝试开门', action: () => this.keepTryingKey() }]); }
    takeNote() {
        this.showDialogue('纸条上写着："它不喜欢噪音，用水可以暂时驱赶它"', [
            {
                text: '收好纸条',
                action: () => {
                    // 直接使用this而不是window.game
                    if (this.gameState && this.gameState.inventory) {
                        if (!this.gameState.inventory.includes('怕水纸条')) {
                            this.gameState.inventory.push('怕水纸条');
                            // 显示物品栏内容
                            this.showDialogue(
                                `已将怕水纸条添加到物品栏。当前物品栏：${this.gameState.inventory.join(', ')}`,
                                [{
                                    text: '继续',
                                    action: () => { this.goToCorridor(); }
                                }]
                            );
                        } else {
                            this.showDialogue('怕水纸条已存在于物品栏。', [{
                                text: '继续',
                                action: () => { this.goToCorridor(); }
                            }]);
                        }
                    } else {
                        this.showDialogue('无法添加物品，物品栏不存在。', [{
                            text: '继续',
                            action: () => { this.goToCorridor(); }
                        }]);
                    }
                }
            }
        ]);
    }
    seeWhoIsThere() { this.showDeath('站在你身后的是一个穿着校服的学生，他的脸正在慢慢融化...'); }

    checkDrawer() {
        if (this.gameState && this.gameState.inventory) {
            const noteItem = '镜子倒影纸条';
            if (!this.gameState.inventory.includes(noteItem)) {
                this.gameState.inventory.push(noteItem);
                this.showDialogue(
                    `你打开了抽屉，里面放着一张泛黄的纸条："不要相信镜子里的倒影"。已将${noteItem}添加到物品栏。当前物品栏：${this.gameState.inventory.join(', ')}`,
                    [{
                        text: '关闭抽屉',
                        action: () => { this.goToCorridor(); }
                    }]
                );
            } else {
                this.showDialogue('你打开了抽屉，里面放着一张泛黄的纸条："不要相信镜子里的倒影"。你已经有这张纸条了。', [{
                    text: '关闭抽屉',
                    action: () => { this.goToCorridor(); }
                }]);
            }
        } else {
            this.showDialogue('你打开了抽屉，里面放着一张泛黄的纸条："不要相信镜子里的倒影"', [{
                text: '关闭抽屉',
                action: () => { this.goToCorridor(); }
            }]);
        }
    }
    keepTryingKey() { this.showDeath('门锁突然转动，但门打开的瞬间，一股黑色的雾气涌了进来，吞噬了你...'); }
    continueReading() { this.showDialogue('日记最后一页写着："它在找替身，特别是在这个日子留在学校的人..."', [{ text: '寻找出口', action: () => this.findExit() }]); }
    closeDiary() { this.showDialogue('你合上日记，决定寻找离开学校的方法。', [{ text: '离开办公室', action: () => this.goToCorridor() }]); }
    findExit() { this.showDialogue('根据日记的线索，你找到了学校的侧门！', [{ text: '尝试开门', action: () => this.trySideDoor() }]); }
    trySideDoor() { this.showDialogue('门没有锁！你推开门，发现外面不是街道，而是一条昏暗的走廊，墙上挂着指向地下室的路标。', [{ text: '进入走廊', action: () => this.enterDeepCorridor() }]); }
    enterDeepCorridor() {
        if (this.gameState && this.gameState.inventory) {
            if (!this.gameState.inventory.includes('地下室地图')) {
                this.gameState.inventory.push('地下室地图');
                // 显示物品栏内容
                this.showDialogue(
                    `你发现了一张地下室地图，并将其添加到物品栏。当前物品栏：${this.gameState.inventory.join(', ')}`,
                    [{
                        text: '按地图探索',
                        action: () => { this.gameClear(); }
                    }]
                );
            } else {
                this.showDialogue('你已经有地下室地图了。走廊尽头的墙上钉着一张泛黄的地图，标记着学校地下结构。', [{
                    text: '按地图探索',
                    action: () => { this.gameClear(); }
                }]);
            }
        } else {
            this.showDialogue('走廊尽头的墙上钉着一张泛黄的地图，标记着学校地下结构。你意识到自己正深入学校未知区域。', [{
                text: '按地图探索',
                action: () => { this.gameClear(); }
            }]);
        }
    }
    gameClear() { this.completeChapter(); }

    // 返回主界面
    backToMainScreen() {
        // 隐藏章节选择界面
        this.elements.chapterSelectScreen.classList.add('hidden');
        // 显示主界面
        this.elements.startScreen.classList.remove('hidden');
        // 重置章节选择相关状态
        this.gameState.selectedChapter = null;
    }

    // 显示自制章节介绍信息
    showCustomChapterInfo() {
        // 创建图片容器
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

        // 创建提示文字
        const hintText = document.createElement('div');
        hintText.textContent = '点击任意处关闭图片';
        hintText.style.cssText = `
            color: white;
            font-size: 18px;
            margin-bottom: 20px;
            text-align: center;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        `;

        // 创建图片元素
        const infoImage = document.createElement('img');
        infoImage.src = 'assets/img/介绍.png';
        infoImage.style.cssText = `
            max-width: 90%;
            max-height: 80%;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
        `;

        // 添加到容器
        infoContainer.appendChild(hintText);
        infoContainer.appendChild(infoImage);
        document.body.appendChild(infoContainer);

        // 点击任意处关闭
        infoContainer.addEventListener('click', () => {
            if (infoContainer.parentNode) {
                infoContainer.parentNode.removeChild(infoContainer);
            }
        });
    }
}

// 游戏初始化
window.addEventListener('DOMContentLoaded', () => {
    const game = new SchoolHorrorGame();
});