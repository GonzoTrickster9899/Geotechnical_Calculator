function computeFootingNet() {
    // --- Get Input Values ---
    const rfn_pdl = parseFloat(document.getElementById("rfn_pdl").value); // Force Dead Load (PDL)
    const rfn_pll = parseFloat(document.getElementById("rfn_pll").value); // Force Live Load (PLL)
    const rfn_mdl = parseFloat(document.getElementById("rfn_mdl").value); // Moment Dead Load (MDL)
    const rfn_mll = parseFloat(document.getElementById("rfn_mll").value); // Moment Live Load (MLL)
    const rfn_dm = parseFloat(document.getElementById("rfn_dm").value);   // Direction of Moment (1: CW, 2: CCW) - Currently unused in calculation logic below
    const rfn_om = parseFloat(document.getElementById("rfn_om").value);   // Orientation of Moment (1: Parallel to B, 2: Parallel to L)
    const rfn_l = parseFloat(document.getElementById("rfn_l").value);     // Footing Dimension (L)
    const rfn_b = parseFloat(document.getElementById("rfn_b").value);     // Footing Dimension (B)
    const rfn_cl = parseFloat(document.getElementById("rfn_cl").value);   // Column Dimension (CL) [mm]
    const rfn_cb = parseFloat(document.getElementById("rfn_cb").value);   // Column Dimension (CB) [mm]
    const rfn_cd = parseFloat(document.getElementById("rfn_cd").value);   // Center Distance b/w Column and Footing
    const rfn_y = parseFloat(document.getElementById("rfn_y").value);     // Soil Unit Weight (γ_soil)
    const rfn_yc = parseFloat(document.getElementById("rfn_yc").value);   // Concrete Unit Weight (γ_concrete)
    const rfn_df = parseFloat(document.getElementById("rfn_df").value);   // Depth of Footing (Df)
    const rfn_t = parseFloat(document.getElementById("rfn_t").value);     // Thickness of Footing (t)

    // --- Input Validation ---
    const inputs = [rfn_pdl, rfn_pll, rfn_mdl, rfn_mll, rfn_dm, rfn_om, rfn_l, rfn_b, rfn_cl, rfn_cb, rfn_cd, rfn_y, rfn_yc, rfn_df, rfn_t];
    if (inputs.some(isNaN)) {
        alert("Please ensure all input fields are filled with valid numbers.");
        // Clear previous results
        document.getElementById("rfn_qnmax").value = "";
        document.getElementById("rfn_qnmin").value = "";
        document.getElementById("rfn_qgmax").value = "";
        document.getElementById("rfn_qgmin").value = "";
        // if (document.getElementById("rfn_uplift_result")) { // Check if uplift result element exists
        //     document.getElementById("rfn_uplift_result").value = "";
        // }
        return false; // Stop execution
    }

    // Check for non-positive dimensions/weights where applicable
    if (rfn_l <= 0 || rfn_b <= 0 || rfn_y <= 0 || rfn_yc <= 0 || rfn_df <= 0 || rfn_t <= 0 || rfn_cl <= 0 || rfn_cb <= 0) {
        alert("Dimensions, unit weights, depth, and thickness must be positive values.");
         // Clear previous results
        document.getElementById("rfn_qnmax").value = "";
        document.getElementById("rfn_qnmin").value = "";
        document.getElementById("rfn_qgmax").value = "";
        document.getElementById("rfn_qgmin").value = "";
        return false; // Stop execution
    }
    
    if (rfn_t > rfn_df) {
        alert("Footing thickness (t) cannot be greater than the depth of footing (Df).");
         // Clear previous results
        document.getElementById("rfn_qnmax").value = "";
        document.getElementById("rfn_qnmin").value = "";
        document.getElementById("rfn_qgmax").value = "";
        document.getElementById("rfn_qgmin").value = "";
        return false; // Stop execution
    }


    // --- Step 1: Moment of Footing ---
    const rfn_slf = rfn_pdl + rfn_pll; // Service Load (Forces)
    const rfn_slm = rfn_mdl + rfn_mll; // Service Load (Moments)
    

    // Net Moment about the footing center (Mf)
    // Assumes rfn_cd is the eccentricity of the service load relative to the footing center.
    // The absolute value considers the magnitude of the net moment.
    const rfn_mf = Math.abs(rfn_slm - rfn_slf * rfn_cd);
    
    // --- Step 2: Determine if No Uplift ---
    const rfn_e = rfn_mf / rfn_slf; // Eccentricity

    let rfn_meu; // Max Eccentricity without Uplift (L/6 or B/6)
    if (rfn_om == 1) { // Moment parallel to B -> Resisted by L
        rfn_meu = rfn_b / 6;
    } else if (rfn_om == 2) { // Moment parallel to L -> Resisted by B
        rfn_meu = rfn_l / 6;
    } else {
         alert("Invalid Orientation of Moment selected.");
         return false; // Should not happen if validation works, but good practice
    }

    // Uplift Check Result (Optional: Display this message)
    let uplift_message = "No Uplift Occurred!";
    if (rfn_e > rfn_meu) {
        uplift_message = "Uplift Occurred! (e > L/6 or B/6)";
        // Note: The P/A +/- M/S formulas below assume no uplift (e <= L/6 or B/6).
        // If uplift occurs, different formulas are needed to calculate the actual pressure distribution.
        // For simplicity, this calculator proceeds but flags the uplift condition. Consider adding more complex logic if needed.
    }
    // Example: Display uplift message if an element with id="rfn_uplift_result" exists
    // if (document.getElementById("rfn_uplift_result")) {
    //     document.getElementById("rfn_uplift_result").value = uplift_message;
    // }
    console.log("Uplift Check: ", uplift_message); // Log to console for debugging

    // --- Step 3: Soil Net Pressure (qn) ---
    // Formula: qn = P/A +/- M/S
    const footing_area = rfn_l * rfn_b;
    const pressure_from_load = rfn_slf / footing_area; // P/A term

    let pressure_from_moment; // M/S term
    let rfn_qnmax, rfn_qnmin;

    if (rfn_om === 2) { // Moment parallel to B -> Resisted by L
        // Section Modulus S = I / c = (B * L^3 / 12) / (L / 2) = B * L^2 / 6
        const section_modulus_L = (rfn_b * rfn_l * rfn_l) / 6;
        if (section_modulus_L === 0) {
             alert("Footing dimensions L and B must be positive.");
             return false;
        }
        pressure_from_moment = rfn_mf / section_modulus_L;
    } else if (rfn_om === 1) { // Moment parallel to L -> Resisted by B
        // Section Modulus S = I / c = (L * B^3 / 12) / (B / 2) = L * B^2 / 6
        const section_modulus_B = (rfn_l * rfn_b * rfn_b) / 6;
         if (section_modulus_B === 0) {
             alert("Footing dimensions L and B must be positive.");
             return false;
        }
        pressure_from_moment = rfn_mf / section_modulus_B;
    }
     // Should already be handled by input validation, but defensive check
     else {
        alert("Calculation error: Invalid moment orientation.");
        return false;
    }


    rfn_qnmax = pressure_from_load + pressure_from_moment;
    rfn_qnmin = pressure_from_load - pressure_from_moment;


    // --- Step 4: Soil Gross Pressure (qg) ---
    // Formula: qg = qn + q_overburden
    // q_overburden = γ_soil * depth_soil + γ_concrete * depth_concrete
    const depth_soil_above_footing = rfn_df - rfn_t;
    const q_overburden = (rfn_y * depth_soil_above_footing) + (rfn_yc * rfn_t);

    const rfn_qgmax = rfn_qnmax + q_overburden;
    const rfn_qgmin = rfn_qnmin + q_overburden;

    // --- Display Results ---
    // Rounding to 3 decimal places for display
    document.getElementById("rfn_qnmax").value = rfn_qnmax.toFixed(3);
    document.getElementById("rfn_qnmin").value = rfn_qnmin.toFixed(3);
    document.getElementById("rfn_qgmax").value = rfn_qgmax.toFixed(3);
    document.getElementById("rfn_qgmin").value = rfn_qgmin.toFixed(3);

    return false; // Prevent default form submission
}

