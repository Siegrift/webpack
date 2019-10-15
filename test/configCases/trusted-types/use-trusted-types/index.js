it("should load chunk when there are no trusted types", function() {
	const promise = import(
		"./empty?a" /* webpackChunkName: "no-trusted-types" */
	);

	var script = document.head._children.pop();
	__non_webpack_require__("./no-trusted-types.web.js");
	expect(script.src).toBe("https://test.cases/path/no-trusted-types.web.js");

	return promise;
});

const rules = {
	createURL: i => i,
	createScriptURL: i => i
};
let createScriptURLSpy;
let createPolicySpy;

function installTrustedTypes(useUppercase = false) {
	const prop = useUppercase ? "TrustedTypes" : "trustedTypes";
	window[prop] = {
		createPolicy: () => rules
	};
	createScriptURLSpy = jest.spyOn(rules, "createScriptURL");
	createPolicySpy = jest.spyOn(window[prop], "createPolicy");
}

function removeTrustedTypes(useUppercase = false) {
	const prop = useUppercase ? "TrustedTypes" : "trustedTypes";
	delete window[prop];
}

it("should work with uppercase TrustedTypes", () => {
	installTrustedTypes(true);

	const promise = import(
		"./empty?b" /* webpackChunkName: "upper-trusted-types" */
	);
	var script = document.head._children.pop();
	__non_webpack_require__("./upper-trusted-types.web.js");
	expect(script.src).toBe("https://test.cases/path/upper-trusted-types.web.js");
	expect(createScriptURLSpy).toHaveBeenCalledWith("upper-trusted-types.web.js");
	expect(createPolicySpy).toHaveBeenCalledWith(
		"customPolicyName",
		expect.anything()
	);

	removeTrustedTypes(true);
	return promise;
});

it("should load chunk using trusted types", function() {
	installTrustedTypes();

	const promise = import("./empty?c" /* webpackChunkName: "trusted-types" */);
	var script = document.head._children.pop();
	__non_webpack_require__("./trusted-types.web.js");
	expect(script.src).toBe("https://test.cases/path/trusted-types.web.js");
	expect(createScriptURLSpy).toHaveBeenCalledWith("trusted-types.web.js");
	expect(createPolicySpy).toHaveBeenCalledWith(
		"customPolicyName",
		expect.anything()
	);

	removeTrustedTypes();
	return promise;
});
