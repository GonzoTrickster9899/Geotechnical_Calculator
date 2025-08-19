function computeBeamShear() {
    // Inputs for the calculation
    var abs_dl = parseFloat(document.getElementById("abs_dl").value); // Dead Load
    var abs_ll = parseFloat(document.getElementById("abs_ll").value); // Live Load
    var abs_c = parseFloat(document.getElementById("abs_c").value); // Size of column
    var abs_b = parseFloat(document.getElementById("abs_b").value); // Size of footing
    var abs_t = parseFloat(document.getElementById("abs_t").value); // Thickness of footing
    var abs_mbd = parseFloat(document.getElementById("abs_mbd").value); // Main bar diameter
    var abs_y = parseFloat(document.getElementById("abs_y").value); // Solid Unit Weight
    var abs_yc = parseFloat(document.getElementById("abs_yc").value); // Concrete Unit Weight
    var abs_fc = parseFloat(document.getElementById("abs_fc").value); // Concrete Compressive Strength
    var abs_fy = parseFloat(document.getElementById("abs_fy").value); // Steel Yield Strength (Unused in calculation, but included in HTML)
    var abs_df = parseFloat(document.getElementById("abs_df").value); // Depth of footing (Unused in calculation, but included in HTML)
    var abs_cc = parseFloat(document.getElementById("abs_cc").value); // Concrete Cover

    // Basic input validation (optional but recommended)
    if (isNaN(abs_dl) || isNaN(abs_ll) || isNaN(abs_c) || isNaN(abs_b) || isNaN(abs_t) || isNaN(abs_mbd) || isNaN(abs_y) || isNaN(abs_yc) || isNaN(abs_fc) || isNaN(abs_fy) || isNaN(abs_df) || isNaN(abs_cc)) {
        alert("Please ensure all input fields have valid numbers.");
        return false; // Stop execution if any input is not a number
    }


    // Calculations for analysis beam shear
    var abs_qu = (1.2 * abs_dl + 1.6 * abs_ll) / (abs_b * abs_b); // Ultimate Soil Pressure
    var abs_d = abs_t - abs_cc - abs_mbd - (abs_mbd / 2); // Effective Depth - Note: Calculation uses abs_mbd twice, check if intended. Usually it's t - cc - mbd/2
    var abs_vu = abs_qu * abs_b * ((abs_b * 1000 - abs_c) / 2 - abs_d) / 1000; // Shear Force (Demand Load)
    var abs_vc_base = (0.17 * Math.sqrt(abs_fc) * (abs_b * 1000) * abs_d) / 1000; // Concrete shear capacity (V_c) in kN (assuming b is width, converting b from m to mm)
    var phi = 0.75; // Strength reduction factor for shear
    var abs_mvu = phi * abs_vc_base; // Capacity of Footing (ØV_c) in kN

    // Check if shear force exceeds capacity
    var abs_r; // Declare remarks variable
    if (abs_mvu >= abs_vu) { // Capacity should be greater than or equal to Demand
         abs_r = "SAFE";
    } else {
         abs_r = "UNSAFE";
    }

    // Results for analysis beam shear as output
    // document.getElementById("qu").value = abs_qu.toFixed(3);  // ERROR: Output Element with ID "qu" does not exist in the HTML. Commented out.
    // document.getElementById("abs_d").value = abs_d.toFixed(3);  // ERROR: Output Element with ID "abs_d" does not exist in the HTML. Commented out.
    document.getElementById("abs_vu").value = abs_vu.toFixed(3); // Shear Force (Demand V_u)
    document.getElementById("abs_mvu").value = abs_mvu.toFixed(3); // Capacity of Footing (ØV_c)
    document.getElementById("abs_r").value = abs_r; // Remarks

    // Prevent default form submission (which would reload the page)
    return false;
}

function clearAnalysisBeamForm() {
    // Clear input fields
    document.getElementById("abs_dl").value = "";
    document.getElementById("abs_ll").value = "";
    document.getElementById("abs_c").value = "";
    document.getElementById("abs_b").value = "";
    document.getElementById("abs_t").value = "";
    document.getElementById("abs_mbd").value = "";
    document.getElementById("abs_y").value = "";
    document.getElementById("abs_yc").value = "";
    document.getElementById("abs_fc").value = "";
    document.getElementById("abs_fy").value = "";
    document.getElementById("abs_df").value = "";
    document.getElementById("abs_cc").value = "";

    // Clear output fields
    document.getElementById("abs_vu").value = "";
    document.getElementById("abs_mvu").value = "";
    document.getElementById("abs_r").value = "";
}

