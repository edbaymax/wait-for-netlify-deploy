# Wait for Netlify Deploy — A GitHub Action ⏱

Do you have other Github actions (Lighthouse, Cypress, etc) that depend on the Netlify Preview URL? This action will wait until the url is available before running the next task.

This is a fork of [JakePartusch/wait-for-netlify-action](https://github.com/JakePartusch/wait-for-netlify-action) which only works for `pull_request`. This for works for `push` action as well.

You will need to generate a [Personal access token](https://app.netlify.com/user/applications/personal) to use and pass it as the NETLIFY_AUTH_TOKEN environment variable.

## Inputs

### `site_name`

**Required** The name of the Netlify site to reach `https://{site_name}.netlify.app`

### `pr_number`

The PR number coming from the previous step, using `jwalton/gh-find-current-pr@v1` action. It's available for `e2e_tests` branch. For `mnaster` branch, PR number is calculated from GitHub context.

### `request_headers`

Optional — Stringified HTTP Header object key/value pairs to send in requests (eg. `'{ "Authorization": "Basic YWxhZGRpbjpvcGVuc2VzYW1l }'`)

### `max_timeout`

Optional — The amount of time to spend waiting on Netlify. Defaults to `60` seconds

### `base_path`

Optional — The page that needs to be tested for 200. Defaults to "/" (eg: `https://{site_name}.netlify.app{base_path}`)

## Outputs

### `url`

The netlify deploy preview url that was deployed.

## Usage

```yaml
steps:
  - name: Wait for Netlify Deploy
    uses: kukiron/wait-for-netlify-deploy@v1.0
    id: waitForDeployment
    with:
      site_name: ${{ secrets.NETLIFY_SITE_NAME }}
      # pr_number: ${{ steps.findPR.outputs.pr }} # available for e2e_tests branch
      max_timeout: 300
    env:
      NETLIFY_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
```
