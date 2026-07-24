import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as SimpleSectionPage } from "./SimpleSectionPage-v_bNU3Oh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/districts-DquhB7mt.js
var import_jsx_runtime = require_jsx_runtime();
function DistrictsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SimpleSectionPage, {
		title: "Districts",
		description: "District-level crime comparison, station coverage, and hotspot indicators for Karnataka.",
		queryKey: "districts",
		endpoint: "/api/districts",
		columns: [
			{
				key: "name",
				label: "District"
			},
			{
				key: "crimeCount",
				label: "Crimes"
			},
			{
				key: "firCount",
				label: "FIRs"
			},
			{
				key: "hotspotCount",
				label: "Hotspots"
			},
			{
				key: "policeStationCount",
				label: "Stations"
			}
		]
	});
}
//#endregion
export { DistrictsPage as component };