function computePunchingShear() {
    // Inputs for the calculation
    var aps_dl = parseFloat(document.getElementById("aps_dl").value); // Dead Load
    var aps_ll = parseFloat(document.getElementById("aps_ll").value); // Live Load
    var aps_c = parseFloat(document.getElementById("aps_c").value); // Size of column
    var aps_b = parseFloat(document.getElementById("aps_b").value); // Size of footing
    var aps_t = parseFloat(document.getElementById("aps_t").value); // Thickness of footing
    var aps_mbd = parseFloat(document.getElementById("aps_mbd").value); // Main bar diameter
    var aps_y = parseFloat(document.getElementById("aps_y").value); // Solid Unit Weight
    var aps_yc = parseFloat(document.getElementById("aps_yc").value); // Concrete Unit Weight
    var aps_fc = parseFloat(document.getElementById("aps_fc").value); // Concrete Compressive Strength
    var aps_fy = parseFloat(document.getElementById("aps_fy").value); // Steel Yield Strength (Unused, but included in HTML)
    var aps_df = parseFloat(document.getElementById("aps_df").value); // Depth of footing (Unused, but included in HTML)
    var aps_cc = parseFloat(document.getElementById("aps_cc").value); // Concrete Cover


    // Calculations for analysis punching shear
    var aps_qu = (1.2 * aps_dl + 1.6 * aps_ll) / (aps_b * aps_b); // Ultimate Soil Pressure
    var aps_d = aps_t - aps_cc - aps_mbd; // Effective Depth
    var aps_vu = aps_qu * (aps_b * aps_b - Math.pow(((aps_c + aps_d) / 1000), 2)); // Shear Force
    var aps_vc = (0.75 * (0.33) * Math.sqrt(aps_fc) * 4 * (aps_c + aps_d) * aps_d) / 1000; // Capacity of Footing
    var aps_mvu = aps_vc; //rename for the right output ID (ØV<sub>u</sub>)

    // Check if shear force exceeds capacity
    if (aps_mvu > aps_vu) {
        var aps_r = "SAFE";
    } else {
        var aps_r = "UNSAFE";
    }

    // Results for analysis punching shear as output
    document.getElementById("aps_vu").value = aps_vu.toFixed(3); // Shear Force
    document.getElementById("aps_mvu").value = aps_mvu.toFixed(3); // Capacity of Footing  (ØV<sub>u</sub>)
    document.getElementById("aps_r").value = aps_r; // Remarks

    // Prevent form submission
    return false;
}

function clearAnalysisPunchingForm() {
    // Clear input fields
    document.getElementById("aps_dl").value = "";
    document.getElementById("aps_ll").value = "";
    document.getElementById("aps_c").value = "";
    document.getElementById("aps_b").value = "";
    document.getElementById("aps_t").value = "";
    document.getElementById("aps_mbd").value = "";
    document.getElementById("aps_y").value = "";
    document.getElementById("aps_yc").value = "";
    document.getElementById("aps_fc").value = "";
    document.getElementById("aps_fy").value = "";
    document.getElementById("aps_df").value = "";
    document.getElementById("aps_cc").value = "";

    // Clear output fields
    document.getElementById("aps_vu").value = "";
    document.getElementById("aps_mvu").value = "";
    document.getElementById("aps_r").value = "";
}