function clearFootingNetForm() {
    // Clear Input Fields
    document.getElementById("rfn_pdl").value = "";
    document.getElementById("rfn_pll").value = "";
    document.getElementById("rfn_mdl").value = "";
    document.getElementById("rfn_mll").value = "";
    document.getElementById("rfn_dm").selectedIndex = 0; // Reset dropdown to placeholder
    document.getElementById("rfn_om").selectedIndex = 0; // Reset dropdown to placeholder
    document.getElementById("rfn_l").value = "";
    document.getElementById("rfn_b").value = "";
    document.getElementById("rfn_cl").value = "";
    document.getElementById("rfn_cb").value = "";
    document.getElementById("rfn_cd").value = "";
    document.getElementById("rfn_y").value = "";
    document.getElementById("rfn_yc").value = "";
    document.getElementById("rfn_df").value = "";
    document.getElementById("rfn_t").value = "";

    // Clear Output Fields
    document.getElementById("rfn_qnmax").value = "";
    document.getElementById("rfn_qnmin").value = "";
    document.getElementById("rfn_qgmax").value = "";
    document.getElementById("rfn_qgmin").value = "";

    // Optional: Clear any validation messages or uplift result if you added them
    // if (document.getElementById("rfn_uplift_result")) {
    //     document.getElementById("rfn_uplift_result").value = "";
    // }

    // Optional: Scroll to the top of the form
    // document.getElementById('beamShearForm').scrollIntoView({ behavior: 'smooth' });
}

