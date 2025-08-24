// Instructions toggle function
function toggleInstructions() {
    let instructionsSection = document.getElementById('instructionsSection');
    
    // If instructions section doesn't exist, initialize it first
    if (!instructionsSection) {
        if (typeof initializeInstructions !== 'undefined') {
            initializeInstructions();
            instructionsSection = document.getElementById('instructionsSection');
        }
        
        if (!instructionsSection) {
            console.error('Failed to create instructions section');
            return;
        }
    }
    
    // Use computed style to check current display state
    const currentDisplay = window.getComputedStyle(instructionsSection).display;
    
    if (currentDisplay === 'none') {
        instructionsSection.style.display = 'block';
        // Ensure instructions are updated to current language when shown
        if (typeof currentLang !== 'undefined' && currentLang) {
            updateInstructionsTranslations(currentLang);
        }
    } else {
        instructionsSection.style.display = 'none';
    }
}

// Show manual install instructions for unsupported browsers
function showInstallInstructions() {
    const instructions = {
        en: "To add this app to your home screen:\n\n1. Open this page in your mobile browser\n2. Tap the share button\n3. Select 'Add to Home Screen'\n4. Confirm the installation",
        vi: "Để thêm ứng dụng này vào màn hình chính:\n\n1. Mở trang này trong trình duyệt di động\n2. Nhấn nút chia sẻ\n3. Chọn 'Thêm vào Màn hình chính'\n4. Xác nhận cài đặt",
        th: "เพื่อเพิ่มแอปนี้ไปยังหน้าจอหลัก:\n\n1. เปิดหน้านี้ในเบราว์เซอร์มือถือ\n2. แตะปุ่มแชร์\n3. เลือก 'เพิ่มไปยังหน้าจอหลัก'\n4. ยืนยันการติดตั้ง",
        cn: "要将此应用添加到主屏幕：\n\n1. 在移动浏览器中打开此页面\n2. 点击分享按钮\n3. 选择'添加到主屏幕'\n4. 确认安装"
    };
    
    // Get current language from global scope or default to 'en'
    const currentLang = (typeof window.currentLang !== 'undefined') ? window.currentLang : 'en';
    alert(instructions[currentLang] || instructions.en);
}

// Create and insert the instructions HTML structure
function createInstructionsHTML() {
    const instructionsHTML = `
        <!-- Collapsible Instructions Section -->
        <div id="instructionsSection" style="display: none; margin-bottom: 24px; padding: 24px; background: var(--bg-secondary); border-radius: 16px; border-left: 4px solid var(--part1-color); border: 1px solid var(--border-primary); box-shadow: var(--shadow-sm);">
            <h2 id="instructionsTitle" style="color: var(--text-primary); margin-bottom: 20px; font-size: 1.5em; font-weight: 600;">How to Use the PU Machine Calculator</h2>
            
            <!-- Formula Display -->
            <div style="margin-bottom: 15px;">
                <div id="instructionsFormula" style="background: var(--bg-tertiary); color: var(--text-primary); padding: 20px; border-radius: 12px; font-family: 'JetBrains Mono', 'Fira Code', 'Courier New', monospace; font-size: 1.3em; text-align: center; margin-bottom: 24px; letter-spacing: 2px; border: 2px solid var(--border-secondary);">
                    Basic Formula: O = C × L (Output = Consumption × Line Speed)
                </div>
                
                <!-- Part Descriptions -->
                <div style="margin-bottom: 15px;">
                    <div style="margin-bottom: 8px;">
                        <h4 id="instructionsPart1Title" style="color: var(--part1-color); margin-bottom: 8px; font-size: 1.2em; font-weight: 600;">Part 1: Basic Calculator</h4>
                        <p id="instructionsPart1" style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">Basic Formula Calculator - Use this to calculate one unknown parameter when you have the other two values. Enter 0 for the parameter you want to calculate.</p>
                    </div>
                    <div style="margin-bottom: 8px;">
                        <h4 id="instructionsPart2Title" style="color: var(--part2-color); margin-bottom: 8px; font-size: 1.2em; font-weight: 600;">Part 2: Test Data Analysis</h4>
                        <p id="instructionsPart2" style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">Test Data Analysis - Input actual test measurements to calculate operational parameters and ratios based on real production data.</p>
                    </div>
                    <div style="margin-bottom: 8px;">
                        <h4 id="instructionsPart3Title" style="color: var(--part3-color); margin-bottom: 8px; font-size: 1.2em; font-weight: 600;">Part 3: Parameter Adjustment</h4>
                        <p id="instructionsPart3" style="color: var(--text-secondary); line-height: 1.6; margin-bottom: 16px;">Parameter Adjustment - Use results from Part 2 to calculate new operational parameters for different production requirements.</p>
                    </div>
                </div>
                
                <!-- Step Guide -->
                <div style="margin-bottom: 15px;">
                    <h4 id="instructionsStepGuideTitle" style="color: var(--text-primary); margin-bottom: 12px; font-size: 1.2em; font-weight: 600;">Step-by-Step Guide:</h4>
                    <ol id="instructionsSteps" style="color: var(--text-secondary); line-height: 1.8; padding-left: 20px; margin-bottom: 20px;">
                        <li>Choose the appropriate section (Part 1, 2, or 3) based on your needs</li>
                        <li>Fill in the known values in the input fields</li>
                        <li>For Part 1: Enter 0 in the field you want to calculate</li>
                        <li>Click Calculate to get results</li>
                        <li>Results are automatically copied to clipboard</li>
                        <li>Use Clear Data to reset the form</li>
                    </ol>
                </div>
                
                <!-- Notes -->
                <div style="background: rgba(255, 193, 7, 0.1); border: 1px solid var(--accent-warning); border-radius: 12px; padding: 16px;">
                    <p id="instructionsNotes" style="color: var(--accent-warning); margin: 0; font-weight: 500; display: flex; align-items: center; gap: 8px;">
                        <span style="font-size: 1.2em;">⚠️</span>
                        Note: Ratio is always required and cannot be zero. RPM values in Part 2 are optional but recommended for accurate Part 3 calculations.
                    </p>
                </div>
            </div>
        </div>
    `;
    
    return instructionsHTML;
}

