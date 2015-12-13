module.exports = function permutate(list) {
	var permutations = [];
	function permute(currentList, options) {
		if (!options.length) {
			permutations.push(currentList);
			return;
		}
		options.forEach(o => permute(currentList.concat([o]), options.filter(o2 => o !== o2)));
	}
	permute([], list);
	return permutations;
};
