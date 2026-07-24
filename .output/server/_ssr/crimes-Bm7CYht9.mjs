import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as SimpleSectionPage } from "./SimpleSectionPage-v_bNU3Oh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crimes-Bm7CYht9.js
var import_jsx_runtime = require_jsx_runtime();
function CrimesPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleSectionPage, {
		title: "Crimes",
		description: "Search, filter, sort, and manage crime records from the live data store.",
		queryKey: "crimes",
		endpoint: "/api/crimes?page=1&pageSize=20",
		assistant: true,
		columns: [
			{
				key: "caseNumber",
				label: "Case"
			},
			{
				key: "districtName",
				label: "District"
			},
			{
				key: "crimeType",
				label: "Crime Type"
			},
			{
				key: "severity",
				label: "Severity"
			},
			{
				key: "status",
				label: "Status"
			},
			{
				key: "investigationOfficer",
				label: "Officer"
			}
		]
	});
}
//#endregion
export { CrimesPage as component };
