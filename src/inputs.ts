import * as core from "@actions/core";

function resolveInput(key: string): string {
  return core.getInput(key);
}

export const PD_INTEGRATION_KEY = resolveInput("pd-integration-key");
export const TITLE = resolveInput("title");
export const SEVERITY = resolveInput("severity");
export const SUMMARY = resolveInput("summary");
