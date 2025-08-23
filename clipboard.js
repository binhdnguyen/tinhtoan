function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        // Use modern clipboard API
        navigator.clipboard.writeText(text).then(() => {
            showCopySuccess();
        }).catch(err => {
            console.error('Failed to copy to clipboard:', err);
            fallbackCopyToClipboard(text);
        });
    } else {
        // Fallback for older browsers or non-HTTPS contexts
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess();
    } catch (err) {
        console.error('Fallback: Failed to copy to clipboard:', err);
        showCopyError();
    }
    
    document.body.removeChild(textArea);
}

function showCopySuccess() {
    const successDiv = document.createElement('div');
    successDiv.className = 'copy-notification success';
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1000;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;
    successDiv.textContent = '✓ Copied to clipboard!';
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

function showCopyError() {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'copy-notification error';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #e74c3c;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 1000;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;
    errorDiv.textContent = '✗ Failed to copy to clipboard';
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Clipboard text generation functions
function generatePart1MaterialText(output, ratio, currentLang) {
    const totalRatio = 1 + ratio;
    const polAmount = output / totalRatio;
    const isoAmount = output * ratio / totalRatio;

    let materialText = `${translations[currentLang].materialAnalysis}:\n`;
    const multipliers = [1, 4, 6];
    
    multipliers.forEach(multiplier => {
        const pol = polAmount * multiplier;
        const iso = isoAmount * multiplier;
        const sum = pol + iso;
        materialText += `Weight x ${multiplier}s: Pol: ${pol.toFixed(1)}g, Iso: ${iso.toFixed(1)}g, ${translations[currentLang].total}: ${sum.toFixed(1)}g\n`;
    });

    return materialText;
}

function generatePart1ClipboardText(lineSpeed, output, concentration, ratio, currentLang, calculationType) {
    let clipboardText = `=== ${translations[currentLang].clipboardHeaders.part1} ===\n\n`;
    clipboardText += `${translations[currentLang].clipboardHeaders.inputParameters}:\n`;
    clipboardText += `${translations[currentLang].lineSpeed}: ${lineSpeed === 0 ? `0 (${translations[currentLang].clipboardHeaders.calculated})` : lineSpeed} ${translations[currentLang].unitMMin.replace('Unit: ', '')}\n`;
    clipboardText += `${translations[currentLang].output}: ${output === 0 ? `0 (${translations[currentLang].clipboardHeaders.calculated})` : output} ${translations[currentLang].unitGs.replace('Unit: ', '')}\n`;
    clipboardText += `${translations[currentLang].consumption}: ${concentration === 0 ? `0 (${translations[currentLang].clipboardHeaders.calculated})` : concentration} ${translations[currentLang].unitGm.replace('Unit: ', '')}\n`;
    clipboardText += `${translations[currentLang].ratio}: ${ratio}\n\n`;

    // Add results based on calculation type
    if (calculationType === 'lineSpeed') {
        const outputInGmin = output * 60;
        const calculatedL = outputInGmin / concentration;
        clipboardText += `${translations[currentLang].clipboardHeaders.results}:\n`;
        clipboardText += `${translations[currentLang].lineSpeed}: ${calculatedL.toFixed(1)} ${translations[currentLang].unitMMin.replace('Unit: ', '')}\n\n`;
        clipboardText += generatePart1MaterialText(output, ratio, currentLang);
    } else if (calculationType === 'output') {
        const calculatedO_gmin = concentration * lineSpeed;
        const calculatedO_gs = calculatedO_gmin / 60;
        clipboardText += `${translations[currentLang].clipboardHeaders.results}:\n`;
        clipboardText += `${translations[currentLang].output}: ${calculatedO_gs.toFixed(2)} ${translations[currentLang].unitGs.replace('Unit: ', '')}\n\n`;
        clipboardText += generatePart1MaterialText(calculatedO_gs, ratio, currentLang);
    } else if (calculationType === 'consumption') {
        const outputInGmin = output * 60;
        const calculatedC = outputInGmin / lineSpeed;
        clipboardText += `${translations[currentLang].clipboardHeaders.results}:\n`;
        clipboardText += `${translations[currentLang].consumption}: ${calculatedC.toFixed(2)} ${translations[currentLang].unitGm.replace('Unit: ', '')}\n\n`;
        clipboardText += generatePart1MaterialText(output, ratio, currentLang);
    }

    return clipboardText;
}

function generatePart2ClipboardText(linespeed, testTime, polyolWeight, isoWeight, polyolRpm, isoRpm, ratio, outputGs, consumptionGM, currentLang) {
    let clipboardText = `=== ${translations[currentLang].clipboardHeaders.part2} ===\n\n`;
    clipboardText += `${translations[currentLang].clipboardHeaders.inputParameters}:\n`;
    clipboardText += `${translations[currentLang].testLineSpeed}: ${linespeed} ${translations[currentLang].unitMMin.replace('Unit: ', '')}\n`;
    clipboardText += `${translations[currentLang].testTime}: ${testTime} ${translations[currentLang].unitSeconds.replace('Unit: ', '')}\n`;
    clipboardText += `${translations[currentLang].polyolWeight}: ${polyolWeight} g\n`;
    clipboardText += `${translations[currentLang].isocyanateWeight}: ${isoWeight} g\n`;
    clipboardText += `${translations[currentLang].polyolRPM}: ${polyolRpm} ${translations[currentLang].unitHz.replace('Unit: ', '')}\n`;
    clipboardText += `${translations[currentLang].isoRPM}: ${isoRpm} ${translations[currentLang].unitHz.replace('Unit: ', '')}\n\n`;

    clipboardText += `${translations[currentLang].clipboardHeaders.results}:\n`;
    clipboardText += `${translations[currentLang].ratio}: ${ratio.toFixed(2)}\n`;
    clipboardText += `${translations[currentLang].output}: ${outputGs.toFixed(2)} ${translations[currentLang].unitGs.replace('Unit: ', '')}\n`;
    clipboardText += `${translations[currentLang].consumption}: ${consumptionGM.toFixed(2)} ${translations[currentLang].unitGm.replace('Unit: ', '')}\n\n`;

    return clipboardText;
}

function generatePart3ClipboardText(newLinespeed, newConsumption, newRatio, newOutputGs, polyolWeightGs, isoWeightGs, timeBreakdownText, polyolRpm, isoRpm, currentLang) {
    let clipboardText = `=== ${translations[currentLang].clipboardHeaders.part3} ===\n\n`;
    clipboardText += `${translations[currentLang].clipboardHeaders.inputParameters}:\n`;
    clipboardText += `${translations[currentLang].newLineSpeed}: ${newLinespeed} ${translations[currentLang].unitMMin.replace('Unit: ', '')}\n`;
    clipboardText += `${translations[currentLang].newConsumption}: ${newConsumption} ${translations[currentLang].unitGm.replace('Unit: ', '')}\n`;
    clipboardText += `${translations[currentLang].newRatio}: ${newRatio}\n\n`;

    clipboardText += `${translations[currentLang].clipboardHeaders.results}:\n`;
    clipboardText += `${translations[currentLang].totalOutput}: ${newOutputGs.toFixed(2)} ${translations[currentLang].unitGs.replace('Unit: ', '')}\n\n`;
    
    clipboardText += `${translations[currentLang].componentWeights}:\n`;
    clipboardText += `${translations[currentLang].polyolWeight}: ${polyolWeightGs.toFixed(2)} ${translations[currentLang].unitGs.replace('Unit: ', '')}\n`;
    clipboardText += `${translations[currentLang].isocyanateWeight}: ${isoWeightGs.toFixed(2)} ${translations[currentLang].unitGs.replace('Unit: ', '')}\n\n`;
    
    clipboardText += `${translations[currentLang].timeBasedBreakdown}:\n`;
    clipboardText += timeBreakdownText + "\n";
    
    clipboardText += `${translations[currentLang].rpmAdjustment}:\n`;
    clipboardText += `${translations[currentLang].polyolRPM}: ${polyolRpm.toFixed(2)} ${translations[currentLang].unitHz.replace('Unit: ', '')}\n`;
    clipboardText += `${translations[currentLang].isoRPM}: ${isoRpm.toFixed(2)} ${translations[currentLang].unitHz.replace('Unit: ', '')}\n\n`;

    return clipboardText;
}