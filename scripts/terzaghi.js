function compute() {
    // Inputs for the calculation
    var c = parseFloat(document.getElementById("c").value); // Soil Cohesion
    var b = parseFloat(document.getElementById("b").value); // Base of the Foundation
    var y = parseFloat(document.getElementById("y").value); // Moist Unit of Weight
    var ys = parseFloat(document.getElementById("ys").value); // Saturated Unit of Weight
    var dw = parseFloat(document.getElementById("dw").value); // Depth of Water Table
    var fs = parseFloat(document.getElementById("fs").value); // Factor of Safety
    var df = parseFloat(document.getElementById("df").value); // Depth of Footing
    var nc = parseFloat(document.getElementById("nc").value); // Nc
    var nq = parseFloat(document.getElementById("nq").value); // Nq
    var ny = parseFloat(document.getElementById("ny").value); // Ny
    var shearType = document.getElementById("shearType").value; // shearType

    var first_term; // Declare first_term outside the if/else blocks
    if (dw > df) {
        first_term = y * df;
    } else if (dw < df) {
        first_term = y * dw;
    } else {
        first_term = y * dw; // Handle dw == df case
    }
    document.getElementById("first_term").value = first_term;

    var second_term; // Declare second_term outside the if/else block
    if (df - dw > 0) {
        second_term = (ys - 9.81) * (df - dw); // Calculate the second term based on the difference between df and dw
    } else {
        second_term = 0;
    }
    document.getElementById("second_term").value = second_term;

    // Calculate effective stress
    var q = first_term + second_term;
    document.getElementById("q").value = q;

    // Step 2: Solving for y'
    var caseType; // Declare caseType outside the if/else if/else blocks
    if (dw <= df + b) {
        caseType = 1;
    } else if (dw < df + b && dw > df) {
        caseType = 2;
    } else if (dw >= df + b) {
        caseType = 3;
    } /**else {
        caseType = 0;
    }**/
    document.getElementById("case").value = caseType;

    var y_prime; // Declare y_prime outside the if/else if/else blocks
    if (caseType == 1) {
        // var y_prime;  //y_prime redeclared, removed this to prevent confusion, this variable is already defined outside the if else if else scope
        if (ys > y) {
            y_prime = ys - 9.81;
        } else {
            y_prime = y - 9.81;
        }
        // var y_prime = effective_stress - (ys * dw); Remove this statement cause you have already defined y_prime within the if else statement above
    } else if (caseType == 2) {
        y_prime = q - (ys * df) + (ys * dw);
    } else if (caseType == 3) {
        if (ys > y) {
            y_prime = ys;
        } else {
            y_prime = y;
        }
    } else {
        y_prime = q;
    }
    document.getElementById("y_prime").value = y_prime;

    // Step 3: Solving for qu, qa and P.
    if (shearType === "1") {
        //! ULTIMATE BEARING CAPACITY OF SOIL
        //! Strip foundation computation
        //var qu01 = (c * nc) + (q * nq) + (0.5 * y * b * ny); // v1
        var qu01 = c * nc + q  * nq + 0.5 * y_prime * b * ny; // v2
        var qall01 = qu01 / fs; 
        var P01 = qall01 * (b * b);
        // ULTIMATE BEARING CAPACITY OF SOIL
        //! Square foundation computation 
        //var qu02 = (1.3 * c * nc) + (q * nq) + (0.4 * y * b * ny); // v1
        var qu02 = 1.3 * c * nc + q * nq + 0.4 * y_prime * b * ny; // v2
        var qall02 = qu02 / fs;
        var P02 = qall02 * (b * b);

        //! Circular foundation computation
        //var qu03 = (1.3 * c * nc) + (q * nq) + (0.3 * y * b * ny); // v1
        var qu03 = 1.3 * c * nc + q * nq + 0.3 * y_prime * b * ny; // v2
        var qall03 = qu03 / fs;
        var P03 = qall03 * (b * b);

        //! Strip foundation display results
        document.getElementById("qu01").value = qu01.toFixed(5);
        document.getElementById("qall01").value = qall01.toFixed(5);
        document.getElementById("p01").value = P01.toFixed(5);

        //! Square foundation display results
        document.getElementById("qu02").value = qu02.toFixed(5);
        document.getElementById("qall02").value = qall02.toFixed(5);
        document.getElementById("p02").value = P02.toFixed(5);

        //! Circular foundation display results
        document.getElementById("qu03").value = qu03.toFixed(5);
        document.getElementById("qall03").value = qall03.toFixed(5);
        document.getElementById("p03").value = P03.toFixed(5);
    } else if (shearType === "2") {
        //! Strip foundation computation
        //var qu11 = ((2 / 3) * c * nc) + (q * nq) + (0.5 * y * b * ny); // v1
        var qu11 = 0.867 * c * nc + q * nq + 0.5 * y_prime * b * ny; // v2
        var qall11 = qu11 / fs;
        var P11 = qall11 * (b * b);

        //! Square foundation computation 
        var qu12 = (0.867 * c * nc) + (q * nq) + (0.4 * y * b * ny);
        var qall12 = qu12 / fs;
        var P12 = qall12 * (b * b);

        //! Circular foundation computation
        var qu13 = (0.867 * c * nc) + (q * nq) + (0.3 * y * b * ny);
        var qall13 = qu13 / fs;
        var P13 = qall13 * (b * b);

        //! Strip foundation display results
        document.getElementById("qu01").value = qu11.toFixed(5);
        document.getElementById("qall01").value = qall11.toFixed(5);
        document.getElementById("p01").value = P11.toFixed(5);

        //! Square foundation display results
        document.getElementById("qu02").value = qu12.toFixed(5);
        document.getElementById("qall02").value = qall12.toFixed(5);
        document.getElementById("p02").value = P12.toFixed(5);

        //! Circular foundation display results
        document.getElementById("qu03").value = qu13.toFixed(5);
        document.getElementById("qall03").value = qall13.toFixed(5);
        document.getElementById("p03").value = P13.toFixed(5);
    } else {
        alert("Please select a shear failure type");
    }
    return false; // Prevent form submission
}

function clearForm(){
    document.getElementById("terzaghiForm").reset(); // Reset the form fields
    document.getElementById("first_term").value = ""; // Clear the first term field
    document.getElementById("second_term").value = ""; // Clear the second term field
    document.getElementById("q").value = ""; // Clear the q field
    document.getElementById("case").value = ""; // Clear the case field
    document.getElementById("y_prime").value = ""; // Clear the y' field
    document.getElementById("qu01").value = ""; // Clear the qu field
    document.getElementById("qall01").value = ""; // Clear the qall field
    document.getElementById("qu02").value = ""; // Clear the qu field
    document.getElementById("qall02").value = ""; // Clear the qall field   
    document.getElementById("qu03").value = ""; // Clear the qu field
    document.getElementById("qall03").value = ""; // Clear the qall field
}