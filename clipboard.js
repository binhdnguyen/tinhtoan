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
    successDiv.textContent = 'Copied to clipboard!';
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

function showCopyError() {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'copy-notification error';
    errorDiv.textContent = 'Failed to copy to clipboard';
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
    const t = translations[currentLang] || translations['en'];
    let clipboardText = `${t.part1}\n\n`;
    
    // Calculate final values based on calculation type
    let finalLineSpeed = lineSpeed;
    let finalOutput = output;
    let finalConsumption = concentration;
    
    if (calculationType === 'lineSpeed') {
        const outputInGmin = output * 60;
        finalLineSpeed = outputInGmin / concentration;
    } else if (calculationType === 'output') {
        const calculatedO_gmin = concentration * lineSpeed;
        finalOutput = calculatedO_gmin / 60;
    } else if (calculationType === 'consumption') {
        const outputInGmin = output * 60;
        finalConsumption = outputInGmin / lineSpeed;
    }
    
    // Show only non-zero input parameters (but use calculated values)
    if (lineSpeed !== 0) {
        clipboardText += `${t.lineSpeed}: ${Math.round(finalLineSpeed)} m/min\n`;
    }
    if (output !== 0) {
        clipboardText += `${t.output}: ${Math.round(finalOutput)} g/s\n`;
    }
    if (concentration !== 0) {
        clipboardText += `${t.consumption}: ${finalConsumption.toFixed(2)} g/m\n`;
    }
    clipboardText += `${t.ratio}: ${ratio}\n\n`;
    
    // Results section - show the calculated field (whichever input was 0)
    clipboardText += `${t.clipboardHeaders.results}:\n`;
    
    // Show the calculated value based on which input was 0
    if (calculationType === 'lineSpeed') {
        clipboardText += `${t.lineSpeed}: ${finalLineSpeed.toFixed(2)} m/min\n`;
    } else if (calculationType === 'output') {
        clipboardText += `${t.output}: ${finalOutput.toFixed(2)} g/s\n`;
    } else if (calculationType === 'consumption') {
        clipboardText += `${t.consumption}: ${finalConsumption.toFixed(2)} g/m\n`;
    }
    
    // Add material breakdown (Pol/Iso)
    const totalRatio = 1 + ratio;
    const polAmount = finalOutput / totalRatio;
    const isoAmount = finalOutput * ratio / totalRatio;
    clipboardText += `Pol: ${polAmount.toFixed(1)} g/s\n`;
    clipboardText += `Iso: ${isoAmount.toFixed(1)} g/s\n`;

    return clipboardText;
}

function generatePart2ClipboardText(linespeed, testTime, polyolWeight, isoWeight, polyolRpm, isoRpm, ratio, outputGs, consumptionGM, currentLang) {
    const t = translations[currentLang] || translations['en'];
    let clipboardText = `${t.part2}\n\n`;
    
    // Input parameters
    clipboardText += `${t.testLineSpeed}: ${linespeed} m/min\n`;
    clipboardText += `${t.testTime}: ${testTime} seconds\n`;
    clipboardText += `${t.polyolWeight}: ${polyolWeight} g\n`;
    clipboardText += `${t.isocyanateWeight}: ${isoWeight} g\n`;
    
    // Only show RPM values if they are greater than 0
    if (polyolRpm > 0) {
        clipboardText += `${t.polyolRPM}: ${polyolRpm} Hz\n`;
    }
    if (isoRpm > 0) {
        clipboardText += `${t.isoRPM}: ${isoRpm} Hz\n`;
    }

    // Results section
    clipboardText += `\n${t.clipboardHeaders.results}:\n`;
    clipboardText += `${t.ratio}: ${ratio.toFixed(2)}\n`;
    clipboardText += `${t.output}: ${outputGs.toFixed(2)} g/s\n`;
    clipboardText += `${t.consumption}: ${consumptionGM.toFixed(2)} g/m\n`;

    return clipboardText;
}

function generatePart3ClipboardText(newLinespeed, newConsumption, newRatio, newOutputGs, polyolWeightGs, isoWeightGs, timeBreakdownText, polyolRpm, isoRpm, currentLang) {
    const t = translations[currentLang] || translations['en'];
    let clipboardText = `${t.part3}\n\n`;
    
    // Input parameters
    clipboardText += `${t.newLineSpeed}: ${newLinespeed} m/min\n`;
    clipboardText += `${t.newConsumption}: ${newConsumption} g/m\n`;
    clipboardText += `${t.newRatio}: ${newRatio}\n\n`;

    // Results section
    clipboardText += `${t.clipboardHeaders.results}:\n`;
    clipboardText += `${t.output}: ${newOutputGs.toFixed(2)} g/s\n`;
    clipboardText += `Polyol: ${polyolWeightGs.toFixed(2)} g/s\n`;
    clipboardText += `Iso: ${isoWeightGs.toFixed(2)} g/s\n`;
    
    // New RPMs section - use translated header
    clipboardText += `${t.clipboardHeaders.newRPMs}:\n`;
    clipboardText += `Polyol: ${polyolRpm.toFixed(2)} Hz\n`;
    clipboardText += `Iso: ${isoRpm.toFixed(2)} Hz\n`;

    return clipboardText;
}