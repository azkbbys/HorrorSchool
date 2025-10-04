class CustomChapter {
    constructor(game) {
        this.game = game;
        this.plotProgress = 0;
        this.txtContent = null;
        this.isProcessing = false;
    }

    // 开始自制章节
    start() {
        this.game.gameState.currentChapter = 'custom';
        this.game.updateGameMap('custom');
        this.plotProgress = 0;
        this.showUploadScreen();
    }

    // 显示上传界面
    showUploadScreen() {
        this.game.clearDialogue();
        
        // 创建上传界面
        const uploadScreen = document.createElement('div');
        uploadScreen.id = 'upload-screen';
        uploadScreen.className = 'upload-screen';
        
        const title = document.createElement('h2');
        title.className = 'upload-title';
        title.textContent = '上传TXT剧情文件';
        uploadScreen.appendChild(title);
        
        const uploadArea = document.createElement('div');
        uploadArea.id = 'upload-area';
        uploadArea.className = 'upload-area';
        uploadArea.innerHTML = `
            <div class="upload-icon">📤</div>
            <p>拖拽文件到此处或</p>
            <button id="browse-btn" class="browse-btn">选择文件</button>
            <input type="file" id="file-input" class="file-input" accept=".txt" hidden>
            <p class="file-format-hint">支持的格式: .txt</p>
        `;
        uploadScreen.appendChild(uploadArea);
        
        const backButton = document.createElement('button');
        backButton.id = 'back-to-chapter';
        backButton.className = 'back-btn';
        backButton.textContent = '返回章节选择';
        uploadScreen.appendChild(backButton);
        
        // 清空游戏容器并添加上传界面
        const gameContainer = document.getElementById('game-container');
        gameContainer.innerHTML = '';
        gameContainer.appendChild(uploadScreen);
        
        // 添加事件监听器
        this.addUploadEventListeners();
    }

    // 添加上传事件监听器
    addUploadEventListeners() {
        const uploadArea = document.getElementById('upload-area');
        const fileInput = document.getElementById('file-input');
        const browseBtn = document.getElementById('browse-btn');
        const backButton = document.getElementById('back-to-chapter');
        
        // 点击浏览按钮触发文件选择
        browseBtn.addEventListener('click', () => {
            fileInput.click();
        });
        
        // 文件选择变化事件
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFileUpload(e.target.files[0]);
            }
        });
        
        // 拖拽事件
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('drag-over');
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('drag-over');
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('drag-over');
            
            if (e.dataTransfer.files.length > 0) {
                this.handleFileUpload(e.dataTransfer.files[0]);
            }
        });
        
        // 返回章节选择
        backButton.addEventListener('click', () => {
            this.game.showChapterSelect();
        });
    }

    // 处理文件上传
    handleFileUpload(file) {
        if (this.isProcessing) return;
        
        // 检查文件类型
        if (file.type !== 'text/plain' && !file.name.endsWith('.txt')) {
            this.showError('请上传TXT格式的文件');
            return;
        }
        
        this.isProcessing = true;
        this.showLoading();
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            this.txtContent = e.target.result;
            this.isProcessing = false;
            
            // 隐藏加载提示
            const loadingElement = document.getElementById('loading');
            if (loadingElement) {
                loadingElement.remove();
            }
            
            // 显示上传成功提示
            this.showSuccess('文件上传成功！即将开始解析...');
            
            // 延迟一段时间后开始解析
            setTimeout(() => {
                this.processTxtContent();
            }, 1500);
        };
        
        reader.onerror = () => {
            this.isProcessing = false;
            
            // 隐藏加载提示
            const loadingElement = document.getElementById('loading');
            if (loadingElement) {
                loadingElement.remove();
            }
            
            this.showError('文件读取失败，请重试');
        };
        
        reader.readAsText(file);
    }

    // 显示加载提示
    showLoading() {
        let loadingElement = document.getElementById('loading');
        if (!loadingElement) {
            loadingElement = document.createElement('div');
            loadingElement.id = 'loading';
            loadingElement.className = 'loading';
            loadingElement.innerHTML = '<div class="loading-spinner"></div><p>加载中...</p>';
            document.getElementById('upload-screen').appendChild(loadingElement);
        }
    }

    // 显示错误提示
    showError(message) {
        let errorElement = document.getElementById('error-message');
        if (errorElement) {
            errorElement.textContent = message;
        } else {
            errorElement = document.createElement('div');
            errorElement.id = 'error-message';
            errorElement.className = 'error-message';
            errorElement.textContent = message;
            document.getElementById('upload-screen').appendChild(errorElement);
        }
        
        // 3秒后隐藏错误提示
        setTimeout(() => {
            if (errorElement) {
                errorElement.remove();
            }
        }, 3000);
    }

    // 显示成功提示
    showSuccess(message) {
        let successElement = document.getElementById('success-message');
        if (successElement) {
            successElement.textContent = message;
        } else {
            successElement = document.createElement('div');
            successElement.id = 'success-message';
            successElement.className = 'success-message';
            successElement.textContent = message;
            document.getElementById('upload-screen').appendChild(successElement);
        }
        
        // 3秒后隐藏成功提示
        setTimeout(() => {
            if (successElement) {
                successElement.remove();
            }
        }, 3000);
    }

    // 处理TXT内容
    processTxtContent() {
        // 这里留空，等待后续实现
        this.game.showDialogue('文件解析功能即将实现...', [
            { text: '返回章节选择', action: () => this.game.showChapterSelect() },
            { text: '重新上传', action: () => this.showUploadScreen() }
        ]);
    }
}