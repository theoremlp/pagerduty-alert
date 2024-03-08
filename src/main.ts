import * as core from "@actions/core";
import * as github from "@actions/github";
import { event as pagerDutyEvent } from "@pagerduty/pdjs";
import { Severity } from "@pagerduty/pdjs/build/src/events";
import * as inputs from "./inputs";

function coerceSeverity(input: string): Severity {
  if (!["critical", "error", "warning", "info"].includes(input)) {
    throw Error("Invalid value provided for input `severity`");
  }
  return input as Severity;
}

async function run(): Promise<void> {
  const { context } = github;
  const runUrl = `${context.serverUrl}/${context.repo.owner}/${context.repo.repo}/actions/runs/${context.runId}`;
  try {
    await pagerDutyEvent({
      data: {
        routing_key: inputs.PD_INTEGRATION_KEY,
        event_action: "trigger",
        payload: {
          component: context.workflow,
          summary: inputs.TITLE,
          source: "GitHub Actions",
          severity: coerceSeverity(inputs.SEVERITY),
          class: "build",
          group: context.ref,
          custom_details: {
            description: inputs.SUMMARY,
            service: inputs.SERVICE,
          },
        },
        dedup_key: `${context.repo}-${context.workflow}-${context.runId}`,
        links: [
          {
            href: runUrl,
            text: runUrl,
          },
        ],
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error);
    }
  }
}

run();
