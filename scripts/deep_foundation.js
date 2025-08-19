function computePilesOnSand() {
    // Inputs for the calculation
    var pos_shape = document.getElementById("pos_shape").value; // Shape of the pile (Value: 1=Square, 2=Circle)
    // Corrected ID from 'pos_s' to 'pos_d' to match HTML
    var pos_d = parseFloat(document.getElementById("pos_d").value); // Diameter/Side of the pile (d)
    var pos_sand = document.getElementById("pos_sand").value; // Type of sand (Value: 1=Loose, 2=Dense)
    var pos_y = parseFloat(document.getElementById("pos_y").value); // Moist Unit Weight (y)
    var pos_ys = parseFloat(document.getElementById("pos_ys").value); // Saturated Unit Weight (ys)
    var pos_l = parseFloat(document.getElementById("pos_l").value); // Length of the pile (L)
    var pos_dw = parseFloat(document.getElementById("pos_dw").value); // Depth of the water table (Dw)
    var pos_u = parseFloat(document.getElementById("pos_u").value); // Coefficient of Friction (µ)
    var pos_nq = parseFloat(document.getElementById("pos_nq").value); // Bearing Capacity Factor (Nq)
    var pos_k = parseFloat(document.getElementById("pos_k").value); // Lateral Pressure Factor (K)
    var pos_fs = parseFloat(document.getElementById("pos_fs").value); // Factor of Safety (F.S.)

    // Check if any input is NaN (Not a Number) which happens if parsing fails (e.g., empty input)
    if (isNaN(pos_d) || isNaN(pos_y) || isNaN(pos_ys) || isNaN(pos_l) || isNaN(pos_dw) || isNaN(pos_u) || isNaN(pos_nq) || isNaN(pos_k) || isNaN(pos_fs) || pos_shape === "" || pos_sand === "") {
        alert("Please ensure all input fields are filled correctly.");
        return; // Stop the calculation if any input is invalid
    }

    // Step 1: Solve Critical Depth (Dc)
    // Use loose equality (==) for comparison as select values are strings
    var pos_dc;
    if (pos_sand == 2) { // Dense Sand (Value "2")
        // Corrected variable name from pos_s to pos_d
        pos_dc = pos_d * 20;
    } else if (pos_sand == 1) { // Loose Sand (Value "1")
        // Corrected variable name from pos_s to pos_d
        pos_dc = pos_d * 10;
    } else {
        // Handle case where sand type is not selected or invalid
        alert("Invalid sand type selected.");
        return;
    }

    // Step 2: Solve Effective Vertical Pressure at Pile Tip (considering critical depth)

    // Calculate effective stress at critical depth (Dc)
    var pos_pv1 = pos_dw * pos_y;

    // Calculate effective stress at depth L (L > Dc)
    var pos_pv2 = pos_pv1 + (pos_ys - 9.81) * (pos_dc - pos_dw);

    var pos_pvt;
    if(pos_dw == 0 && pos_ys == 0){
        pos_pvt = pos_dc * pos_y; // Effective vertical stress at depth L (L > Dc)
    } else {
        pos_pvt = pos_pv2;
    }

    // Step 3: Point Bearing Capacity (Qb)
    var pos_qb;
    if (pos_shape == 2) {
        pos_qb = pos_pvt * pos_nq * 0.25 * Math.PI * Math.pow(pos_d, 2); // Using original calculation structure
    } else if (pos_shape == 1) {
        pos_qb = pos_pvt * pos_nq * Math.pow(pos_d, 2); // Using original calculation structure
    } else {
        alert("Invalid pile shape selected.");
    }


    // Step 4: Perimeter of Pile (P)
    var pos_p;
    // Use loose equality (==) for comparison
    // Corrected logic: Assign formulas to the correct shape based on HTML value attributes
    if (pos_shape == 1) { // Square Pile (Value "1")
        // Corrected variable name from pos_s to pos_d
        pos_p = 4 * pos_d;
    } else if (pos_shape == 2) { // Circle Pile (Value "2")
        // Corrected Math.PI() to Math.PI and variable name from pos_s to pos_d
        pos_p = Math.PI * pos_d;
    }
    // No else needed here since shape validity checked in Step 3

    // Step 5: Area of Vertical Effective Stress Diagram along Pile Shaft (Apv)
    var pos_apv; // This represents the integral q'(z) dz from 0 to L
    if (pos_ys == 0 && pos_dw == 0) { 
        pos_apv = ((pos_pvt * pos_dc / 2) + pos_pvt * (pos_l - pos_dc));
    } else { 
        pos_apv = ((pos_pv1 * (pos_dw) / 2) + ((pos_pv1 + pos_pv2) / 2) * (pos_dc - pos_dw) + (pos_pv2) * (pos_l - pos_dc));
    }
     // Ensure area isn't negative
    pos_apv = Math.max(0, pos_apv);

    // Step 6: Frictional Capacity (Qf)
    var pos_qf = pos_p * pos_k * pos_u * pos_apv; // Frictional Capacity (Qf) for the pile

    // Step 7: Ultimate Bearing Capacity (Qu)
    var pos_qu = pos_qb + pos_qf; // Ultimate Bearing Capacity (Qu) for the pile

    // Step 8: Allowable Bearing Capacity (Qall)
    if (pos_fs <= 0) {
        alert("Factor of Safety must be greater than zero.");
        return;
    }
    var pos_qall = pos_qu / pos_fs; // Allowable Bearing Capacity (Qall) for the pile

    // Output the results, rounded to 3 decimal places
    document.getElementById("pos_qb").value = pos_qb.toFixed(3);
    document.getElementById("pos_qf").value = pos_qf.toFixed(3);
    document.getElementById("pos_qu").value = pos_qu.toFixed(3);
    document.getElementById("pos_qall").value = pos_qall.toFixed(3);
}