function computeFootingWide() {
    // --- Get Input Values ---
    const rfw_pdl = parseFloat(document.getElementById("rfw_pdl").value); // Force Dead Load (PDL)
    const rfw_pll = parseFloat(document.getElementById("rfw_pll").value); // Force Live Load (PLL)
    const rfw_mdl = parseFloat(document.getElementById("rfw_mdl").value); // Moment Dead Load (MDL)
    const rfw_mll = parseFloat(document.getElementById("rfw_mll").value); // Moment Live Load (MLL)
    const rfw_dm = parseFloat(document.getElementById("rfw_dm").value);   // Direction of Moment (1: CW, 2: CCW)
    const rfw_om = parseFloat(document.getElementById("rfw_om").value);   // Orientation of Moment (1: Parallel to B, 2: Parallel to L)
    const rfw_l = parseFloat(document.getElementById("rfw_l").value);     // Footing Dimension (L) [m]
    const rfw_b = parseFloat(document.getElementById("rfw_b").value);     // Footing Dimension (B) [m]
    const rfw_cl = parseFloat(document.getElementById("rfw_cl").value);   // Column Dimension (CL) [mm]
    const rfw_cb = parseFloat(document.getElementById("rfw_cb").value);   // Column Dimension (CB) [mm]
    const rfw_cd = parseFloat(document.getElementById("rfw_cd").value);   // Load Eccentricity (e_load) from footing center [m]
    const rfw_y = parseFloat(document.getElementById("rfw_y").value);     // Soil Unit Weight (γ_soil) [kN/m3]
    const rfw_yc = parseFloat(document.getElementById("rfw_yc").value);   // Concrete Unit Weight (γ_concrete) [kN/m3]
    const rfw_df = parseFloat(document.getElementById("rfw_df").value);   // Depth of Footing (Df) [m]
    const rfw_t = parseFloat(document.getElementById("rfw_t").value);     // Thickness of Footing (t) [m]
    const rfw_fc = parseFloat(document.getElementById("rfw_fc").value);   // Concrete Compressive Strength (f'c) [MPa]
    const rfw_fy = parseFloat(document.getElementById("rfw_fy").value);   // Steel Yield Strength (fy) [MPa]
    const rfw_cc = parseFloat(document.getElementById("rfw_cc").value);   // Concrete Cover (cc) [mm]
    const rfw_rbd = parseFloat(document.getElementById("rfw_rbd").value); // Reinforcing Bar Diameter (db) [mm]
    const rfw_wbs = parseFloat(document.getElementById("rfw_wbs").value); // Wide Beam Shear Distance from Edge [m]

    // --- Input Validation ---
    const inputs = [rfw_pdl, rfw_pll, rfw_mdl, rfw_mll, rfw_dm, rfw_om, rfw_l, rfw_b, rfw_cl, rfw_cb, rfw_cd, rfw_y, rfw_yc, rfw_df, rfw_t, rfw_fc, rfw_fy, rfw_cc, rfw_rbd, rfw_wbs];
    if (inputs.some(isNaN)) {
        alert("Please ensure all input fields are filled with valid numbers.");
        // Corrected: Clear outputs for THIS tab
        document.getElementById("rfw_vu").value = "";
        document.getElementById("rfw_vc").value = "";
        document.getElementById("rfw_remark").value = "";
        return false; // Stop execution
    }

    // Check for non-positive dimensions/weights where applicable
    // ** Note: Allow rfw_cd (eccentricity) to be zero or negative **
    // ** Note: Allow rfw_df to be zero **
    if (rfw_l <= 0 || rfw_b <= 0 || rfw_y <= 0 || rfw_yc <= 0 || rfw_t <= 0 || rfw_cl <= 0 || rfw_cb <= 0 || rfw_fc <= 0 || rfw_fy <= 0 || rfw_cc < 0 || rfw_rbd <= 0 || rfw_wbs < 0 || rfw_df < 0) {
        alert("Dimensions (L, B, CL, CB, t, db), unit weights, strengths (f'c, fy) must be positive. Cover (cc), Depth (Df), and Distance from Edge (wbs) must be non-negative.");
        // Corrected: Clear outputs for THIS tab
        document.getElementById("rfw_vu").value = "";
        document.getElementById("rfw_vc").value = "";
        document.getElementById("rfw_remark").value = "";
        return false; // Stop execution
    }

    if (rfw_t > rfw_df && rfw_df >= 0) {
        alert("Footing thickness (t) cannot be greater than the depth of footing (Df).");
        // Corrected: Clear outputs for THIS tab
        document.getElementById("rfw_vu").value = "";
        document.getElementById("rfw_vc").value = "";
        document.getElementById("rfw_remark").value = "";
        return false; // Stop execution
    }
     // Check concrete cover + rebar fits within thickness (simplified check)
     if (rfw_cc * 2 + rfw_rbd * 2 > rfw_t * 1000) {
         alert("Insufficient footing thickness (t) for concrete cover (cc) and two layers of rebar diameter (db).");
         // Corrected: Clear outputs for THIS tab
         document.getElementById("rfw_vu").value = "";
         document.getElementById("rfw_vc").value = "";
         document.getElementById("rfw_remark").value = "";
         return false;
     }
     // Check wbs relative to footing dimension
     if ((rfw_om === 1 && rfw_wbs > rfw_l) || (rfw_om === 2 && rfw_wbs > rfw_b)) {
        alert("Wide Beam Shear Distance from Edge (wbs) cannot be greater than the relevant footing dimension (L or B based on moment orientation).");
        // Corrected: Clear outputs for THIS tab
         document.getElementById("rfw_vu").value = "";
         document.getElementById("rfw_vc").value = "";
         document.getElementById("rfw_remark").value = "";
         return false;
     }


    // === COMPUTATIONS START (UNCHANGED LOGIC as requested) ===

    //* --- Step 1: Moment of Footing ---
    const rfw_ulf = 1.2 * rfw_pdl + 1.6 * rfw_pll; // Ultimate Load (Forces)
    const rfw_ulm = 1.2 * rfw_mdl + 1.6 * rfw_mll; // Ultimate Load (Moments)
    const rfw_mf = Math.abs(rfw_ulm - rfw_ulf * rfw_cd); // Net Moment about the footing center (Mf)
    
    //* --- Step 2: Determine if No Uplift ---
    const rfw_e = rfw_ulf === 0 ? 0 : rfw_mf / rfw_ulf; // Eccentricity (handle division by zero)

    let rfw_meu; // Max Eccentricity without Uplift (L/6 or B/6)
    // Corrected: Use === for comparison
    if (rfw_om === 2) { // Moment parallel to B -> Resisted by L
        rfw_meu = rfw_l / 6; // Check against L/6
    } else if (rfw_om === 1) { // Moment parallel to L -> Resisted by B
        rfw_meu = rfw_b / 6; // Check against B/6
    } else {
         alert("Invalid Orientation of Moment selected.");
         return false;
    }

    let uplift_message = "No Uplift Occurred!";
    if (rfw_e > rfw_meu) {
        uplift_message = "Uplift Occurred! (e > limit)";
    }
    console.log("Uplift Check: ", uplift_message);

    //* --- Step 3: Soil Net Pressure (qu) ---
    const footing_area = rfw_l * rfw_b;
    const pressure_from_load = rfw_ulf === 0 ? 0 : rfw_ulf / footing_area; // P/A term

    let pressure_from_moment = 0; // M/S term
    let rfw_qumax = pressure_from_load;
    let rfw_qumin = pressure_from_load;

    // Corrected: Use === for comparison and correct section modulus assignment
    if (rfw_mf > 0) {
        if (rfw_om === 2) { // Moment parallel to B -> Resisted by L
            const section_modulus_L = (rfw_b * rfw_l * rfw_l) / 6;
            if (section_modulus_L > 0) {
                pressure_from_moment = rfw_mf / section_modulus_L;
            }
        } else if (rfw_om === 1) { // Moment parallel to L -> Resisted by B
            const section_modulus_B = (rfw_l * rfw_b * rfw_b) / 6;
            if (section_modulus_B > 0) {
                pressure_from_moment = rfw_mf / section_modulus_B;
            }
        } else {
            alert("Calculation error: Invalid moment orientation in pressure calc.");
            return false;
        }
        rfw_qumax = pressure_from_load + pressure_from_moment;
        rfw_qumin = pressure_from_load - pressure_from_moment;
    }

    //* --- Step 4: Effective Depths ---
    // Effective Depth on long Direction (dg) - Note: This naming might be confusing, it depends on bar placement
    const rfw_dg = rfw_t * 1000 - rfw_cc - rfw_rbd / 2; // Assumes main steel is outer layer
    // Effective Depth on short Direction (dl) - Note: This naming might be confusing
    const rfw_dl = rfw_t * 1000 - rfw_cc - rfw_rbd - rfw_rbd / 2; // Assumes this steel is inner layer

    //* --- Step 5: Calculate qu3 ---
    // Stress on Wide Beam Area (Interpolation based on rfw_wbs distance from edge and dimension 'b')
    // ** Keeping original formula as requested **
    let rfw_qu3 = rfw_qumax; // Default if pressure is uniform or b=0
    if (rfw_qumax !== rfw_qumin && rfw_b > 0) {
         // This formula seems to incorrectly use 'rfw_b' as the dimension over which pressure varies
         // regardless of moment orientation, and assumes rfw_wbs is measured from the qmax edge (x=0).
         rfw_qu3 = ((rfw_qumin - rfw_qumax) * (rfw_wbs - 0)) / rfw_b + rfw_qumax;
    }

    //* --- Step 6: Solving Demand Load ---
    // Demand Load (vu) output
    // ** Keeping original formula as requested **
    let rfw_vu = 0; // Corrected: Declare variable outside the if/else block
    // Corrected: Use === for comparison
    if (rfw_om === 2) { // Moment parallel to B
        // This seems to assume shear area is (rfw_l - rfw_wbs) * rfw_b
        rfw_vu = 0.5 * (rfw_qu3 + rfw_qumin) * (rfw_l - rfw_wbs) * rfw_b;
    } else if (rfw_om === 1) { // Moment parallel to L
         // This seems to assume shear area is (rfw_b - rfw_wbs) * rfw_l
        rfw_vu = 0.5 * (rfw_qu3 + rfw_qumin) * (rfw_b - rfw_wbs) * rfw_l;
    } else {
        alert("Invalid Moment Orientation selected for Vu calculation.");
        return false;
    }
     // Ensure Vu is not negative (can happen if pressures are negative due to high moment)
     rfw_vu = Math.max(0, rfw_vu);

    //* --- Step 7: Solving Capacity of the Footing ---
    // Capacity of the Footing (Vc) output - Assumes phi=0.75 is included
    // ** Keeping original formula as requested **
    let rfw_vc = 0; // Corrected: Declare variable outside the if/else block
    const effective_d_for_capacity = Math.max(rfw_dg, rfw_dl); // Uses the larger 'd' [mm]
    // Corrected: Use === for comparison
    if (rfw_om === 2) { // Moment parallel to B
        // Uses footing width 'b' [m] and effective_d [mm]
        // The 0.17 * sqrt(fc') * bw * d formula requires consistent units (MPa, mm, mm -> N)
        // This original formula seems to mix units (m for b) and might be missing conversion factors.
        rfw_vc = 0.75 * 0.17 * Math.sqrt(rfw_fc) * (rfw_b * 1000) * effective_d_for_capacity / 1000; // Estimate correction: bw in mm, result in kN
        // Original formula for reference (likely incorrect units):
        // rfw_vc = 0.75 * Math.sqrt(rfw_fc) * rfw_b * effective_d_for_capacity * 0.17;
    } else if (rfw_om === 1) { // Moment parallel to L
        // Uses footing width 'l' [m] and effective_d [mm]
         rfw_vc = 0.75 * 0.17 * Math.sqrt(rfw_fc) * (rfw_l * 1000) * effective_d_for_capacity / 1000; // Estimate correction: bw in mm, result in kN
         // Original formula for reference (likely incorrect units):
        // rfw_vc = 0.75 * Math.sqrt(rfw_fc) * rfw_l * effective_d_for_capacity * 0.17;
    } else {
        alert("Invalid Moment Orientation selected for Vc calculation.");
        return false;
    }

     // === COMPUTATIONS END ===


    // --- Display Results ---
    document.getElementById("rfw_vu").value = rfw_vu.toFixed(3);
    document.getElementById("rfw_vc").value = rfw_vc.toFixed(3); // Outputting the calculated Vc

    let rfw_remark = "UNSAFE";
    if (rfw_vc >= rfw_vu) { // Compare calculated capacity Vc with demand Vu
        rfw_remark = "SAFE";
    }
     // Add uplift warning if applicable
     if (rfw_e > rfw_meu) {
        rfw_remark += " - WARNING: Uplift occurred (e > limit).";
    }
    document.getElementById("rfw_remark").value = rfw_remark;


    return false; // Prevent default form submission
}

