// @module:workspace @layer:hook @scope:module:workspace @deps:action:thesaurus.actions,schema:thesaurus.schema
import { useMutation } from "@tanstack/react-query";
import { generateWordplayAction } from "../actions/thesaurus.actions";
import type { WordplayResponse } from "../schemas/thesaurus.schema";

export function useWordplayMutation() {
  return useMutation<WordplayResponse, Error, string>({
    mutationFn: async (seed: string) => {
      const result = await generateWordplayAction(seed);

      if (result?.error) {
        throw new Error(result.error);
      }

      if (!result?.data) {
        throw new Error("Walay nadawat nga data. (No data received.)");
      }

      return result.data as WordplayResponse;
    },
  });
}
