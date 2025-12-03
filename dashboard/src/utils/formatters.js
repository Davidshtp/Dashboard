
export const formatCurrency = (value, currency = "COP", locale = "es-CO") => {
  if (!value && value !== 0) return "$0";
  
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatCompactNumber = (value) => {
  if (!value && value !== 0) return "0";
  
  const absValue = Math.abs(value);
  
  if (absValue >= 1e9) {
    return (value / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
  }
  if (absValue >= 1e6) {
    return (value / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (absValue >= 1e3) {
    return (value / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
  }
  
  return Math.floor(value).toString();
};

export const formatNumber = (value, locale = "es-CO") => {
  if (!value && value !== 0) return "0";
  
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatPercentage = (value, decimals = 1) => {
  if (!value && value !== 0) return "0%";
  
  return (Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(decimals) + "%";
};
