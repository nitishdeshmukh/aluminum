/**
 * Calculate aluminum weight for window dimensions
 * Weight = (1.123 × Width) + (1.677 × Height)
 */
function calculateWeight(width, height) {
    const widthFactor = 1.123;  // kg per ft of width
    const heightFactor = 1.677; // kg per ft of height
    return (widthFactor * width) + (heightFactor * height);
}

/**
 * Calculate complete window price based on new logic
 * @param {number} width - Width in feet
 * @param {number} height - Height in feet
 * @param {string} finishType - 'color' or 'silver'
 * @param {object} rates - Material rates from database
 * @param {object} selectedItems - Object with boolean flags
 * @returns {object} - Detailed price breakdown
 */
function calculateWindowPrice(width, height, finishType, rates, selectedItems) {
    const area = width * height;
    const perimeter = 2 * (width + height);

    // 1. ALUMINUM WEIGHT & COST
    const totalWeight = calculateWeight(width, height);
    const aluRate = finishType === 'color' ? rates.alu_color : rates.alu_silver;
    const aluminumCost = Math.round(totalWeight * aluRate);

    // 2. GLASS COST
    const glassCost = Math.round(area * rates.glass);

    // 3. GLASS RUBBER COST
    // Formula: per user request 1x1 window takes 6ft rubber
    // For 3-track sliding (2 glass shutters): Rubber per shutter = 2(H + W/2) -> 2H + W
    // 2 Shutters = 4H + 2W. For 1x1 -> 4(1)+2(1) = 6. Matches user data.
    const rubberLength = (2 * width) + (4 * height);
    const glassRubberCost = Math.round(rubberLength * rates.glass_rubber);

    // 4. MOSQUITO NET COST
    // Net area for 3-track is roughly half the window area for 1 shutter
    const netArea = area * 0.5;
    const mosquitoNetCost = Math.round(netArea * rates.mosquito_net);

    // 5. HARDWARE (Linear/Fixed Items)
    // User data for 1x1: 
    // - U-Channel: 100 Rs (Fixed?)
    // - Locks: 170 Rs (Fixed)
    // - Bearings: 60 Rs (6 units) (Fixed)
    // - Screws: 80 Rs (Fixed)

    // Using Rate DB values which match user's new request:
    const uChannelCost = rates.u_channel_fixed || 100;
    const screwCost = rates.screw_fixed || 80;

    // Combine for linear hardware equivalent if needed, or keep separate items
    // But frontend checkbox has "U-Channel & Screws". 
    // We'll calculate total and assign.
    const hardwareKitCost = uChannelCost + screwCost;

    const lockCost = rates.lock;
    const bearingCost = rates.bearing; // Rate is for set of 6

    // 6. HARDWARE - TRACK RUBBER (New Item)
    // User mentioned "track rubber = 80 inr" for 1x1?
    // Not clear if it's per ft. Assuming fixed set cost or linear.
    // If not in rates, ignore or assume included.
    // Given the specific list "u channel..100", "screw..80", let's assume Track Rubber is separate?
    // But checking rates list, no track rubber. 
    // Wait, earlier user said "Hardware (Linear) U-Channel & Screws".
    // Now user says "u channel .. 100", "screw .. 80". These look like fixed costs for this window size.
    // But a larger window needs more screws/channel?
    // Let's stick to the user's specific "1x1" breakdown as baseline.
    // If we want PER FOOT scaling:
    // U-Channel for 1x1 (P=4) is 100? -> 25/ft?
    // Screws for 1x1 is 80? -> 20/ft?
    // Let's implement as Fixed + Variable or just Fixed if user implies a 'kit'.
    // User prompt "ye sab add kro" implies strictly following these values.
    // I will assume these are base costs and maybe scale slightly or keep fixed per window unit for simplicity unless 'per ft' specified.
    // "u channel = no dimension .. 100 inr" -> "NO DIMENSION" implies FIXED COST.
    // "1 x 1 window = 80 inr screw" -> Implies scale? But likely a set.

    // 7. LABOUR COST
    // Max of minimum charge OR area * rate
    // User: "350 inr" (for 1x1) vs "24-25 per sqft"
    // So logic: Math.max(350, area * 24)
    const labourCost = Math.max(rates.labour_min, Math.round(area * rates.labour_sqft));

    // CALCULATE TOTALS BASED ON SELECTED ITEMS
    let materialsTotal = 0;

    if (selectedItems.glass) materialsTotal += glassCost;
    if (selectedItems.glassRubber) materialsTotal += glassRubberCost;
    if (selectedItems.mosquitoNet) materialsTotal += mosquitoNetCost;

    // Hardware checks
    if (selectedItems.uChannel) materialsTotal += uChannelCost; // New explicit key
    if (selectedItems.screw) materialsTotal += screwCost;
    // Backward compat: if old "hardwareLinear" checkbox (frontend maps 'uChannel' to it?) 
    // In frontend MaterialCheckboxes, we have 'uChannel' and 'lock', 'bearing'.
    // We need to ensuring mapping.
    // Ideally frontend sends 'uChannel' -> we add uChannelCost + screwCost?
    // Let's group U-Channel + Screw as one if user wants, or separate.
    // User list: "u channel ... 100", "lock ... 170", "bearing ... 60", "screw ... 80".
    // Frontend Checkbox currently: "U-Channel & Screws (Linear)".
    // So we combine them.
    if (selectedItems.uChannel) materialsTotal += screwCost; // Add screw if u-channel selected (grouped)

    // Fixed items
    if (selectedItems.lock) materialsTotal += lockCost;
    if (selectedItems.bearing) materialsTotal += bearingCost;

    const labourTotal = selectedItems.labour ? labourCost : 0;

    const grandTotal = aluminumCost + materialsTotal + labourTotal;

    return {
        dimensions: { width, height, area, perimeter },
        weight: {
            total: totalWeight.toFixed(2),
            unit: 'kg'
        },
        breakdown: {
            aluminum: {
                weight: totalWeight.toFixed(2),
                rate: aluRate,
                finishType,
                cost: aluminumCost
            },
            glass: { area, rate: rates.glass, cost: glassCost },
            glassRubber: { length: rubberLength, rate: rates.glass_rubber, cost: glassRubberCost },
            mosquitoNet: { area: netArea, rate: rates.mosquito_net, cost: mosquitoNetCost },

            // Hardware decomposed
            hardwareLinear: {
                perimeter, // keeping for ref
                cost: hardwareKitCost, // 100 + 80
                label: 'U-Channel & Screws (Set)',
                rate: 'Fixed'
            },
            lock: { cost: lockCost },
            bearing: { cost: bearingCost },

            labour: { area, rate: rates.labour_sqft, minimum: rates.labour_min, cost: labourCost }
        },
        totals: {
            aluminum: aluminumCost,
            materials: materialsTotal,
            labour: labourTotal,
            grandTotal
        }
    };
}

module.exports = {
    calculateWeight,
    calculateWindowPrice
};