function clearPileOnSandForm() {
    // Reset the form inputs to their default values (usually empty or placeholder)
    document.getElementById("pilesOnSandForm").reset();

    // Manually clear the output fields
    document.getElementById("pos_qb").value = "";
    document.getElementById("pos_qf").value = "";
    document.getElementById("pos_qu").value = "";
    document.getElementById("pos_qall").value = "";
}

function computePilesOnClayA() {
    // Inputs for the calculation
    var posa_shape = document.getElementById("posa_shape").value; // Shape of the pile (Value: 1=Square, 2=Circle)
    var posa_s = parseFloat(document.getElementById("posa_s").value); // Diameter/Side of the pile (d or s)
    var posa_y = parseFloat(document.getElementById("posa_y").value); // Unit Weight (y) - Note: Not used in current calculations
    var posa_l = parseFloat(document.getElementById("posa_l").value); // Length of the pile (L)
    var posa_a = parseFloat(document.getElementById("posa_a").value); // Adhesion Factor (α)
    // Reads from the input field with the corrected ID
    var posa_qu_input_val = parseFloat(document.getElementById("posa_qu_input").value); // Unconfined Compressive Strength (qu)
    var posa_nc = parseFloat(document.getElementById("posa_nc").value); // Bearing Capacity Factor (Nc)
    var posa_fs = parseFloat(document.getElementById("posa_fs").value); // Factor of Safety (F.S.)

    // Check for valid inputs (basic check)
    if (isNaN(posa_s) || isNaN(posa_y) || isNaN(posa_l) || isNaN(posa_a) || isNaN(posa_qu_input_val) || isNaN(posa_nc) || isNaN(posa_fs) || posa_shape === "") {
        alert("Please fill in all required fields with valid numbers.");
        return;
    }
    if (posa_fs <= 0) {
         alert("Factor of Safety must be a positive number.");
         return;
    }

    var posa_qf; // Variable for Frictional Capacity (Qf)

    // Step 1: End Bearing Capacity (Qb)
    if (posa_shape == 2) { // Circle
        var posa_qb = (posa_qu_input_val / 2) * posa_nc * Math.PI * Math.pow(posa_s, 2) * 0.25;
    } else if (posa_shape == 1) { // Square
        var posa_qb = (posa_qu_input_val / 2) * posa_nc * Math.pow(posa_s, 2); 
    } else {
        alert("Invalid shape selected.");
    }

    // Step 2: Skin Friction (Qf)
    if (posa_shape == 2) { // Circle
        // Formula: Qf = α * Cu * As = α * (qu/2) * (PI * d * L)
        var posa_qf = posa_a * (posa_qu_input_val / 2) * Math.PI * posa_s * posa_l;
    } else if (posa_shape == 1) { // Square - Corrected typo 'pos_shape' to 'posa_shape'
        // Formula: Qf = α * Cu * As = α * (qu/2) * (4 * s * L)
        var posa_qf = posa_a * (posa_qu_input_val / 2) * 4 * posa_s * posa_l;
    } else {
        // This part should ideally not be reached if shape check passed above, but included for robustness
        alert("Invalid shape selected.");
    }

    // Step 3: Ultimate Load Bearing Capacity (Qu)
    // Corrected: Summing Qb and Qf. Original had 'posa_qt' which was undefined.
    var posa_qu_ultimate = posa_qb + posa_qf;

    // Step 4: Allowable Bearing Capacity (Qall)
    // Corrected: Using the calculated ultimate capacity
    var posa_qall = posa_qu_ultimate / posa_fs;

    // Output the results, rounded to 3 decimal places
    document.getElementById("posa_qb").value = posa_qb.toFixed(3);
    document.getElementById("posa_qf").value = posa_qf.toFixed(3);
    // Outputting the calculated ultimate capacity to the 'posa_qu' output field
    document.getElementById("posa_qu").value = posa_qu_ultimate.toFixed(3);
    document.getElementById("posa_qall").value = posa_qall.toFixed(3);
}

function clearPilesOnClayAForm() {
    // Clear Input Fields
    document.getElementById("posa_shape").value = ""; // Reset dropdown to default
    document.getElementById("posa_s").value = "";
    document.getElementById("posa_y").value = "";
    document.getElementById("posa_l").value = "";
    document.getElementById("posa_a").value = "";
    document.getElementById("posa_qu_input").value = ""; // Clear the renamed input field
    document.getElementById("posa_nc").value = "";
    document.getElementById("posa_fs").value = "";

    // Clear Output Fields
    document.getElementById("posa_qb").value = "";
    document.getElementById("posa_qf").value = "";
    document.getElementById("posa_qu").value = ""; // Clear the ultimate capacity output field
    document.getElementById("posa_qall").value = "";
}

