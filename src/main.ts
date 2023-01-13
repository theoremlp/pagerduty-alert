import * as core from "@actions/core";
import * as github from "@actions/github";
import { event as pagerDutyEvent } from "@pagerduty/pdjs";
import { Severity } from "@pagerduty/pdjs/build/src/events";
import * as constants from "./constants";

function coerceSeverity(input: string): Severity {
  if (!["critical", "error", "warning", "info"].includes(input)) {
    throw Error("Invalid value provided for input `severity`");
  }
  return input as Severity;
}

async function run(): Promise<void> {
  try {
    // TODO(rahul): Add link
    await pagerDutyEvent({
      data: {
        routing_key: core.getInput(constants.PD_INTEGRATION_KEY),
        event_action: "trigger",
        payload: {
          component: github.context.action,
          summary: core.getInput(constants.SUMMARY),
          source: "GitHub Actions",
          severity: coerceSeverity(core.getInput(constants.SEVERITY)),
          class: "build",
          group: "master",
        },
        dedup_key: github.context.action,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error);
    }
  }
}

run();
