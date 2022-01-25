const orderHelper = (items) => {
  const orderedItems = [];

  for (let i = 0; i < items.length; i++) {
    orderedItems.push({
      name: items[i].name,
      amount: items[i].amount,
    });
  }
  return orderedItems;
};

module.exports = orderHelper;