function computePilesOnClayA2() {
    // Inputs for the calculation
    var posa2_shape = document.getElementById("posa2_shape").value; // Shape of the pile (Value: 1=Square, 2=Circle)
    var posa2_s = parseFloat(document.getElementById("posa2_s").value); // Diameter/Side of the pile (d or s)
    var posa2_y = parseFloat(document.getElementById("posa2_y").value); // Unit Weight (y)
    var posa2_ys = parseFloat(document.getElementById("posa2_ys").value); // Saturated Unit Weight (ys) (ys)
    var posa2_l = parseFloat(document.getElementById("posa2_l").value); // Length of the pile (L)
    var posa2_dw = parseFloat(document.getElementById("posa2_dw").value); // Depth of Water Table (Dw)
    var posa2_c1 = parseFloat(document.getElementById("posa2_c1").value); // Cohesion (C1)
    var posa2_c2 = parseFloat(document.getElementById("posa2_c2").value); // Cohesion (C2)
    var posa2_a1 = parseFloat(document.getElementById("posa2_a1").value); // Adhesion Factor (a1)
    var posa2_a2 = parseFloat(document.getElementById("posa2_a2").value); // Adhesion Factor (a2)

    // Step 1: Skin Resistance
    var posa2_qf
    if (posa2_shape == 2){
        posa2_qf = (posa2_a1 * posa2_c1) * ((Math.PI * posa2_s) * posa2_dw) + (posa2_a2 * posa2_c2) * (Math.PI * posa2_s) * (posa2_l - posa2_dw);
    } else if (posa2_shape == 1){
        var posa2_qf = (posa2_a1 * posa2_c1) * (4 * posa2_s) + (posa2_a2 * posa2_c2) * (4 * posa2_s) * (posa2_l - posa2_dw);
    }

    document.getElementById("posa2_qf").value = posa2_qf.toFixed(3);
}

function clearPilesOnClayA2Form() {
    // Clear Input Fields
    document.getElementById("posa2_shape").value = ""; // Reset dropdown
    document.getElementById("posa2_s").value = "";
    document.getElementById("posa2_y").value = "";
    document.getElementById("posa2_ys").value = "";
    document.getElementById("posa2_l").value = "";
    document.getElementById("posa2_dw").value = "";
    document.getElementById("posa2_c1").value = "";
    document.getElementById("posa2_c2").value = "";
    document.getElementById("posa2_a1").value = "";
    document.getElementById("posa2_a2").value = "";

    // Clear Output Fields
    document.getElementById("posa2_qf").value = "";
}

function computePilesOnClayY() {
    // Inputs for the calculation
    var posy_shape = document.getElementById("posy_shape").value; // Shape of the pile (Value: 1=Square, 2=Circle)
    // Corrected IDs below
    var posy_s = parseFloat(document.getElementById("posy_s").value); // Diameter/Side of the pile (d or s)
    var posy_y = parseFloat(document.getElementById("posy_y").value); // Unit Weight (y)
    var posy_l = parseFloat(document.getElementById("posy_l").value); // Length of the pile (L)
    var posy_fcy = parseFloat(document.getElementById("posy_fcy").value); // Frictional Coefficient (fcy / gamma)
    var posy_qu = parseFloat(document.getElementById("posy_qu").value); // Unconfined Compressive Strength (qu)

    // Basic Input Validation
    if (posy_shape === "" || isNaN(posy_s) || isNaN(posy_y) || isNaN(posy_l) || isNaN(posy_fcy) || isNaN(posy_qu)) {
        alert("Please fill in all required fields with valid numbers.");
        return; // Stop execution if validation fails
    }

    var posy_p; // Perimeter variable

    // Step 1: Perimeter of Pile
    if (posy_shape == 2) { // Circle
        posy_p = Math.PI * posy_s;
    } else if (posy_shape == 1) { // Square
        posy_p = 4 * posy_s;
    } else {
        // This case should ideally not be hit due to the initial check, but good practice
        alert("Invalid shape selected.");
        return; // Stop execution
    }

    // Step 2: Average Vertical Pressure
    var posy_qv = posy_y * posy_l / 2; // Average vertical pressure (qv)

    // Step 3: Cohesion of Clay (Undrained Shear Strength, Cu)
    var posy_c = posy_qu / 2; // Cohesion of clay (c)

    // Step 4: Skin Friction: (Calculation logic unchanged as requested)
    var posy_qf = posy_p * posy_l * posy_fcy * (posy_qv + 2 * posy_c); // Skin friction (Qf)

    // Output the results, rounded to 3 decimal places
    document.getElementById("posy_qf").value = posy_qf.toFixed(3);
}

function clearPilesOnClayYForm() {
    // Clear Input Fields
    document.getElementById("posy_shape").value = ""; // Reset dropdown
    document.getElementById("posy_s").value = "";
    document.getElementById("posy_y").value = "";
    document.getElementById("posy_l").value = "";
    document.getElementById("posy_fcy").value = "";
    document.getElementById("posy_qu").value = "";

    // Clear Output Fields
    document.getElementById("posy_qf").value = "";
}

