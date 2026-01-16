/**
 * Calculate aluminum weight for any window dimension
 * @param {number} width - Width in feet
 * @param {number} height - Height in feet
 * @returns {number} - Total weight in kg
 */
export const calculateWeight = (width, height) => {
    const widthFactor = 1.123;  // kg per ft of width
    const heightFactor = 1.677; // kg per ft of height
    
    return (widthFactor * width) + (heightFactor * height);
};

/**
 * Calculate complete window price
 * @param {number} width - Width in feet
 * @param {number} height - Height in feet
 * @param {string} finishType - 'color' or 'silver'
 * @param {object} rates - Material rates from database
 * @param {object} selectedItems - Object with boolean flags for each component
 * @returns {object} - Detailed price breakdown
 */
export const calculateWindowPrice = (width, height, finishType, rates, selectedItems) => {
    const area = width * height;
    const perimeter = 2 * (width + height);
    
    // 1. ALUMINUM WEIGHT & COST
    const totalWeight = calculateWeight(width, height);
    const aluRate = finishType === 'color' ? rates.alu_color : rates.alu_silver;
    const aluminumCost = Math.round(totalWeight * aluRate);
    
    // 2. GLASS COST
    const glassCost = Math.round(area * rates.glass);
    
    // 3. GLASS RUBBER COST
    const rubberLength = (2 * width) + (4 * height);
    const glassRubberCost = Math.round(rubberLength * rates.glass_rubber);
    
    // 4. TRACK RUBBER COST
    const trackRubberCost = rates.track_rubber;
    
    // 5. MOSQUITO NET COST
    const netArea = area * 0.5;
    const mosquitoNetCost = Math.round(netArea * rates.mosquito_net);
    
    // 6. U-CHANNEL COST
    const uChannelCost = rates.u_channel;
    
    // 7. LOCK COST
    const lockCost = rates.lock;
    
    // 8. BEARING COST
    const bearingCost = 6 * rates.bearing;
    
    // 9. SCREW COST
    const screwCost = rates.screw;
    
    // 10. LABOUR COST
    const labourCost = Math.max(rates.labour_min, Math.round(area * rates.labour_sqft));
    
    // CALCULATE TOTALS BASED ON SELECTED ITEMS
    let materialsTotal = 0;
    if (selectedItems.glass) materialsTotal += glassCost;
    if (selectedItems.glassRubber) materialsTotal += glassRubberCost;
    if (selectedItems.trackRubber) materialsTotal += trackRubberCost;
    if (selectedItems.mosquitoNet) materialsTotal += mosquitoNetCost;
    if (selectedItems.uChannel) materialsTotal += uChannelCost;
    if (selectedItems.lock) materialsTotal += lockCost;
    if (selectedItems.bearing) materialsTotal += bearingCost;
    if (selectedItems.screw) materialsTotal += screwCost;
    
    const labourTotal = selectedItems.labour ? labourCost : 0;
    
    const grandTotal = aluminumCost + materialsTotal + labourTotal;
    
    return {
        dimensions: { width, height, area },
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
            trackRubber: { cost: trackRubberCost },
            mosquitoNet: { area: netArea, rate: rates.mosquito_net, cost: mosquitoNetCost },
            uChannel: { cost: uChannelCost },
            lock: { cost: lockCost },
            bearing: { quantity: 6, rate: rates.bearing, cost: bearingCost },
            screw: { cost: screwCost },
            labour: { area, rate: rates.labour_sqft, minimum: rates.labour_min, cost: labourCost }
        },
        totals: {
            aluminum: aluminumCost,
            materials: materialsTotal,
            labour: labourTotal,
            grandTotal
        }
    };
};