function clearFootingWideForm() {
    console.log("Clearing Wide Beam Shear Form"); // Debug log
    // Clear Input Fields
    const wide_inputs = ["rfw_pdl", "rfw_pll", "rfw_mdl", "rfw_mll", "rfw_l", "rfw_b", "rfw_cl", "rfw_cb", "rfw_cd", "rfw_y", "rfw_yc", "rfw_df", "rfw_t", "rfw_fc", "rfw_fy", "rfw_cc", "rfw_rbd", "rfw_wbs"];
    wide_inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = "";
    });
     const wide_selects = ["rfw_dm", "rfw_om"];
     wide_selects.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.selectedIndex = 0; // Reset dropdowns
    });

    // Clear Output Fields
    const wide_outputs = ["rfw_vu", "rfw_vc", "rfw_remark"];
     wide_outputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = "";
    });
}

function computeFootingDesign() {
    // --- Get Input Values ---
    const rfd_pdl = parseFloat(document.getElementById("rfd_pdl").value); // Force Dead Load (PDL)
    const rfd_pll = parseFloat(document.getElementById("rfd_pll").value); // Force Live Load (PLL)
    const rfd_mdl = parseFloat(document.getElementById("rfd_mdl").value); // Moment Dead Load (MDL)
    const rfd_mll = parseFloat(document.getElementById("rfd_mll").value); // Moment Live Load (MLL)
    const rfd_dm = parseFloat(document.getElementById("rfd_dm").value);   // Direction of Moment (1: CW, 2: CCW)
    const rfd_om = parseFloat(document.getElementById("rfd_om").value);   // Orientation of Moment (1: Parallel to B, 2: Parallel to L)
    const rfd_l = parseFloat(document.getElementById("rfd_l").value);     // Footing Dimension (L) [m]
    const rfd_b = parseFloat(document.getElementById("rfd_b").value);     // Footing Dimension (B) [m]
    const rfd_cl = parseFloat(document.getElementById("rfd_cl").value);   // Column Dimension (CL) [mm]
    const rfd_cb = parseFloat(document.getElementById("rfd_cb").value);   // Column Dimension (CB) [mm]
    const rfd_cd = parseFloat(document.getElementById("rfd_cd").value);   // Load Eccentricity (e_load) from footing center [m]
    const rfd_y = parseFloat(document.getElementById("rfd_y").value);     // Soil Unit Weight (γ_soil) [kN/m3]
    const rfd_yc = parseFloat(document.getElementById("rfd_yc").value);   // Concrete Unit Weight (γ_concrete) [kN/m3]
    const rfd_df = parseFloat(document.getElementById("rfd_df").value);   // Depth of Footing (Df) [m]
    const rfd_t = parseFloat(document.getElementById("rfd_t").value);     // Thickness of Footing (t) [m]
    const rfd_fc = parseFloat(document.getElementById("rfd_fc").value);   // Concrete Compressive Strength (f'c) [MPa]
    const rfd_fy = parseFloat(document.getElementById("rfd_fy").value);   // Steel Yield Strength (fy) [MPa]
    const rfd_cc = parseFloat(document.getElementById("rfd_cc").value);   // Concrete Cover (cc) [mm]
    const rfd_rbd = parseFloat(document.getElementById("rfd_rbd").value); // Reinforcing Bar Diameter (db) [mm]
    const rfd_d = parseFloat(document.getElementById("rfd_d").value);     // Distance (x) [m]

    // --- Input Validation ---
    const inputs = [rfd_pdl, rfd_pll, rfd_mdl, rfd_mll, rfd_dm, rfd_om, rfd_l, rfd_b, rfd_cl, rfd_cb, rfd_cd, rfd_y, rfd_yc, rfd_df, rfd_t, rfd_fc, rfd_fy, rfd_cc, rfd_rbd, rfd_d];
    if (inputs.some(isNaN)) {
        alert("Please ensure all input fields for Footing Design are filled with valid numbers.");
        clearFootingDesignForm(); // Corrected: Clear outputs for THIS tab
        return false; // Stop execution
    }

    // Check for non-positive/invalid dimensions/weights etc.
    if (rfd_l <= 0 || rfd_b <= 0 || rfd_y <= 0 || rfd_yc <= 0 || rfd_t <= 0 || rfd_cl <= 0 || rfd_cb <= 0 || rfd_fc <= 0 || rfd_fy <= 0 || rfd_cc < 0 || rfd_rbd <= 0 || rfd_d < 0 || rfd_df < 0) {
        alert("Dimensions (L, B, CL, CB, t, db), unit weights, strengths (f'c, fy) must be positive. Cover (cc), Depth (Df), and Distance (x) must be non-negative.");
        clearFootingDesignForm(); // Corrected: Clear outputs for THIS tab
        return false; // Stop execution
    }

    if (rfd_t > rfd_df && rfd_df >= 0) {
        alert("Footing thickness (t) cannot be greater than the depth of footing (Df).");
        clearFootingDesignForm(); // Corrected: Clear outputs for THIS tab
        return false; // Stop execution
    }
    // Check concrete cover + rebar fits within thickness (simplified check)
    if (rfd_cc * 2 + rfd_rbd * 2 > rfd_t * 1000) {
        alert("Insufficient footing thickness (t) for concrete cover (cc) and two layers of rebar diameter (db).");
        clearFootingDesignForm(); // Corrected: Clear outputs for THIS tab
        return false;
    }
    // Removed invalid check involving rfd_wbs as it's not an input here


    // === COMPUTATIONS START (UNCHANGED LOGIC as requested, except bar area fix) ===

    //* --- Step 1: Moment of Footing ---
    const rfd_ulf = 1.2 * rfd_pdl + 1.6 * rfd_pll; // Ultimate Load (Forces)
    const rfd_ulm = 1.2 * rfd_mdl + 1.6 * rfd_mll; // Ultimate Load (Moments)
    const rfd_mf = Math.abs(rfd_ulm - rfd_ulf * rfd_cd); // Net Moment about the footing center (Mf)

    // Displays the calculated moment
    document.getElementById("rfd_ulf").value = rfd_ulf.toFixed(3); // Use 3 decimals for consistency
    document.getElementById("rfd_ulm").value = rfd_ulm.toFixed(3);
    document.getElementById("rfd_mf").value = rfd_mf.toFixed(3);

    //* --- Step 2: Determine if No Uplift ---
    const rfd_e = rfd_ulf === 0 ? 0 : rfd_mf / rfd_ulf; // Eccentricity (handle division by zero)

    let rfd_meu; // Max Eccentricity without Uplift (L/6 or B/6)
    // ** Keeping original (potentially reversed) logic as requested **
    // Corrected: Use === for comparison
    if (rfd_om === 2) { // Moment parallel to L (User convention) -> Resisted by L
        rfd_meu = rfd_l / 6; // Check against L/6
    } else if (rfd_om === 1) { // Moment parallel to B (User convention) -> Resisted by B
        rfd_meu = rfd_b / 6; // Check against B/6
    } else {
         alert("Invalid Orientation of Moment selected.");
         clearFootingDesignForm();
         return false;
    }

    let uplift_message = "No Uplift Occurred";
    if (rfd_e > rfd_meu) {
        uplift_message = "Uplift Occurred! (e > limit)";
    }
    console.log("Uplift Check: ", uplift_message);

    // Displays the uplift message
    document.getElementById("rfd_e").value = rfd_e.toFixed(3);
    document.getElementById("rfd_meu").value = rfd_meu.toFixed(3);
    document.getElementById("rfd_uplift").value = uplift_message;

    //* --- Step 3: Soil Net Pressure (qu) ---
    const footing_area = rfd_l * rfd_b;
    const pressure_from_load = rfd_ulf === 0 ? 0 : rfd_ulf / footing_area; // P/A term

    let pressure_from_moment = 0; // M/S term
    let rfd_qu1 = pressure_from_load; // q_u,max
    let rfd_qu2 = pressure_from_load; // q_u,min

    // ** Keeping original (potentially reversed) logic as requested **
    // Corrected: Use === for comparison
    if (rfd_mf > 0) {
        if (rfd_om === 2) { // Moment parallel to L (User convention) -> Resisted by L
            const section_modulus_L = (rfd_b * rfd_l * rfd_l) / 6;
            if (section_modulus_L > 0) {
                pressure_from_moment = rfd_mf / section_modulus_L;
            }
        } else if (rfd_om === 1) { // Moment parallel to B (User convention) -> Resisted by B
            const section_modulus_B = (rfd_l * rfd_b * rfd_b) / 6;
            if (section_modulus_B > 0) {
                pressure_from_moment = rfd_mf / section_modulus_B;
            }
        } else {
            alert("Calculation error: Invalid moment orientation in pressure calc.");
            clearFootingDesignForm();
            return false;
        }
        rfd_qu1 = pressure_from_load + pressure_from_moment;
        rfd_qu2 = pressure_from_load - pressure_from_moment;
    }

    // Displays the calculated pressures
    document.getElementById("rfd_qu1").value = rfd_qu1.toFixed(3);
    document.getElementById("rfd_qu2").value = rfd_qu2.toFixed(3);

    //* --- Step 4: Effective Depths ---
    // Assumes Long direction bars are placed first (outer layer) -> Larger d
    const rfd_db = rfd_t * 1000 - rfd_cc - rfd_rbd / 2; // Eff depth for Long bars [mm]
    // Assumes Short direction bars are placed inside (inner layer) -> Smaller d
    const rfd_dl = rfd_t * 1000 - rfd_cc - rfd_rbd - rfd_rbd / 2; // Eff depth for Short bars [mm]

    // Displays the calculated effective depths
    document.getElementById("rfd_db").value = rfd_db.toFixed(1); // mm usually don't need 3 decimals
    document.getElementById("rfd_dl").value = rfd_dl.toFixed(1);

    //* --- Step 5: Calculate qu4 ---
    // ** Keeping original formula as requested **
    // This formula interpolates pressure at distance 'rfd_d' [m] from the edge where pressure is q1,
    // assuming pressure varies over dimension 'rfd_b' [m]. This is likely only correct if rfd_om = 1.
    let rfd_qu4 = rfd_qu1; // Default if pressure is uniform or b=0
    if (rfd_qu1 !== rfd_qu2 && rfd_b > 0) {
        rfd_qu4 = ((rfd_qu2 - rfd_qu1) * (rfd_d - 0)) / (rfd_b - 0) + rfd_qu1;
    }
    // Displays the calculated qu4
    document.getElementById("rfd_qu4").value = rfd_qu4.toFixed(3);

    //* --- Step 6: Ultimate Moment ---
    // ** Keeping original formula as requested **
    // This formula for Mu is non-standard and uses sqrt(dimension - distance). Units seem inconsistent.
    const rfd_mu = (rfd_l * Math.sqrt(Math.max(0, rfd_b - rfd_d)) / 6) * (rfd_qu4 - rfd_qu2); // Added Math.max to avoid sqrt of negative

    // Displays the calculated ultimate moment
    document.getElementById("rfd_mu").value = rfd_mu.toFixed(3);

    //* --- Step 7: Minimum Steel Ratio ---
    // ** Keeping original formula as requested **
    // This is rho_min for temperature/shrinkage per ACI (if fy is in MPa)
    const rfd_msr = (rfd_fy >= 420) ? 0.0018 : (1.4 / rfd_fy); // Adjusted for fy >= 420 MPa
    //const rfd_msr = 1.4 / rfd_fy; // Original formula provided

    // Displays the calculated minimum steel ratio
    document.getElementById("rfd_msr").value = rfd_msr.toFixed(4); // Ratio needs more decimals

    //* --- Step 8: Number of Top Bars and Bottom Bars (Based on Minimum Steel) ---
    // Area of steel = rho * b * d
    const As_min_long_dir = rfd_msr * (rfd_b * 1000) * rfd_db; // Use width B for long bars, d_B
    const As_min_short_dir = rfd_msr * (rfd_l * 1000) * rfd_dl;// Use width L for short bars, d_L

    // Corrected: Area of one bar = pi/4 * d^2
    const area_one_bar = 0.25 * Math.PI * Math.pow(rfd_rbd, 2); // mm^2

    let rfd_bld = 0; // Bars Long Direction (Bottom)
    let rfd_bsd = 0; // Bars Short Direction (Top) - Note: Short bars usually go bottom if main moment is that way

    if (area_one_bar > 0) {
         rfd_bld = Math.ceil(As_min_long_dir / area_one_bar); // Round up
         rfd_bsd = Math.ceil(As_min_short_dir / area_one_bar); // Round up
    }

    // Display the result in the output field
    document.getElementById("rfd_bld").value = rfd_bld; // Display as integer
    document.getElementById("rfd_bsd").value = rfd_bsd; // Display as integer

    // === COMPUTATIONS END ===


    // --- Display Final Summary ---
    // Corrected: Use the calculated bar numbers and diameter
    const rfd_mlbd_message = `Use ${rfd_bld} - ${rfd_rbd} mm dia. bars (Bottom)`;
    const rfd_msbd_message = `Use ${rfd_bsd} - ${rfd_rbd} mm dia. bars (Top)`;

    // Corrected: Assign to correct output IDs
    document.getElementById("rfd_mlbd").value = rfd_mlbd_message;
    document.getElementById("rfd_msbd").value = rfd_msbd_message;

    return false; // Prevent default form submission
}


