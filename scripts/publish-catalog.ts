import { publishCatalog } from "@/lib/catalog/publish";

const meta = await publishCatalog();
console.log(
  `Published ${meta.packageCount} packages (${meta.caskCount} apps, ${meta.formulaCount} CLI tools)`,
);
