const gaugeElement = document.querySelector(".gauge");

function setGaugeValue(gauge, value) {
  const percentile = (value - 300) / (900 - 300);
  const angle = percentile * 200 - 20;

  gauge.querySelector(".gauge__fill").style.transform = `rotate(${angle}deg)`;

  gauge.querySelector(".gauge__cover").textContent = value;

  const arrowEle = document.querySelector(".credit-meter .inner-circle .arrow");
  if (arrowEle) {
    arrowEle.style.transform = `rotate(${angle}deg)`;
  }
  return `angle-${Math.floor(angle)}`;
}

setGaugeValue(gaugeElement, 700);
