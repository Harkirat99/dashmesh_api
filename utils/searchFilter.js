/**
 * Generate search filter for multiple fields
 * @param {string} searchQuery - The search query from req.query
 * @param {string[]} fields - Array of field names to apply the search on
 * @returns {Object} MongoDB filter object with $or conditions
 */
const searchFilter = (searchQuery, fields) => {
    if (!searchQuery || !fields.length) return {};

    const searchRegex = new RegExp(searchQuery, 'i');  // Case-insensitive search

    const orConditions = fields.map((field) => ({
        [field]: searchRegex
    }));

    return { $or: orConditions };
};

module.exports = searchFilter;
