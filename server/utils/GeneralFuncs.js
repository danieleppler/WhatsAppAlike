
const groupBy = (array, key) => {
    return array.reduce((result, currentValue) => {
        // Get the value of the key
        const groupKey = currentValue[key];
        
        // If the group doesn't exist, create it
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        
        // Add the current object to the group
        result[groupKey].push(currentValue);
        
        return result;
    }, {});
};

module.exports = {groupBy}