function computePilesOnClayY2() {
    // Inputs for the calculation
    var posy2_shape = document.getElementById("posy2_shape").value; // Shape of the pile (Value: 1=Square, 2=Circle)
    var posy2_s = parseFloat(document.getElementById("posy2_s").value); // Diameter/Side of the pile (d or s)
    var posy2_y = parseFloat(document.getElementById("posy2_y").value); // Unit Weight (y)
    var posy2_ys = parseFloat(document.getElementById("posy2_ys").value); // Saturated Unit Weight (ys) (ys)
    var posy2_l = parseFloat(document.getElementById("posy2_l").value); // Length of the pile (L)
    var posy2_dw = parseFloat(document.getElementById("posy2_dw").value); // Depth of Water Table (Dw)
    var posy2_c1 = parseFloat(document.getElementById("posy2_c1").value); // Cohesion (C1)
    var posy2_c2 = parseFloat(document.getElementById("posy2_c2").value); // Cohesion (C2)
    var posy2_fcy1 = parseFloat(document.getElementById("posy2_fcy1").value); // Frictional Coefficient (y1)
    var posy2_fcy2 = parseFloat(document.getElementById("posy2_fcy2").value); // Fricitional Coeffiicient (y2)

    // Step 1: Perimeter of Pile
    if (posy2_shape == 2){
        var posy2_p = Math.PI * posy2_s;
    } else if (posy2_shape == 1){
        var posy2_p = 4 * posy2_s;
    }

    // Step 2: Skin Friction Above
    var posy2_qf1 = (posy2_p * posy2_dw * posy2_fcy1 * (posy2_y * (posy2_dw / 2) + 2 * posy2_c1)); // Skin friction above water table (Qf1)
    
    // Step 3: Skin Friction Below
    var posy2_qf2 = (posy2_p * (posy2_l - posy2_dw) * posy2_fcy2 * ((posy2_y * posy2_dw + (posy2_ys - 9.81) * ((posy2_l - posy2_dw) / 2)) + 2 * posy2_c2)); // Skin friction below water table (Qf2)

    // Step 4: Total Skin Friction (Qf)
    var posy2_qf = posy2_qf1 + posy2_qf2; // Total skin friction (Qf)

    document.getElementById("posy2_qf").value = posy2_qf.toFixed(3);
}

function clearPilesOnClayY2Form() {
    // Clear Input Fields
    document.getElementById('posy2_shape').value = ''; // Reset dropdown to default/placeholder
    document.getElementById('posy2_s').value = '';
    document.getElementById('posy2_y').value = '';
    document.getElementById('posy2_ys').value = '';
    document.getElementById('posy2_l').value = '';
    document.getElementById('posy2_dw').value = '';
    document.getElementById('posy2_c1').value = '';
    document.getElementById('posy2_c2').value = '';
    document.getElementById('posy2_a1').value = '';
    document.getElementById('posy2_a2').value = ''; // Clear the second adhesion factor (uses corrected ID)

    // Clear Output Field
    document.getElementById('posy2_qf').value = '';

    // Optional: You could set the focus back to the first input field
    // document.getElementById('posy2_shape').focus();
}

/**
 * Helper function to convert degrees to radians.
 * @param {number} degrees Angle in degrees.
 * @returns {number} Angle in radians.
 */
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

function computePilesOnClayB() {
    // Inputs for the calculation
    var posb_shape = document.getElementById("posb_shape").value; // Shape of the pile (Value: 1=Square, 2=Circle)
    var posb_s = parseFloat(document.getElementById("posb_s").value); // Diameter/Side of the pile (d or s) - ID corrected
    var posb_y = parseFloat(document.getElementById("posb_y").value); // Unit Weight (y)
    var posb_l = parseFloat(document.getElementById("posb_l").value); // Length of the pile (L)
    var posb_dfa = parseFloat(document.getElementById("posb_dfa").value); // Drained Friction Angle (assumed in degrees)
    var posb_ocr = parseFloat(document.getElementById("posb_ocr").value); // Over Consolidated Ratio

    // Input validation (basic check for NaN which occurs if fields are empty or non-numeric)
    if (isNaN(posb_s) || isNaN(posb_y) || isNaN(posb_l) || isNaN(posb_dfa) || isNaN(posb_ocr) || posb_shape === "") {
        alert("Please ensure all input fields are filled correctly.");
        // Clear output field in case of invalid input
        document.getElementById("posb_qf").value = '';
        return; // Stop execution
    }

    var posb_p; // Perimeter variable

    // Step 1: Perimeter of Pile
    if (posb_shape == 2) { // Circle
        posb_p = Math.PI * posb_s;
    } else if (posb_shape == 1) { // Square
        posb_p = 4 * posb_s;
    } else {
        // This case might be hit if the dropdown value is somehow invalid after initial selection
        alert("Invalid shape selected.");
         document.getElementById("posb_qf").value = ''; // Clear output
        return; // Stop execution
    }

    // Step 2: Value of Beta
    var betaTerm; // Term involving friction angle
    // CORRECTED: Replaced Math.radians with degreesToRadians helper function
    betaTerm = (1 - Math.sin(degreesToRadians(posb_dfa))) * Math.tan(degreesToRadians(posb_dfa));

    var posb_b; // Beta value
    if (posb_ocr <= 1) { // Typically OCR >= 1. Consider OCR=0 case or adjust logic if needed. Using <=1 for general case.
        posb_b = betaTerm; // For Normally Consolidated (OCR=1) or if input is 0/invalid
    } else { // Over Consolidated (OCR > 1)
        posb_b = betaTerm * Math.sqrt(posb_ocr);
    }

    // Step 3: Skin Friction
    // Note: The term (posb_y * (posb_l / 2)) represents the average effective vertical stress
    // This assumes uniform soil properties along the pile length and water table at the surface or very deep.
    // More complex scenarios might require different effective stress calculations.
    var averageEffectiveStress = posb_y * (posb_l / 2); // Basic calculation
    var posb_qf = posb_p * posb_l * posb_b * averageEffectiveStress;

    // Output the results, rounded to 3 decimal places
    // CORRECTED: Output ID changed from posy_qf to posb_qf
    document.getElementById("posb_qf").value = posb_qf.toFixed(3);
}

