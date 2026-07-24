import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as SimpleSectionPage } from "./SimpleSectionPage-v_bNU3Oh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-DUzZ4bF2.js
var import_jsx_runtime = require_jsx_runtime();
function ReportsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleSectionPage, {
		title: "Reports",
		description: "Generate downloadable PDF, Excel, and CSV-ready reporting summaries.",
		queryKey: "reports",
		endpoint: "/api/reports",
		columns: [
			{
				key: "title",
				label: "Title"
			},
			{
				key: "format",
				label: "Format"
			},
			{
				key: "rows",
				label: "Rows"
			},
			{
				key: "updatedAt",
				label: "Updated"
			}
		]
	});
}
//#endregion
export { ReportsPage as component };
