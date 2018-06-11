let data = {
    'Criteria.RatingScale.OneFive': {
        attribute: "rating"
    },
    'Criteria.RatingScale.YesNo': {
        attribute: "condition_met"
    }
};

export function setRatingScale(obj, scale, data) {
    let attribute = data[scale].attribute;
    obj[attribute] = data;
}

export function getRatingScaleData(obj, scale) {

    if (typeof data[scale] == "undefined")
        return false;

    let attribute = data[scale].attribute;
    let retData = {};
    retData[attribute] = obj[attribute];

    return retData;
}
