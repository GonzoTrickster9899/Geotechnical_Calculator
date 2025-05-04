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
    // Inputs for the calculation
    var d_dl = parseFloat(document.getElementById("d_dl").value); // Dead Load
    var d_ll = parseFloat(document.getElementById("d_ll").value); // Live Load
    var d_c = parseFloat(document.getElementById("d_c").value); // Size of column
    var d_b = parseFloat(document.getElementById("d_b").value); // Size of footing
    var d_t = parseFloat(document.getElementById("d_t").value); // Thickness of footing
    var d_mbd = parseFloat(document.getElementById("d_mbd").value); // Main bar diameter
    var d_y = parseFloat(document.getElementById("d_y").value); // Solid Unit Weight
    var d_yc = parseFloat(document.getElementById("d_yc").value); // Concrete Unit Weight
    var d_fc = parseFloat(document.getElementById("d_fc").value); // Concrete Compressive Strength
    var d_fy = parseFloat(document.getElementById("d_fy").value); // Steel Yield Strength (Unused, but included in HTML)
    var d_df = parseFloat(document.getElementById("d_df").value); // Depth of footing (Unused, but included in HTML)
    var d_cc = parseFloat(document.getElementById("d_cc").value); // Concrete Cover

    // Analysis for design
    // Step 1: Initial Effective Depth
    var d_d = d_t - d_cc; // Effective Depth
    
    // Step 2: Solving for Effective Soil Pressure 
    var d_qeff = d_qa - d_s - d_yc * (d_n / 1000) - d_y * (d_df/ 1000); // Net Soil Pressure
    
    // Step 3: Solving Dimension of Footing
    var d_fd = Math.ceil(Math.sqrt(d_dl + d_ll) / d_qeff / 0.25) * 0.25; // Footing Dimension 
    
    // Step 4: Ultimate Upward Soil Pressure
    var d_qu = (1.2 * d_dl + 1.6 * d_ll) / (d_fd * d_fd) // Ultimate Soil Upward Pressure

    // Step 5: Check if Safe in Beam Shear (One-Way Shear)
    var d_x = ((d_fd - d_c / 1000) / 2 - d_d) / 1000; // Effective Dimension
    var d_vu1 = d_qu * d_x * d_fd; // Beam Shear Capacity
    var d_d1 = ((d_vu1 * 1000) * 6) / (0.75 * Math.sqrt(d_fc) * d_fd * 1000); // Design Shear Force
    // Check if shear force exceeds capacity
    if (d_d1 < d_d) {
        var d_cs1 = "SAFE";
    } else {
        var d_cs1 = "UNSAFE";
    }

    // Step 6: Check if Safe in Punching Shear (Two-Way Shear)
    var d_cd = b_c + d_d; // c + d
    var d_vu2 = (Math.sqrt(d_fd) - Math.sqrt(d_cd / 1000)) * d_qu;  // Punching Shear Capacity
    var d_d2 = (d_vu2 * 1000) / (0.75 * Math.sqrt(d_fc) * d_cd * d_d); // Design Shear Force
    // Check if shear force exceeds capacity
    if (d_d2 < d_d) {
        var d_cs2 = "SAFE";
    } else {
        var d_cs2 = "UNSAFE";
    }

    // Step 7: Reinforcement of Square Footing
    var d_nsb = Math.ceil((d_fd * 1000 * Math.max(d_d1, d_d2) * (1.4 / d_fy)) / (0.25 * Math.PI() * Math.sqrt(B16)),1); // Required Number of Steel Bars (n) (d<sub>1=</sub>)
    
    // Output results
    if (d_cs1 = d_cs2){    
        var d_final_dimension = d_fd;
    } else {
        var d_final_dimension = d_fd + 0.25;
    }
    
    var d_footing_dimension = d_final_dimension + " m x " + d_final_dimension + " m"; // Footing Dimension
    
    var d_nbw = "Use " + d_nsb + " - " + d_mbd + " mm diameter bars"; // Number of Steel Bars (n) (d<sub>1=</sub>)

    // Results for analysis punching shear as output
    document.getElementById("d_d").value = d_d.toFixed(3); // Effective Depth (d)
    document.getElementById("d_qeff").value = d_qeff.toFixed(3); // Net Soil Pressure (qeff)
    document.getElementById("d_fd").value = d_fd.toFixed(3); // Footing Dimension (fd)
    document.getElementById("d_qu").value = d_qu.toFixed(3); // Ultimate Soil Upward Pressure (qu)
    document.getElementById("d_x").value = d_x.toFixed(3); // Effective Dimension (x)
    document.getElementById("d_vu1").value = d_vu1.toFixed(3); // Beam Shear Capacity (Vu1)
    document.getElementById("d_d1").value = d_d1.toFixed(3); // Effective Depth (d1)
    document.getElementById("d_cs1").value = d_cs1.toFixed(3); // Check if Safe
    document.getElementById("d_cd").value = d_cd.toFixed(3); // c + d
    document.getElementById("d_vu2").value = d_vu2.toFixed(3); // Punching Shear Capacity (Vu)
    document.getElementById("d_d2").value = d_d2.toFixed(3); // Effective Depth (d2)
    document.getElementById("d_cs2").value = d_cs2.toFixed(3); // Check if Safe
    document.getElementById("d_nsb").value = d_nsb.toFixed(3); // Required Number of Steel Bars (n)

    document.getElementById("d_final_dimension").value = d_final_dimension.toFixed(3); // Effective Depth
    document.getElementById("d_footing_dimension").value = d_footing_dimension.toFixed(3); // Effective Depth
    document.getElementById("d_nsb").value = d_nsb; // Effective Depth

    // Prevent form submission
    return false;
}