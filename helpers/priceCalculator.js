// helpers/priceCalculator.js

function calculateTotalPrice(distanceKm, pricePerKm) {
  const baseFare = parseFloat(distanceKm) * parseFloat(pricePerKm);

  const OPERATING_COST_PERCENT = 0.20;
  const STATE_TAX_PERCENT = 0.0888;
  const CONGESTION_FEE = 2.75;
  const CARD_PROCESSING_FEE_PERCENT = 0.03;

  const total =
    baseFare +
    baseFare * OPERATING_COST_PERCENT +
    baseFare * STATE_TAX_PERCENT +
    baseFare * CARD_PROCESSING_FEE_PERCENT +
    CONGESTION_FEE;

  return parseFloat(total.toFixed(2));
}

module.exports = calculateTotalPrice;