/**
 * Clears all input and output fields within the Piles on Clay (b) form.
 */
function clearPilesOnClayBForm() {
    // Clear Input Fields
    document.getElementById('posb_shape').value = ''; // Reset dropdown to default/placeholder
    document.getElementById('posb_s').value = '';
    document.getElementById('posb_y').value = '';
    document.getElementById('posb_l').value = '';
    document.getElementById('posb_dfa').value = '';
    document.getElementById('posb_ocr').value = '';

    // Clear Output Field
    document.getElementById('posb_qf').value = '';

    // Optional: Set focus back to the first input field
    // document.getElementById('posb_shape').focus();
}

/**
 * Helper function to convert degrees to radians.
 * @param {number} degrees Angle in degrees.
 * @returns {number} Angle in radians.
 */
function degreesToRadians(degrees) {
    // Add check for NaN or non-numeric input to helper
    if (typeof degrees !== 'number' || isNaN(degrees)) {
        return NaN; // Return NaN if input is invalid
    }
    return degrees * (Math.PI / 180);
}

function computePilesOnClayB2() {
    // Inputs for the calculation
    const posb2_shape = document.getElementById("posb2_shape").value; // Shape of the pile (Value: 1=Square, 2=Circle)
    // CORRECTED: Get element by ID 'posb2_d' and use variable posb2_d
    const posb2_d = parseFloat(document.getElementById("posb2_d").value); // Diameter/Side of the pile (d)
    const posb2_y = parseFloat(document.getElementById("posb2_y").value); // Unit Weight (y)
    const posb2_ys = parseFloat(document.getElementById("posb2_ys").value); // Saturated Unit Weight (ys)
    const posb2_l = parseFloat(document.getElementById("posb2_l").value); // Length of the pile (L)
    const posb2_dw = parseFloat(document.getElementById("posb2_dw").value); // Depth of Water Table (Dw)
    const posb2_dfa1 = parseFloat(document.getElementById("posb2_dfa1").value); // Drained Friction Angle Layer 1 (degrees)
    const posb2_dfa2 = parseFloat(document.getElementById("posb2_dfa2").value); // Drained Friction Angle Layer 2 (degrees)
    const posb2_ocr = parseFloat(document.getElementById("posb2_ocr").value); // Over Consolidation Ratio (Read but not used in provided calculation)

    const UNIT_WEIGHT_WATER = 9.81; // Define unit weight of water as a constant (kN/m^3)

    // --- Basic Input Validation ---
    const inputs = [posb2_d, posb2_y, posb2_ys, posb2_l, posb2_dw, posb2_dfa1, posb2_dfa2, posb2_ocr];
    if (posb2_shape === "" || inputs.some(isNaN)) { // Check if shape is selected and all numeric inputs are valid numbers
        alert("Please ensure all input fields are filled correctly with numeric values.");
        document.getElementById("posb2_qf").value = ''; // Clear output on error
        return; // Stop execution
    }
     // Add check: Water table depth cannot be greater than pile length
     if (posb2_dw > posb2_l) {
        alert("Depth of Water Table (Dw) cannot be greater than Length of Pile (L).");
        document.getElementById("posb2_qf").value = ''; // Clear output on error
        return; // Stop execution
    }
    // --- End Validation ---


    // Step 1: Perimeter of Pile
    let posb2_p; // Use let as it's reassigned
    // CORRECTED: Use posb2_d instead of posb2_s
    if (posb2_shape == 2) { // Circle
        posb2_p = Math.PI * posb2_d;
    } else if (posb2_shape == 1) { // Square
        posb2_p = 4 * posb2_d;
    } else {
        alert("Invalid shape selected."); // Should not happen with validation, but keep as fallback
        document.getElementById("posb2_qf").value = '';
        return;
    }

    // Convert angles to radians AFTER validation
    const rad_dfa1 = degreesToRadians(posb2_dfa1);
    const rad_dfa2 = degreesToRadians(posb2_dfa2);
    if (isNaN(rad_dfa1) || isNaN(rad_dfa2)) {
         alert("Invalid friction angle entered.");
         document.getElementById("posb2_qf").value = ''; // Clear output on error
         return; // Stop execution
    }

    // Step 2: Skin Friction Above Water Table (Qf1)
    // Formula uses average vertical effective stress above WT = (gamma * Dw / 2)
    // Beta method coefficient = (1 - sin(phi')) * tan(phi')
    const beta1 = (1 - Math.sin(rad_dfa1)) * Math.tan(rad_dfa1);
    const avg_eff_stress_above = (posb2_y * posb2_dw / 2);
    const posb2_qf1 = posb2_p * posb2_dw * beta1 * avg_eff_stress_above;

    // Step 3: Skin Friction Below Water Table (Qf2)
    // Length below water table
    //const length_below_wt = posb2_l - posb2_dw;
    // Average vertical effective stress below WT
    // Stress at WT + average buoyant stress increase below WT
    // = (gamma * Dw) + (gamma_buoyant * length_below / 2)
    // = (gamma * Dw) + ( (gamma_sat - gamma_w) * length_below / 2 )
    //const avg_eff_stress_below = (posb2_y * posb2_dw) + ((posb2_ys - UNIT_WEIGHT_WATER) * (length_below_wt / 2));
    ///const avg_eff_stress_below = Math.sqrt(posb2_ocr) * (posb2_y * posb2_dw) + ((posb2_ys - UNIT_WEIGHT_WATER) * (length_below_wt / 2));
    // Beta method coefficient for layer 2
    //const beta2 = (1 - Math.sin(rad_dfa2)) * Math.tan(rad_dfa2);
    const posb2_qf2 = posb2_p * (posb2_l - posb2_dw) * (1 - Math.sin(rad_dfa2)) * Math.tan(rad_dfa2) * Math.sqrt(posb2_ocr) * (posb2_y * posb2_dw + (posb2_ys - UNIT_WEIGHT_WATER) * (posb2_l - posb2_dw) / 2);
    //document.getElementById("posb2_qf2").value = posb2_qf2.toFixed(3);
    // Step 4: Total Skin Friction (Qf)
    // Check if qf1 or qf2 resulted in NaN (can happen with tan(90 degrees))
     let posb2_qf;
     if (isNaN(posb2_qf1) || isNaN(posb2_qf2)) {
         posb2_qf = NaN; // Propagate NaN if any part is invalid
         alert("Calculation resulted in an invalid number. Check friction angles (e.g., 90 degrees).");
     } else {
         posb2_qf = posb2_qf1 + posb2_qf2; // Total skin friction (Qf)
     }


    // Output the result or empty string if NaN
    document.getElementById("posb2_qf").value = isNaN(posb2_qf) ? '' : posb2_qf.toFixed(3);
}


