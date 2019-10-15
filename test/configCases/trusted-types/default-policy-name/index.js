function installTrustedTypes() {
	const rules = {
		createURL: i => i,
		createScriptURL: i => i
	};
	window.trustedTypes = {
		createPolicy: () => rules
	};
}

function removeTrustedTypes() {
	delete window.trustedTypes;
}

it("should use default trusted types policy name", function() {
	installTrustedTypes();
	const createPolicySpy = jest.spyOn(window.trustedTypes, "createPolicy");

	const promise = import(
		"./empty?b" /* webpackChunkName: "default-policy-name" */
	);
	expect(__non_webpack_require__("./default-policy-name.web.js")).toBe(
		undefined
	);
	expect(createPolicySpy).toHaveBeenCalledWith("webpack", expect.anything());

	removeTrustedTypes();
	return promise;
});