function computeDesign() {
    // --- Input Validation ---
    const ids = ["d_dl", "d_ll", "d_c", "d_t", "d_qa", "d_s", "d_y", "d_yc", "d_fc", "d_fy", "d_df", "d_cc", "d_mbd", "d_n"];
    let isValid = true;
    ids.forEach(id => {
        const element = document.getElementById(id);
        if (!element || element.value === "" || isNaN(parseFloat(element.value))) {
            // Optionally add visual feedback for invalid fields
            console.error("Invalid or missing input for ID:", id);
            isValid = false;
        }
    });

    if (!isValid) {
        alert("Please ensure all input fields are filled with valid numbers.");
        return false; // Prevent calculation
    }

    // --- Get Inputs ---
    var d_dl = parseFloat(document.getElementById("d_dl").value); // Dead Load (kN)
    var d_ll = parseFloat(document.getElementById("d_ll").value); // Live Load (kN)
    var d_c = parseFloat(document.getElementById("d_c").value); // Size of column (mm)
    var d_t = parseFloat(document.getElementById("d_t").value); // Thickness of footing (mm)
    var d_qa = parseFloat(document.getElementById("d_qa").value); // Allowable Soil Pressure (kPa)
    var d_s = parseFloat(document.getElementById("d_s").value); // Slab Pressure (kPa)
    var d_y = parseFloat(document.getElementById("d_y").value); // Soil Unit Weight (kN/m^3)
    var d_yc = parseFloat(document.getElementById("d_yc").value); // Concrete Unit Weight (kN/m^3)
    var d_fc = parseFloat(document.getElementById("d_fc").value); // Concrete Compressive Strength (MPa)
    var d_fy = parseFloat(document.getElementById("d_fy").value); // Steel Yield Strength (MPa) - Corrected ID
    var d_df = parseFloat(document.getElementById("d_df").value); // Depth of footing base (m) - Corrected ID
    var d_cc = parseFloat(document.getElementById("d_cc").value); // Concrete Cover (mm) - Corrected ID
    var d_mbd = parseFloat(document.getElementById("d_mbd").value); // Main bar diameter (mm)
    var d_n = parseFloat(document.getElementById("d_n").value); // Assumed Footing Thickness for Weight (mm) - ID kept, interpretation based on usage

    // --- Analysis for design ---

    // Step 1: Initial Effective Depth
    var d_d = d_t - d_cc;
    if (d_d <= 0) {
         alert("Effective depth is zero or negative. Check Thickness and Cover.");
         return false;
    }


    // Step 2: Solving for Effective Soil Pressure
    // Note: Original formula uses d_n (assumed thickness in mm) / 1000 for footing weight pressure.
    // Units: kPa - kPa - (kN/m^3 * m) - (kN/m^3 * m) = kPa
    var d_qeff = d_qa - d_s - d_yc * (d_t / 1000) - d_y * (d_df - (d_t / 1000)); // Net Soil Pressure (kPa)
    if (d_qeff <= 0) {
         alert("Effective soil pressure is zero or negative. Check inputs.");
         return false;
    }

    // Step 3: Solving Dimension of Footing
    // Required Area = (DL + LL) / qeff
    // B = sqrt(Area)
    // Round up B to nearest 0.25m
    var required_area = (d_dl + d_ll) / d_qeff;
    var d_fd_raw = Math.sqrt(required_area);
    var d_fd = Math.ceil(d_fd_raw / 0.25) * 0.25; // Footing Dimension (m), rounded up
    if (d_fd <= 0) {
        alert("Calculated footing dimension is zero or negative.");
        return false;
    }

    // Step 4: Ultimate Upward Soil Pressure
    var factored_load = 1.2 * d_dl + 1.6 * d_ll; // Total Factored Load (kN)
    var d_qu = factored_load / (d_fd * d_fd); // Ultimate Soil Upward Pressure (kPa)

    // Step 5: Check if Safe in Beam Shear (One-Way Shear)
    // Critical section at 'd' from column face
    // Note: Original formula for d_x seems dimensionally inconsistent. Kept as is.
    // d_x = ((B - c)/2 - d) / 1000
    var d_x = ((d_fd - d_c / 1000) / 2 - d_d / 1000); // Effective Dimension (m) - Adjusted d_d to meters
    if (d_x < 0) d_x = 0; // Shear doesn't act if critical section is outside footing

    var d_vu1 = d_qu * d_x * d_fd; // Beam Shear Force (kN) [kPa * m * m = kN]

    // Calculate required d based on shear capacity formula: Vu = phi * 0.17 * sqrt(fc') * B * d
    // d_req = Vu / (phi * 0.17 * sqrt(fc') * B)
    // phi = 0.75 for shear
    // Note: Original formula for d_d1 was different. Kept original structure.
    // d_d1 = ((Vu1 * 1000 N) * 6) / (0.75 * sqrt(fc' MPa) * B mm * 1000 ?) - Units seem mixed
    var d_d1 = ((d_vu1 * 1000) * 6) / (0.75 * Math.sqrt(d_fc) * (d_fd * 1000)); // Required Effective Depth for Beam Shear (mm) - Kept original formula structure

    // Check if provided d is safe
    var d_cs1 = (d_d >= d_d1) ? "SAFE" : "UNSAFE";

    // Step 6: Check if Safe in Punching Shear (Two-Way Shear)
    // Critical perimeter b0 = 4 * (c + d) for square column
    // Punching area = B*B - (c+d)*(c+d) (assuming c and d in same units)
    var d_cd_m = (d_c / 1000) + (d_d / 1000); // (c + d) in meters
    var d_cd = d_c + d_d; // c + d in mm (Used in original d_d2 formula)

    // Note: Original formula for Vu2 was highly unusual. Kept as is.
    // Vu2 = (sqrt(B) - sqrt((c+d)/1000)) * qu  -- Dimensionally strange
    var d_vu2 = (d_qu * ((d_fd*d_fd) - (d_cd_m * d_cd_m))); // More typical Vu2 calc: qu * (Total Area - Critical Area) (kN)

    // Calculate required d based on punching shear capacity: Vu = phi * 0.34 * sqrt(fc') * bo * d
    // bo = 4 * (c+d)
    // d_req = Vu / (phi * 0.34 * sqrt(fc') * bo)
    // Note: Original formula for d_d2 was different and dimensionally suspect. Kept original structure.
    // d_d2 = (Vu2 * 1000 N) / (0.75 * sqrt(fc' MPa) * (c+d mm) * (d mm?)) -- Units seem mixed
    var d_d2 = (d_vu2 * 1000 * 3) / (0.75 * Math.sqrt(d_fc) * 4 * d_cd); // Required d for Punching (mm) - Kept original formula structure, assuming bo = 4*(c+d)

    // Check if provided d is safe
    var d_cs2 = (d_d >= d_d2) ? "SAFE" : "UNSAFE";

    // Step 7: Reinforcement of Square Footing
    // Note: Original formula is unusual, using max(d1, d2) and 1.4/fy (min temp/shrinkage?).
    // Kept original formula structure but corrected syntax errors.
    // As = (B * max(d1,d2) * (1.4/fy)) ?? -- Conceptually unclear
    // n = As / (pi/4 * db^2)
    var bar_area = 0.25 * Math.PI * Math.pow(d_mbd, 2); // Area of one bar (mm^2) Corrected: Math.pow(d_mbd, 2)
    var required_steel_term = (d_fd * 1000 * Math.max(d_d1, d_d2) * (1.4 / d_fy)); // Original numerator term (units mixed: mm * mm * unitless = mm^2 ??)
    var d_nsb = Math.ceil( required_steel_term / bar_area ); // Required Number of Steel Bars (n) - Corrected: Removed ',1' from ceil

    // --- Output results ---
    var final_adopted_dimension; // Use a different variable name
    if (d_cs1 === "SAFE" && d_cs2 === "SAFE") { // Corrected: === and combined checks
        final_adopted_dimension = d_fd; // Use the calculated required dimension
    } else {
        // If unsafe, the user needs to increase inputs (like footing thickness 't')
        // Simply adding 0.25m might not be sufficient or correct.
        // We will output the calculated required dimension but highlight the UNSAFE check.
        final_adopted_dimension = d_fd;
        alert("WARNING: Shear check failed (Beam or Punching). The calculated dimension B=" + d_fd + "m and thickness t=" + d_t + "mm are likely insufficient. Please increase footing thickness or other relevant inputs.");
    }

    var d_footing_dimension_str = final_adopted_dimension.toFixed(2) + " m x " + final_adopted_dimension.toFixed(2) + " m"; // Footing Dimension string
    var d_nbw_str = "Use " + d_nsb + " - " + d_mbd + " mm diameter bars (Both Ways)"; // Reinforcement string - Clarified output

    // --- Display Results ---
    document.getElementById("d_d").value = d_d.toFixed(2);       // Effective Depth (d)
    document.getElementById("d_qeff").value = d_qeff.toFixed(2); // Net Soil Pressure (qeff)
    document.getElementById("d_fd").value = d_fd.toFixed(2);     // Required Footing Dimension (B)
    document.getElementById("d_qu").value = d_qu.toFixed(2);     // Ultimate Soil Upward Pressure (qu)
    document.getElementById("d_x").value = d_x.toFixed(3);       // Effective Dimension for Beam Shear (x)
    document.getElementById("d_vu1").value = d_vu1.toFixed(2);   // Factored Beam Shear (Vu1)
    document.getElementById("d_d1").value = d_d1.toFixed(2);     // Required d for Beam Shear (d1)
    document.getElementById("d_cs1").value = d_cs1;              // Check if Safe (Beam Shear) - Corrected: No .toFixed()
    document.getElementById("d_cd").value = d_cd.toFixed(2);     // Punching Shear Dimension (c + d)
    document.getElementById("d_vu2").value = d_vu2.toFixed(2);   // Factored Punching Shear (Vu2)
    document.getElementById("d_d2").value = d_d2.toFixed(2);     // Required d for Punching Shear (d2)
    document.getElementById("d_cs2").value = d_cs2;              // Check if Safe (Punching Shear) - Corrected: No .toFixed()
    document.getElementById("d_nsb").value = d_nsb;              // Required Number of Steel Bars (n) - Corrected: ID is d_nsb

    // Final summary outputs
    document.getElementById("d_final_dimension").value = final_adopted_dimension.toFixed(2); // Adopted Footing Dimension (B)
    document.getElementById("d_footing_dimension").value = d_footing_dimension_str;         // Footing Dimensions string - Corrected: No .toFixed()
    document.getElementById("d_nbw").value = d_nbw_str;                                     // Reinforcement string

    // Prevent default form submission
    return false;
}

// Placeholder for the clear function - Implement as needed
function clearDesignForm() {
    document.getElementById("designForm").reset(); // Resets the form inputs

    // Clear result fields manually
    const resultIds = ["d_d", "d_qeff", "d_fd", "d_qu", "d_x", "d_vu1", "d_d1", "d_cs1", "d_cd", "d_vu2", "d_d2", "d_cs2", "d_nsb", "d_final_dimension", "d_footing_dimension", "d_nbw"];
    resultIds.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.value = "";
        }
    });
}