/**
 * Clears all input and output fields within the Piles on Clay (b2) form.
 */
function clearPilesOnClayB2Form() {
    // Clear Input Fields
    document.getElementById('posb2_shape').value = ''; // Reset dropdown
    document.getElementById('posb2_d').value = '';     // Use corrected ID
    document.getElementById('posb2_y').value = '';
    document.getElementById('posb2_ys').value = '';
    document.getElementById('posb2_l').value = '';
    document.getElementById('posb2_dw').value = '';
    document.getElementById('posb2_dfa1').value = '';
    document.getElementById('posb2_dfa2').value = '';
    document.getElementById('posb2_ocr').value = '';   // Clear OCR even if unused in calc

    // Clear Output Field
    document.getElementById('posb2_qf').value = '';

    // Optional: Set focus back to the first input field
    // document.getElementById('posb2_shape').focus();
}

function computePilesActIndivdually() {
    // Inputs for the calculation
    var pai_shape = document.getElementById("pai_shape").value; // Shape of the pile (Value: 1=Square, 2=Circle)
    // Corrected ID from 'pos_s' to 'pos_d' to match HTML
    var pai_s = parseFloat(document.getElementById("pai_s").value); // Side Length/Diameter
    var pai_y = document.getElementById("pai_y").value; // Moist Unit Weight (y)
    var pai_l = parseFloat(document.getElementById("pai_l").value); // Length of Pile (L)
    var pai_sc = parseFloat(document.getElementById("pai_sc").value); // Center-center Spacing (Sc)
    var pai_c = parseFloat(document.getElementById("pai_c").value); // Cohesion (C)
    var pai_a = parseFloat(document.getElementById("pai_a").value); // Adhesion Factor (α)
    var pai_nc = parseFloat(document.getElementById("pai_nc").value); // Bearing Capacity Factor (Nc)
    var pai_n = parseFloat(document.getElementById("pai_n").value); // Number of Piles (n)
    var pai_fs = parseFloat(document.getElementById("pai_fs").value); // Factor of Safety (F.S.)
    var pai_m = parseFloat(document.getElementById("pai_m").value); // Number of Column (m)
    var pai_r = parseFloat(document.getElementById("pai_r").value); // Number of Rows (n)

    // Step 1: Perimeter

    var pai_p;
    if (pai_shape == 2) { 
        pai_p = pai_s * Math.PI;
    } else if (pai_shape == 1) {
        pai_p = pai_s * 4;
    } else {
        alert("Invalid shape selected.");
        return;
    }
    
    // Step 2: Point Bearing Capacity

    if (pai_shape == 2) { // Circle
        var pai_qb = pai_c * pai_nc *(0.25 * Math.PI * Math.pow(pai_s, 2)); // Using original calculation structure
    } else if (pai_shape == 1) { // Square
        var pai_qb = pai_c * pai_nc * Math.pow(pai_s, 2); // Using original calculation structure
    } else {
        alert("Invalid pile shape selected.");
        return; // Stop execution if invalid shape
    }

    // Step 3: Skin Friction
    var pai_qf = pai_a * pai_c * pai_p * pai_l; // Skin friction (Qf)

    // Step 4: Ultimate Load Bearing Capacity
    var pai_qu = (pai_qb + pai_qf) * pai_n; // Ultimate Load Bearing Capacity (Qu)
    
    // Step 5: Allowable Load Bearing Capacity
    var pai_qall = pai_qu / pai_fs;

    // Step 6: Allowable Load Bearing Capacity for Group Effect
    var pai_qgall;

    pai_qgall = pai_qall * (2 * (pai_m + pai_r - 2) * pai_sc + 4 * pai_s) / (pai_p * pai_m * pai_r); // Allowable Load Bearing Capacity for Group Effect (Qgall)

    // Output the results, rounded to 3 decimal places
    document.getElementById("pai_qu").value = pai_qu.toFixed(3);
    document.getElementById("pai_qall").value = pai_qall.toFixed(3);
    document.getElementById("pai_qgall").value = pai_qgall.toFixed(3);
}

