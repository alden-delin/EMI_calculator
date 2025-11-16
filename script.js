// EMI Calculator - frontend only

const form = document.getElementById('emi-form');
const principalSlider = document.getElementById('principal');
const annualRateSlider = document.getElementById('annual-rate');
const tenureSlider = document.getElementById('tenure-months');
const emiOut = document.getElementById('emi');
const totalPaymentOut = document.getElementById('total-payment');
const totalInterestOut = document.getElementById('total-interest');
const resultsSection = document.getElementById('results');
const resetBtn = document.getElementById('reset-btn');

function formatCurrency(value){
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value);
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 1 }).format(value);
}

function calculateEMI(P, rAnnualPercent, n){
  // P: principal, rAnnualPercent: annual % rate (e.g., 7.5), n: months
  if (n <= 0) return {emi:0, totalPayment:0, totalInterest:0};
  const r = rAnnualPercent / 12 / 100; // monthly rate
  if (r === 0){
    const emi = P / n;
    const totalPayment = P;
    const totalInterest = 0;
    return {emi, totalPayment, totalInterest};
  }
  const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - P;
  return {emi, totalPayment, totalInterest};
}

function updateResults() {
  const P = parseFloat(principalSlider.value);
  const r = parseFloat(annualRateSlider.value);
  const n = parseInt(tenureSlider.value, 10);

  // Update display values
  document.getElementById('principal-value').textContent = formatNumber(P);
  document.getElementById('annual-rate-value').textContent = formatNumber(r);
  document.getElementById('tenure-months-value').textContent = n;

  const {emi, totalPayment, totalInterest} = calculateEMI(P, r, n);

  emiOut.textContent = formatCurrency(emi);
  totalPaymentOut.textContent = formatCurrency(totalPayment);
  totalInterestOut.textContent = formatCurrency(totalInterest);
  resultsSection.classList.remove('hidden');
}

// Add event listeners to all sliders for real-time calculation
principalSlider.addEventListener('input', updateResults);
annualRateSlider.addEventListener('input', updateResults);
tenureSlider.addEventListener('input', updateResults);

resetBtn.addEventListener('click', () => {
  form.reset();
  principalSlider.value = 500000;
  annualRateSlider.value = 7.5;
  tenureSlider.value = 60;
  updateResults();
});

// Initial calculation on page load
updateResults();

// Expose calculate for console/testing
window.__emi = calculateEMI;
