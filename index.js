const core = require("@actions/core");
const github = require("@actions/github");
const axios = require("axios");

const waitForUrl = async (url, MAX_TIMEOUT, { headers }) => {
  const iterations = MAX_TIMEOUT / 2;
  for (let i = 0; i < iterations; i++) {
    try {
      await axios.get(url, { headers });
      return;
    } catch (e) {
      console.log("Url unavailable, retrying...");
      await new Promise((r) => setTimeout(r, 2000));
    }
  }
  core.setFailed(`Timeout reached: Unable to connect to ${url}`);
};

const run = async () => {
  try {
    // use PR number from input - for e2e_tests branch
    // use PR number from context - for master branch
    const PR_NUMBER = Number(core.getInput("pr_number")) || github.context.payload.number;

    if (!PR_NUMBER) {
      
    }

    const MAX_TIMEOUT = Number(core.getInput("max_timeout")) || 60;
    const siteName = core.getInput("site_name");
    const basePath = core.getInput("base_path");

    if (!siteName) {
      core.setFailed("Required field `site_name` was not provided");
    }

    // const url = `https://deploy-preview-${PR_NUMBER}--${siteName}.netlify.app${basePath}`;
    let url = '';

    if(!PR_NUMBER) {
      console.warn('No PR number is available, using branch name');
      const branchName = github.context.ref.replace('refs/heads/', '');
      if(branchName === "main") {
        url = `https://${siteName}.netlify.app${basePath}`;
      } else {
        url = `https://${branchName}--${siteName}.netlify.app${basePath}`;
      }
    } else {
      url = `https://deploy-preview-${PR_NUMBER}--${siteName}.netlify.app${basePath}`;
    }

    core.setOutput("url", url);

    const extraHeaders = core.getInput("request_headers");
    const headers = !extraHeaders ? {} : JSON.parse(extraHeaders)

    console.log(`Waiting for a 200 from: ${url}`);
    await waitForUrl(url, MAX_TIMEOUT, {
      headers,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
};

run();