function clearPileActIndividually() {
    // Clear Input Fields
    document.getElementById('pai_shape').value = ''; // Reset dropdown
    document.getElementById('pai_s').value = '';
    document.getElementById('pai_y').value = '';
    document.getElementById('pai_l').value = '';
    document.getElementById('pai_sc').value = '';
    document.getElementById('pai_c').value = '';
    document.getElementById('pai_a').value = '';
    document.getElementById('pai_nc').value = '';
    document.getElementById('pai_n').value = '';
    document.getElementById('pai_fs').value = '';
    document.getElementById('pai_m').value = '';
    document.getElementById('pai_r').value = '';

    // Clear Output Fields
    document.getElementById('pai_qu').value = '';
    document.getElementById('pai_qall').value = '';
    document.getElementById('pai_qgall').value = '';

    // Optional: Set focus back to the first input field
    // document.getElementById('pai_shape').focus();
}

function computePilesActAsBlock() {
    // Inputs for the calculation
    var pab_shape = document.getElementById("pab_shape").value; // Shape of the pile (Value: 1=Square, 2=Circle)
    var pab_s = parseFloat(document.getElementById("pab_s").value); // Side Length/Diameter
    var pab_y = document.getElementById("pab_y").value; // Moist Unit Weight (y)
    var pab_l = parseFloat(document.getElementById("pab_l").value); // Length of Pile (L)
    var pab_sc = parseFloat(document.getElementById("pab_sc").value); // Center-center Spacing (Sc)
    var pab_c = parseFloat(document.getElementById("pab_c").value); // Cohesion (C)
    var pab_a = parseFloat(document.getElementById("pab_a").value); // Adhesion Factor (α)
    var pab_nc = parseFloat(document.getElementById("pab_nc").value); // Bearing Capacity Factor (Nc)
    var pab_n = parseFloat(document.getElementById("pab_n").value); // Number of Piles (n)
    var pab_fs = parseFloat(document.getElementById("pab_fs").value); // Factor of Safety (F.S.)
    var pab_m = parseFloat(document.getElementById("pab_m").value); // Number of Column (m)
    var pab_r = parseFloat(document.getElementById("pab_r").value); // Number of Rows (r)

    // Step 1: Width of Block
    var pab_wb = pab_s + pab_sc * (pab_m - 1); // Width of Block (Wb)

    // Step 2: Length of Block

    var pab_lb = pab_s + pab_sc * (pab_r - 1); // Length of Block (Lb)

    // Step 3: Point Bearing Capacity
    var pab_qb = (pab_c * pab_nc * pab_wb * pab_lb); // Skin friction (Qf)

    // Step 4: Skin Friction
    var pab_qf = pab_a * pab_c * 2 * (pab_wb + pab_lb) * pab_l; // Ultimate Load Bearing Capacity (Qu)

    // Step 5: Ultimate Load Bearing Capacity
    var pab_qu = pab_qb + pab_qf; // Ultimate Load Bearing Capacity (Qu)

    // Step 6: Allowable Load Bearing Capacity
    var pab_qall = pab_qu / pab_fs; // Allowable Load Bearing Capacity (Qall)

    // Output the results, rounded to 3 decimal places
    document.getElementById("pab_qu").value = pab_qu.toFixed(3);
    document.getElementById("pab_qall").value = pab_qall.toFixed(3);
}

