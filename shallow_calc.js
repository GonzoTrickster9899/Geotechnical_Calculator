function computeBeamShear() {
    // Inputs for the calculation
    var abs_dl = parseFloat(document.getElementById("abs_dl").value); // Dead Load
    var abs_ll = parseFloat(document.getElementById("abs_ll").value); // Live Load
    var abs_c = parseFloat(document.getElementById("y").value); // Size of column
    var abs_b = parseFloat(document.getElementById("abs_b").value); // Size of footing
    var abs_t = parseFloat(document.getElementById("abs_t").value); // Thickness of footing
    var abs_mbd = parseFloat(document.getElementById("abs_mbd").value); // Main bar diameter
    var abs_y = parseFloat(document.getElementById("abs_y").value); // Solid Unit Weight
    var abs_yc = parseFloat(document.getElementById("abs_yc").value); // Concrete Unit Weight
    var abs_fc = parseFloat(document.getElementById("abs_fc").value); // Steel Yield Strength
    var abs_cc = parseFloat(document.getElementById("cc").value); // Concrete Cover


    // Results for analysis beam shear
    var abs_qu = (1.2 * abs_dl + 1.6 * abs_ll) / (abs_b * abs_b); // Ultimate Soil Pressure
    var abs_d = abs_t - abs_cc - abs_mbd - abs_mbd / 2; // Effective Depth
    var abs_vu = abs_qu * abs_b * ((abs_b * 1000 - abs_c) / 2 - abs_d) / 1000; // Shear Force
    var abs_vc = (0.75 * (0.17) * Math.sqrt(abs_fc) * abs_b * abs_d); // Capacity of Footing
    
    // Results for analysis beam shear as output
    document.getElementById("abs_vu").value = abs_vu.toFixed(3); // Shear Force
    document.getElementById("abs_vc").value = abs_vc.toFixed(3); // Capacity of Footing

    // Check if shear force exceeds capacity
    return false; // Prevent form submission

}