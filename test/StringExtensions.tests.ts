namespace StringExtensionsTest {
	let jsonMetaDataAnalyzer = require("../JsonAnalyser.js");
	let StringExtensions = jsonMetaDataAnalyzer.StringExtensions;

	const subject = "Hello, World!";

	describe("startsWith",
		() => {
			it("Empty String starts with Empty String",
				() => {
					let result = StringExtensions.startsWith("", "");
					if (!result) {
						throw new Error("Expected True");
					}
				});

			it("Does start with Empty String",
				() => {
					let result = StringExtensions.startsWith(subject, "");
					if (!result) {
						throw new Error("Expected True");
					}
				});

			it("Does start with 'H'",
				() => {
					let result = StringExtensions.startsWith(subject, "H");
					if (!result) {
						throw new Error("Expected True");
					}
				});

			it("Does start with 'Hello,'",
				() => {
					let result = StringExtensions.startsWith(subject, "Hello,");
					if (!result) {
						throw new Error("Expected True");
					}
				});

			it("Does NOT start with 'World'",
				() => {
					let result = StringExtensions.startsWith(subject, "World");
					if (result) {
						throw new Error("Expected True");
					}
				});
		});

	describe("endsWith",
		() => {
			it("Empty String starts with Empty String",
				() => {
					let result = StringExtensions.endsWith("", "");
					if (!result) {
						throw new Error("Expected True");
					}
				});

			it("Does ends with Empty String",
				() => {
					let result = StringExtensions.endsWith(subject, "");
					if (!result) {
						throw new Error("Expected True");
					}
				});

			it("Does ends with '!'",
				() => {
					let result = StringExtensions.endsWith(subject, "!");
					if (!result) {
						throw new Error("Expected True");
					}
				});

			it("Does ends with 'd!'",
				() => {
					let result = StringExtensions.endsWith(subject, "d!");
					if (!result) {
						throw new Error("Expected True");
					}
				});

			it("Does ends with 'World!'",
				() => {
					let result = StringExtensions.endsWith(subject, "World!");
					if (!result) {
						throw new Error("Expected True");
					}
				});

			it("Does NOT ends with 'Hello'",
				() => {
					let result = StringExtensions.endsWith(subject, "Hello");
					if (result) {
						throw new Error("Expected True");
					}
				});
		});

	describe("reverse",
		() => {
			it("Empty String reversed is Empty String",
				() => {
					let result = StringExtensions.reverse("", "");
					if (result !== "") {
						throw new Error("Expected True");
					}
				});

			it("'Hello, World!' reversed is '!dlrow ,olleH'",
				() => {
					const expected = "!dlroW ,olleH";
					let result = StringExtensions.reverse(subject, expected);
					if (result !== expected) {
						throw new Error("Expected '" + expected + "' but found '" + result + "'");
					}
				});
		});
}