function clearPileActBlock() {
    // --- Clear Input Fields ---

    // Reset the shape dropdown to the default "Select shape" option
    document.getElementById('pab_shape').value = ''; 
    // Or alternatively, if you always want the first option (index 0):
    // document.getElementById('pab_shape').selectedIndex = 0; 

    // Clear numeric input fields
    document.getElementById('pab_s').value = '';
    document.getElementById('pab_y').value = '';
    document.getElementById('pab_l').value = '';
    document.getElementById('pab_sc').value = '';
    document.getElementById('pab_c').value = '';
    document.getElementById('pab_a').value = '';
    document.getElementById('pab_nc').value = '';
    document.getElementById('pab_n').value = '';
    document.getElementById('pab_fs').value = '';
    document.getElementById('pab_m').value = '';
    document.getElementById('pab_r').value = '';

    // --- Clear Output Fields ---
    document.getElementById('pab_qu').value = '';
    document.getElementById('pab_qall').value = '';

    // Optional: You could also refocus the first input element for better UX
    // document.getElementById('pab_shape').focus(); 
}

function clearSpacingForm() {
    // Clear Input Fields
    document.getElementById('spacing_shape').value = ''; // Reset dropdown
    document.getElementById('spacing_s').value = '';
    document.getElementById('spacing_m').value = '';
    document.getElementById('spacing_n').value = '';
    document.getElementById('spacing_eg').value = '';

    // Clear Output Fields
    document.getElementById('spacing_sc').value = '';
    document.getElementById('spacing_sp').value = '';

    // Optional: Set focus back to the first input field
    // document.getElementById('spacing_shape').focus();
}

function computeSpacing() {
    // --- Get Inputs ---
    const spacing_shape = document.getElementById("spacing_shape").value; // Shape: 1=Square, 2=Circle
    const spacing_s = parseFloat(document.getElementById("spacing_s").value); // Diameter/Side (d or s)
    const spacing_m = parseFloat(document.getElementById("spacing_m").value); // Number of Columns (m)
    const spacing_n = parseFloat(document.getElementById("spacing_n").value); // Number of Rows (n) - Corrected variable name consistency
    const spacing_eg = parseFloat(document.getElementById("spacing_eg").value); // Efficiency (Eg)

    // --- Basic Input Validation ---
    if (isNaN(spacing_s) || isNaN(spacing_m) || isNaN(spacing_n) || isNaN(spacing_eg) || spacing_shape === "") {
        alert("Please ensure all input fields are filled correctly with valid numbers.");
        // Clear potentially partially calculated outputs if needed
        document.getElementById("spacing_sc").value = '';
        document.getElementById("spacing_sp").value = '';
        return; // Stop execution if input is invalid
    }
     if (spacing_m + spacing_n <= 2) {
         alert("The sum of columns (m) and rows (n) must be greater than 2 for this calculation.");
         document.getElementById("spacing_sc").value = '';
         document.getElementById("spacing_sp").value = '';
         return;
     }


    // --- Initialize output variables ---
    let spacing_sc = 0; // Minimum Pile Spacing (Calculated)
    let spacing_sp = 0; // Preferred Spacing (Derived from spacing_sc)

    // --- Step 1: Calculate Minimum Spacing (Sc) based on shape ---
    // CORRECTED: Used 'spacing_shape' variable instead of 'posb_shape'
    if (spacing_shape == "2") { // Circle (value is "2")
        // Calculation logic unchanged as requested
        spacing_sc = ((spacing_eg / 100) * (Math.PI * spacing_s) * spacing_m * spacing_n - 4 * spacing_s) / (2 * (spacing_m + spacing_n - 2));
    } else if (spacing_shape == "1") { // Square (value is "1")
         // Calculation logic unchanged as requested
        spacing_sc = ((spacing_eg / 100) * (4 * spacing_s) * spacing_m * spacing_n - 4 * spacing_s) / (2 * (spacing_m + spacing_n - 2));
    } else {
        // Should not happen if HTML is correct, but good practice to handle
        alert("Invalid shape selected. Please select Square or Circle.");
        document.getElementById("spacing_sc").value = '';
        document.getElementById("spacing_sp").value = '';
        return; // Stop if shape is invalid
    }

    // --- Step 2: Calculate Preferred Spacing (Sp) ---
    // CORRECTED: Math.ceiling is not a function. Using Math.ceil()
    // Assuming the goal was to round *up* to the nearest 0.1
    if (!isNaN(spacing_sc) && isFinite(spacing_sc) && spacing_sc > 0) { // Check if spacing_sc is a valid positive number before rounding
       spacing_sp = Math.ceil(spacing_sc * 10) / 10; // Rounds UP to the nearest 0.1
    } else {
       // Handle cases where spacing_sc might be invalid (e.g., division by zero if m+n=2, or negative result)
       spacing_sc = NaN; // Indicate invalid calculation
       spacing_sp = NaN;
       alert("Calculation resulted in an invalid value for Minimum Spacing (Sc). Please check inputs (e.g., ensure m+n > 2).");
    }


    // --- Output the results ---
    // Use .toFixed(3) only if the value is a valid number
    document.getElementById("spacing_sc").value = !isNaN(spacing_sc) ? spacing_sc.toFixed(3) : '';
    document.getElementById("spacing_sp").value = !isNaN(spacing_sp) ? spacing_sp.toFixed(3) : '';
}
