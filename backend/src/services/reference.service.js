const Candidature = require('../models/Candidature.model');


const generateReference = async () => {
  const year = new Date().getFullYear();
  const prefix = `RIF-${year}-`;

  const lastRef = await Candidature.getLastReferenceOfYear(year);

  let nextNum = 1;
  if (lastRef) {

    const lastNum = parseInt(lastRef.reference.split('-')[2], 10);
    nextNum = lastNum + 1;
  }

  const padded = String(nextNum).padStart(4, '0');
  return `${prefix}${padded}`;
};

module.exports = { generateReference };



