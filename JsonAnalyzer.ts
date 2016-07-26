/// <reference path="typings/index.d.ts" />

import * as fs from "fs";

namespace jsonMetaDataAnalyzer {
	"use strict";

	export interface PropertyData {
		[propertyName: string]: FieldData[];
	}

	export interface FieldData {
		propertyName: string;
		filename: string;
		type: string;
		value: string;
	}

	export class StringExtensions {
		public static startsWith(str: string, prefix: string): boolean {
			const index = str.indexOf(prefix);

			// console.log("DEBUG:: " + str + " | " + prefix + " | " + index);
			return index === 0;
		}

		public static endsWith(str: string, suffix: string): boolean {
			let reserveStr = this.reverse(str);
			let prefix = this.reverse(suffix);

			return this.startsWith(reserveStr, prefix);
		}

		public static reverse(str: string): string {
			return str.split("").reverse().join("");
		}
	}

	export class JsonAnalyser {
		public fileNames: string[] = [];
		public properties: PropertyData = {};

		public readDirectory(directory: string[]) {
			let self = this;
			let directoryPath = directory.join("/");
			let files: string[] = fs.readdirSync(directoryPath);
			files
				.filter(x => !StringExtensions.startsWith(x, "."))
				.forEach(function (file) {
					let path = directory.concat(file);
					self.processFileOrDirectory(path);
				});
		}

		private processFileOrDirectory(pathArray: string[]) {
			let path = pathArray.join("/");
			if (fs.lstatSync(path).isFile()) {
				this.processFile(path);
			} else {
				this.readDirectory(pathArray);
			}
		}

		private processFile(file: string) {
			if (!StringExtensions.endsWith(file, ".json")) {
				return;
			}

			let data = fs.readFileSync(file, "utf-8");
			let json: {} = JSON.parse(data);

			let isWeapon = json["subtype"] === "weapon";
			let isArmor = json["subtype"] === "armor";

			// if (json["type"] !== "item") {
			// 	return;
			// }

			// if (!isWeapon) {
			// 	return;
			// }

			if (this.fileNames.indexOf(file) < 0) {
				this.fileNames.push(file);
			}

			for (let property in json) {
				this.processProperty(json, file, property);
			}
		}

		private processProperty(json: {}, file: string, property: string) {
			if (!this.properties) {
				this.properties = {};
			}
			if (!this.properties[property]) {
				this.properties[property] = [];
			}

			let data = <FieldData>{
				propertyName: property,
				filename: file,
				type: typeof json[property],
				value: json[property]
			};

			this.properties[property].push(data);

			if (data.type === "object") {
				this.processObjectField(file, property, json[property]);
			}
		}

		private processObjectField(file: string, property: string, data: {}) {
			for (let subproperty in data) {
				let name = [property, subproperty].join("->");
				let subProperty = <FieldData>{
					filename: file,
					type: typeof data[subproperty],
					value: data[subproperty]
				};

				if (!this.properties[name]) {
					this.properties[name] = [];
				}

				this.properties[name].push(subProperty);

				if (subProperty.type === "object") {
					this.processObjectField(file, name, data[subproperty]);
				}
			}
		}
	}

	export class Program {
		private delimiter = "|";

		public Total: number;
		public Properties: PropertyData;
		public PropertyNames: string[];
		public FileNames: string[];

		constructor() {
			this.main();
		}

		public GetDistinctValues<T>(array: T[]): T[] {
			return array.filter((x, i) => array.indexOf(x) === i);
		}

		public getMaxOfArray(numArray: number[]): number {
			return Math.max.apply(null, numArray);
		}

		public ReportPropertyOccurances(properties: PropertyData, total: number) {
			let MaxNameLength = this.getMaxOfArray(Object.keys(properties).map(x => x.length));

			console.log(Array(80).join("="));
			console.log("properties");
			console.log(Array(80).join("-"));
			console.log(["Property", "Count", "Total", "Percentage", "Types"].join(this.delimiter));
			console.log(Array(80).join("-"));
			for (let property in properties) {
				let data = properties[property];

				let count = data.length;
				let percentage = (count / total * 100).toFixed(2);

				let typeData = data.map(x => x.type);
				let filteredTypeData = typeData.filter((x, i) => typeData.indexOf(x) === i);

				console.log([property, count, total, percentage, filteredTypeData.join(", ")].join(this.delimiter));
			}
			console.log(Array(80).join("-"));
		}

		public ReportSpecificPropertyData(propertyData: FieldData[], property: string) {

			let distinctFiles = this.GetDistinctValues(propertyData.map(x => x.filename));
			let distinctValues = this.GetDistinctValues(propertyData.map(x => x.value));

			console.log(Array(80).join("="));
			console.log("Property[" + property + "]");
			console.log(Array(80).join("-"));

			console.log(distinctFiles.length + " Distinct File(s)");
			console.log(distinctValues.length + " Distinct Values");
			console.log(Array(80).join("-"));
			this.PrintStrings(distinctFiles);
			console.log(Array(80).join("-"));

			//
			// console.log(Array(80).join("-"));
			// this.ReportDistinctValues(distinctValues);
			// console.log(Array(80).join("-"));
			console.log();
		}

		public ReportUsages(properties: PropertyData, property: string) {
			console.log(property);
			let subtypeValues = properties[property].map(x => x.value);
			subtypeValues
				.filter((x, i) => subtypeValues.indexOf(x) === i)
				.map(x => {
					return {
						Value: x,
						Usages: properties[property].filter(y => y.value === x).length
					}
				})
				.map(x => console.log("    " + JSON.stringify(x.Value) + "|" + x.Usages));
		}

		public PrintStrings(propertyData: string[]) {
			for (let value in propertyData) {
				console.log(propertyData[value]);
			}
		}

		private main() {
			let psrdDataDirectory = [
				"C:",
				"Users",
				"eric.thomas",
				"Documents",
				"GitHub",
				"PSRD-Data"
			];

			let directory = psrdDataDirectory.concat(
				"core_rulebook",
				"item"
			);

			// let directory = psrdDataDirectory.concat(
			// 	"core_rulebook",
			// 	"rules",
			// 	"equipment",
			// 	"weapons"
			// );

			let anaylzer = new JsonAnalyser();
			anaylzer.readDirectory(directory);

			this.Properties = anaylzer.properties;

			this.FileNames = anaylzer.fileNames;
			this.Total = this.FileNames.length;
			this.PropertyNames = Object.keys(this.Properties);
		}
	}
}
module.exports = jsonMetaDataAnalyzer;

let program = new jsonMetaDataAnalyzer.Program();

program.ReportPropertyOccurances(program.Properties, program.Total);
// for (let property in program.Properties) {
// 	program.ReportSpecificPropertyData(program.Properties[property], property);
// }

// let propertyData = program.Properties["subtype"].map(x => x.filename);
// propertyData.map(x => console.log(x));

// program.ReportUsages(program.Properties, "subtype");

// program.ReportUsages(program.Properties, "slot");
//  program.ReportUsages(program.Properties, "misc->null");