// Insert instructions HTML into the page
function insertInstructionsHTML() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        const instructionsContainer = document.createElement('div');
        instructionsContainer.innerHTML = createInstructionsHTML();
        
        // Insert after the part navigation but before the first section
        const firstSection = mainContent.querySelector('.section');
        if (firstSection) {
            mainContent.insertBefore(instructionsContainer.firstElementChild, firstSection);
        } else {
            mainContent.appendChild(instructionsContainer.firstElementChild);
        }
    }
}

// Update instructions content with current language translations
function updateInstructionsTranslations(currentLang) {
    if (!translations || !translations[currentLang] || !translations[currentLang].instructions) {
        return;
    }
    
    // Only update if instructions section exists
    const instructionsSection = document.getElementById('instructionsSection');
    if (!instructionsSection) {
        return;
    }
    
    const t = translations[currentLang];
    
    // Update instructions content
    if (document.getElementById('instructionsTitle')) {
        document.getElementById('instructionsTitle').textContent = t.instructions.title;
    }
    if (document.getElementById('instructionsFormula')) {
        document.getElementById('instructionsFormula').textContent = t.instructions.formula;
    }
    if (document.getElementById('instructionsPart1Title')) {
        document.getElementById('instructionsPart1Title').textContent = t.instructions.part1Title;
    }
    if (document.getElementById('instructionsPart2Title')) {
        document.getElementById('instructionsPart2Title').textContent = t.instructions.part2Title;
    }
    if (document.getElementById('instructionsPart3Title')) {
        document.getElementById('instructionsPart3Title').textContent = t.instructions.part3Title;
    }
    if (document.getElementById('instructionsStepGuideTitle')) {
        document.getElementById('instructionsStepGuideTitle').textContent = t.instructions.stepGuideTitle;
    }
    if (document.getElementById('instructionsPart1')) {
        document.getElementById('instructionsPart1').textContent = t.instructions.part1Desc;
    }
    if (document.getElementById('instructionsPart2')) {
        document.getElementById('instructionsPart2').textContent = t.instructions.part2Desc;
    }
    if (document.getElementById('instructionsPart3')) {
        document.getElementById('instructionsPart3').textContent = t.instructions.part3Desc;
    }
    if (document.getElementById('instructionsNotes')) {
        const notesElement = document.getElementById('instructionsNotes');
        // Preserve the warning emoji icon and update only the text content
        notesElement.innerHTML = `
            <span style="font-size: 1.2em;">⚠️</span>
            ${t.instructions.notes}
        `;
    }

    // Update instructions steps
    const stepsList = document.getElementById('instructionsSteps');
    if (stepsList && t.instructions.steps) {
        stepsList.innerHTML = '';
        t.instructions.steps.forEach(step => {
            const li = document.createElement('li');
            li.textContent = step;
            stepsList.appendChild(li);
        });
    }
}

// Initialize instructions when DOM is loaded
function initializeInstructions() {
    // Insert instructions HTML structure
    insertInstructionsHTML();
    
    // Update with current language - always use global currentLang if available
    const lang = (typeof currentLang !== 'undefined' && currentLang) ? currentLang : 'en';
    updateInstructionsTranslations(lang);
}