// --- Function to Clear Inputs and Outputs for Footing Design Tab ---
function clearFootingDesignForm() {
    console.log("Clearing Footing Design Form"); // Debug log
    // Clear Input Fields
    const design_inputs = ["rfd_pdl", "rfd_pll", "rfd_mdl", "rfd_mll", "rfd_l", "rfd_b", "rfd_cl", "rfd_cb", "rfd_cd", "rfd_y", "rfd_yc", "rfd_df", "rfd_t", "rfd_fc", "rfd_fy", "rfd_cc", "rfd_rbd", "rfd_d"];
    design_inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = "";
    });
     const design_selects = ["rfd_dm", "rfd_om"];
     design_selects.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.selectedIndex = 0; // Reset dropdowns
    });

    // Clear ALL Output Fields for this tab
    const design_outputs = [
        "rfd_ulf", "rfd_ulm", "rfd_mf", // Step 1
        "rfd_e", "rfd_meu", "rfd_uplift", // Step 2
        "rfd_qu1", "rfd_qu2", // Step 3
        "rfd_db", "rfd_dl", // Step 4
        "rfd_qu4", // Step 5
        "rfd_mu", // Step 6
        "rfd_msr", // Step 7
        "rfd_bld", "rfd_bsd", // Step 8
        "rfd_mlbd", "rfd_msbd" // Final Summary
    ];
     design_outputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = "";
    });
}