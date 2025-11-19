import { useEffect } from "react";

const useFieldComparison = (
  info,
  fieldComparison,
  setBgColor,
  setBgImg,
  setDisplayItem,
) => {
  useEffect(() => {
    checkConditions();
  }, [info, fieldComparison]);

  const checkConditions = () => {
    const fieldComparisonArray = Object.values(fieldComparison || {});

    if (fieldComparisonArray.length === 0) {
      setDisplayItem(true);
      return;
    }

    const value = parseFloat(info);
    let shouldHideItem = false;

    const conditionCheckers = {
      bigger: (condValue) => value > parseFloat(condValue),
      smaller: (condValue) => value < parseFloat(condValue),
      equal: (condValue) => value === parseFloat(condValue),
      GreaterThanOrEqual: (condValue) => value >= parseFloat(condValue),
      LessThanOrEqual: (condValue) => value <= parseFloat(condValue),
    };

    for (let condition of fieldComparisonArray) {
      const checker = conditionCheckers[condition.key];

      if (checker && checker(condition.value)) {
        setBgColor(condition.color);
        setBgImg(condition.bgImg);

        if (condition.visibility === true) {
          shouldHideItem = true;
        }
        break;
      }
    }

    setDisplayItem(!shouldHideItem);
  };

  return null;
};

export default useFieldComparison;
