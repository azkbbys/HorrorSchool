class Chapter2 {
    constructor(game) {
        this.game = game;
        this.plotProgress = 0;
        this.friendMet = false;
        this.friendName = '';
        this.friendGender = ''; // 朋友性别
        this.typingInterval = null;
        // 伏笔相关状态
        this.strangeSymbolFound = false;
        this.mysteriousKeyFound = false;
        this.ghostWhisperHeard = false;

        // 音效元素
        this.horrorDing = document.getElementById('horror-ding');
        this.horrorUp = document.getElementById('horror-up');
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

    // 根据朋友性别获取正确的代词
    getPronoun(type) {
        // 检查是否为非正常性别
        const abnormalGenders = ['沃尔玛购物袋', '武装直升机'];
        if (abnormalGenders.includes(this.game.gameState.playerGender)) {
            return '它';
        }

        const isMale = this.friendGender === 'male';
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

    // 打字机效果显示对话
    showDialogue(text, choices) {
        // 直接使用游戏对象的showDialogue方法
        this.game.showDialogue(text, choices);
    }

    // 开始第二章
    start(startTime = null) {
        this.game.gameState.currentChapter = 'chapter2';
        // 初始化游戏时间
        if (startTime) {
            this.updateGameTime(startTime);
        } else {
            this.updateGameTime('22:00'); // 默认起始时间
        }
        this.game.updateGameMap('entrance');
        this.plotProgress = 0;
        this.loadScene('entrance');
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

    // 学校入口场景
    showEntranceScene() {
        this.game.gameState.currentScene = 'entrance';
        this.game.updateGameMap('entrance');
        this.showDialogue('你站在学校正门，大门半掩着，门环上挂着一把生锈的锁。旁边的公告栏贴着泛黄的通知："因维修，学校将于21:00后封闭"。现在已经是22:00了。', [
            { text: '进入学校', action: () => this.enterSchool() },
            { text: '查看公告栏', action: () => this.checkNoticeBoard() }
        ]);
    }

    enterSchool() {
        this.game.updateGameMap('quadrangle');
        this.showDialogue('你推开校门，吱呀的声音在寂静的夜里格外刺耳。月光下的校园广场空无一人，只有风吹过落叶的沙沙声。', [
            { text: '走向宿舍区', action: () => this.loadScene('dormitory') },
            { text: '走向食堂', action: () => this.loadScene('canteen') },
            { text: '返回入口', action: () => this.loadScene('entrance') }
        ]);
    }

    checkNoticeBoard() {
        this.showDialogue('公告栏上除了封闭通知，还贴着一张寻人启事："寻找失踪学生李明，最后出现时间：10月13日晚"。启事下方有一行手写小字："不要相信影子"。', [
            { text: '进入学校', action: () => this.enterSchool() },
            { text: '拍照记录', action: () => this.takePhoto() }
        ]);
    }

    takePhoto() {
        // 自动给玩家手机
        if (!this.game.gameState.inventory.includes('手机')) {
            this.game.gameState.inventory.push('手机');
            // 更新物品栏显示
            this.game.updateInventoryDisplay();
        }
        this.showDialogue('你用手机拍下了公告栏的内容。照片上，寻人启事的眼睛似乎在盯着你。', [
            { text: '进入学校', action: () => this.enterSchool() }
        ]);
    }

    // 宿舍场景
    showDormitoryScene() {
        this.game.gameState.currentScene = 'dormitory';
        this.game.updateGameMap('dormitory');

        if (!this.friendMet) {
            // 检查是否为非正常性别
            const abnormalGenders = ['沃尔玛购物袋', '武装直升机'];
            if (abnormalGenders.includes(this.game.gameState.playerGender)) {
                this.friendName = Math.random() < 0.5 ? '汪汪' : '喵喵';
                this.friendGender = 'abnormal';
            } else {
                const isMale = this.game.gameState.playerGender === 'male';
                this.friendGender = isMale ? 'male' : 'female';
                this.friendName = isMale ? '张伟' : '李娜';
            }
            this.friendMet = true;

            let friendDescription = abnormalGenders.includes(this.game.gameState.playerGender) ? '一个奇怪的身影' : (this.friendGender === 'male' ? '男生' : '女生');
            this.showDialogue(`宿舍区一片漆黑，只有一间宿舍亮着灯。你走近一看，门没锁。里面传来熟悉的声音："${this.game.gameState.playerName}？是你吗？"\n${friendDescription}从床上坐起来，是你的同班同学${this.friendName}。`, [
                { text: '你怎么在这里？', action: () => this.askFriend() },
                { text: '这里太危险了，快跟我走！', action: () => this.urgeFriend() }
            ]);
        } else {
            this.showDialogue(`宿舍里空无一人，${this.friendName}的床铺整理得整整齐齐，但课本摊开在桌子上，似乎主人只是暂时离开。`, [
                { text: '检查桌子', action: () => this.checkFriendDesk() },
                { text: '离开宿舍', action: () => this.enterSchool() }
            ]);
        }
    }

    checkFriendDesk() {
        this.showDialogue(`你走到书桌前，课本摊开在《心理学导论》的某一页。上面用铅笔圈着一段话："恐惧是人类最原始的情感之一，也是最容易被操纵的情感。"
桌子上还有一张便签，字迹潦草："他们在监视我们。不要相信任何人。"`, [
            { text: '收起便签', action: () => this.takeNote() },
            { text: '离开宿舍', action: () => this.enterSchool() }
        ]);
    }

    takeNote() {
        // 添加便签到物品栏
        if (!this.game.gameState.inventory.includes('便签')) {
            this.game.gameState.inventory.push('便签');
            // 更新物品栏显示
            this.game.updateInventoryDisplay();
        }
        this.showDialogue('你把便签放进兜里。虽然不知道是谁写的，但直觉告诉你这很重要。', [
            { text: '离开宿舍', action: () => this.enterSchool() }
        ]);
    }

    askFriend() {
        this.showDialogue(`${this.friendName}揉了揉眼睛："我...我也不知道。晚自习后我好像迷路了，不知不觉就走到这里。这里感觉好奇怪，我总觉得有人在盯着我。"
${this.getPronoun('subject')}掀开被子，露出脚踝上一道红肿的抓痕。`, [
            { text: '那道伤是怎么来的？', action: () => this.askAboutInjury() },
            { text: '我们一起离开这里', action: () => this.urgeFriend() }
        ]);
    }

    askAboutInjury() {
        this.showDialogue(`${this.friendName}低头看着脚踝："我不知道...刚才在走廊里，我感觉有什么东西碰了我一下，然后就这样了。可能是被钉子刮到了吧？"
${this.getPronoun('subject')}的声音越来越小，眼神里充满恐惧。`, [
            { text: '我们得尽快离开', action: () => this.urgeFriend() },
            { text: '我帮你找找医药箱', action: () => this.searchFirstAidKit() }
        ]);
    }

    urgeFriend() {
        this.showDialogue(`${this.friendName}点点头："好...好的。我去拿书包。"
${this.getPronoun('subject')}快速收拾东西，无意中掉落一张照片。照片上是一群学生在废弃教学楼前的合影，其中一个人的脸被涂黑了。`, [
            { text: '捡起照片', action: () => this.pickUpPhoto() },
            { text: '催促朋友快走', action: () => this.leaveDormitoryWithFriend() }
        ]);
    }

    searchFirstAidKit() {
        this.showDialogue('你在宿舍抽屉里找到一个落灰的医药箱。打开后，里面有一些过期的药品和纱布。最下面压着一把铜钥匙，上面刻着奇怪的符号。', [
            { text: '拿走钥匙', action: () => this.takeMysteriousKey() },
            { text: '给朋友包扎', action: () => this.bandageFriend() }
        ]);
    }

    takeMysteriousKey() {
        this.mysteriousKeyFound = true;
        // 添加神秘钥匙到物品栏（避免重复添加）
        if (!this.game.gameState.inventory.includes('神秘钥匙')) {
            this.game.gameState.inventory.push('神秘钥匙');
            // 更新物品栏显示
            this.game.updateInventoryDisplay();
        }
        this.showDialogue('你把钥匙放进兜里。这把钥匙看起来很古老，符号像是某种密码。', [
            { text: '给朋友包扎', action: () => this.bandageFriend() }
        ]);
    }

    bandageFriend() {
        this.showDialogue(`你用纱布帮${this.friendName}包扎脚踝。${this.getPronoun('subject')}疼得皱起眉头，但还是勉强笑了笑："谢谢你。我们现在可以走了吗？"`, [
            { text: '离开宿舍', action: () => this.leaveDormitoryWithFriend() }
        ]);
    }

    pickUpPhoto() {
        this.showDialogue(`你捡起照片。涂黑的脸看起来像是后来用马克笔涂的，边缘有些模糊。照片背面写着："他们都得死"。\n${this.friendName}慌忙抢过照片："这...这不是我的！我不知道怎么会有这种东西！"`, [
            { text: `相信${this.getPronoun('object')}`, action: () => this.trustFriend() },
            { text: '追问到底', action: () => this.questionFriend() }
        ]);
    }

    trustFriend() {
        this.showDialogue(`你拍了拍${this.friendName}的肩膀："没关系，可能是谁恶作剧放的。我们赶紧离开吧。"\n${this.friendName}感激地点点头，跟着你走出宿舍。`, [
            { text: '前往食堂', action: () => this.loadScene('canteen') },
            { text: '前往仓库', action: () => this.loadScene('storageRoom') }
        ]);
    }

    questionFriend() {
        this.showDialogue(`你盯着${this.friendName}的眼睛："这到底是怎么回事？照片上的人是谁？"
${this.friendName}的表情变得僵硬："我真的不知道！你要是不相信我，那我自己走！"
${this.getPronoun('subject')}生气地摔门而出，留下你一个人在宿舍。`, [
            { text: '追出去', action: () => this.chaseFriend() },
            { text: '独自探索', action: () => this.enterSchool() }
        ]);
    }

    leaveDormitoryWithFriend() {
        this.game.updateGameMap('quadrangle');
        this.showDialogue(`${this.friendName}突然停下脚步："等一下...你有没有听到什么声音？像是...有人在哭？"`, [
            { text: '前往哭声源头', action: () => this.followCryingSound() },
            { text: '赶紧离开学校', action: () => this.tryEscapeSchool() }
        ]);
    }

    chaseFriend() {
        this.game.updateGameMap('quadrangle');
        this.showDialogue(`你追出门外，但${this.friendName}已经不见了踪影。月光下，地面上只有你自己的影子。\n一阵冷风吹过，你听到远处传来若有若无的笑声。`, [
            { text: '前往食堂', action: () => this.loadScene('canteen') },
            { text: '前往仓库', action: () => this.loadScene('storageRoom') }
        ]);
    }

    followCryingSound() {
        this.game.updateGameMap('storageRoom');
        this.showDialogue('哭声是从仓库方向传来的。你们小心翼翼地靠近，仓库门虚掩着，里面透出微弱的光线。', [
            { text: '进去查看', action: () => this.loadScene('storageRoom') },
            { text: '返回广场', action: () => this.enterSchool() }
        ]);
    }

    tryEscapeSchool() {
        this.showDialogue('你们跑到校门口，发现大门已经被锁住了。锁上有一道奇怪的符号，和你捡到的钥匙上的符号一模一样。', [
            { text: '用钥匙开锁', action: () => this.useMysteriousKey() },
            { text: '寻找其他出口', action: () => this.enterSchool() }
        ]);
    }

    useMysteriousKey() {
        // 同时检查钥匙状态和物品栏，增加容错性
        const hasKey = this.mysteriousKeyFound || this.game.gameState.inventory.includes('神秘钥匙') || this.game.gameState.inventory.includes('铜钥匙');

        if (hasKey) {
            this.showDialogue(`你掏出钥匙插入锁孔，钥匙和锁完美契合。随着"咔嗒"一声，锁开了。\n${this.friendName}松了一口气："太好了！我们快走吧！"`, [
                { text: '离开学校', action: () => this.escapeSchool() },
                { text: '继续探索', action: () => this.enterSchool() }
            ]);
        } else {
            this.showDialogue(`${this.friendName}着急地说："那怎么办？我们是不是被困在这里了？"`, [
                { text: '寻找钥匙', action: () => this.searchForKey() },
                { text: '寻找其他出口', action: () => this.enterSchool() }
            ]);
        }
    }

    escapeSchool() {
        this.showDialogue(`你们冲出校门，跑到大街上。回头望去，学校里突然亮起一片红光，随后传来一声凄厉的尖叫。
${this.friendName}紧紧抓住你的胳膊："我们...我们是不是做错了什么？"
你注意到${this.getPronoun('possessive')}眼睛里，闪烁着一丝你从未见过的光芒。`, [
            { text: '继续...', action: () => this.showFriendAbductionScene() }
        ]);
    }

    showFriendAbductionScene() {
        this.playSound('horror');
        this.showDialogue(`就在你们准备离开时，${this.friendName}眼中的光芒突然变得更加明亮。
"等等..."${this.getPronoun('subject')}的声音开始颤抖，"我...我感觉有什么不对劲..."

一阵诡异的大雾突然从地面升起，瞬间笼罩了整个街道。雾中传来低沉的咆哮声，仿佛来自地狱深处。

"救命！"${this.friendName}突然尖叫起来。一只巨大的黑色手臂从雾中伸出，如同来自另一个世界的恶魔之手，一把抓住了${this.getPronoun('object')}。

"不！${this.game.gameState.playerName}！救我——"${this.friendName}的惨叫声划破夜空，随后戛然而止。

雾散去了，街道上只剩下你一个人。朋友消失了，地上只留下那张照片，上面涂黑的脸似乎正在对你微笑。`, [
            { text: '结束第二章', action: () => this.finishChapter() }
        ]);
    }

    searchForKey() {
        this.showDialogue(`${this.friendName}突然说："我记得宿舍里好像有个医药箱，说不定里面有钥匙？"`, [
            { text: '返回宿舍', action: () => this.loadScene('dormitory') },
            { text: '寻找其他地方', action: () => this.enterSchool() }
        ]);
    }

    // 食堂场景
    showCanteenScene() {
        this.game.gameState.currentScene = 'canteen';
        this.game.updateGameMap('canteen');
        this.showDialogue('食堂里一片狼藉，桌椅翻倒在地，饭菜洒了一地。墙上的时钟停在了21:45。', [
            { text: '检查厨房', action: () => this.checkKitchen() },
            { text: '检查小卖部', action: () => this.checkCanteenStore() },
            { text: '离开食堂', action: () => this.enterSchool() }
        ]);
    }

    checkKitchen() {
        this.showDialogue('厨房的水龙头正在滴水，水槽里漂浮着一只死老鼠。墙上贴着一张菜单，上面的菜名被人用红笔改成了"人肉叉烧包"、"眼球汤"等恐怖的名字。', [
            { text: '检查冰箱', action: () => this.checkFridge() },
            { text: '离开厨房', action: () => this.showCanteenScene() }
        ]);
    }

    checkCanteenStore() {
        this.showDialogue('小卖部的货架空空如也，只有角落的货架上放着一瓶没开封的矿泉水。瓶身上贴着一张便签："不要喝这里的水"。', [
            { text: '拿起矿泉水', action: () => this.takeMineralWater() },
            { text: '离开小卖部', action: () => this.showCanteenScene() }
        ]);
    }

    checkFridge() {
        this.showDialogue('冰箱里散发着难闻的气味。里面有几个发霉的面包和一盒过期的牛奶。最底层放着一个金属盒子，上面刻着和钥匙相同的符号。', [
            { text: '尝试打开盒子', action: () => this.tryOpenBox() },
            { text: '离开冰箱', action: () => this.checkKitchen() }
        ]);
    }

    takeMineralWater() {
        // 添加矿泉水到物品栏（避免重复添加）
        if (!this.game.gameState.inventory.includes('矿泉水')) {
            this.game.gameState.inventory.push('矿泉水');
            // 更新物品栏显示
            this.game.updateInventoryDisplay();
        }
        this.showDialogue('你把矿泉水放进包里。虽然便签提醒不要喝，但带着以防万一总是好的。', [
            { text: '离开小卖部', action: () => this.showCanteenScene() }
        ]);
    }

    tryOpenBox() {
        if (this.mysteriousKeyFound) {
            this.showDialogue('你用钥匙打开盒子，里面放着一张泛黄的日记纸。上面写着："10月13日，实验失败。他们开始出现异常行为。必须销毁所有证据，包括...实验体。"', [
                { text: '收起日记', action: () => this.takeDiaryPage() },
                { text: '离开厨房', action: () => this.showCanteenScene() }
            ]);
        } else {
            this.showDialogue('盒子锁着，你需要钥匙才能打开。', [
                { text: '离开厨房', action: () => this.showCanteenScene() }
            ]);
        }
    }

    takeDiaryPage() {
        // 添加日记残页到物品栏（避免重复添加）
        if (!this.game.gameState.inventory.includes('日记残页')) {
            this.game.gameState.inventory.push('日记残页');
            // 更新物品栏显示
            this.game.updateInventoryDisplay();
        }
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
    takeDiaryPage() {
        // 添加日记残页到物品栏（避免重复添加）
        if (!this.game.gameState.inventory.includes('日记残页')) {
            this.game.gameState.inventory.push('日记残页');
            // 更新物品栏显示
            this.game.updateInventoryDisplay();
        }
        this.showDialogue('你收起日记纸。10月13日...这和公告栏上寻人启事的日期一样。', [
            { text: '离开厨房', action: () => this.showCanteenScene() }
        ]);
    }

    // 仓库场景
    showStorageRoomScene() {
        this.game.gameState.currentScene = 'storageRoom';
        this.game.updateGameMap('storageRoom');
        this.showDialogue('仓库里堆满了旧桌椅和杂物。墙角有一个铁笼子，上面挂着一把生锈的锁。笼子里似乎有什么东西在动。', [
            { text: '靠近铁笼', action: () => this.approachCage() },
            { text: '检查杂物', action: () => this.checkStorageItems() },
            { text: '离开仓库', action: () => this.enterSchool() }
        ]);
    }

    approachCage() {
        this.playSound('ding');
        this.showDialogue('你靠近铁笼，里面的东西突然发出一声尖叫。借着月光，你看到一个衣衫褴褛的人影缩在角落，眼睛里闪烁着绿光。\n"救...救我..."它发出沙哑的声音。', [
            { text: '尝试打开笼子', action: () => this.tryOpenCage() },
            { text: '后退', action: () => this.showStorageRoomScene() }
        ]);
    }

    checkStorageItems() {
        // 添加锤子到物品栏（避免重复添加）
        if (!this.game.gameState.inventory.includes('锤子')) {
            this.game.gameState.inventory.push('锤子');
            // 更新物品栏显示
            this.game.updateInventoryDisplay();
        }
        // 添加手电筒到物品栏（避免重复添加）
        if (!this.game.gameState.inventory.includes('手电筒')) {
            this.game.gameState.inventory.push('手电筒');
            // 更新物品栏显示
            this.game.updateInventoryDisplay();
        }
        this.showDialogue('你在杂物堆里翻找，找到一把生锈的锤子和一个手电筒。手电筒还能亮，但光线很弱。你把它们都放进了包里。\n在一个木箱里，你发现了一张旧地图，上面标记着学校的各个区域，包括一个用红笔圈起来的"禁区"。', [
            { text: '拿走地图', action: () => this.takeStorageMap() },
            { text: '继续翻找', action: () => this.searchMoreItems() }
        ]);
    }

    tryOpenCage() {
        if (this.game.gameState.inventory.includes('锤子')) {
            this.showDialogue('你用锤子砸开锁，铁笼门"吱呀"一声打开。里面的人影突然扑向你，指甲深深陷入你的手臂。\n"终于...自由了..."它发出刺耳的笑声，消失在黑暗中。', [
                { text: '处理伤口', action: () => this.treatWound() },
                { text: '离开仓库', action: () => this.enterSchool() }
            ]);
        } else {
            this.showDialogue('笼子锁着，你需要工具才能打开。', [
                { text: '寻找工具', action: () => this.checkStorageItems() },
                { text: '离开仓库', action: () => this.enterSchool() }
            ]);
        }
    }

    takeStorageMap() {
        // 添加仓库地图到物品栏（避免重复添加）
        if (!this.game.gameState.inventory.includes('禁区地图')) {
            this.game.gameState.inventory.push('禁区地图');
            // 更新物品栏显示
            this.game.updateInventoryDisplay();
        }
        this.showDialogue('你收起地图。禁区...那会是什么地方？', [
            { text: '继续翻找', action: () => this.searchMoreItems() },
            { text: '离开仓库', action: () => this.enterSchool() }
        ]);
    }

    searchMoreItems() {
        // 将徽章添加到物品栏
        if (!this.game.gameState.inventory.includes('徽章')) {
            this.game.gameState.inventory.push('徽章');
            // 更新物品栏显示
            this.game.updateInventoryDisplay();
        }
        this.playSound('horror');
        this.showDialogue('你继续翻找，在一个铁盒里发现了一枚徽章，上面刻着和钥匙、盒子相同的符号。' +
            '突然，仓库的灯闪了几下，熄灭了。黑暗中，你听到沉重的脚步声向你靠近。', [
            { text: '用手电筒照亮', action: () => this.useFlashlight() },
            { text: '赶紧离开', action: () => this.enterSchool() }
        ]);
    }

    useFlashlight() {
        if (this.game.gameState.inventory.includes('手电筒')) {
            this.playSound('ding');
            this.showDialogue('你打开手电筒，光束照在一个穿着保安制服的人影上。他的脸扭曲变形，眼睛里没有瞳孔。\n"不许动..."他发出机械的声音，一步步向你逼近。', [
                { text: '用锤子攻击', action: () => this.attackWithHammer() },
                { text: '转身逃跑', action: () => this.enterSchool() }
            ]);
        } else {
            this.showDialogue('你没有手电筒，无法在黑暗中视物。脚步声越来越近...', [
                { text: '摸黑逃跑', action: () => this.enterSchool() }
            ]);
        }
    }

    attackWithHammer() {
        if (this.game.gameState.inventory.includes('锤子')) {
            this.playSound('ding');
            this.showDialogue('你举起锤子砸向保安，锤子穿过他的身体，没有造成任何伤害。\n"攻击无效..."他继续逼近，双手掐住你的脖子。', [
                { text: '挣扎', action: () => this.struggle() },
                { text: '使用徽章', action: () => this.useBadge() }
            ]);
        } else {
            this.showDialogue('你没有锤子，无法攻击。', [
                { text: '转身逃跑', action: () => this.enterSchool() }
            ]);
        }
    }

    useBadge() {
        if (this.game.gameState.inventory.includes('徽章')) {
            this.showDialogue('你掏出徽章，徽章突然发出强烈的光芒，保安惨叫一声，化作一缕黑烟消失了。\n光芒散去后，你发现徽章上的符号变得更加清晰了。', [
                { text: '收起徽章', action: () => this.keepBadge() },
                { text: '离开仓库', action: () => this.enterSchool() }
            ]);
        } else {
            this.showDialogue('你没有徽章。', [
                { text: '挣扎', action: () => this.struggle() }
            ]);
        }
    }

    struggle() {
        this.showDialogue(`你拼命挣扎，但保安的力气太大了。你感到呼吸困难，眼前发黑...
就在这时，仓库门被撞开，${this.friendName}冲了进来："放开${this.getPronoun('object')}!"
保安转头看向${this.friendName}，松开了手，化作黑烟消失了。`, [
            { text: '感谢朋友', action: () => this.thankFriend() },
            { text: '离开仓库', action: () => this.enterSchool() }
        ]);
    }

    keepBadge() {
        this.showDialogue('你收起徽章。这枚徽章似乎有着特殊的力量，可能会在后续的冒险中派上用场。', [
            { text: '离开仓库', action: () => this.enterSchool() }
        ]);
    }

    thankFriend() {
        this.showDialogue(`你喘着气说："谢谢你...刚才差点就..."
${this.friendName}摇摇头："别说了，我们快离开这里吧。这个地方太诡异了。"
你注意到${this.getPronoun('possessive')}手里，拿着你之前在宿舍看到的那张照片。`, [
            { text: '询问照片', action: () => this.askAboutPhotoAgain() },
            { text: '离开仓库', action: () => this.enterSchool() }
        ]);
    }

    askAboutPhotoAgain() {
        this.showDialogue(`你指着${this.friendName}手里的照片："你怎么会有这张照片？"
${this.friendName}脸色一变："我...我刚才在走廊捡到的。可能是被风吹过来的吧。"
${this.getPronoun('subject')}的眼神闪烁，不敢直视你。`, [
            { text: '继续追问', action: () => this.pressFriend() },
            { text: '不再追问', action: () => this.enterSchool() }
        ]);
    }

    pressFriend() {
        this.showDialogue(`你抓住${this.friendName}的手腕："告诉我真相！这张照片到底是怎么回事？"
${this.friendName}猛地甩开你的手："够了！你以为你是谁？凭什么管我？"
${this.getPronoun('subject')}转身跑出仓库，照片掉在地上。你捡起照片，发现涂黑的脸旁边多了一行小字："下一个就是你"。`, [
            { text: '追出去', action: () => this.chaseFriend() },
            { text: '独自探索', action: () => this.enterSchool() }
        ]);
    }

    treatWound() {
        if (this.game.gameState.inventory.includes('矿泉水') && this.game.gameState.inventory.includes('纱布')) {
            this.showDialogue('你用矿泉水冲洗伤口，然后用纱布包扎。伤口很深，但似乎没有流血，反而有黑色的液体渗出。', [
                { text: '离开仓库', action: () => this.enterSchool() }
            ]);
        } else {
            this.showDialogue('你没有足够的物品处理伤口。伤口开始隐隐作痛，仿佛有什么东西在皮肤下蠕动。', [
                { text: '离开仓库', action: () => this.enterSchool() }
            ]);
        }
    }

    // 显示结算画面
    showResultScreen() {
        // 隐藏游戏屏幕，显示结果屏幕
        this.game.elements.gameScreen.classList.add('hidden');
        this.game.elements.resultScreen.classList.remove('hidden');

        // 显示章节名称和通关时间
        const chapterName = '第二章-「宿舍鬼影」';
        const gameTime = this.game.gameState.gameTime || '22:30'; // 默认值

        this.game.elements.resultChapter.textContent = chapterName;
        this.game.elements.resultTime.textContent = gameTime;

        // 显示下一章按钮
        const nextChapterBtn = this.game.elements.nextChapterBtn;
        nextChapterBtn.textContent = '进入第三章';
        nextChapterBtn.classList.remove('hidden');
        nextChapterBtn.onclick = () => this.startChapter3();
    }

    // 完成章节
    finishChapter() {
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

        this.game.unlockChapter('chapter3');

        // 显示结算画面
        this.showResultScreen();
    }

    startChapter3() {
        if (window.Chapter3) {
            this.game.elements.gameScreen.classList.add('hidden');
            this.game.chapter3 = new Chapter3(this.game);
            this.game.chapter3.start('22:30');
        } else {
            this.showDialogue('无法加载第三章内容，请确保Chapter3.js已正确加载。', [
                { text: '返回章节选择', action: () => this.game.returnToChapterSelect() }
            ]);
        }
    }
}

// 导出Chapter2类到window对象，以便在主游戏中使用
window.Chapter2 = Chapter2;