import { defineConfig } from "@openapi-codegen/cli";
import {
  generateReactQueryComponents,
  generateSchemaTypes,
} from "@openapi-codegen/typescript";

export default defineConfig({
  clientApi: {
    from: { source: "url", url: "http://localhost:3001/api/docs-json" },
    outputDir: "src/queries/api",
    to: async (context) => {
      const filenamePrefix = "barsApi";
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix,
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles,
      });
    },
  },
});
